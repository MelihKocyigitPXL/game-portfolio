export default function() {
    scene("planet_easter_egg", () => {
        setGravity(0);

        const bg = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(6, 8, 18)),
            fixed(),
            z(-100),
        ]);

        // Decorative overkill stars
        for (let i = 0; i < 220; i++) {
            const twinkle = add([
                rect(rand(1, 3), rand(1, 3)),
                pos(rand(0, width()), rand(0, height())),
                color(rgb(180 + rand(0, 75), 180 + rand(0, 75), 255)),
                opacity(rand(0.15, 0.9)),
                z(-50),
            ]);
            twinkle.onUpdate(() => {
                twinkle.opacity = 0.3 + Math.abs(Math.sin(time() * rand(1, 4))) * 0.7;
            });
        }

        const title = add([
            text("PLANET EASTER EGG: UNNECESSARILY ENTERPRISE EDITION", { size: 24 }),
            pos(width() / 2, 30),
            anchor("center"),
            color(rgb(120, 255, 255)),
            z(30),
        ]);

        const subtitle = add([
            text("You discovered a completely over-scoped feature. Congratulations?", { size: 15 }),
            pos(width() / 2, 62),
            anchor("center"),
            color(rgb(180, 220, 255)),
            z(30),
        ]);

        // Planet core and orbiting beans because yes
        const core = add([
            circle(80),
            pos(width() / 2, height() / 2),
            color(rgb(90, 170, 255)),
            outline(6, rgb(220, 240, 255)),
            anchor("center"),
            z(5),
            area(),
            "core",
        ]);

        const coreGlow = add([
            circle(120),
            pos(core.pos),
            color(rgb(70, 130, 255)),
            opacity(0.2),
            anchor("center"),
            z(4),
        ]);

        const orbiters = [];
        for (let i = 0; i < 8; i++) {
            const orbiter = add([
                sprite("bean"),
                pos(core.pos),
                scale(0.55),
                anchor("center"),
                z(8),
                {
                    orbitR: 130 + i * 18,
                    orbitSpeed: 0.45 + i * 0.08,
                    orbitOffset: i * 0.75,
                },
            ]);
            orbiters.push(orbiter);
        }

        // Metrics panel (massive overkill)
        const panel = add([
            rect(350, 240, { radius: 10 }),
            pos(25, 95),
            color(rgb(18, 22, 35)),
            outline(3, rgb(120, 180, 255)),
            z(20),
        ]);

        panel.add([
            text("Planet Operations Dashboard", { size: 18 }),
            pos(175, 24),
            anchor("center"),
            color(rgb(160, 220, 255)),
        ]);

        const metricsText = panel.add([
            text("booting...", { size: 14, lineSpacing: 6 }),
            pos(20, 55),
            color(rgb(220, 240, 255)),
        ]);

        // Achievement toaster
        const toast = add([
            rect(420, 46, { radius: 8 }),
            pos(width() / 2, height() - 36),
            anchor("center"),
            color(rgb(20, 35, 55)),
            outline(2, rgb(120, 220, 120)),
            opacity(0),
            z(50),
        ]);
        const toastText = toast.add([
            text("", { size: 14 }),
            anchor("center"),
            color(rgb(220, 255, 220)),
        ]);

        let scannerCharge = 0;
        let boops = 0;
        let discoveredLore = 0;
        let chaosMode = false;

        const loreLines = [
            "Lore #1: This planet has 14 committees and 0 deadlines.",
            "Lore #2: Bean satellites vote on architecture decisions.",
            "Lore #3: The ring is made of deprecated TODO comments.",
            "Lore #4: QA approved this easter egg out of pure confusion.",
            "Lore #5: The planet was rewritten 6 times for 'scalability'.",
        ];

        const loreBox = add([
            rect(470, 190, { radius: 10 }),
            pos(width() - 495, 95),
            color(rgb(18, 22, 35)),
            outline(3, rgb(255, 190, 120)),
            z(20),
        ]);
        loreBox.add([
            text("Archived Cosmic Lore", { size: 18 }),
            pos(235, 24),
            anchor("center"),
            color(rgb(255, 215, 165)),
        ]);

        const loreText = loreBox.add([
            text("Press L to reveal classified nonsense.", { size: 14, width: 430, lineSpacing: 6 }),
            pos(20, 55),
            color(rgb(255, 240, 220)),
        ]);

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 120),
            anchor("center"),
            area(),
            z(40),
            { overCore: false },
        ]);

        player.onCollide("core", () => {
            player.overCore = true;
        });
        player.onCollideEnd("core", () => {
            player.overCore = false;
        });

        const helpText = add([
            text("Arrows: Move | B: Boop planet | L: Lore | C: Chaos | R: Return", { size: 14 }),
            pos(width() / 2, height() - 70),
            anchor("center"),
            color(rgb(205, 225, 255)),
            z(45),
        ]);

        const returnHint = add([
            text("", { size: 14 }),
            pos(width() / 2, height() - 95),
            anchor("center"),
            color(rgb(255, 255, 180)),
            z(45),
        ]);

        const SPEED = 330;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        function showToast(message) {
            toastText.text = message;
            toast.opacity = 1;
            wait(1.2, () => {
                tween(toast.opacity, 0, 0.3, (v) => {
                    toast.opacity = v;
                }, easings.easeOutQuad);
            });
        }

        function refreshMetrics() {
            const complexity = 100 + boops * 13 + discoveredLore * 29 + (chaosMode ? 999 : 0);
            metricsText.text = [
                `Scanner Charge: ${Math.floor(scannerCharge)}%`,
                `Planet Boops: ${boops}`,
                `Lore Unlocked: ${discoveredLore}/${loreLines.length}`,
                `Technical Debt: ${complexity} units`,
                `Status: ${chaosMode ? "ABSOLUTE CHAOS" : "over-engineered but stable"}`,
                "",
                "Tip: boop near core for premium analytics.",
            ].join("\n");
        }

        onKeyPress("b", () => {
            boops += 1;
            scannerCharge = Math.min(100, scannerCharge + 12);
            let pulseScale = 1;

            const pulse = add([
                circle(20),
                pos(core.pos),
                color(rgb(130, 255, 220)),
                opacity(0.7),
                anchor("center"),
                scale(1),
                z(6),
                lifespan(0.6),
            ]);
            pulse.onUpdate(() => {
                pulseScale += dt() * 3.8;
                pulse.scale = vec2(pulseScale, pulseScale);
                pulse.opacity = Math.max(0, pulse.opacity - dt() * 1.5);
            });

            if (player.overCore) {
                showToast("Core Boop Certified. Planet morale improved by 400%.");
            } else {
                showToast("Long-distance boop accepted by interplanetary protocol.");
            }

            refreshMetrics();
        });

        onKeyPress("l", () => {
            if (discoveredLore < loreLines.length) {
                discoveredLore += 1;
                loreText.text = loreLines.slice(0, discoveredLore).join("\n");
                showToast(`Lore unlocked: ${discoveredLore}/${loreLines.length}`);
            } else {
                showToast("All lore unlocked. The universe is now fully documented.");
            }
            refreshMetrics();
        });

        onKeyPress("c", () => {
            chaosMode = !chaosMode;
            showToast(chaosMode ? "Chaos mode ON. Excellent questionable decision." : "Chaos mode OFF. Boring, but responsible.");
            refreshMetrics();
        });

        onKeyPress("r", () => {
            go("hub");
        });

        onUpdate(() => {
            // Keep player in bounds
            player.pos.x = clamp(player.pos.x, 18, width() - 18);
            player.pos.y = clamp(player.pos.y, 18, height() - 18);

            // Animate core and glow
            coreGlow.pos = core.pos;
            core.scale = vec2(1 + Math.sin(time() * 2.8) * 0.05);
            coreGlow.scale = vec2(1.05 + Math.sin(time() * 2) * 0.12);

            // Orbiting bean simulation engine v12.5
            orbiters.forEach((orbiter, idx) => {
                const a = time() * orbiter.orbitSpeed + orbiter.orbitOffset;
                orbiter.pos = vec2(
                    core.pos.x + Math.cos(a) * orbiter.orbitR,
                    core.pos.y + Math.sin(a) * (orbiter.orbitR * 0.62)
                );
                orbiter.angle += dt() * (55 + idx * 7);
            });

            // Slowly charge scanner over time
            scannerCharge = Math.min(100, scannerCharge + dt() * 1.7);

            if (chaosMode) {
                bg.color = rgb(8 + rand(0, 28), 6 + rand(0, 18), 15 + rand(0, 40));
                title.angle = Math.sin(time() * 3.2) * 2.5;
                subtitle.scale = vec2(1 + Math.sin(time() * 6) * 0.03);
                helpText.color = rgb(180 + rand(0, 75), 200, 255);
            } else {
                bg.color = rgb(6, 8, 18);
                title.angle = 0;
                subtitle.scale = vec2(1);
                helpText.color = rgb(205, 225, 255);
            }

            returnHint.text = player.overCore
                ? "You are at the Core. Press B to boop with maximum bureaucracy."
                : "";

            refreshMetrics();
        });

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(20, 30, 50)),
            opacity(1),
            fixed(),
            z(200),
        ]);
        tween(1, 0, 0.6, (v) => {
            fadeIn.opacity = v;
        }, easings.easeOutQuad);
    });
}
