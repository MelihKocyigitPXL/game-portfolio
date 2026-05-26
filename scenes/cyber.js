import { state } from "../globalState.js";

export default function() {
    scene("cyber", (info) => {
        setGravity(0);
        add([rect(width(), height()), pos(0, 0), color(rgb(10, 10, 20)), fixed(), z(-20)]);

        add([
            text("CYBERSECURITY FORENSICS CHALLENGE", { size: 28 }),
            pos(width() / 2, 40),
            anchor("center"),
            color(rgb(255, 50, 50)),
        ]);

        const imgBox = add([
            rect(400, 400),
            pos(width() * 0.25, height() / 2 + 20),
            anchor("center"),
            color(rgb(20, 20, 30)),
            outline(2, rgb(255, 0, 0)),
        ]);

        imgBox.add([
            sprite("rainbowdash"),
            scale(0.8),
            anchor("center"),
            pos(0, 0),
        ]);

        const scanLine = add([
            rect(390, 2),
            pos(imgBox.pos.x - 195, imgBox.pos.y - 195),
            color(rgb(255, 0, 0)),
            opacity(0.5),
            z(10),
        ]);

        scanLine.onUpdate(() => {
            scanLine.pos.y += 120 * dt();
            if (scanLine.pos.y > imgBox.pos.y + 195) {
                scanLine.pos.y = imgBox.pos.y - 195;
            }
        });

        const terminal = add([
            rect(450, 500, { radius: 8 }),
            pos(width() * 0.72, height() / 2 + 20),
            anchor("center"),
            color(rgb(5, 5, 10)),
            outline(2, rgb(0, 255, 0)),
            area(),
            "terminal"
        ]);

        const consoleOutput = terminal.add([
            text("Initializing forensics tool...\n> Analysis of 'rainbowdash.jpg' in progress...\n> 2 Base64 strings detected in metadata.", { 
                size: 14, 
                width: 420, 
                lineSpacing: 8,
                font: "monospace" 
            }),
            pos(-215, -235),
            color(rgb(0, 255, 0)),
        ]);

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 100),
            area(),
            anchor("center"),
            z(50),
            { activeTerminal: false }
        ]);

        state.attachXP(player, 400);

        const prompt = add([
            text("", { size: 16 }),
            pos(width() / 2, height() - 60),
            anchor("center"),
            fixed(),
            color(rgb(255, 255, 255)),
        ]);

        let phase = 0;
        let isProcessing = false;

        player.onCollide("terminal", () => {
            player.activeTerminal = true;
            if (!isProcessing) {
                if (phase === 0) prompt.text = "Druk E om Base64 uit te pakken";
                else if (phase === 1) prompt.text = "Druk E om Python-script uit te voeren";
                else if (phase === 2) prompt.text = "Druk E om reflectie te lezen";
            }
        });

        player.onCollideEnd("terminal", () => {
            player.activeTerminal = false;
            prompt.text = "";
        });

        onKeyPress("e", () => {
            if (!player.activeTerminal || isProcessing) return;

            if (phase === 0) {
                consoleOutput.text += "\n\n> String 1 (Key): mR18... (REDACTED)\n> String 2 (IV):  aXo2... (REDACTED)";
                phase = 1;
                prompt.text = "Druk E om Python-script uit te voeren";
            } else if (phase === 1) {
                isProcessing = true;
                prompt.text = "Processing...";
                consoleOutput.text += "\n\n> Running: decrypt.py\n> Using PyCryptodome (AES-CBC)\n> Decoding Base64 strings...\n> Interpreting as UTF-16LE...";
                
                wait(1.5, () => {
                    consoleOutput.text += "\n> Found null-bytes. Cleaning output...";
                    wait(1.5, () => {
                        consoleOutput.text += "\n\n(FLAG FOUND): CTF{F0R3NS1C5_M4ST3R_2026}";
                        phase = 2;
                        isProcessing = false;
                        if (player.activeTerminal) prompt.text = "Druk E om de reflectie te lezen";
                    });
                });
            } else if (phase === 2) {
                showReflection();
            }
        });

        function showReflection() {
            const overlay = add([
                rect(width() * 0.9, height() * 0.85, { radius: 12 }),
                pos(width() / 2, height() / 2),
                anchor("center"),
                color(rgb(10, 10, 25)),
                outline(4, rgb(255, 0, 0)),
                z(100),
            ]);

            overlay.add([
                text("CYBERSECURITY UITDAGING 2026 - REFLECTIE", { size: 24 }),
                pos(0, -260),
                anchor("center"),
                color(rgb(255, 50, 50)),
            ]);

            const fullText = "Net zoals vorig jaar nam ik ook dit jaar opnieuw deel aan de Cybersecurity Challenge. Dit is een nationale competitie waarbij studenten hun technische kennis en probleemoplossend vermogen testen via Capture The Flag-opdrachten (CTF's).\n\nMijn favoriete categorie is 'Forensics'. Hierbij analyseer je digitale artefacten zoals afbeeldingen om verborgen flags te vinden via metadata of bestandsstructuren.\n\nEen van de opdrachten die me bijbleef was een cartoonafbeelding waarin twee Base64-strings verborgen zaten. Na decodering vormden deze de AES-sleutel en IV. Ik schreef een Python-script met de PyCryptodome-bibliotheek om de data te ontsleutelen (AES-CBC) en te interpreteren als UTF-16LE.\n\nReflectie: Ik had opnieuw een positieve ervaring, al miste ik het teamgevoel van vorig jaar omdat het dit jaar individueel was. Ook de timing met mijn stage maakte het uitdagend. Toch was mijn doorzettingsvermogen mijn grootste troef. De Cybersecurity Challenge is voor mij een must: het combineert doordenkingsvermogen, technische kennis en creativiteit op een manier die ik bij de PXL mis.";

            overlay.add([
                text(fullText, { size: 16, width: width() * 0.8, align: "left", lineSpacing: 6 }),
                pos(0, 0),
                anchor("center"),
                color(rgb(255, 255, 255)),
            ]);

            overlay.add([
                text("Druk SPATIEBALK om te sluiten", { size: 16 }),
                pos(0, 260),
                anchor("center"),
                color(rgb(150, 150, 250)),
            ]);

            const closeEvent = onKeyPress("space", () => {
                destroy(overlay);
                closeEvent.cancel();
            });
        }

        const returnPortal = add([
            circle(28),
            pos(80, height() - 40),
            color(rgb(40, 40, 60)),
            outline(3, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            "return",
        ]);

        const returnPrompt = add([
            text("", { size: 14 }),
            pos(width() / 2, height() - 40),
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

        const f = add([rect(width(), height()), pos(0, 0), color(rgb(0, 0, 0)), opacity(1), fixed(), z(200)]);
        tween(1, 0, 0.5, (v) => f.opacity = v);
    });
}
