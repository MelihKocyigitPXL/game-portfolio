import kaplay from "kaplay";
import { PORTFOLIO_DATA } from "./data.js";
import menuScene from "./scenes/menu.js";
import cutsceneScene from "./scenes/cutscene.js";
import hubScene from "./scenes/hub.js";
import cyberScene from "./scenes/cyber.js";
import fosdemScene from "./scenes/fosdem.js";
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

loadBean();
loadSprite("thalento", "assets/thalento.png");
loadSprite("arrowkeys", "assets/arrowkeys.png");
loadSprite("rainbowdash", "assets/rainbowdash.jpg");
loadSprite("fosdemJava", "assets/fosdemJava.jpg");
loadSprite("fosdemQuantum", "assets/fosdemQuantum.jpg");
loadSprite("fosdemROSA", "assets/fosdemROSA.jpg");
loadSprite("fosdemTor", "assets/fosdemTor.jpg");
loadSprite("fosdemVLC", "assets/fosdemVLC.jpg");

menuScene();
cutsceneScene();
hubScene(PORTFOLIO_DATA);
cyberScene();
fosdemScene();
easterEggScene();
detailScene();
introScene();
testimonialsScene();

go("menu");
