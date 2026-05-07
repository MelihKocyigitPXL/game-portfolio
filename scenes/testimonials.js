export default function() {
    scene("testimonials", (info) => {
        setGravity(0);
        add([rect(width(), height()), pos(0, 0), color(rgb(20, 10, 30)), fixed(), z(-20)]);

        add([
            text("Testimonials", { size: 24 }),
            pos(width() / 2, 40),
            anchor("center"),
            color(rgb(200, 100, 255)),
        ]);

        const npcs = [
            { name: "Cas", pos: vec2(width() * 0.16, height() * 0.45), color: rgb(100, 200, 255), testimonial: "Cas: 'Ik heb hem leren kennen als iemand die betrouwbaar is en zijn werk met de nodige zorg en toewijding uitvoert. Hij werkt gestructureerd, denkt mee en is een aangename persoon om mee samen te werken.'" },
            { name: "Safri", pos: vec2(width() * 0.33, height() * 0.45), color: rgb(255, 150, 100), testimonial: "Safri: 'Ik waardeer aan jou dat je veel mee bent met wat er in de wereld gebeurt en daar ook boeiend over kan vertellen. Je brengt interessante inzichten en nieuwe ideeën in de groep, en tegelijk maak je de sfeer vaak wat luchtiger.'" },
            { name: "Ferre", pos: vec2(width() * 0.5, height() * 0.45), color: rgb(150, 255, 100), testimonial: "Ferre: 'Hij is iemand die altijd 100% geeft en door die inzet weet je dat er altijd een resultaat gaat zijn waar je trots op kan zijn'" },
            { name: "Berdan", pos: vec2(width() * 0.66, height() * 0.45), color: rgb(255, 100, 255), testimonial: "Berdan: 'Ik heb hem leren kennen tijdens het IT-project en het klikte meteen. Hij is een sterk teamlid om mee te werken en bovendien iemand op wie je binnen een team altijd kunt vertrouwen.'" },
            { name: "Lucas", pos: vec2(width() * 0.84, height() * 0.45), color: rgb(209, 244, 52), testimonial: "Lucas: Wat ik het meest waardeer aan Melih is zijn motivatie en de manier waarop hij altijd met nieuwe ideeën komt. Hij is betrouwbaar, werkt hard en zorgt ervoor dat samenwerken altijd vlot en aangenaam verloopt. Je merkt echt dat hij passie heeft voor wat hij doet.'" },
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
            prompt.text = `Druk E om te praten met ${n.name}`;
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
    });
}
