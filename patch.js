const fs = require('fs');
const path = require('path');

console.log('Running Bedrock Protocol 1.26.45 Auto-Patcher...');

// 1. Patch options.js
const optionsPath = path.join(__dirname, 'node_modules', 'bedrock-protocol', 'src', 'options.js');
if (fs.existsSync(optionsPath)) {
    let content = fs.readFileSync(optionsPath, 'utf8');
    if (!content.includes("Versions['1.26.45']")) {
        content = content.replace("const CURRENT_VERSION = '1.26.40'", "const CURRENT_VERSION = '1.26.45'");
        content = content.replace(
            "const Versions = Object.fromEntries(mcData.versions.bedrock.filter(e => e.releaseType === 'release').map(e => [e.minecraftVersion, e.version]))",
            "const Versions = Object.fromEntries(mcData.versions.bedrock.filter(e => e.releaseType === 'release').map(e => [e.minecraftVersion, e.version]))\nVersions['1.26.45'] = 2169"
        );
        fs.writeFileSync(optionsPath, content, 'utf8');
        console.log('  [OK] Patched options.js');
    }
}

// 2. Patch serializer.js
const serializerPath = path.join(__dirname, 'node_modules', 'bedrock-protocol', 'src', 'transforms', 'serializer.js');
if (fs.existsSync(serializerPath)) {
    let content = fs.readFileSync(serializerPath, 'utf8');
    if (!content.includes("mcData('bedrock_1.26.40')")) {
        content = content.replace(
            "const protocol = require('minecraft-data')('bedrock_' + version).protocol",
            "const mcData = require('minecraft-data')\n  const data = mcData('bedrock_' + version) || mcData('bedrock_1.26.40')\n  const protocol = data.protocol"
        );
        fs.writeFileSync(serializerPath, content, 'utf8');
        console.log('  [OK] Patched serializer.js');
    }
}

// 3. Patch client.js
const clientPath = path.join(__dirname, 'node_modules', 'bedrock-protocol', 'src', 'client.js');
if (fs.existsSync(clientPath)) {
    let content = fs.readFileSync(clientPath, 'utf8');
    if (!content.includes("require('minecraft-data')('bedrock_1.26.40')")) {
        content = content.replace(
            "const mcData = require('minecraft-data')('bedrock_' + this.options.version)",
            "const mcData = require('minecraft-data')('bedrock_' + this.options.version) || require('minecraft-data')('bedrock_1.26.40')"
        );
        fs.writeFileSync(clientPath, content, 'utf8');
        console.log('  [OK] Patched client.js');
    }
}

// 4. Patch login.js
const loginPath = path.join(__dirname, 'node_modules', 'bedrock-protocol', 'src', 'handshake', 'login.js');
if (fs.existsSync(loginPath)) {
    let content = fs.readFileSync(loginPath, 'utf8');
    if (!content.includes("mcData('bedrock_1.26.40')")) {
        content = content.replace(
            "const skinData = require('minecraft-data')('bedrock_' + options.version).defaultSkin",
            "const mcData = require('minecraft-data')\n  const skinData = (mcData('bedrock_' + options.version) || mcData('bedrock_1.26.40')).defaultSkin"
        );
        fs.writeFileSync(loginPath, content, 'utf8');
        console.log('  [OK] Patched login.js');
    }
}

console.log('Bedrock Protocol 1.26.45 Auto-Patcher Complete!');
