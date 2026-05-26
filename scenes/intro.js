import { state } from "../globalState.js";

export default function() {
    scene("intro", (info) => {
        setGravity(0);
        add([rect(width(), height()), pos(0, 0), color(rgb(10, 20, 30)), fixed(), z(-20)]);

        add([
            sprite("thalento"),
            pos(width() / 2, 55),
            scale(0.4),
            anchor("center"),
        ]);

        const monument = add([
            rect(width() * 0.6, 320, { radius: 12 }),
            pos(width() / 2, height() / 2),
            anchor("center"),
            color(rgb(20, 25, 40)),
            outline(4, rgb(info.color[0], info.color[1], info.color[2])),
        ]);

        monument.add([
            text(info.title.toUpperCase(), { size: 32 }),
            pos(0, -130),
            anchor("center"),
            color(rgb(info.color[0], info.color[1], info.color[2])),
        ]);

        const bodyText = monument.add([
            text(info.text, { size: 17, width: width() * 0.5, align: "center", lineSpacing: 6 }),
            pos(0, 10),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        const traits = [
            { 
                label: "DENKEN", 
                type: "Impulsief", 
                match: "66%", 
                val: 0.66,
                pos: vec2(width() * 0.1, height() * 0.2),
                color: rgb(0, 255, 255),
                desc: "Spontaan & intuïtief beslissen. Handelt reactief."
            },
            { 
                label: "DOEN", 
                type: "Uitvoerend", 
                match: "80%", 
                val: 0.80,
                pos: vec2(width() * 0.9, height() * 0.2),
                color: rgb(255, 100, 100),
                desc: "Nood aan structuur. Focust op uitvoering."
            },
            { 
                label: "COMMUNICEREN", 
                type: "Introvert", 
                match: "84%", 
                val: 0.84,
                pos: vec2(width() * 0.1, height() * 0.8),
                color: rgb(100, 255, 100),
                desc: "Terughoudend & kritisch. Verkiest afstand."
            },
            { 
                label: "SAMENWERKEN", 
                type: "Meewerkend", 
                match: "87%", 
                val: 0.87,
                pos: vec2(width() * 0.9, height() * 0.8),
                color: rgb(255, 255, 0),
                desc: "DOMINANT: Coöperatief & gericht op afstemming."
            },
        ];

        traits.forEach((t) => {
            const p = add([
                circle(50),
                pos(t.pos),
                color(t.color.darken(180)),
                outline(4, t.color),
                area(),
                anchor("center"),
                "trait",
                { info: t }
            ]);

            p.add([
                circle(50 * t.val),
                color(t.color),
                opacity(0.4),
                anchor("center"),
            ]);

            p.add([
                text(t.match, { size: 20 }),
                anchor("center"),
                color(rgb(255, 255, 255)),
            ]);

            p.add([
                text(t.label, { size: 14 }),
                pos(0, 65),
                anchor("center"),
                color(t.color),
            ]);

            if (t.label === "SAMENWERKEN") {
                const fx = p.add([
                    circle(55),
                    color(t.color),
                    opacity(0.1),
                    anchor("center"),
                    scale(1),
                ]);
                fx.onUpdate(() => {
                    fx.scale = vec2(1 + Math.sin(time() * 3) * 0.15);
                });
            }
        });

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 110),
            area(),
            anchor("center"),
            z(10),
        ]);

        state.attachXP(player, 400);

        const traitInfoBox = add([
            rect(500, 110, { radius: 8 }),
            pos(width() / 2, height() - 180),
            anchor("center"),
            color(rgb(15, 15, 25)),
            outline(2, rgb(255, 255, 255)),
            opacity(0),
            fixed(),
            z(20),
        ]);

        const traitText = traitInfoBox.add([
            text("", { size: 16, width: 460, align: "center", lineSpacing: 6 }),
            pos(0, 0),
            anchor("center"),
        ]);

        player.onCollide("trait", (t) => {
            traitInfoBox.opacity = 1;
            traitInfoBox.outline.color = t.info.color;
            traitText.text = `${t.info.label}: ${t.info.type} (${t.info.match})\n${t.info.desc}`;
            
            if (t.info.label === "SAMENWERKEN") {
                for (let i = 0; i < 3; i++) {
                    add([
                        sprite("bean"),
                        pos(player.pos.add(rand(-40, 40), rand(-40, 40))),
                        scale(0.5),
                        color(t.info.color),
                        opacity(0.6),
                        lifespan(1),
                        move(vec2(rand(-1, 1), rand(-1, 1)), 100),
                    ]);
                }
            }
        });

        player.onCollideEnd("trait", () => {
            traitInfoBox.opacity = 0;
            traitText.text = "";
        });

        const returnPortal = add([
            circle(28),
            pos(width() / 2, height() - 40),
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

        const f = add([rect(width(), height()), pos(0, 0), color(rgb(0, 0, 0)), opacity(1), fixed(), z(100)]);
        tween(1, 0, 0.5, (v) => f.opacity = v);
    });
}
