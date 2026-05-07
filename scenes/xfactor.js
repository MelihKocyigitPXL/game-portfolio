export default function() {
    scene("xfactor", (info) => {
        setGravity(0);
        
        const bgColor = rgb(15, 10, 30);
        add([rect(width(), height()), pos(0, 0), color(bgColor), fixed(), z(-20)]);

        add([
            pos(width() / 2, height() / 2),
            circle(300),
            color(rgb(30, 30, 60)),
            outline(1, rgb(100, 100, 255)),
            opacity(0.15),
            anchor("center"),
            z(-10),
        ]);

        const centerPos = vec2(width() / 2, height() / 2);
        const xColor = rgb(255, 165, 0);
        
        const xContainer = add([
            pos(centerPos),
            anchor("center"),
            z(5),
        ]);

        xContainer.add([
            rect(120, 25, { radius: 5 }),
            color(xColor),
            rotate(45),
            anchor("center"),
            outline(4, rgb(255, 255, 255)),
        ]);
        xContainer.add([
            rect(120, 25, { radius: 5 }),
            color(xColor),
            rotate(-45),
            anchor("center"),
            outline(4, rgb(255, 255, 255)),
        ]);

        const pillarData = [
            { 
                title: "PASSIE & INNOVATIE", 
                pos: vec2(width() / 2, height() / 2 - 200), 
                color: rgb(255, 100, 100),
                desc: "Ik werk graag aan applicaties en bouw graag dingen op. De creatieve uitwerking van mijn portfolio is hier een sterk voorbeeld van."
            },
            { 
                title: "ONDERNEMEND", 
                pos: vec2(width() / 2 + 220, height() / 2), 
                color: rgb(100, 255, 100),
                desc: "Mijn aanpassingsvermogen in groepsprojecten weerspiegelt mijn ondernemingszin. Ik neem verantwoordelijkheid waar nodig."
            },
            { 
                title: "SAMENWERKEN", 
                pos: vec2(width() / 2, height() / 2 + 200), 
                color: rgb(100, 100, 255),
                desc: "Ik stuur bij waar nodig om het gewenste resultaat te bereiken samen met het team."
            },
            { 
                title: "MULTIDISCIPLINAIR", 
                pos: vec2(width() / 2 - 220, height() / 2), 
                color: rgb(255, 255, 100),
                desc: "Ik beperk me niet tot app-dev, maar verdiep me ook in cybersecurity om een bredere professionele basis te leggen."
            },
        ];

        pillarData.forEach((p) => {
            add([
                pos(centerPos),
                rect(2, p.pos.dist(centerPos)),
                color(p.color),
                opacity(0.3),
                anchor("top"),
                rotate(centerPos.angle(p.pos) - 90),
                z(-5),
            ]);

            const pillar = add([
                rect(200, 50, { radius: 10 }),
                pos(p.pos),
                color(rgb(25, 25, 45)),
                outline(3, p.color),
                area(),
                anchor("center"),
                "pillar",
                { info: p }
            ]);

            add([
                text(p.title, { size: 14 }),
                pos(p.pos),
                anchor("center"),
                color(p.color),
            ]);
        });

        add([
            text("ONTDEK MIJN X-FACTOR", { size: 22 }),
            pos(width() / 2, 60),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        const descriptionBox = add([
            rect(width() * 0.85, 130, { radius: 12 }),
            pos(width() / 2, height() - 140),
            anchor("center"),
            color(rgb(10, 10, 20)),
            outline(2, rgb(255, 255, 255)),
            opacity(0),
            z(20),
        ]);

        const descriptionText = descriptionBox.add([
            text("", { size: 18, width: width() * 0.8, align: "center", lineSpacing: 8 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(220, 220, 255)),
        ]);

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() / 2 + 100),
            area(),
            anchor("center"),
            z(30),
        ]);

        const SPEED = 400;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        player.onCollide("pillar", (p) => {
            descriptionBox.opacity = 1;
            descriptionText.text = p.info.desc;
            descriptionBox.outline.color = p.info.color;
            p.scale = vec2(1.1);
        });

        player.onCollideEnd("pillar", (p) => {
            descriptionBox.opacity = 0;
            descriptionText.text = "";
            p.scale = vec2(1.0);
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
            if (onReturn && isKeyPressed("e")) {
                go("hub");
            }
        });

        onUpdate(() => {
            if (chance(0.04)) {
                add([
                    text("X", { size: rand(12, 28) }),
                    pos(rand(0, width()), height()),
                    color(rgb(255, 165, 0)),
                    opacity(0.1),
                    move(UP, rand(50, 100)),
                    lifespan(3),
                    z(-5),
                ]);
            }
            xContainer.scale = vec2(1 + Math.sin(time() * 2) * 0.05);
        });

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(0, 0, 0)),
            opacity(1),
            fixed(),
            z(100),
        ]);
        tween(1, 0, 0.6, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
