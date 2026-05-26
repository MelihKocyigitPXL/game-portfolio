
import { state } from "../globalState.js";

export default function() {
    scene("blackhole", () => {
        setGravity(0);
        
        // Dark space background
        add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(5, 5, 10)),
            fixed(),
            z(-20)
        ]);

        // Starfield background
        for (let i = 0; i < 100; i++) {
            add([
                pos(rand(0, width()), rand(0, height())),
                circle(rand(1, 2)),
                color(rgb(255, 255, 255)),
                opacity(rand(0.2, 0.8)),
                z(-15),
            ]);
        }

        const blackHole = add([
            circle(50),
            pos(width() / 2, height() / 2),
            color(rgb(0, 0, 0)),
            outline(4, rgb(255, 100, 255)),
            area(),
            anchor("center"),
            z(5),
            "blackhole",
            {
                size: 50,
                expansionRate: 15,
                isStabilized: false
            }
        ]);

        // Accretion disk effect
        const disk = add([
            pos(width() / 2, height() / 2),
            circle(blackHole.size + 20),
            color(rgb(100, 0, 200)),
            opacity(0.3),
            anchor("center"),
            z(4),
        ]);

        const player = add([
            sprite("bean"),
            pos(100, 100),
            area(),
            anchor("center"),
            z(100),
        ]);

        state.attachXP(player, 500);

        // UI
        const statusLabel = add([
            text("BLACK HOLE STABILIZATION: 0%", { size: 24 }),
            pos(width() / 2, 40),
            anchor("center"),
            color(rgb(255, 100, 255)),
            fixed(),
        ]);

        const tutorialLabel = add([
            text("LINKERMUISKNOP om sterren te schieten\nVoed het zwarte gat om het te stoppen!\n(ESC) om te stoppen", { size: 16, align: "center" }),
            pos(width() / 2, height() - 80),
            anchor("center"),
            color(rgb(200, 200, 200)),
            fixed(),
        ]);

        let stabilization = 0;

        onKeyPress("escape", () => go("hub"));

        onMousePress("left", () => {
            if (blackHole.isStabilized) return;

            const dir = mousePos().sub(player.pos).unit();
            add([
                circle(8),
                pos(player.pos),
                color(rgb(255, 255, 150)),
                outline(2, rgb(255, 255, 255)),
                area(),
                anchor("center"),
                move(dir, 800),
                offscreen({ destroy: true }),
                "star_bullet",
                z(50),
            ]);
            
            // Recoil
            player.move(dir.scale(-200));
        });

        onCollide("star_bullet", "blackhole", (s, b) => {
            destroy(s);
            if (b.isStabilized) return;

            stabilization += 2;
            b.size = Math.max(30, b.size - 5);
            
            // Visual feedback
            shake(2);
            const ring = add([
                pos(b.pos),
                circle(b.radius),
                color(rgb(255, 255, 255)),
                opacity(0.5),
                anchor("center"),
                z(6),
            ]);
            tween(0.5, 1.5, 0.3, (v) => ring.scale = vec2(v));
            tween(0.5, 0, 0.3, (v) => ring.opacity = v).onEnd(() => destroy(ring));

            if (stabilization >= 100) {
                b.isStabilized = true;
                stabilization = 100;
                winGame();
            }
        });

        function winGame() {
            state.isHero = true;
            blackHole.outline.color = rgb(0, 255, 255);
            disk.color = rgb(0, 150, 255);
            statusLabel.text = "STABILIZED! PORTFOLIO SECURE";
            statusLabel.color = rgb(0, 255, 255);
            
            wait(2, () => {
                add([
                    text("Druk E om terug te keren als de Redder van de Kosmos", { size: 20 }),
                    pos(width() / 2, height() / 2 + 150),
                    anchor("center"),
                    color(rgb(255, 255, 255)),
                ]);
            });
        }

        onUpdate(() => {
            if (!blackHole.isStabilized) {
                // Black hole grows
                blackHole.size += dt() * blackHole.expansionRate;
                blackHole.radius = blackHole.size;
                disk.radius = blackHole.size + 20;
                
                statusLabel.text = `STABILIZATION: ${Math.floor(stabilization)}%`;

                // Pull player
                const pullDir = blackHole.pos.sub(player.pos).unit();
                const dist = player.pos.dist(blackHole.pos);
                const pullStrength = map(dist, 0, 1000, 400, 50);
                player.move(pullDir.scale(pullStrength));

                if (dist < blackHole.size) {
                    // Sucked in! Reset position
                    player.pos = vec2(100, 100);
                    shake(20);
                    stabilization = Math.max(0, stabilization - 10);
                }
            }

            if (blackHole.isStabilized && isKeyPressed("e")) {
                go("hub");
            }
            
            // Boundaries
            player.pos.x = clamp(player.pos.x, 20, width() - 20);
            player.pos.y = clamp(player.pos.y, 20, height() - 20);
        });

        // Entrance animation
        const f = add([rect(width(), height()), pos(0, 0), color(rgb(0, 0, 0)), opacity(1), fixed(), z(200)]);
        tween(1, 0, 1, (v) => f.opacity = v);
    });
}
