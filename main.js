import kaplay from "kaplay";
import { PORTFOLIO_DATA } from "./data.js";
import menuScene from "./scenes/menu.js";
import cutsceneScene from "./scenes/cutscene.js";
import hubScene from "./scenes/hub.js";
import easterEggScene from "./scenes/planet_easter_egg.js";
import detailScene from "./scenes/detail.js";
import introScene from "./scenes/intro.js";
import testimonialsScene from "./scenes/testimonials.js";

kaplay({
    background: [5, 5, 15],
    font: "monospace",
    width: 1000,
    height: 700,
    letterbox: true,
});

// --- ASSETS ---
loadBean();
loadSprite("thalento", "assets/thalento.png");
loadSprite("arrowkeys", "assets/arrowkeys.png");

// --- INITIALIZE SCENES ---
menuScene();
cutsceneScene();
hubScene(PORTFOLIO_DATA);
easterEggScene();
detailScene();
introScene();
testimonialsScene();

// --- START GAME ---
go("menu");
