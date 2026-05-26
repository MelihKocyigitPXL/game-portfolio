export const state = {
    xp: 0,
    level: 0,
    xpToNextLevel: [100, 300, 600, 1200], // Lvl 1, 2, 3, 4
    
    getRewardText(lvl) {
        const rewards = {
            1: "3D Globe Ontgrendeld!",
            2: "Geheime Planeet + Kosmisch Spoor!",
            3: "Het Draaiende Touw + Snelheidsboost!",
            4: "Zwart Gat Geactiveerd! (Check het Hub Centrum)"
        };
        return rewards[lvl] || "";
    },

    addXP(amount) {
        this.xp += amount;
        let newLevel = 0;
        for (let i = 0; i < this.xpToNextLevel.length; i++) {
            if (this.xp >= this.xpToNextLevel[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }
        
        if (newLevel > this.level) {
            this.level = newLevel;
            return true; 
        }
        return false;
    },
    
    getProgress() {
        const currentThreshold = this.level === 0 ? 0 : this.xpToNextLevel[this.level - 1];
        const nextThreshold = this.xpToNextLevel[this.level] || this.xpToNextLevel[this.xpToNextLevel.length - 1] * 2;
        const needed = nextThreshold - currentThreshold;
        const earned = this.xp - currentThreshold;
        return Math.min(earned / needed, 1);
    },

    attachXP(player, speed = 450) {
        // Add UI elements to player
        const barBg = player.add([
            rect(50, 8, { radius: 4 }),
            pos(0, -45),
            anchor("center"),
            color(rgb(20, 20, 20)),
            outline(2, rgb(255, 255, 255)),
            fixed(),
            z(100),
        ]);
        const xpBar = barBg.add([
            rect(0, 4, { radius: 2 }),
            pos(-23, 0),
            anchor("left"),
            color(rgb(50, 200, 50)),
        ]);
        const levelText = player.add([
            text("LVL " + this.level, { size: 10 }),
            pos(0, -60),
            anchor("center"),
            fixed(),
        ]);

        const notifyLevelUp = (lvl) => {
            const container = add([
                pos(width() / 2, height() / 2),
                anchor("center"),
                fixed(),
                z(1000),
            ]);

            // Background panel for readability
            container.add([
                rect(width() * 0.8, 120, { radius: 10 }),
                color(rgb(0, 0, 0)),
                opacity(0.8),
                outline(2, rgb(255, 255, 255)),
                anchor("center"),
            ]);

            container.add([
                text("NIVEAU OMHOOG! LVL " + lvl, { size: 36, font: "monospace" }),
                pos(0, -25),
                anchor("center"),
                color(rgb(255, 255, 0)),
                outline(4, rgb(0, 0, 0)),
            ]);

            container.add([
                text("ONTGRENDELD: " + this.getRewardText(lvl), { size: 20, font: "monospace" }),
                pos(0, 30),
                anchor("center"),
                color(rgb(255, 255, 255)),
                outline(2, rgb(0, 0, 0)),
            ]);

            tween(1, 0, 3, (v) => container.opacity = v).onEnd(() => destroy(container));
            shake(10);
        };

        const move = (x, y) => {
            let actualSpeed = speed;
            // Level 1 Reward: Mechanical Speed Boost (stays, but officially announced at Lvl 3)
            if (this.level >= 1) actualSpeed *= 1.2;
            
            player.move(x * actualSpeed, y * actualSpeed);
            if (this.addXP(dt() * 20)) {
                notifyLevelUp(this.level);
            }
        };

        onKeyDown("left", () => move(-1, 0));
        onKeyDown("right", () => move(1, 0));
        onKeyDown("up", () => move(0, -1));
        onKeyDown("down", () => move(0, 1));

        player.onUpdate(() => {
            xpBar.width = this.getProgress() * 46;
            levelText.text = "LVL " + this.level;

            if (this.level >= 2 && (isKeyDown("left") || isKeyDown("right") || isKeyDown("up") || isKeyDown("down"))) {
                const trail = add([
                    pos(player.pos),
                    circle(rand(2, 8)),
                    color(rgb(100, 200, 255)),
                    opacity(0.6),
                    anchor("center"),
                    z(player.z - 1),
                ]);
                tween(0.6, 0, 0.5, (v) => trail.opacity = v).onEnd(() => destroy(trail));
            }
        });

        onKeyPress("e", () => {
            if (this.addXP(15)) {
                notifyLevelUp(this.level);
            }
        });

        return player;
    }
};
