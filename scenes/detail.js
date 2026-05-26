import { state } from "../globalState.js";

export default function() {
    scene("detail", (info) => {
        setGravity(0);
        
        const bgColor = rgb(
            Math.floor(info.color[0] * 0.1),
            Math.floor(info.color[1] * 0.1),
            Math.floor(info.color[2] * 0.1)
        );
        add([rect(width(), height()), pos(0, 0), color(bgColor), fixed(), z(-20)]);

        const monument = add([
            rect(width() * 0.85, 480, { radius: 12 }),
            pos(width() / 2, height() / 2 - 20),
            anchor("center"),
            color(rgb(20, 20, 30)),
            outline(4, rgb(info.color[0], info.color[1], info.color[2])),
            opacity(info.type === "graph" ? 0 : 1),
        ]);

        const monumentTitle = monument.add([
            text(info.title.toUpperCase(), { size: 36 }),
            pos(0, -190),
            anchor("center"),
            color(rgb(info.color[0], info.color[1], info.color[2])),
            opacity(info.type === "graph" ? 0 : 1),
        ]);

        const monumentBody = monument.add([
            text(info.text, { size: 19, width: width() * 0.75, align: "center", lineSpacing: 8 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(255, 255, 255)),
            opacity(info.type === "graph" ? 0 : 1),
        ]);

        const monumentFlair = monument.add([
            text(info.flair, { size: 15 }),
            pos(0, 200),
            anchor("center"),
            color(rgb(info.color[0], info.color[1], info.color[2])),
            opacity(info.type === "graph" ? 0 : 0.8),
        ]);

        if (info.type === "terminal") {
            onUpdate(() => {
                if (chance(0.1)) {
                    add([
                        pos(rand(0, width()), 0),
                        text(choose(["0", "1", "<", ">", "/", "_"]), { size: 16 }),
                        color(rgb(0, 255, 0)),
                        opacity(0.3),
                        move(vec2(0, 1), rand(100, 300)),
                        lifespan(3),
                        z(-5),
                    ]);
                }
            });
        } else if (info.type === "graph") {
            const graphW = 500;
            const graphH = 300;
            const origin = vec2(width() / 2 - graphW / 2, height() / 2 + 100);

            const xAxis = add([
                rect(graphW, 4),
                pos(origin),
                color(rgb(255, 255, 255)),
                opacity(0),
                z(2),
            ]);
            const yAxis = add([
                rect(4, graphH),
                pos(origin.x, origin.y - graphH),
                color(rgb(255, 255, 255)),
                opacity(0),
                z(2),
            ]);
            const graphPoints = [];
            const graphLabels = [];

            const labels = [
                { t: "START", x: 0, shown: false },
                { t: "LEREN", x: 0.3, shown: false },
                { t: "PXL", x: 0.7, shown: false },
                { t: "PRO", x: 1.0, shown: false },
            ];

            tween(0, 1, 0.8, (v) => {
                xAxis.opacity = v;
                yAxis.opacity = v;
            }, easings.easeOutQuad).onEnd(() => {
                let lastStep = -1;
                const totalSteps = 140;

                tween(0, 1, 2.4, (progress) => {
                    const step = Math.floor(progress * totalSteps);

                    for (let i = lastStep + 1; i <= step; i++) {
                        const p = i / totalSteps;
                        const currX = p * graphW;
                        const currY = Math.pow(p, 2.5) * graphH;

                        const point = add([
                            rect(6, 6),
                            pos(origin.x + currX, origin.y - currY),
                            color(rgb(100, 255, 100)),
                            anchor("center"),
                            z(3),
                        ]);
                        graphPoints.push(point);
                    }
                    lastStep = step;

                    labels.forEach((l) => {
                        if (progress >= l.x && !l.shown) {
                            l.shown = true;
                            const label = add([
                                text(l.t, { size: 14 }),
                                pos(origin.x + l.x * graphW, origin.y + 20),
                                anchor("center"),
                                color(rgb(150, 150, 250)),
                                z(4),
                            ]);
                            graphLabels.push(label);
                        }
                    });
                }, easings.linear).onEnd(() => {
                    wait(0.6, () => {
                        tween(0, 1, 1, (v) => {
                            monument.opacity = v;
                            monumentTitle.opacity = v;
                            monumentBody.opacity = v;
                            monumentFlair.opacity = v * 0.8;

                            xAxis.opacity = 1 - v;
                            yAxis.opacity = 1 - v;
                            graphPoints.forEach((point) => point.opacity = 1 - v);
                            graphLabels.forEach((label) => label.opacity = 1 - v);
                        }, easings.easeOutQuad).onEnd(() => {
                            graphPoints.forEach((point) => destroy(point));
                            graphLabels.forEach((label) => destroy(label));
                            destroy(xAxis);
                            destroy(yAxis);
                        });
                    });
                });
            });

        } else if (info.type === "circuit") {
            for (let x = 0; x < width(); x += 60) {
                for (let y = 0; y < height(); y += 60) {
                    add([pos(x, y), circle(2), color(rgb(info.color[0], info.color[1], info.color[2])), opacity(0.1), z(-5)]);
                }
            }
        } else if (info.type === "crowd") {
            for (let i = 0; i < 15; i++) {
                const b = add([
                    sprite("bean"),
                    pos(rand(0, width()), rand(0, height())),
                    scale(0.4),
                    opacity(0.15),
                    z(-5),
                    anchor("center"),
                    { dir: vec2(rand(-1, 1), rand(-1, 1)).unit() }
                ]);
                b.onUpdate(() => {
                    b.move(b.dir.scale(40));
                    if (b.pos.x < 0 || b.pos.x > width()) b.dir.x *= -1;
                    if (b.pos.y < 0 || b.pos.y > height()) b.dir.y *= -1;
                });
            }
        } else {
            for (let i = 0; i < 60; i++) {
                add([pos(rand(0, width()), rand(0, height())), rect(2, 2), color(rgb(info.color[0], info.color[1], info.color[2])), opacity(0.2), z(-5)]);
            }
        }

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 140),
            area(),
            anchor("center"),
            z(10),
        ]);

        state.attachXP(player, 400);

        const returnPortal = add([
            circle(28),
            pos(width() / 2, height() - 35),
            color(rgb(40, 40, 60)),
            outline(3, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            "return",
        ]);

        const returnPrompt = add([
            text("", { size: 14 }),
            pos(width() / 2, height() - 85),
            anchor("center"),
            fixed(),
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

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(info.color[0], info.color[1], info.color[2])),
            opacity(1),
            fixed(),
            z(100),
        ]);
        tween(1, 0, 0.6, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
