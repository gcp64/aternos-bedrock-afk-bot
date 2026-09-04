const { ArabicShaper } = require('arabic-persian-reshaper');

// Test Arabic Reshaper + BiDi for Minecraft Bedrock
function fixArabicForMinecraft(text) {
    if (!text) return "";
    // If no Arabic characters at all, return as-is
    if (!/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFC]/.test(text)) {
        return text;
    }

    // Step 1: Shape the Arabic text (convert to presentation forms B)
    const shaped = ArabicShaper.convertArabic(text);

    // Step 2: Split into tokens (color codes, words, numbers, punctuation, spaces)
    // We want to handle Minecraft format codes §[0-9a-fk-or] so they don't break
    // Tokenizer regex:
    // 1) §[0-9a-fk-or] (Minecraft format code)
    // 2) [0-9]+(?:\.[0-9]+)? (Numbers)
    // 3) [a-zA-Z0-9_\-+:/.|]+ (Latin words / symbols)
    // 4) Arabic words (Presentation forms or arabic letters)
    // 5) Whitespace
    // 6) Other characters/emojis

    // Better yet, let's split by lines first
    const lines = shaped.split('\n');
    const processedLines = lines.map(line => processLine(line));
    return processedLines.join('\n');
}

function processLine(line) {
    // Regex matching tokens:
    // - Minecraft color codes: §[0-9a-zA-Z]
    // - Numbers and Latin words/symbols: [A-Za-z0-9_.\-/:#@]+
    // - Arabic words: [\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFC]+
    // - Whitespace: \s+
    // - Any other single character (emojis, punctuation, etc.)
    const tokenRegex = /(§[0-9a-zA-Z]|[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFC]+|[A-Za-z0-9_.\-/:#@!?,]+|\s+|.)/gu;
    const tokens = [];
    let match;
    while ((match = tokenRegex.exec(line)) !== null) {
        tokens.push(match[0]);
    }

    // Now, Bedrock renders Left-to-Right.
    // In an RTL sentence, the first word should appear on the right side.
    // For pure Arabic words, each word's characters must be reversed,
    // AND the order of tokens in the sentence must be reversed!
    // But for numbers / Latin tokens (e.g. "Overworld", "-411", "X:"), their internal character order must remain LTR!
    // And Minecraft format codes (e.g. "§c§l") must precede the token they style!

    // Let's group format codes with the token they precede:
    const grouped = [];
    let currentFormats = [];

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.startsWith('§') && t.length === 2) {
            currentFormats.push(t);
        } else {
            grouped.push({
                formats: currentFormats.slice(),
                text: t,
                isArabic: /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFC]/.test(t)
            });
            currentFormats = [];
        }
    }
    if (currentFormats.length > 0) {
        grouped.push({
            formats: currentFormats.slice(),
            text: "",
            isArabic: false
        });
    }

    // Now, for Arabic tokens, reverse their characters so Bedrock LTR renders them reading RTL
    for (const item of grouped) {
        if (item.isArabic) {
            item.text = item.text.split('').reverse().join('');
        }
    }

    // Now reverse the sentence order of tokens so the sentence reads RTL
    grouped.reverse();

    // Reconstruct the line
    let result = "";
    for (const item of grouped) {
        result += item.formats.join('') + item.text;
    }
    return result;
}

// Test cases
console.log("--- TEST 1 ---");
console.log("Original: مرحبا بكم");
console.log("Fixed:   ", fixArabicForMinecraft("مرحبا بكم"));

console.log("--- TEST 2 ---");
console.log("Original: §c§l💀 [موقع الوفاة - Death Coordinates]");
console.log("Fixed:   ", fixArabicForMinecraft("§c§l💀 [موقع الوفاة - Death Coordinates]"));

console.log("--- TEST 3 ---");
console.log("Original: §e📍 لقد مت عند الإحداثيات: §fX: §a-411 §f| Y: §a102 §f| Z: §a222");
console.log("Fixed:   ", fixArabicForMinecraft("§e📍 لقد مت عند الإحداثيات: §fX: §a-411 §f| Y: §a102 §f| Z: §a222"));

console.log("--- TEST 4 ---");
console.log("Original: وصلت إلى موقع قبرك بنجاح! تم استرجاع أغراضك وإيقاف التتبع.");
console.log("Fixed:   ", fixArabicForMinecraft("وصلت إلى موقع قبرك بنجاح! تم استرجاع أغراضك وإيقاف التتبع."));
