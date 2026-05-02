import kaplay from "kaplay";

kaplay({
    background: [5, 5, 15],
    font: "monospace",
    width: 800,
    height: 600,
    letterbox: true,
});

// --- ASSETS ---
loadBean();

const PORTFOLIO_DATA = [
    { id: "intro", title: "Voorstelling", color: [0, 255, 255], text: "Melih Kocyigit. Nieuwsgierige IT-student..." },
    { id: "seminars", title: "Seminaries", color: [255, 255, 0], text: "8+ sessies gevolgd over o.a. .Net Aspire..." },
    { id: "cyber", title: "Cybersecurity", color: [255, 0, 0], text: "Deelname aan CTF 2026. Focus op Forensics..." },
    { id: "innovation", title: "Innovatieroute", color: [0, 255, 0], text: "Application Integration bij Cornerbrix..." },
    { id: "fosdem", title: "Fosdem 2026", color: [255, 0, 255], text: "Internationaal Open Source event..." },
    { id: "reflection", title: "Reflectie", color: [255, 255, 255], text: "Klaar voor de IT-toekomst!" },
];

// --- SCENE: MAIN MENU ---
scene("menu", () => {
    add([
        text("I-TALENT PORTFOLIO", { size: 48 }),
        pos(width() / 2, height() / 3),
        anchor("center"),
    ]);

    const btn = add([
        rect(240, 80, { radius: 8 }),
        pos(width() / 2, height() / 2 + 50),
        area(),
        anchor("center"),
        outline(4),
        color(100, 100, 255),
    ]);

    btn.add([
        text("OPEN PORTFOLIO", { size: 24 }),
        anchor("center"),
        color(255, 255, 255),
    ]);

    btn.onHoverUpdate(() => { btn.scale = vec2(1.1); setCursor("pointer"); });
    btn.onHoverEnd(() => { btn.scale = vec2(1); setCursor("default"); });
    btn.onClick(() => go("cutscene"));
});

// --- SCENE: CUTSCENE ---
scene("cutscene", () => {
    const t = add([
        text("Initializing World...", { size: 24 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        opacity(0),
    ]);

    tween(0, 1, 1, (val) => t.opacity = val, easings.easeInQuad).onEnd(() => {
        wait(0.5, () => {
            tween(1, 0, 1, (val) => t.opacity = val, easings.easeOutQuad).onEnd(() => {
                go("hub");
            });
        });
    });
});

// --- SCENE: HUB WORLD ---
scene("hub", () => {
    setGravity(0);

    // 1. ADD SCENERY: Nebula Clouds
    const nebulaColors = [
        [40, 10, 50],  // Purple
        [10, 20, 50],  // Deep Blue
        [30, 0, 30],   // Magenta-ish
    ];

    for (let i = 0; i < 6; i++) {
        add([
            pos(rand(0, width()), rand(0, height())),
            circle(rand(150, 300)),
            color(nebulaColors[i % 3][0], nebulaColors[i % 3][1], nebulaColors[i % 3][2]),
            opacity(0.25),
            fixed(),
            z(-2),
        ]);
    }

    // Stars
    for (let i = 0; i < 80; i++) {
        add([
            pos(rand(0, width()), rand(0, height())),
            rect(rand(1, 3), rand(1, 3)),
            color(255, 255, 255),
            opacity(rand(0.2, 0.8)),
            z(-1),
        ]);
    }

    // --- ADD PLANET ---
    const planetPos = vec2(width() * 0.8, height() * 0.2);
    // Planet Base
    add([
        circle(50),
        pos(planetPos),
        color(80, 120, 200), // Nice blue planet
        z(-1.5),
        fixed(),
    ]);
    // Planet Shadow (to make it look 3D)
    add([
        circle(50),
        pos(planetPos.add(8, 8)),
        color(5, 5, 20),
        z(-1.4),
        fixed(),
    ]);
    // Planet Ring
    add([
        rect(160, 2, { radius: 1 }),
        pos(planetPos),
        color(200, 200, 255),
        opacity(0.3),
        anchor("center"),
        rotate(-25),
        z(-1.6),
        fixed(),
    ]);


    // 2. HUB PORTALS
    PORTFOLIO_DATA.forEach((item, index) => {
        const x = 150 + (index % 3) * 250;
        const y = 200 + Math.floor(index / 3) * 250;

        const portal = add([
            circle(40),
            pos(x, y),
            color(20, 20, 40),
            outline(4, color(item.color[0], item.color[1], item.color[2])),
            area(),
            anchor("center"),
            "structure",
            { info: item }
        ]);

        const swirl = add([
            pos(x, y),
            circle(30),
            color(item.color[0], item.color[1], item.color[2]),
            opacity(0.3),
            anchor("center"),
            rotate(0),
        ]);

        onUpdate(() => {
            swirl.angle += dt() * 100;
            swirl.scale = vec2(1 + Math.sin(time() * 5) * 0.2);
        });

        add([
            text(item.title.toUpperCase(), { size: 18 }),
            pos(x, y - 70),
            anchor("center"),
            color(item.color[0], item.color[1], item.color[2]),
        ]);
    });

    // 3. PLAYER
    const player = add([
        sprite("bean"),
        pos(width() / 2, height() - 100),
        area(),
        body(),
        anchor("center"),
    ]);

    const SPEED = 350;
    onKeyDown("left", () => player.move(-SPEED, 0));
    onKeyDown("right", () => player.move(SPEED, 0));
    onKeyDown("up", () => player.move(0, -SPEED));
    onKeyDown("down", () => player.move(0, SPEED));

    // 4. UI
    const backdrop = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        fixed(),
        z(90),
    ]);

    const modal = add([
        rect(width() - 100, 260, { radius: 12 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(30, 30, 45),
        outline(4, color(200, 200, 255)),
        fixed(),
        z(100),
        opacity(0),
    ]);
    modal.hidden = true;

    const modalTitle = modal.add([
        text("", { size: 32 }),
        pos(0, -80),
        anchor("center"),
        color(150, 150, 255),
    ]);

    const modalText = modal.add([
        text("", { size: 20, width: width() - 150, align: "center", lineSpacing: 4 }),
        pos(0, 30),
        anchor("center"),
        color(255, 255, 255),
    ]);

    player.onCollide("structure", (s) => {
        modal.hidden = false;
        modal.opacity = 1;
        backdrop.opacity = 0.8;
        modalTitle.text = s.info.title;
        modalText.text = s.info.text;
    });

    player.onCollideEnd("structure", () => {
        modal.hidden = true;
        modal.opacity = 0;
        backdrop.opacity = 0;
    });
});

go("menu");
