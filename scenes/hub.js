import * as THREE from 'three';

export default function(PORTFOLIO_DATA) {
    scene("hub", () => {
        setGravity(0);

        let isSpinning = false;
        let spinSpeed = 0;
        const TARGET_SPIN_SPEED = 180;

        const world = add([
            pos(width() / 2, height() / 2),
            anchor("center"),
            rotate(0),
        ]);

        let threeCanvas;
        let renderer;
        let scene3d;
        let camera;
        let planetGroup;
        let animationFrameId;
        let currentPlanetSpin = 0.00015;
        const BASE_PLANET_SPIN = 0.00015;
        const BOOST_PLANET_SPIN = 0.03;

        const setupThreeJS = () => {
            scene3d = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(35, width() / height(), 0.1, 2000);
            camera.position.set(0, 0, 400);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width(), height());
            threeCanvas = renderer.domElement;
            threeCanvas.style.position = "absolute";
            threeCanvas.style.pointerEvents = "none";
            threeCanvas.style.zIndex = "-1";
            
            const kaplayCanvas = document.querySelector("canvas");
            if (kaplayCanvas) {
                threeCanvas.style.width = kaplayCanvas.style.width;
                threeCanvas.style.height = kaplayCanvas.style.height;
                threeCanvas.style.top = kaplayCanvas.style.top || "50%";
                threeCanvas.style.left = kaplayCanvas.style.left || "50%";
                threeCanvas.style.transform = kaplayCanvas.style.transform || "translate(-50%, -50%)";
                threeCanvas.style.border = kaplayCanvas.style.border;
                threeCanvas.style.boxSizing = "border-box";
                kaplayCanvas.style.position = "relative";
                kaplayCanvas.style.zIndex = "1";
                kaplayCanvas.style.backgroundColor = "transparent";
            }
            document.body.appendChild(threeCanvas);

            planetGroup = new THREE.Group();
            planetGroup.position.y = -520;
            scene3d.add(planetGroup);

            const planetRadius = 450;

            const geoCore = new THREE.SphereGeometry(planetRadius, 128, 128);
            const matCore = new THREE.MeshPhongMaterial({ 
                color: 0x0a1a3a,
                specular: 0x111111,
                shininess: 25,
            });
            const core = new THREE.Mesh(geoCore, matCore);
            planetGroup.add(core);

            const matLand = new THREE.MeshStandardMaterial({
                color: 0x1a3a1a,
                roughness: 0.9,
                metalness: 0.0,
                flatShading: true,
            });

            const landGroup = new THREE.Group();
            planetGroup.add(landGroup);

            for(let i = 0; i < 150; i++) {
                const landSize = 5 + Math.random() * 25;
                const geoLand = new THREE.IcosahedronGeometry(landSize, 1);
                const land = new THREE.Mesh(geoLand, matLand);
                
                const phi = (Math.random() - 0.5) * 1.8;
                const theta = (Math.random() - 0.5) * 0.7;
                
                land.position.x = planetRadius * Math.sin(theta) * Math.cos(phi);
                land.position.y = planetRadius * Math.cos(theta);
                land.position.z = planetRadius * Math.sin(theta) * Math.sin(phi);
                
                land.scale.set(1, 0.15, 1); 
                land.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0), 
                    land.position.clone().normalize()
                );
                
                landGroup.add(land);
            }

            const matAtmosphere = new THREE.MeshBasicMaterial({
                color: 0x4488ff,
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide
            });
            const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(planetRadius + 15, 64, 64), matAtmosphere);
            planetGroup.add(atmosphere);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene3d.add(ambientLight);
            
            const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
            sunLight.position.set(200, 300, 100);
            scene3d.add(sunLight);

            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.7,
                transparent: true,
                opacity: 0.8,
            });

            const starVertices = [];
            for (let i = 0; i < 2000; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = -Math.random() * 1000 - 500;
                starVertices.push(x, y, z);
            }

            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene3d.add(stars);

            const animate3d = () => {
                animationFrameId = requestAnimationFrame(animate3d);
                planetGroup.rotation.y += currentPlanetSpin;
                starMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.002) * 0.3;

                if (kaplayCanvas) {
                    threeCanvas.style.width = kaplayCanvas.style.width;
                    threeCanvas.style.height = kaplayCanvas.style.height;
                }
                
                renderer.render(scene3d, camera);
            };
            animate3d();
        };

        setupThreeJS();

        onSceneLeave(() => {
            const kaplayCanvas = document.querySelector("canvas");
            if (kaplayCanvas) {
                kaplayCanvas.style.backgroundColor = "";
            }
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (threeCanvas && threeCanvas.parentNode) {
                threeCanvas.parentNode.removeChild(threeCanvas);
            }
        });

        const smallPlanetGroup = add([
            pos(width() * 0.85, height() * 0.15),
            fixed(),
            z(10),
        ]);

        smallPlanetGroup.add([circle(70), pos(0,0), color(rgb(100, 150, 255)), opacity(0.1), anchor("center"), z(-4)]);
        const smallPlanetRing = smallPlanetGroup.add([rect(180, 6, { radius: 3 }), pos(0,0), color(rgb(200, 220, 255)), opacity(0.4), anchor("center"), rotate(-20), z(-3)]);
        const smallPlanetCore = smallPlanetGroup.add([circle(50), pos(0,0), color(rgb(80, 140, 255)), outline(2, rgb(255, 255, 255)), anchor("center"), z(-2)]);
        smallPlanetGroup.add([circle(45), pos(8, 8), color(rgb(0, 0, 40)), opacity(0.5), anchor("center"), z(-1)]);

        const planetEggTrigger = smallPlanetGroup.add([
            circle(60),
            pos(0,0),
            area(),
            anchor("center"),
            opacity(0),
            "planet_egg",
        ]);

        smallPlanetGroup.onUpdate(() => {
            if (isSpinning) {
                smallPlanetRing.angle += dt() * 1000;
                smallPlanetCore.angle -= dt() * 500;
            }
        });

        const ropeX = 80;
        const rope = add([
            pos(ropeX, 0),
            rect(6, 160),
            color(rgb(177, 174, 202)),
            outline(2, rgb(60, 40, 20)),
            anchor("top"),
            z(10),
        ]);

        const handle = add([
            pos(ropeX, 160),
            circle(20),
            color(rgb(220, 40, 40)),
            outline(4, rgb(255, 255, 255)),
            area(),
            anchor("center"),
            z(11),
            "handle"
        ]);

        const radiusX = 350;
        const radiusY = 180;

        for (let i = 0; i < PORTFOLIO_DATA.length; i++) {
            const angle1 = (i / PORTFOLIO_DATA.length) * Math.PI * 2;
            const angle2 = ((i + 1) % PORTFOLIO_DATA.length) / PORTFOLIO_DATA.length * Math.PI * 2;

            const p1 = vec2(Math.cos(angle1) * radiusX, Math.sin(angle1) * radiusY);
            const p2 = vec2(Math.cos(angle2) * radiusX, Math.sin(angle2) * radiusY);

            const dist = p1.dist(p2);
            const ang = p2.sub(p1).angle();

            world.add([
                pos(p1),
                rect(dist, 1),
                rotate(ang),
                color(rgb(100, 150, 255)),
                opacity(0.15),
                z(0),
            ]);

            const pulse = world.add([
                pos(p1),
                circle(2),
                color(rgb(200, 220, 255)),
                opacity(0),
                z(1),
                {
                    t: rand(0, 1),
                    speed: rand(0.1, 0.3)
                }
            ]);
            pulse.onUpdate(() => {
                pulse.t += dt() * pulse.speed;
                if (pulse.t > 1) pulse.t = 0;
                pulse.pos = p1.lerp(p2, pulse.t);
                pulse.opacity = Math.sin(pulse.t * Math.PI) * 0.4;
            });
        }

        PORTFOLIO_DATA.forEach((item, index) => {
            const angle = (index / PORTFOLIO_DATA.length) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;

            const portalGroup = world.add([
                pos(x, y),
                z(1)
            ]);

            portalGroup.onUpdate(() => {
                portalGroup.angle = -world.angle;
            });

            const glow = portalGroup.add([
                circle(55),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.1),
                anchor("center"),
            ]);

            const portal = portalGroup.add([
                circle(45),
                color(rgb(15, 15, 30)),
                outline(4, rgb(item.color[0], item.color[1], item.color[2])),
                anchor("center"),
            ]);

            portalGroup.add([
                circle(72),
                area(),
                anchor("center"),
                opacity(0),
                "structure",
                { info: item },
            ]);

            const swirl1 = portalGroup.add([
                rect(40, 40, { radius: 10 }),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.2),
                anchor("center"),
            ]);
            const swirl2 = portalGroup.add([
                rect(30, 30, { radius: 5 }),
                color(rgb(item.color[0], item.color[1], item.color[2])),
                opacity(0.4),
                anchor("center"),
            ]);

            swirl1.onUpdate(() => {
                swirl1.angle += dt() * 60;
                swirl2.angle -= dt() * 90;
                glow.scale = vec2(1 + Math.sin(time() * 3 + index) * 0.1);
            });

            portalGroup.add([
                rect(item.title.length * 10 + 20, 24, { radius: 12 }),
                pos(0, -75),
                anchor("center"),
                color(rgb(20, 20, 40)),
                outline(2, rgb(item.color[0], item.color[1], item.color[2])),
            ]).add([
                text(item.title.toUpperCase(), { size: 14 }),
                pos(0, 0),
                anchor("center"),
                color(rgb(255, 255, 255)),
            ]);
        });

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() / 2),
            area(),
            anchor("center"),
            z(100), 
            { activePortal: null, onPlanetEgg: false, onRope: false }
        ]);

        const activePortalContacts = new Set();

        const SPEED = 450;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        const promptBox = add([
            rect(400, 45, { radius: 10 }),
            pos(width() / 2, height() - 80),
            anchor("center"),
            color(rgb(0, 0, 0)),
            outline(2, rgb(255, 255, 255)),
            opacity(0),
            fixed(),
            z(150),
        ]);

        const promptText = promptBox.add([
            text("", { size: 16 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        const updatePrompt = () => {
            if (player.onRope) {
                promptBox.opacity = 0.9;
                promptText.text = "(E) Trek aan het touw";
                promptBox.outline.color = rgb(220, 40, 40);
            } else if (player.activePortal) {
                promptBox.opacity = 0.9;
                promptText.text = `(E) ${player.activePortal.info.title}`;
                promptBox.outline.color = rgb(player.activePortal.info.color[0], player.activePortal.info.color[1], player.activePortal.info.color[2]);
            } else if (player.onPlanetEgg) {
                promptBox.opacity = 0.9;
                promptText.text = "(E) Bezoek mysterieuze planeet";
                promptBox.outline.color = rgb(100, 150, 255);
            } else {
                promptBox.opacity = 0;
                promptText.text = "";
            }
        };

        player.onCollide("structure", (portal) => {
            activePortalContacts.add(portal);
            player.activePortal = portal;
            updatePrompt();
        });

        player.onCollideEnd("structure", (portal) => {
            activePortalContacts.delete(portal);
            if (player.activePortal === portal) {
                player.activePortal = activePortalContacts.values().next().value ?? null;
            }
            updatePrompt();
        });

        player.onCollide("handle", () => {
            player.onRope = true;
            updatePrompt();
        });

        player.onCollideEnd("handle", () => {
            player.onRope = false;
            updatePrompt();
        });

        player.onCollide("planet_egg", () => {
            player.onPlanetEgg = true;
            updatePrompt();
        });

        player.onCollideEnd("planet_egg", () => {
            player.onPlanetEgg = false;
            updatePrompt();
        });

        onUpdate(() => {
            updatePrompt();

            if (isSpinning) {
                spinSpeed = lerp(spinSpeed, TARGET_SPIN_SPEED, dt() * 1.5);
                currentPlanetSpin = lerp(currentPlanetSpin, BOOST_PLANET_SPIN, dt() * 1.5);
                world.angle += spinSpeed * dt();
            } else {
                spinSpeed = lerp(spinSpeed, 0, dt() * 3);
                currentPlanetSpin = lerp(currentPlanetSpin, BASE_PLANET_SPIN, dt() * 3);
                world.angle += spinSpeed * dt();
            }

            // Boundary checks
            player.pos.x = clamp(player.pos.x, 20, width() - 20);
            player.pos.y = clamp(player.pos.y, 20, height() - 20);
        });

        onKeyPress("e", () => {
            if (player.onRope) {
                isSpinning = !isSpinning;
                
                handle.pos.y += 20;
                rope.height += 20;
                wait(0.1, () => {
                    handle.pos.y -= 20;
                    rope.height -= 20;
                });
            } else if (player.activePortal) {
                const id = player.activePortal.info.id;
                const specializedScenes = ["testimonials", "intro", "cyber", "fosdem", "xfactor", "seminars", "innovation"];
                if (specializedScenes.includes(id)) go(id, player.activePortal.info);
                else go("detail", player.activePortal.info);
            } else if (player.onPlanetEgg) {
                go("planet_easter_egg");
            }
        });

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(0, 0, 0)),
            opacity(1),
            fixed(),
            z(200),
        ]);
        tween(1, 0, 0.5, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
