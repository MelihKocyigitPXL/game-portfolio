import kaplay from "kaplay";

kaplay({
    background: [5, 5, 15],
    font: "monospace",
    width: 1000,
    height: 700,
    letterbox: true,
});

// --- ASSETS ---
loadBean();

const PORTFOLIO_DATA = [
    { 
        id: "intro", 
        title: "Voorstelling", 
        color: [0, 255, 255], 
        text: "Mijn nieuwsgierigheid is mijn drijfveer. Ik sta vaak stil bij ervaringen om de kern te begrijpen. Uit mijn Thalento-rapport bleek mijn sterke aanpassingsvermogen: ik neem de leiding wanneer nodig, maar kan ook perfect bijsturen als teamlid. Mijn doel? IT-oplossingen bouwen met maatschappelijke waarde, zoals platformen die mensen echt helpen.",
        flair: "Curiosity: MAX | Adaptability: HIGH",
        type: "atmospheric"
    },
    { 
        id: "seminars", 
        title: "Seminaries", 
        color: [255, 255, 0], 
        text: "Een reis door de IT-wereld: van .Net Aspire microservices en AWS cloud-automatisatie tot de dieptes van React state management en Three.js 3D rendering. Ik leerde over Zero Trust security, AI-gestuurd testen met Postman, en hoe Microsoft Fabric datawarehousing transformeert. Deze sessies gaven me de 'confidence boost' dat ik complexe tech echt kan doorgronden.",
        flair: "Full Stack Knowledge | 8+ Specialized Sessions",
        type: "grid"
    },
    { 
        id: "cyber", 
        title: "Cybersecurity", 
        color: [255, 0, 0], 
        text: "De Cybersecurity Challenge 2026 testte mijn grenzen. In de categorie Forensics kraakte ik een verborgen AES-sleutel in een afbeelding met een custom Python-script (PyCryptodome). Ondanks de eenzamere individuele setup dit jaar, bewees mijn doorzettingsvermogen dat ik ook onder druk en met beperkte stage-tijd complexe puzzels kan oplossen.",
        flair: "> [STATUS: DECRYPTED] | AES-CBC | Python",
        type: "terminal"
    },
    { 
        id: "innovation", 
        title: "Innovatieroute", 
        color: [0, 255, 0], 
        text: "Bij Cornerbrix dook ik in Application Integration. We transformerde point-to-point chaos naar schaalbare event-driven architectuur. Met Java, Maven en Docker bouwden we een festivalcase op Apache Kafka en Azure API Management. Het Exchange-object in Camel werd de centrale ruggengraat die 'spaghetti' verbindingen voorkwam.",
        flair: "Kafka | Azure | Enterprise Integration",
        type: "circuit"
    },
    { 
        id: "fosdem", 
        title: "FOSDEM 2026", 
        color: [255, 0, 255], 
        text: "Brussel, ULB: Ondergedompeld in de wereldwijde open-source community. Ik leerde over de gevaren van 'harvest now, decrypt later' in post-quantum crypto en zag live demo's van de ROSA fuzzing-tool voor backdoors. Het besef dat mijn basiskennis me toeliet om talks van wereldniveau te volgen, was een enorme professionele motivatie.",
        flair: "Open Source | Post-Quantum Crypto | ROSA",
        type: "crowd"
    },
    { 
        id: "final", 
        title: "Eindreflectie", 
        color: [200, 200, 255], 
        text: "Mijn tijd bij PXL was een transformatie. Ik ben niet meer de student van het begin; ik ben een professional die begrijpt dat groei zit in teamwerk en het verlaten van je comfortzone. Ik kijk positief terug op een traject waar mijn IT-kennis exponentieel groeide en ik klaarstoomde voor een carriere met echte impact. De toekomst is een kans die ik met beide handen grijp.",
        flair: "TRANSFORMATION COMPLETE | PXL 2026",
        type: "shimmer"
    },
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
        outline(4, rgb(255, 255, 255)),
        color(100, 100, 255),
    ]);

    btn.add([
        text("OPEN PORTFOLIO", { size: 24 }),
        anchor("center"),
        color(255, 255, 255),
    ]);

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

    // 1. SCENERY: Nebula
    const nebulaColors = [rgb(40, 10, 50), rgb(10, 20, 50), rgb(30, 0, 30)];
    for (let i = 0; i < 6; i++) {
        add([
            pos(rand(0, width()), rand(0, height())),
            circle(rand(150, 300)),
            color(nebulaColors[i % 3]),
            opacity(0.2),
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

    // 2. PORTALS
    PORTFOLIO_DATA.forEach((item, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const x = width() / 2 + (side * 350);
        const y = 150 + Math.floor(index / 2) * 200;

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
        { activePortal: null }
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
        prompt.text = "";
    });

    onUpdate(() => {
        if (player.activePortal && isKeyPressed("e")) {
            go("detail", player.activePortal.info);
        }
    });

    // Fade in
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

// --- SCENE: DETAIL AREA ---
scene("detail", (info) => {
    setGravity(0);
    
    // 1. BACKGROUND
    const bgColor = rgb(
        Math.floor(info.color[0] * 0.1),
        Math.floor(info.color[1] * 0.1),
        Math.floor(info.color[2] * 0.1)
    );
    add([rect(width(), height()), pos(0, 0), color(bgColor), fixed(), z(-20)]);

    // TYPE-SPECIFIC EFFECTS
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

    // 2. MONUMENT
    const monument = add([
        rect(width() * 0.85, 480, { radius: 12 }),
        pos(width() / 2, height() / 2 - 20),
        anchor("center"),
        color(rgb(20, 20, 30)),
        outline(4, rgb(info.color[0], info.color[1], info.color[2])),
    ]);

    monument.add([
        text(info.title.toUpperCase(), { size: 36 }),
        pos(0, -190),
        anchor("center"),
        color(rgb(info.color[0], info.color[1], info.color[2])),
    ]);

    monument.add([
        text(info.text, { size: 19, width: width() * 0.75, align: "center", lineSpacing: 8 }),
        pos(0, 0),
        anchor("center"),
        color(rgb(255, 255, 255)),
    ]);

    monument.add([
        text(info.flair, { size: 15 }),
        pos(0, 200),
        anchor("center"),
        color(rgb(info.color[0], info.color[1], info.color[2])),
        opacity(0.8),
    ]);

    // 3. PLAYER
    const player = add([
        sprite("bean"),
        pos(width() / 2, height() - 140),
        area(),
        anchor("center"),
        z(10),
    ]);

    const SPEED = 400;
    onKeyDown("left", () => player.move(-SPEED, 0));
    onKeyDown("right", () => player.move(SPEED, 0));
    onKeyDown("up", () => player.move(0, -SPEED));
    onKeyDown("down", () => player.move(0, SPEED));

    // 4. RETURN
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
        returnPrompt.text = "Press E to Return";
    });

    player.onCollideEnd("return", () => {
        onReturn = false;
        returnPrompt.text = "";
    });

    onUpdate(() => {
        if (onReturn && isKeyPressed("e")) {
            go("hub");
        }
    });

    // 5. FADE IN
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

go("menu");
