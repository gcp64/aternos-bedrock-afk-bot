import zipfile
import json
import os
import uuid
import shutil

build_dir = r"d:\المشاريع\MCP\afk_bot\Death_Waypoint_Beacon_BP_Build"
if os.path.exists(build_dir):
    shutil.rmtree(build_dir)
os.makedirs(os.path.join(build_dir, "scripts"), exist_ok=True)

header_uuid = str(uuid.uuid4())
module_uuid = str(uuid.uuid4())

manifest = {
    "format_version": 2,
    "header": {
        "name": "§cDeath Waypoint §7& §eGrave Beacon",
        "description": "Shows exact death coordinates in chat and spawns a vertical beacon beam at your grave.",
        "uuid": header_uuid,
        "version": [1, 0, 0],
        "min_engine_version": [1, 21, 0]
    },
    "modules": [
        {
            "description": "Death Waypoint Script Module",
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

const activeGraves = new Map();

world.afterEvents.entityDie.subscribe((event) => {
    try {
        const dead = event.deadEntity;
        if (!dead || dead.typeId !== "minecraft:player") return;

        const loc = dead.location;
        const dim = dead.dimension;
        const dimName = dim.id.includes("nether") ? "Nether" : (dim.id.includes("the_end") ? "The End" : "Overworld");
        const x = Math.floor(loc.x);
        const y = Math.floor(loc.y);
        const z = Math.floor(loc.z);

        system.runTimeout(() => {
            try {
                dead.sendMessage("\\n§c========================================");
                dead.sendMessage("§c§l💀 [موقع الوفاة - Death Marker]");
                dead.sendMessage(`§e📍 الإحداثيات: §fX: §a${x} §f| Y: §a${y} §f| Z: §a${z}`);
                dead.sendMessage(`§b🌍 البُعد: §f${dimName}`);
                dead.sendMessage("§6✨ تم إطلاق شعاع منارة عمودي في المكان ليرشدك إلى أغراضك!");
                dead.sendMessage("§c========================================\\n");
            } catch (e) {}
        }, 40);

        activeGraves.set(dead.name, {
            x: loc.x,
            y: loc.y,
            z: loc.z,
            dim: dim,
            ticksLeft: 20 * 60 * 10
        });
    } catch (err) {
        console.error("[DeathBeacon Error]", err);
    }
});

system.runInterval(() => {
    try {
        for (const [playerName, grave] of activeGraves.entries()) {
            grave.ticksLeft -= 20;
            if (grave.ticksLeft <= 0) {
                activeGraves.delete(playerName);
                continue;
            }

            const dim = grave.dim;
            for (let dy = 0; dy <= 40; dy += 4) {
                try {
                    dim.spawnParticle("minecraft:endrod", { x: grave.x, y: grave.y + dy, z: grave.z });
                } catch (e) {}
            }

            for (const player of world.getAllPlayers()) {
                if (player.name === playerName && player.dimension.id === dim.id) {
                    const distSq = (player.location.x - grave.x) ** 2 + (player.location.y - grave.y) ** 2 + (player.location.z - grave.z) ** 2;
                    if (distSq < 25) {
                        player.sendMessage("§a§l[🎉 استرجاع الأغراض] §fوصلت إلى موقع قبرك بنجاح! تم إطفاء المنارة.");
                        player.playSound("random.levelup");
                        activeGraves.delete(playerName);
                        break;
                    }
                }
            }
        }
    } catch (err) {
        console.error("[DeathBeacon Loop Error]", err);
    }
}, 20);
"""

with open(os.path.join(build_dir, "scripts", "main.js"), "w", encoding="utf-8") as f:
    f.write(script_code)

out_pack = r"d:\المشاريع\MCP\afk_bot\Death_Waypoint_Beacon_BP.mcpack"
with zipfile.ZipFile(out_pack, "w", zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(build_dir):
        for file in files:
            full = os.path.join(root, file)
            rel = os.path.relpath(full, build_dir)
            z.write(full, rel)

shutil.rmtree(build_dir)
print(f"Successfully built {out_pack}, size={os.path.getsize(out_pack)} bytes")
