export default function() {
    scene("fosdem", (info) => {
        setGravity(0);
        add([rect(width(), height()), pos(0, 0), color(rgb(25, 25, 35)), fixed(), z(-20)]);

        add([
            text("FOSDEM 2026 - ULB BRUSSELS", { size: 28 }),
            pos(width() / 2, 40),
            anchor("center"),
            color(rgb(255, 100, 255)),
        ]);

        const booths = [
            {
                title: "DATABASE WARS",
                topic: "PostgreSQL vs MySQL",
                desc: "De zaal was zo overvol dat we helemaal achteraan moesten staan! Een duidelijk beeld van hoe groot FOSDEM is!",
                pos: vec2(width() * 0.2, 200),
                color: rgb(0, 150, 255),
                img: "fosdemJava",
                scale: 0.55
            },
            {
                title: "QUANTUM SHIELD",
                topic: "Post-Quantum Cryptografie",
                desc: "'Oogst nu, ontsleutel later'. We hebben hybride aanpakken onderzocht die klassieke en post-kwantumalgoritmen combineren voor toekomstbestendige beveiliging.",
                pos: vec2(width() * 0.5, 200),
                color: rgb(150, 0, 255),
                img: "fosdemQuantum",
                scale: 0.55
            },
            {
                title: "CLOUD AUTH",
                topic: "OAuth Token Beveiliging",
                desc: "De Onzichtbare Sleutel: Hoe OAuth-tokens de nieuwe aanvalsvector zijn voor cloud-integraties en SSO-toepassingen.",
                pos: vec2(width() * 0.8, 200),
                color: rgb(255, 150, 0),
                img: null,
                scale: 0.55
            },
            {
                title: "BUG HUNTER",
                topic: "ROSA: Achterdeurenopsporing",
                desc: "Live Demo! Met AFL++ en Runtime Trace Oracle-based Selection Algorithm stille achterdeuren in binaries opsporen in plaats van alleen crashes.",
                pos: vec2(width() * 0.2, 450),
                color: rgb(0, 255, 100),
                img: "fosdemROSA",
                scale: 0.55
            },
            {
                title: "P2P LAB",
                topic: "Blockchain & Peer-to-Peer",
                desc: "Verder dan Bitcoin: Praktische en geavanceerde use cases voor gedecentraliseerde netwerken en P2P-protocollen.",
                pos: vec2(width() * 0.5, 450),
                color: rgb(255, 255, 0),
                img: "fosdemTor",
                scale: 0.55
            },
            {
                title: "VLC BOOTH",
                topic: "Open Source Multimedia",
                desc: "Bezoeken van de iconische VLC-booth. Het was inspirerend om te zien hoe zo'n globaal programma geworteld blijft in de open-source gemeenschap op FOSDEM.",
                pos: vec2(width() * 0.8, 450),
                color: rgb(255, 150, 50),
                img: "fosdemVLC",
                scale: 0.35
            }
        ];

        booths.forEach((b) => {
            const base = add([
                rect(140, 100, { radius: 8 }),
                pos(b.pos),
                color(b.color.darken(150)),
                outline(3, b.color),
                area(),
                anchor("center"),
                "booth",
                { info: b }
            ]);

            base.add([
                text(b.title, { size: 14, width: 120, align: "center" }),
                anchor("center"),
                color(b.color),
            ]);
        });

        for (let i = 0; i < 20; i++) {
            add([
                sprite("bean"),
                pos(rand(50, width() - 50), rand(100, height() - 100)),
                scale(0.35),
                opacity(0.4),
                anchor("center"),
                z(10),
            ]);
        }

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 80),
            area(),
            anchor("center"),
            z(50),
            { activeBooth: null }
        ]);

        const SPEED = 400;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        const prompt = add([
            text("", { size: 16 }),
            pos(width() / 2, height() - 40),
            anchor("center"),
            fixed(),
        ]);

        player.onCollide("booth", (b) => {
            player.activeBooth = b;
            prompt.text = `Druk E om het ${b.info.title} booth te bezoeken`;
        });

        player.onCollideEnd("booth", () => {
            player.activeBooth = null;
            prompt.text = "";
        });

        onKeyPress("e", () => {
            if (player.activeBooth) {
                showBoothInfo(player.activeBooth.info);
            }
        });

        function showBoothInfo(b) {
            const hasImg = b.img !== null;
            const overlayHeight = hasImg ? 0.9 : 0.5;

            const overlay = add([
                rect(width() * 0.9, height() * overlayHeight, { radius: 12 }),
                pos(width() / 2, height() / 2),
                anchor("center"),
                color(rgb(15, 15, 30)),
                outline(4, b.color),
                z(100),
            ]);

            const titleY = hasImg ? -280 : -100;
            overlay.add([
                text(b.title + ": " + b.topic, { size: 24 }),
                pos(0, titleY),
                anchor("center"),
                color(b.color),
            ]);

            if (hasImg) {
                overlay.add([
                    sprite(b.img),
                    pos(0, -40),
                    anchor("center"),
                    scale(b.scale || 0.55)
                ]);
            }

            const descY = hasImg ? 180 : 30;
            overlay.add([
                text(b.desc, { size: 18, width: width() * 0.8, align: "center", lineSpacing: 8 }),
                pos(0, descY),
                anchor("center"),
                color(rgb(230, 230, 230)),
            ]);

            const closeY = hasImg ? 280 : 120;
            overlay.add([
                text("Druk SPATIEBALK om te sluiten", { size: 16 }),
                pos(0, closeY),
                anchor("center"),
                color(rgb(150, 150, 150)),
            ]);

            const closeEvent = onKeyPress("space", () => {
                destroy(overlay);
                closeEvent.cancel();
            });
        }

        const returnPortal = add([
            circle(28),
            pos(50, height() - 50),
            color(rgb(40, 40, 60)),
            outline(3, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            "return",
        ]);

        add([
            text("UITGANG", { size: 14 }),
            pos(50, height() - 90),
            anchor("center"),
        ]);

        player.onCollide("return", () => {
            go("hub");
        });

        const f = add([rect(width(), height()), pos(0, 0), color(rgb(0, 0, 0)), opacity(1), fixed(), z(200)]);
        tween(1, 0, 0.5, (v) => f.opacity = v);
    });
}
