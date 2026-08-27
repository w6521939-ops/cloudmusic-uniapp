const fs = require('fs');
const path = require('path');

const apkPath = process.argv[2];
const dexPath = process.argv[3];
const assetsDir = process.argv[4];

// APK is a ZIP file. We need to append entries.
// Since we don't have a ZIP library, we'll use a simple approach:
// Read the base APK (which already has resources), then rebuild it with DEX and assets.

// Read the base APK
const baseApk = fs.readFileSync(apkPath);

// We'll use the built-in zlib to create a proper ZIP
const zlib = require('zlib');

// Simple ZIP file builder
function createZipEntry(name, data) {
    const nameBytes = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const compressed = zlib.deflateRawSync(data);
    
    // Local file header
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // compression method (0=stored, 8=deflated)
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc-32
    localHeader.writeUInt32LE(compressed.length, 18); // compressed size
    localHeader.writeUInt32LE(data.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBytes.length, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length
    
    return {
        localHeader,
        nameBytes,
        compressed,
        name,
        crc,
        compressedSize: compressed.length,
        uncompressedSize: data.length
    };
}

// CRC32 implementation
function crc32(buf) {
    let table = [];
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
            else c = c >>> 1;
        }
        table[i] = c >>> 0;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Collect all entries
const entries = [];

// Add classes.dex
if (fs.existsSync(dexPath)) {
    const dexData = fs.readFileSync(dexPath);
    entries.push(createZipEntry('classes.dex', dexData));
    console.log(`Added classes.dex (${dexData.length} bytes)`);
}

// Add assets
function addDir(dir, zipPath) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const entryPath = zipPath ? `${zipPath}/${item}` : item;
        if (fs.statSync(fullPath).isDirectory()) {
            addDir(fullPath, entryPath);
        } else {
            const data = fs.readFileSync(fullPath);
            entries.push(createZipEntry(`assets/${entryPath}`, data));
            console.log(`Added assets/${entryPath} (${data.length} bytes)`);
        }
    }
}

if (fs.existsSync(assetsDir)) {
    addDir(assetsDir, '');
}

// Build the new ZIP
// We need to preserve the existing entries in the base APK
// Parse the base APK to extract existing entries
function parseZip(buf) {
    const entries = [];
    let offset = 0;
    while (offset < buf.length - 4) {
        const sig = buf.readUInt32LE(offset);
        if (sig !== 0x04034b50) break; // local file header
        
        const compMethod = buf.readUInt16LE(offset + 8);
        const crc = buf.readUInt32LE(offset + 14);
        const compSize = buf.readUInt32LE(offset + 18);
        const uncompSize = buf.readUInt32LE(offset + 22);
        const nameLen = buf.readUInt16LE(offset + 26);
        const extraLen = buf.readUInt16LE(offset + 28);
        const name = buf.toString('utf8', offset + 30, offset + 30 + nameLen);
        const dataStart = offset + 30 + nameLen + extraLen;
        const data = buf.slice(dataStart, dataStart + compSize);
        
        entries.push({
            name,
            compMethod,
            crc,
            compSize,
            uncompSize,
            data,
            localHeader: buf.slice(offset, dataStart),
            localHeaderLen: dataStart - offset
        });
        
        offset = dataStart + compSize;
    }
    return entries;
}

// The base APK already has resources. We just need to append our new entries.
// But ZIP format requires a central directory at the end.
// Simplest approach: rebuild the entire ZIP from scratch.

// Parse existing entries from base APK
const existingEntries = parseZip(baseApk);
console.log(`Base APK has ${existingEntries.length} entries`);

// Build new ZIP
const parts = [];
const centralDir = [];
let currentOffset = 0;

// Write existing entries
for (const entry of existingEntries) {
    parts.push(entry.localHeader);
    parts.push(entry.data);
    
    centralDir.push({
        name: entry.name,
        crc: entry.crc,
        compSize: entry.compSize,
        uncompSize: entry.uncompSize,
        compMethod: entry.compMethod,
        offset: currentOffset
    });
    currentOffset += entry.localHeader.length + entry.data.length;
}

// Write new entries
for (const entry of entries) {
    parts.push(entry.localHeader);
    parts.push(entry.nameBytes);
    parts.push(entry.compressed);
    
    centralDir.push({
        name: entry.name,
        crc: entry.crc,
        compSize: entry.compressedSize,
        uncompSize: entry.uncompressedSize,
        compMethod: 8, // deflated
        offset: currentOffset
    });
    currentOffset += entry.localHeader.length + entry.nameBytes.length + entry.compressed.length;
}

// Build central directory
const cdParts = [];
let cdSize = 0;
for (const entry of centralDir) {
    const nameBytes = Buffer.from(entry.name, 'utf8');
    const cdEntry = Buffer.alloc(46);
    cdEntry.writeUInt32LE(0x02014b50, 0); // central file header signature
    cdEntry.writeUInt16LE(20, 4); // version made by
    cdEntry.writeUInt16LE(20, 6); // version needed
    cdEntry.writeUInt16LE(0, 8); // flags
    cdEntry.writeUInt16LE(entry.compMethod, 10); // compression method
    cdEntry.writeUInt16LE(0, 12); // mod time
    cdEntry.writeUInt16LE(0, 14); // mod date
    cdEntry.writeUInt32LE(entry.crc, 16); // crc-32
    cdEntry.writeUInt32LE(entry.compSize, 20); // compressed size
    cdEntry.writeUInt32LE(entry.uncompSize, 24); // uncompressed size
    cdEntry.writeUInt16LE(nameBytes.length, 28); // filename length
    cdEntry.writeUInt16LE(0, 30); // extra field length
    cdEntry.writeUInt16LE(0, 32); // comment length
    cdEntry.writeUInt16LE(0, 34); // disk number
    cdEntry.writeUInt16LE(0, 36); // internal attrs
    cdEntry.writeUInt32LE(0, 38); // external attrs
    cdEntry.writeUInt32LE(entry.offset, 42); // local header offset
    
    cdParts.push(cdEntry);
    cdParts.push(nameBytes);
    cdSize += cdEntry.length + nameBytes.length;
}

// End of central directory
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
eocd.writeUInt16LE(0, 4); // disk number
eocd.writeUInt16LE(0, 6); // disk with CD
eocd.writeUInt16LE(centralDir.length, 8); // entries on disk
eocd.writeUInt16LE(centralDir.length, 10); // total entries
eocd.writeUInt32LE(cdSize, 12); // CD size
eocd.writeUInt32LE(currentOffset, 16); // CD offset
eocd.writeUInt16LE(0, 20); // comment length

// Write output
const output = Buffer.concat([...parts, ...cdParts, eocd]);
const outPath = apkPath.replace('.apk', '-full.apk');
fs.writeFileSync(outPath, output);
console.log(`Written: ${outPath} (${output.length} bytes)`);
