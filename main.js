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
        text: "De Cybersecurity Challenge 2026 testte mijn grenzen. In de categorie Forensics kraakte ik een verborgen AES-sleutel in een afbeelding met een custom Python-script (PyCryptodome). Ondanks de eenzamere individuele setup dit year, bewees mijn doorzettingsvermogen dat ik ook onder druk en met beperkte stage-tijd complexe puzzels kan oplossen.",
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
        text: "Brussel, ULB: Ondergedompeld in de wereldwijde open-source community. Ik leerde over de gevaren van 'harvest now, decrypt later' in post-quantum crypto en zag live demo's van de ROSA fuzzing-tool for backdoors. Het besef dat mijn basiskennis me toeliet om talks van wereldniveau te volgen, was een enorme professionele motivatie.",
        flair: "Open Source | Post-Quantum Crypto | ROSA",
        type: "crowd"
    },
    { 
        id: "reflection", 
        title: "Eindreflectie", 
        color: [255, 255, 255], 
        text: "Mijn tijd bij PXL was een transformatie. Ik ben niet meer de student van het begin; ik ben een professional die begrijpt dat groei zit in teamwerk en het verlaten van je comfortzone. Ik kijk positief terug op een traject waar mijn IT-kennis exponentieel groeide en ik klaarstoomde voor een carriere met echte impact.",
        flair: "GROWTH: EXPONENTIAL | LEVEL UP",
        type: "graph"
    },
    {
        id: "testimonials",
        title: "Testimonials",
        color: [200, 100, 255],
        text: "Wat anderen over mij zeggen. Interacteer met de personen in de kamer om hun testimonials te horen.",
        flair: "Feedback | Recommendations",
        type: "npc_room"
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
            prompt.text = "Press F to inspect suspiciously important planet";
        }
    });

    player.onCollideEnd("planet_egg", () => {
        player.onPlanetEgg = false;
        if (!player.activePortal) prompt.text = "";
    });

    onUpdate(() => {
        if (player.activePortal && isKeyPressed("e")) {
            if (player.activePortal.info.id === "testimonials") {
                go("testimonials", player.activePortal.info);
            } else {
                go("detail", player.activePortal.info);
            }
        } else if (player.onPlanetEgg && isKeyPressed("f")) {
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

// --- SCENE: PLANET EASTER EGG ---
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

    // 2. MONUMENT (Initial invisible)
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
    } else if (info.type === "graph") {
        // GROWTH GRAPH CUTSCENE
        const graphW = 500;
        const graphH = 300;
        const origin = vec2(width() / 2 - graphW / 2, height() / 2 + 100);

        // Axes
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
            { t: "LEARNING", x: 0.3, shown: false },
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

                // Draw only newly reached points each frame
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

// --- SCENE: TESTIMONIALS ROOM ---
scene("testimonials", (info) => {
    setGravity(0);
    add([rect(width(), height()), pos(0, 0), color(rgb(20, 10, 30)), fixed(), z(-20)]);

    add([
        text("TESTIMONIALS ROOM", { size: 24 }),
        pos(width() / 2, 40),
        anchor("center"),
        color(rgb(200, 100, 255)),
    ]);

    const npcs = [
        { name: "Cas", pos: vec2(width() * 0.2, height() / 2), color: rgb(100, 200, 255), testimonial: "Cas: 'Ik heb hem leren kennen als iemand die betrouwbaar is en zijn werk met de nodige zorg en toewijding uitvoert. Hij werkt gestructureerd, denkt mee en is een aangename persoon om mee samen te werken.'" },
        { name: "Safri", pos: vec2(width() * 0.4, height() / 2), color: rgb(255, 150, 100), testimonial: "Safri: 'Ik waardeer aan jou dat je veel mee bent met wat er in de wereld gebeurt en daar ook boeiend over kan vertellen. Je brengt interessante inzichten en nieuwe ideeën in de groep, en tegelijk maak je de sfeer vaak wat luchtiger.'" },
        { name: "Ferre", pos: vec2(width() * 0.6, height() / 2), color: rgb(150, 255, 100), testimonial: "Ferre: 'Hij is iemand die altijd 100% geeft en door die inzet weet je dat er altijd een resultaat gaat zijn waar je trots op kan zijn'" },
        { name: "Berdan", pos: vec2(width() * 0.8, height() / 2), color: rgb(255, 100, 255), testimonial: "Berdan: 'Ik heb hem leren kennen tijdens het IT-project en het klikte meteen. Hij is een sterk teamlid om mee te werken en bovendien iemand op wie je binnen een team altijd kunt vertrouwen.'" },
    ];

    npcs.forEach((n) => {
        const base = add([
            pos(n.pos),
            anchor("center"),
            area({ shape: new Rect(vec2(0), 60, 60) }),
            "npc",
            { testimonial: n.testimonial, name: n.name },
            z(20),
        ]);

        base.add([
            sprite("bean"),
            scale(1),
            anchor("center"),
            color(n.color),
        ]);

        add([
            text(n.name, { size: 16 }),
            pos(n.pos.x, n.pos.y - 50),
            anchor("center"),
            color(n.color),
        ]);
    });

    const player = add([
        sprite("bean"),
        pos(width() / 2, height() - 150),
        area(),
        anchor("center"),
        z(10),
        { activeNPC: null }
    ]);

    const SPEED = 400;
    onKeyDown("left", () => player.move(-SPEED, 0));
    onKeyDown("right", () => player.move(SPEED, 0));
    onKeyDown("up", () => player.move(0, -SPEED));
    onKeyDown("down", () => player.move(0, SPEED));

    const dialogueBox = add([
        rect(width() * 0.8, 120, { radius: 8 }),
        pos(width() / 2, height() - 80),
        anchor("center"),
        color(rgb(10, 10, 20)),
        outline(3, rgb(200, 100, 255)),
        opacity(0),
        fixed(),
        z(50),
    ]);

    const dialogueText = dialogueBox.add([
        text("", { size: 18, width: width() * 0.7, lineSpacing: 8 }),
        pos(0, 0),
        anchor("center"),
        color(rgb(255, 255, 255)),
    ]);

    const prompt = add([
        text("", { size: 16 }),
        pos(width() / 2, height() - 160),
        anchor("center"),
        fixed(),
    ]);

    player.onCollide("npc", (n) => {
        player.activeNPC = n;
        prompt.text = `Press E to talk to ${n.name}`;
    });

    player.onCollideEnd("npc", () => {
        player.activeNPC = null;
        prompt.text = "";
        dialogueBox.opacity = 0;
        dialogueText.text = "";
    });

    onUpdate(() => {
        if (player.activeNPC && isKeyPressed("e")) {
            dialogueBox.opacity = 1;
            dialogueText.text = player.activeNPC.testimonial;
            prompt.text = "";
        }
    });

    // Return portal
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
        text("EXIT", { size: 14 }),
        pos(50, height() - 90),
        anchor("center"),
    ]);

    player.onCollide("return", () => {
        go("hub");
    });
});

go("menu");
