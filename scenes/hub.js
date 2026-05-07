export default function(PORTFOLIO_DATA) {
    scene("hub", () => {
        setGravity(0);

        let isSpinning = false;
        let spinSpeed = 0;
        const TARGET_SPIN_SPEED = 180;

        // The World container that will rotate
        const world = add([
            pos(width() / 2, height() / 2),
            anchor("center"),
            rotate(0),
        ]);

        // Background (Static - does not rotate)
        add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(10, 15, 30)),
            fixed(),
            z(-20)
        ]);

        // Nebula effect (Inside world, so they rotate)
        const nebulaColors = [rgb(30, 10, 50), rgb(10, 20, 60), rgb(40, 10, 30)];
        for (let i = 0; i < 8; i++) {
            const nebula = world.add([
                pos(rand(-width(), width()), rand(-height(), height())),
                circle(rand(200, 400)),
                color(nebulaColors[i % 3]),
                opacity(0.15),
                anchor("center"),
                z(-15),
            ]);
            nebula.onUpdate(() => {
                nebula.opacity = 0.15 + Math.sin(time() * 0.5 + i) * 0.05;
            });
        }

        // Parallax Stars (Inside world)
        for (let i = 0; i < 150; i++) {
            world.add([
                pos(rand(-width() * 1.5, width() * 1.5), rand(-height() * 1.5, height() * 1.5)),
                rect(rand(1, 3), rand(1, 3)),
                color(rgb(200, 220, 255)),
                opacity(rand(0.2, 0.9)),
                z(-10),
                "star"
            ]);
        }


        // Easter Egg Planet (Moved back to the RIGHT)
        const planetPos = vec2(width() * 0.35, -height() * 0.35);
        world.add([circle(70), pos(planetPos), color(rgb(100, 150, 255)), opacity(0.1), anchor("center"), z(-4)]);
        world.add([rect(180, 6, { radius: 3 }), pos(planetPos), color(rgb(200, 220, 255)), opacity(0.4), anchor("center"), rotate(-20), z(-3)]);
        world.add([circle(50), pos(planetPos), color(rgb(80, 140, 255)), outline(2, rgb(255, 255, 255)), anchor("center"), z(-2)]);
        world.add([circle(45), pos(planetPos.add(8, 8)), color(rgb(0, 0, 40)), opacity(0.5), anchor("center"), z(-1)]);

        const planetEggTrigger = world.add([
            circle(60),
            pos(planetPos),
            area(),
            anchor("center"),
            opacity(0),
            "planet_egg",
        ]);

        // Rope Easter Egg (Moved to LEFT)
        const ropeX = 80;
        const rope = add([
            pos(ropeX, 0),
            rect(6, 160),
            color(rgb(120, 80, 40)),
            outline(2, rgb(60, 40, 20)),
            anchor("top"),
            z(10),
        ]);

        const handle = add([
            pos(ropeX, 160),
            circle(20),
            color(rgb(220, 40, 40)),
            outline(4, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            z(11),
            "handle"
        ]);

        // Portals
        const radiusX = 350;
        const radiusY = 180;

        PORTFOLIO_DATA.forEach((item, index) => {
            const angle = (index / PORTFOLIO_DATA.length) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;

            const portalGroup = world.add([
                pos(x, y),
                z(1)
            ]);

            const glow = portalGroup.add([
                circle(55),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.1),
                anchor("center"),
            ]);

            const portal = portalGroup.add([
                circle(45),
                color(rgb(15, 15, 30)),
                outline(4, rgb(item.color[0], item.color[1], item.color[2])),
                anchor("center"),
            ]);

            // Larger invisible hitbox
            portalGroup.add([
                circle(72),
                area(),
                anchor("center"),
                opacity(0),
                "structure",
                { info: item },
            ]);

            const swirl1 = portalGroup.add([
                rect(40, 40, { radius: 10 }),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.2),
                anchor("center"),
            ]);
            const swirl2 = portalGroup.add([
                rect(30, 30, { radius: 5 }),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.4),
                anchor("center"),
            ]);

            swirl1.onUpdate(() => {
                swirl1.angle += dt() * 60;
                swirl2.angle -= dt() * 90;
                glow.scale = vec2(1 + Math.sin(time() * 3 + index) * 0.1);
            });

            portalGroup.add([
                rect(item.title.length * 10 + 20, 24, { radius: 12 }),
                pos(0, -75),
                anchor("center"),
                color(rgb(20, 20, 40)),
                outline(2, rgb(item.color[0], item.color[1], item.color[2])),
            ]).add([
                text(item.title.toUpperCase(), { size: 14 }),
                pos(0, 0),
                anchor("center"),
                color(rgb(255, 255, 255)),
            ]);
        });

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() / 2),
            area(),
            anchor("center"),
            z(100), // Player always on top
            { activePortal: null, onPlanetEgg: false, onRope: false }
        ]);

        const activePortalContacts = new Set();

        const SPEED = 450;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        const promptBox = add([
            rect(400, 45, { radius: 10 }),
            pos(width() / 2, height() - 80),
            anchor("center"),
            color(rgb(0, 0, 0)),
            outline(2, rgb(255, 255, 255)),
            opacity(0),
            fixed(),
            z(150),
        ]);

        const promptText = promptBox.add([
            text("", { size: 16 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        const updatePrompt = () => {
            if (player.onRope) {
                promptBox.opacity = 0.9;
                promptText.text = "(E) Trek aan het touw";
                promptBox.outline.color = rgb(220, 40, 40);
            } else if (player.activePortal) {
                promptBox.opacity = 0.9;
                promptText.text = `(E) ${player.activePortal.info.title}`;
                promptBox.outline.color = rgb(player.activePortal.info.color[0], player.activePortal.info.color[1], player.activePortal.info.color[2]);
            } else if (player.onPlanetEgg) {
                promptBox.opacity = 0.9;
                promptText.text = "(E) Bezoek mysterieuze planeet";
                promptBox.outline.color = rgb(100, 150, 255);
            } else {
                promptBox.opacity = 0;
                promptText.text = "";
            }
        };

        player.onCollide("structure", (portal) => {
            activePortalContacts.add(portal);
            player.activePortal = portal;
            updatePrompt();
        });

        player.onCollideEnd("structure", (portal) => {
            activePortalContacts.delete(portal);
            if (player.activePortal === portal) {
                player.activePortal = activePortalContacts.values().next().value ?? null;
            }
            updatePrompt();
        });

        player.onCollide("handle", () => {
            player.onRope = true;
            updatePrompt();
        });

        player.onCollideEnd("handle", () => {
            player.onRope = false;
            updatePrompt();
        });

        player.onCollide("planet_egg", () => {
            player.onPlanetEgg = true;
            updatePrompt();
        });

        player.onCollideEnd("planet_egg", () => {
            player.onPlanetEgg = false;
            updatePrompt();
        });

        onUpdate(() => {
            updatePrompt();

            if (isSpinning) {
                spinSpeed = lerp(spinSpeed, TARGET_SPIN_SPEED, dt() * 1.5);
                world.angle += spinSpeed * dt();
            } else {
                spinSpeed = lerp(spinSpeed, 0, dt() * 3);
                world.angle += spinSpeed * dt();
            }

            get("star").forEach((star) => {
                if (chance(0.01)) star.opacity = rand(0.2, 1);
            });
        });

        onKeyPress("e", () => {
            if (player.onRope) {
                isSpinning = !isSpinning;
                
                // Visual feedback for pull
                handle.pos.y += 20;
                rope.height += 20;
                wait(0.1, () => {
                    handle.pos.y -= 20;
                    rope.height -= 20;
                });
            } else if (player.activePortal) {
                const id = player.activePortal.info.id;
                const specializedScenes = ["testimonials", "intro", "cyber", "fosdem", "xfactor"];
                if (specializedScenes.includes(id)) go(id, player.activePortal.info);
                else go("detail", player.activePortal.info);
            } else if (player.onPlanetEgg) {
                go("planet_easter_egg");
            }
        });

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(0, 0, 0)),
            opacity(1),
            fixed(),
            z(200),
        ]);
        tween(1, 0, 0.5, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
