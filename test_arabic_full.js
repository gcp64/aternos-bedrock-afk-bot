// Comprehensive Arabic Reshaper & Bidirectional Engine for Minecraft Bedrock

const charsMap = [
    /* code, isolated, initial, medial, final */
    [ 0x0621, 0xFE80, null  , null  , null   ], /* HAMZA */
    [ 0x0622, 0xFE81, null  , null  , 0xFE82 ], /* ALEF_MADDA */
    [ 0x0623, 0xFE83, null  , null  , 0xFE84 ], /* ALEF_HAMZA_ABOVE */
    [ 0x0624, 0xFE85, null  , null  , 0xFE86 ], /* WAW_HAMZA */
    [ 0x0625, 0xFE87, null  , null  , 0xFE88 ], /* ALEF_HAMZA_BELOW */
    [ 0x0626, 0xFE89, 0xFE8B, 0xFE8C, 0xFE8A ], /* YEH_HAMZA */
    [ 0x0627, 0xFE8D, null  , null  , 0xFE8E ], /* ALEF */
    [ 0x0628, 0xFE8F, 0xFE91, 0xFE92, 0xFE90 ], /* BEH */
    [ 0x0629, 0xFE93, null  , null  , 0xFE94 ], /* TEH_MARBUTA */
    [ 0x062A, 0xFE95, 0xFE97, 0xFE98, 0xFE96 ], /* TEH */
    [ 0x062B, 0xFE99, 0xFE9B, 0xFE9C, 0xFE9A ], /* THEH */
    [ 0x062C, 0xFE9D, 0xFE9F, 0xFEA0, 0xFE9E ], /* JEEM */
    [ 0x062D, 0xFEA1, 0xFEA3, 0xFEA4, 0xFEA2 ], /* HAH */
    [ 0x062E, 0xFEA5, 0xFEA7, 0xFEA8, 0xFEA6 ], /* KHAH */
    [ 0x062F, 0xFEA9, null  , null  , 0xFEAA ], /* DAL */
    [ 0x0630, 0xFEAB, null  , null  , 0xFEAC ], /* THAL */
    [ 0x0631, 0xFEAD, null  , null  , 0xFEAE ], /* REH */
    [ 0x0632, 0xFEAF, null  , null  , 0xFEB0 ], /* ZAIN */
    [ 0x0698, 0xFB8A, null  , null  , 0xFB8B ], /* ZHEH */
    [ 0x0633, 0xFEB1, 0xFEB3, 0xFEB4, 0xFEB2 ], /* SEEN */
    [ 0x0634, 0xFEB5, 0xFEB7, 0xFEB8, 0xFEB6 ], /* SHEEN */
    [ 0x0635, 0xFEB9, 0xFEBB, 0xFEBC, 0xFEBA ], /* SAD */
    [ 0x0636, 0xFEBD, 0xFEBF, 0xFEC0, 0xFEBE ], /* DAD */
    [ 0x0637, 0xFEC1, 0xFEC3, 0xFEC4, 0xFEC2 ], /* TAH */
    [ 0x0638, 0xFEC5, 0xFEC7, 0xFEC8, 0xFEC6 ], /* ZAH */
    [ 0x0639, 0xFEC9, 0xFECB, 0xFECC, 0xFECA ], /* AIN */
    [ 0x063A, 0xFECD, 0xFECF, 0xFED0, 0xFECE ], /* GHAIN */
    [ 0x0640, 0x0640, 0x0640, 0x0640, 0x0640 ], /* TATWEEL */
    [ 0x0641, 0xFED1, 0xFED3, 0xFED4, 0xFED2 ], /* FEH */
    [ 0x0642, 0xFED5, 0xFED7, 0xFED8, 0xFED6 ], /* QAF */
    [ 0x0643, 0xFED9, 0xFEDB, 0xFEDC, 0xFEDA ], /* KAF */
    [ 0x0644, 0xFEDD, 0xFEDF, 0xFEE0, 0xFEDE ], /* LAM */
    [ 0x0645, 0xFEE1, 0xFEE3, 0xFEE4, 0xFEE2 ], /* MEEM */
    [ 0x0646, 0xFEE5, 0xFEE7, 0xFEE8, 0xFEE6 ], /* NOON */
    [ 0x0647, 0xFEE9, 0xFEEB, 0xFEEC, 0xFEEA ], /* HEH */
    [ 0x0648, 0xFEED, null  , null  , 0xFEEE ], /* WAW */
    [ 0x0649, 0xFEEF, 0xFBE8, 0xFBE9, 0xFBFD ], /* ALEF_MAKSURA */
    [ 0x064A, 0xFEF1, 0xFEF3, 0xFEF4, 0xFEF2 ], /* YEH */
    [ 0x06CC, 0xFBFC, 0xFBFE, 0xFBFF, 0xFEF0 ], /* YEH Farsi */
    [ 0x0686, 0xFB7A, 0xFB7C, 0xFB7D, 0xFB7B ], /* CHEH */
    [ 0x067E, 0xFB56, 0xFB58, 0xFB59, 0xFB57 ],
    [ 0x06AF, 0xFB92, 0xFB94, 0xFB95, 0xFB93 ],
    [ 0x06A9, 0xFB8E, 0xFB90, 0xFB91, 0xFB8F ]
];

const combCharsMap = [
    [ [ 0x0644, 0x0622 ], 0xFEF5, null, null, 0xFEF6 ], /* LAM_ALEF_MADDA */
    [ [ 0x0644, 0x0623 ], 0xFEF7, null, null, 0xFEF8 ], /* LAM_ALEF_HAMZA_ABOVE */
    [ [ 0x0644, 0x0625 ], 0xFEF9, null, null, 0xFEFA ], /* LAM_ALEF_HAMZA_BELOW */
    [ [ 0x0644, 0x0627 ], 0xFEFB, null, null, 0xFEFC ]  /* LAM_ALEF */
];

const transChars = [
    0x0610, 0x0612, 0x0613, 0x0614, 0x0615, 0x064B, 0x064C, 0x064D,
    0x064E, 0x064F, 0x0650, 0x0651, 0x0652, 0x0653, 0x0654, 0x0655,
    0x0656, 0x0657, 0x0658, 0x0670, 0x06D6, 0x06D7, 0x06D8, 0x06D9,
    0x06DA, 0x06DB, 0x06DC, 0x06DF, 0x06E0, 0x06E1, 0x06E2, 0x06E3,
    0x06E4, 0x06E7, 0x06E8, 0x06EA, 0x06EB, 0x06EC, 0x06ED
];

const charMapLookup = new Map();
for (const entry of charsMap) {
    charMapLookup.set(entry[0], entry);
}

const transSet = new Set(transChars);

function reshapeArabic(text) {
    let shaped = "";
    for (let i = 0; i < text.length; ++i) {
        const current = text.charCodeAt(i);
        const crep = charMapLookup.get(current);
        if (crep) {
            let prevID = i - 1;
            while (prevID >= 0 && transSet.has(text.charCodeAt(prevID))) {
                prevID--;
            }
            let prev = prevID >= 0 ? text.charCodeAt(prevID) : null;
            let prevRep = prev ? charMapLookup.get(prev) : null;
            if (prevRep && prevRep[2] == null && prevRep[3] == null) {
                prev = null;
            }

            let nextID = i + 1;
            while (nextID < text.length && transSet.has(text.charCodeAt(nextID))) {
                nextID++;
            }
            let next = nextID < text.length ? text.charCodeAt(nextID) : null;
            let nextRep = next ? charMapLookup.get(next) : null;
            if (nextRep && nextRep[3] == null && nextRep[4] == null) {
                next = null;
            }

            /* Combinations (Lam + Alef) */
            if (current === 0x0644 && next !== null &&
                (next === 0x0622 || next === 0x0623 || next === 0x0625 || next === 0x0627)) {
                let combCode = null;
                for (const c of combCharsMap) {
                    if (c[0][0] === current && c[0][1] === next) {
                        combCode = prev !== null ? c[4] : c[1];
                        break;
                    }
                }
                if (combCode) {
                    shaped += String.fromCharCode(combCode);
                    i++;
                    continue;
                }
            }

            /* Medial */
            if (prev !== null && next !== null && crep[3] !== null) {
                shaped += String.fromCharCode(crep[3]);
            } else if (prev !== null && crep[4] !== null) { /* Final */
                shaped += String.fromCharCode(crep[4]);
            } else if (next !== null && crep[2] !== null) { /* Initial */
                shaped += String.fromCharCode(crep[2]);
            } else { /* Isolated */
                shaped += String.fromCharCode(crep[1]);
            }
        } else {
            shaped += String.fromCharCode(current);
        }
    }
    return shaped;
}

function isArabicChar(code) {
    return (code >= 0x0600 && code <= 0x06FF) ||
           (code >= 0xFB50 && code <= 0xFDFF) ||
           (code >= 0xFE70 && code <= 0xFEFC);
}

// Tokenizes line preserving Minecraft color codes and grouping Arabic vs LTR
function fixArabicForBedrock(text) {
    if (!text) return "";
    if (!/[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFC]/.test(text)) {
        return text;
    }

    const lines = text.split('\n');
    return lines.map(line => {
        if (!/[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFC]/.test(line)) {
            return line;
        }

        const shaped = reshapeArabic(line);

        // Tokenize line into:
        // 1. Color/format codes: §[0-9a-zA-Z]
        // 2. Arabic words (runs of Arabic characters)
        // 3. Numbers / Latin / Punctuation
        // 4. Spaces
        const tokens = [];
        let i = 0;
        while (i < shaped.length) {
            // Check Minecraft formatting code
            if (shaped[i] === '§' && i + 1 < shaped.length) {
                tokens.push({ type: 'format', text: shaped.substring(i, i + 2) });
                i += 2;
                continue;
            }

            // Check Arabic word
            if (isArabicChar(shaped.charCodeAt(i))) {
                let start = i;
                while (i < shaped.length && isArabicChar(shaped.charCodeAt(i))) {
                    i++;
                }
                tokens.push({ type: 'arabic', text: shaped.substring(start, i) });
                continue;
            }

            // Check space
            if (shaped[i] === ' ') {
                tokens.push({ type: 'space', text: ' ' });
                i++;
                continue;
            }

            // Other character (numbers, Latin letters, punctuation, symbols)
            let start = i;
            while (i < shaped.length &&
                   shaped[i] !== ' ' &&
                   shaped[i] !== '§' &&
                   !isArabicChar(shaped.charCodeAt(i))) {
                i++;
            }
            tokens.push({ type: 'other', text: shaped.substring(start, i) });
        }

        // Attach preceding format codes to the following token
        const chunks = [];
        let activeFormats = [];

        for (const tok of tokens) {
            if (tok.type === 'format') {
                activeFormats.push(tok.text);
            } else {
                chunks.push({
                    formats: activeFormats.slice(),
                    type: tok.type,
                    text: tok.text
                });
                activeFormats = [];
            }
        }
        if (activeFormats.length > 0) {
            chunks.push({ formats: activeFormats, type: 'format_only', text: '' });
        }

        // For Arabic words, reverse their internal letters for Bedrock LTR display
        for (const c of chunks) {
            if (c.type === 'arabic') {
                c.text = c.text.split('').reverse().join('');
            }
        }

        // Reverse chunk order so the sentence reads RTL
        chunks.reverse();

        // Reassemble
        let result = "";
        for (const c of chunks) {
            result += c.formats.join('') + c.text;
        }
        return result;
    }).join('\n');
}

// Tests
console.log("=== Arabic Bedrock Reshaper Test ===");
console.log("Test 1:", fixArabicForBedrock("مرحبا بكم في السيرفر"));
console.log("Test 2:", fixArabicForBedrock("§c[موقع الوفاة] §eالإحداثيات: §fX: §a-411 §f| Y: §a102 §f| Z: §a222"));
console.log("Test 3:", fixArabicForBedrock("وصلت إلى موقع قبرك بنجاح! تم إطفاء المنارة."));
console.log("Test 4:", fixArabicForBedrock("Mrbob2031: هلا شباب شلونكم"));
