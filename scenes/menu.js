export default function() {
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
            text("PORTFOLIO OPENEN", { size: 24 }),
            anchor("center"),
            color(255, 255, 255),
        ]);

        btn.onClick(() => go("cutscene"));
    });
}
