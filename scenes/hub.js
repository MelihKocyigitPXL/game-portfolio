export default function(PORTFOLIO_DATA) {
    scene("hub", () => {
        setGravity(0);

        // 1. SCENERY: Nebula
        const nebulaColors = [rgb(40, 10, 50), rgb(10, 20, 50), rgb(30, 0, 30)];
        for (let i = 0; i < 6; i++) {
            add([
                pos(rand(0, width()), rand(0, height())),
                circle(rand(150, 300)),
                color(nebulaColors[i % 3]),
                opacity(0.25),
                fixed(),
                z(-10),
            ]);
        }

        // Stars
        for (let i = 0; i < 80; i++) {
            add([
                pos(rand(0, width()), rand(0, height())),
                rect(rand(1, 3), rand(1, 3)),
                color(rgb(255, 255, 255)),
                opacity(rand(0.2, 0.8)),
                z(-5),
            ]);
        }

        // Planet
        const planetPos = vec2(width() * 0.55, height() * 0.15);
        add([circle(60), pos(planetPos), color(rgb(100, 150, 255)), opacity(0.15), z(-4)]);
        add([rect(160, 4, { radius: 2 }), pos(planetPos), color(rgb(200, 220, 255)), opacity(0.4), anchor("center"), rotate(-25), z(-3)]);
        add([circle(50), pos(planetPos), color(rgb(100, 160, 255)), outline(3, rgb(255, 255, 255)), z(-2)]);
        add([circle(50), pos(planetPos.add(6, 6)), color(rgb(0, 0, 30)), opacity(0.6), z(-1)]);

        // Hidden easter egg trigger around the planet
        const planetEggTrigger = add([
            circle(62),
            pos(planetPos),
            area(),
            anchor("center"),
            opacity(0),
            "planet_egg",
        ]);

        // 2. TUTORIAL (Similar to Easter Egg Style)
        add([
            text("Arrows: Move | E: Interact", { size: 14 }),
            pos(width() / 2, height() - 70),
            anchor("center"),
            color(rgb(205, 225, 255)),
            z(45),
        ]);

        // 2. PORTALS
        PORTFOLIO_DATA.forEach((item, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const x = width() / 2 + (side * 350);
            const y = 120 + Math.floor(index / 2) * 160;

            const portal = add([
                circle(40),
                pos(x, y),
                color(rgb(20, 20, 40)),
                outline(4, rgb(item.color[0], item.color[1], item.color[2])),
                area(),
                anchor("center"),
                "structure",
                { info: item }
            ]);

            const swirl = add([
                pos(x, y),
                circle(30),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.3),
                anchor("center"),
                rotate(0),
            ]);

            swirl.onUpdate(() => {
                swirl.angle += dt() * 100;
                swirl.scale = vec2(1 + Math.sin(time() * 5) * 0.2);
            });

            add([
                text(item.title.toUpperCase(), { size: 18 }),
                pos(x, y - 70),
                anchor("center"),
                color(rgb(item.color[0], item.color[1], item.color[2])),
            ]);
        });

        // 3. PLAYER
        const player = add([
            sprite("bean"),
            pos(width() / 2, height() / 2),
            area(),
            anchor("center"),
            { activePortal: null, onPlanetEgg: false }
        ]);

        const SPEED = 400;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        const prompt = add([
            text("", { size: 16 }),
            pos(width() / 2, height() - 50),
            anchor("center"),
            fixed(),
        ]);

        player.onCollide("structure", (s) => {
            player.activePortal = s;
            prompt.text = `Press E to enter ${s.info.title}`;
        });

        player.onCollideEnd("structure", () => {
            player.activePortal = null;
            if (!player.onPlanetEgg) prompt.text = "";
        });

        player.onCollide("planet_egg", () => {
            player.onPlanetEgg = true;
            if (!player.activePortal) {
                prompt.text = "Press E to inspect suspiciously important planet";
            }
        });

        player.onCollideEnd("planet_egg", () => {
            player.onPlanetEgg = false;
            if (!player.activePortal) prompt.text = "";
        });

        onUpdate(() => {
            if (player.activePortal && isKeyPressed("e")) {
                const id = player.activePortal.info.id;
                // Check if a specialized scene exists, else use generic detail
                const specializedScenes = ["testimonials", "intro"];
                if (specializedScenes.includes(id)) {
                    go(id, player.activePortal.info);
                } else {
                    go("detail", player.activePortal.info);
                }
            } else if (player.onPlanetEgg && isKeyPressed("e")) {
                go("planet_easter_egg");
            }

            // Tiny pulse so the trigger area feels magically suspicious
            planetEggTrigger.scale = vec2(1 + Math.sin(time() * 3) * 0.02);
        });

        // Fade
        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(0, 0, 0)),
            opacity(1),
            fixed(),
            z(100),
        ]);
        tween(1, 0, 0.5, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
