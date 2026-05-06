export default function() {
    scene("cutscene", () => {
        const t = add([
            text("Wereld initialiseren...", { size: 24 }),
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
}
