import { state } from "../globalState.js";

export default function() {
    scene("innovation", (info) => {
        setGravity(0);
        add([rect(width(), height()), pos(0, 0), color(rgb(10, 15, 25)), fixed(), z(-20)]);

        add([
            text(info.title, { size: 28 }),
            pos(width() / 2, 30),
            anchor("center"),
            color(rgb(100, 255, 100)),
        ]);

        add([
            text("Visualisatie van de Event-driven Architectuur", { size: 14 }),
            pos(width() / 2, 60),
            anchor("center"),
            color(rgb(200, 200, 255)),
        ]);

        const bus = add([
            rect(700, 40, { radius: 10 }),
            pos(width() / 2, height() / 2 - 20),
            anchor("center"),
            color(rgb(30, 40, 30)),
            outline(2, rgb(100, 255, 100)),
            z(-15),
        ]);

        add([
            text("APACHE KAFKA EVENT BUS", { size: 16 }),
            pos(width() / 2, height() / 2 - 20),
            anchor("center"),
            color(rgb(100, 255, 100)),
            z(-14),
        ]);

        const nodes = [
            { name: "Java App", pos: vec2(width() * 0.2, height() * 0.25) },
            { name: "Docker Container", pos: vec2(width() * 0.5, height() * 0.15) },
            { name: "Azure API Mgmt", pos: vec2(width() * 0.8, height() * 0.25) },
            { name: "Camel Exchange", pos: vec2(width() * 0.3, height() * 0.6) },
            { name: "Microservice", pos: vec2(width() * 0.7, height() * 0.6) },
        ];

        nodes.forEach((n) => {
            const busY = height() / 2 - 20;
            const h = Math.abs(n.pos.y - busY);
            add([
                rect(4, h),
                pos(n.pos.x, Math.min(n.pos.y, busY)),
                anchor("top"),
                color(rgb(50, 100, 50)),
                z(-16),
            ]);

            const nodeObj = add([
                rect(140, 50, { radius: 8 }),
                pos(n.pos),
                anchor("center"),
                color(rgb(20, 30, 20)),
                outline(2, rgb(200, 200, 200)),
                z(-10),
            ]);

            add([
                text(n.name, { size: 14 }),
                pos(n.pos),
                anchor("center"),
                color(rgb(255, 255, 255)),
                z(-9),
            ]);

            nodeObj.onUpdate(() => {
                if (chance(0.01)) {
                    nodeObj.color = rgb(50, 150, 50);
                    wait(0.2, () => nodeObj.color = rgb(20, 30, 20));
                    const otherNodes = nodes.filter(node => node.name !== n.name);
                    const targetNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
                    spawnPacket(n.pos, targetNode.pos);
                }
            });
        });

        function spawnPacket(startPos, endPos) {
            const busY = height() / 2 - 20;
            
            const p = add([
                circle(4),
                pos(startPos),
                color(rgb(100, 255, 100)),
                z(-12),
            ]);
            
            tween(p.pos.y, busY, 0.4, (val) => p.pos.y = val, easings.easeOutQuad).onEnd(() => {
                tween(p.pos.x, endPos.x, 0.6, (val) => p.pos.x = val, easings.linear).onEnd(() => {
                    tween(p.pos.y, endPos.y, 0.4, (val) => p.pos.y = val, easings.easeInQuad).onEnd(() => {
                        destroy(p);
                    });
                });
            });
        }

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() / 2 + 60),
            area(),
            anchor("center"),
            color(info.color ? rgb(info.color[0], info.color[1], info.color[2]) : rgb(100, 255, 100)),
        ]);

        state.attachXP(player, 350);

        const infoBox = add([
            rect(width() * 0.9, 130, { radius: 10 }),
            pos(width() / 2, height() - 75),
            anchor("center"),
            color(rgb(10, 15, 20)),
            outline(3, rgb(info.color[0], info.color[1], info.color[2])),
            z(50),
        ]);

        infoBox.add([
            text(info.text, { size: 15, width: width() * 0.85, lineSpacing: 5 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        const returnPortal = add([
            circle(28),
            pos(width() / 2, height() - 170),
            color(rgb(40, 40, 60)),
            outline(3, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            "return",
        ]);

        const returnPrompt = add([
            text("", { size: 14 }),
            pos(width() / 2, height() - 210),
            anchor("center"),
        ]);

        let onReturn = false;
        player.onCollide("return", () => {
            onReturn = true;
            returnPrompt.text = "(E) TERUG";
        });

        player.onCollideEnd("return", () => {
            onReturn = false;
            returnPrompt.text = "";
        });

        onUpdate(() => {
            player.pos.x = clamp(player.pos.x, 20, width() - 20);
            player.pos.y = clamp(player.pos.y, 20, height() - 20);
            if (onReturn && isKeyPressed("e")) {
                go("hub");
            }
        });
    });
}
