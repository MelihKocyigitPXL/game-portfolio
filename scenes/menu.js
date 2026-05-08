import * as THREE from 'three';

export default function() {
    scene("menu", () => {
        setGravity(0);

        let threeCanvas;
        let renderer;
        let scene3d;
        let camera;
        let planetGroup;
        let animationFrameId;

        const setupThreeJS = () => {
            scene3d = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width() / height(), 0.1, 2000);
            camera.position.set(0, 0, 400);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width(), height());
            threeCanvas = renderer.domElement;
            threeCanvas.style.position = "absolute";
            threeCanvas.style.top = "0";
            threeCanvas.style.left = "0";
            threeCanvas.style.pointerEvents = "none";
            threeCanvas.style.zIndex = "-1";
            
            const kaplayCanvas = document.querySelector("canvas");
            if (kaplayCanvas) {
                threeCanvas.style.width = kaplayCanvas.style.width;
                threeCanvas.style.height = kaplayCanvas.style.height;
                threeCanvas.style.top = kaplayCanvas.style.top || "50%";
                threeCanvas.style.left = kaplayCanvas.style.left || "50%";
                threeCanvas.style.transform = kaplayCanvas.style.transform || "translate(-50%, -50%)";
                kaplayCanvas.style.position = "relative";
                kaplayCanvas.style.zIndex = "1";
                kaplayCanvas.style.backgroundColor = "transparent";
            }
            document.body.appendChild(threeCanvas);

            planetGroup = new THREE.Group();
            planetGroup.position.set(200, -100, 0); 
            scene3d.add(planetGroup);

            const planetRadius = 250;
            const geoCore = new THREE.SphereGeometry(planetRadius, 64, 64);
            const matCore = new THREE.MeshPhongMaterial({ color: 0x051025, shininess: 20 });
            const core = new THREE.Mesh(geoCore, matCore);
            planetGroup.add(core);

            const matLand = new THREE.MeshStandardMaterial({ color: 0x103020, flatShading: true });
            for(let i = 0; i < 80; i++) {
                const landSize = 10 + Math.random() * 30;
                const geoLand = new THREE.IcosahedronGeometry(landSize, 1);
                const land = new THREE.Mesh(geoLand, matLand);
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                land.position.x = planetRadius * Math.sin(theta) * Math.cos(phi);
                land.position.y = planetRadius * Math.cos(theta);
                land.position.z = planetRadius * Math.sin(theta) * Math.sin(phi);
                land.scale.set(1, 0.2, 1);
                land.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), land.position.clone().normalize());
                planetGroup.add(land);
            }

            const starGeometry = new THREE.BufferGeometry();
            const starVertices = [];
            for (let i = 0; i < 1500; i++) {
                starVertices.push((Math.random()-0.5)*2000, (Math.random()-0.5)*2000, -Math.random()*1000);
            }
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 }));
            scene3d.add(stars);

            scene3d.add(new THREE.AmbientLight(0xffffff, 0.4));
            const light = new THREE.DirectionalLight(0xffffff, 1.5);
            light.position.set(1, 1, 1);
            scene3d.add(light);

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                planetGroup.rotation.y += 0.001;
                renderer.render(scene3d, camera);
            };
            animate();
        };

        setupThreeJS();

        onSceneLeave(() => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (threeCanvas && threeCanvas.parentNode) threeCanvas.parentNode.removeChild(threeCanvas);
        });

        add([
            rect(width(), height()),
            pos(0,0),
            color(0, 0, 0),
            opacity(0.6),
            z(-10),
            fixed(),
        ]);

        const titleGroup = add([
            pos(width() / 2, height() / 3),
            anchor("center"),
            scale(0),
            opacity(0),
        ]);

        titleGroup.add([
            text("MELIH'S", { size: 24, font: "monospace", letterSpacing: 8 }),
            pos(0, -80),
            anchor("center"),
            color(255, 255, 255),
            opacity(0.8),
        ]);

        titleGroup.add([
            text("I-TALENT", { size: 72, font: "monospace" }),
            pos(0, -10),
            anchor("center"),
            color(100, 200, 255),
        ]);

        titleGroup.add([
            text("PORTFOLIO SYSTEM", { size: 24, font: "monospace", letterSpacing: 4 }),
            pos(0, 40),
            anchor("center"),
            color(255, 255, 255),
            opacity(0.8),
        ]);

        const btn = add([
            rect(320, 70, { radius: 4 }),
            pos(width() / 2, height() * 0.65),
            area(),
            anchor("center"),
            outline(2, rgb(100, 200, 255)),
            color(0, 0, 0),
            opacity(0),
            scale(0),
        ]);

        const btnText = btn.add([
            text("INITIALIZE LINK", { size: 20, font: "monospace" }),
            anchor("center"),
            color(100, 200, 255),
        ]);

        add([
            rect(width(), 2),
            pos(0, height() / 2),
            color(100, 200, 255),
            opacity(0.1),
            fixed(),
        ]);

        const scanline = add([
            rect(width(), 50),
            pos(0, -50),
            color(100, 200, 255),
            opacity(0.05),
            fixed(),
        ]);

        scanline.onUpdate(() => {
            scanline.pos.y += 150 * dt();
            if (scanline.pos.y > height()) scanline.pos.y = -50;
        });

        // Entrance Animation
        wait(0.2, () => {
            tween(0, 1, 0.8, (v) => {
                titleGroup.scale = vec2(v);
                titleGroup.opacity = v;
            }, easings.easeOutBack);
        });

        wait(0.6, () => {
            tween(0, 1, 0.5, (v) => {
                btn.scale = vec2(v);
                btn.opacity = v;
            }, easings.easeOutQuad);
        });

        btn.onHoverUpdate(() => {
            btn.scale = vec2(1.05);
            btn.outline.width = 4;
            btnText.color = rgb(255, 255, 255);
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.outline.width = 2;
            btnText.color = rgb(100, 200, 255);
        });

        btn.onClick(() => {
            const overlay = add([
                rect(width(), height()),
                pos(0,0),
                color(0, 0, 0),
                opacity(0),
                fixed(),
                z(100),
            ]);
            tween(0, 1, 0.5, (v) => overlay.opacity = v, easings.easeInQuad).onEnd(() => {
                go("cutscene");
            });
        });
    });
}
