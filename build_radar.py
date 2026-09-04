import zipfile
import json
import os
import uuid
import shutil

build_dir = r"d:\المشاريع\MCP\afk_bot\RPG_Radar_BP_Build"
if os.path.exists(build_dir):
    shutil.rmtree(build_dir)
os.makedirs(os.path.join(build_dir, "scripts"), exist_ok=True)

header_uuid = str(uuid.uuid4())
module_uuid = str(uuid.uuid4())

manifest = {
    "format_version": 2,
    "header": {
        "name": "§6RPG Navigation Radar §7& §eCompass HUD",
        "description": "Sleek live HUD bar showing real-time Compass, Coordinates, Direction, Time & Radar.",
        "uuid": header_uuid,
        "version": [1, 0, 0],
        "min_engine_version": [1, 21, 0]
    },
    "modules": [
        {
            "description": "RPG Radar Script Module",
            "type": "script",
            "language": "javascript",
            "uuid": module_uuid,
            "version": [1, 0, 0],
            "entry": "scripts/main.js"
        }
    ],
    "dependencies": [
        {
            "module_name": "@minecraft/server",
            "version": "1.13.0"
        }
    ]
}

with open(os.path.join(build_dir, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

script_code = """import { world, system } from "@minecraft/server";

function getDirectionName(rotationY) {
    let deg = (rotationY % 360 + 360) % 360;
    if (deg >= 337.5 || deg < 22.5) return { dir: "S", icon: "⬇️", deg: Math.floor(deg) };
    if (deg >= 22.5 && deg < 67.5) return { dir: "SW", icon: "↙️", deg: Math.floor(deg) };
    if (deg >= 67.5 && deg < 112.5) return { dir: "W", icon: "⬅️", deg: Math.floor(deg) };
    if (deg >= 112.5 && deg < 157.5) return { dir: "NW", icon: "↖️", deg: Math.floor(deg) };
    if (deg >= 157.5 && deg < 202.5) return { dir: "N", icon: "⬆️", deg: Math.floor(deg) };
    if (deg >= 202.5 && deg < 247.5) return { dir: "NE", icon: "↗️", deg: Math.floor(deg) };
    if (deg >= 247.5 && deg < 292.5) return { dir: "E", icon: "➡️", deg: Math.floor(deg) };
    return { dir: "SE", icon: "↘️", deg: Math.floor(deg) };
}

function getFormattedTime(dim) {
    try {
        const timeOfDay = world.getTimeOfDay();
        // Minecraft day starts at 0 (6:00 AM)
        const hours = Math.floor((timeOfDay / 1000 + 6) % 24);
        const minutes = Math.floor((timeOfDay % 1000) * 60 / 1000);
        const icon = (hours >= 6 && hours < 19) ? "☀️" : "🌙";
        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        return `${icon} ${hh}:${mm}`;
    } catch (e) {
        return "☀️ Day";
    }
}

// Update HUD bar every 4 ticks (0.2s) smoothly for every player
system.runInterval(() => {
    try {
        for (const player of world.getAllPlayers()) {
            if (!player.isValid()) continue;
            // Don't clutter AFK guardian bot
            if (player.name === "AFK_Guardian") continue;

            const loc = player.location;
            const rot = player.getRotation();
            const heading = getDirectionName(rot.y);
            const timeStr = getFormattedTime(player.dimension);

            const x = Math.floor(loc.x);
            const y = Math.floor(loc.y);
            const z = Math.floor(loc.z);

            const dimId = player.dimension.id;
            let dimTag = "§aOverworld";
            if (dimId.includes("nether")) dimTag = "§cNether";
            else if (dimId.includes("the_end")) dimTag = "§eThe End";

            // Clean, sleek, non-intrusive Action Bar display
            const hudText = `§6🧭 §e${heading.dir} ${heading.deg}° §f| §bX: §f${x} §aY: §f${y} §cZ: §f${z} §f| ${dimTag} §f| §e${timeStr}`;
            player.onScreenDisplay.setActionBar(hudText);
        }
    } catch (err) {
        // Silent catch to prevent console spam
    }
}, 4);
"""

with open(os.path.join(build_dir, "scripts", "main.js"), "w", encoding="utf-8") as f:
    f.write(script_code)

out_pack = r"d:\المشاريع\MCP\afk_bot\RPG_Radar_BP.mcpack"
with zipfile.ZipFile(out_pack, "w", zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(build_dir):
        for file in files:
            full = os.path.join(root, file)
            rel = os.path.relpath(full, build_dir)
            z.write(full, rel)

shutil.rmtree(build_dir)
print(f"Successfully built {out_pack}, size={os.path.getsize(out_pack)} bytes")
