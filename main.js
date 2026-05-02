import kaplay from "kaplay";

kaplay({
    background: [10, 10, 20],
    font: "monospace",
});

// --- ASSETS & PLACEHOLDERS ---
loadBean();
loadSprite("hub-bg", "https://via.placeholder.com/800x600?text=Grand+Portfolio+Hall");

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

    // Button Interaction
    btn.onHoverUpdate(() => {
        btn.scale = vec2(1.1);
        setCursor("pointer");
    });

    btn.onHoverEnd(() => {
        btn.scale = vec2(1);
        setCursor("default");
    });

    btn.onClick(() => go("cutscene"));
});

// --- SCENE: CUTSCENE ---
scene("cutscene", () => {
    const t = add([
        text("Entering the digital journey...", { size: 24 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        opacity(0),
    ]);

    // Simple animation sequence
    tween(0, 1, 1, (val) => t.opacity = val, easings.easeInQuad).onEnd(() => {
        wait(1, () => {
            tween(1, 0, 1, (val) => t.opacity = val, easings.easeOutQuad).onEnd(() => {
                go("hub");
            });
        });
    });
});

// --- SCENE: HUB WORLD ---
scene("hub", () => {
    setGravity(0);

    // Help UI
    add([
        text("USE ARROWS TO EXPLORE | TOUCH A PEDESTAL", { size: 16 }),
        pos(20, 20),
        fixed(),
    ]);

    // The Hub Structure
    PORTFOLIO_DATA.forEach((item, index) => {
        const x = 150 + (index % 3) * 250;
        const y = 200 + Math.floor(index / 3) * 250;

        // Animated Pedestal
        const pedestal = add([
            rect(80, 40, { radius: 4 }),
            pos(x, y),
            color(40, 40, 60),
            outline(2),
            area(),
            anchor("center"),
            "structure",
            { info: item }
        ]);

        // Floating Title above pedestal
        const label = add([
            text(item.title.toUpperCase(), { size: 18 }),
            pos(x, y - 60),
            anchor("center"),
            color(item.color[0], item.color[1], item.color[2]),
        ]);

        // "Pulse" Animation for the label to make it feel alive
        onUpdate(() => {
            label.scale = vec2(1 + Math.sin(time() * 3) * 0.1);
        });

        // Small floating orb on the pedestal
        add([
            circle(12),
            pos(x, y - 30),
            color(item.color[0], item.color[1], item.color[2]),
            anchor("center"),
            "orb"
        ]);
    });

    // Player
    const player = add([
        sprite("bean"),
        pos(width() / 2, height() - 100),
        area(),
        body(),
        anchor("center"),
    ]);

    // Movement
    const SPEED = 300;
    onKeyDown("left", () => player.move(-SPEED, 0));
    onKeyDown("right", () => player.move(SPEED, 0));
    onKeyDown("up", () => player.move(0, -SPEED));
    onKeyDown("down", () => player.move(0, SPEED));

    // --- UI: BACKDROP (Dims the screen) ---
    const backdrop = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        fixed(),
        z(90),
    ]);

    // --- UI: MODAL ---
    const modal = add([
        rect(width() - 100, 240, { radius: 12 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(35, 35, 50), // Lighter, more distinct color
        outline(4, color(200, 200, 255)), // Brighter outline
        fixed(),
        z(100),
        opacity(0), // Start fully transparent
    ]);

    modal.hidden = true; // Also hide it initially

    const modalTitle = modal.add([
        text("", { size: 32 }),
        pos(0, -70),
        anchor("center"),
        color(150, 150, 255),
    ]);

    const modalText = modal.add([
        text("", { size: 20, width: width() - 150, align: "center", lineSpacing: 4 }),
        pos(0, 40),
        anchor("center"),
        color(255, 255, 255), // Pure white for max contrast
    ]);

    player.onCollide("structure", (s) => {
        modal.hidden = false;
        modal.opacity = 1;
        backdrop.opacity = 0.7; // Dim the background
        modalTitle.text = s.info.title;
        modalText.text = s.info.text;
    });

    player.onCollideEnd("structure", () => {
        modal.hidden = true;
        modal.opacity = 0;
        backdrop.opacity = 0;
        modalTitle.text = "";
        modalText.text = "";
    });
});

// Start the game at the menu
go("menu");
