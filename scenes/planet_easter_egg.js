import * as THREE from "three";

export default function() {
    scene("planet_easter_egg", () => {
        setGravity(0);

        const bg = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(6, 8, 18)),
            fixed(),
            z(-100),
        ]);

        for (let i = 0; i < 220; i++) {
            const twinkle = add([
                rect(rand(1, 3), rand(1, 3)),
                pos(rand(0, width()), rand(0, height())),
                color(rgb(180 + rand(0, 75), 180 + rand(0, 75), 255)),
                opacity(rand(0.15, 0.9)),
                z(-50),
            ]);
            const phase = rand(0, Math.PI * 2);
            const speed = rand(1, 4);
            twinkle.onUpdate(() => {
                twinkle.opacity = 0.2 + Math.abs(Math.sin(time() * speed + phase)) * 0.8;
            });
        }

        const title = add([
            text("PLANEET X", { size: 24 }),
            pos(width() / 2, 22),
            anchor("center"),
            color(rgb(120, 255, 255)),
            z(30),
        ]);

        const subtitle = add([
            text(".", { size: 15 }),
            pos(width() / 2, 48),
            anchor("center"),
            color(rgb(180, 220, 255)),
            z(30),
        ]);

        const globeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        globeRenderer.setPixelRatio(window.devicePixelRatio);
        globeRenderer.setClearColor(0x000000, 0);

        const globeCanvas = globeRenderer.domElement;
        globeCanvas.style.position = "fixed";
        globeCanvas.style.inset = "0";
        globeCanvas.style.pointerEvents = "none";
        globeCanvas.style.zIndex = "5";
        globeCanvas.style.width = "100vw";
        globeCanvas.style.height = "100vh";
        document.body.appendChild(globeCanvas);

        const threeScene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0.15, 7.5);

        const globeGroup = new THREE.Group();
        threeScene.add(globeGroup);

        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 64, 64),
            new THREE.MeshStandardMaterial({
                color: 0x2f7fff,
                roughness: 0.7,
                metalness: 0.15,
                emissive: 0x081426,
                emissiveIntensity: 0.45,
            })
        );
        globeGroup.add(globe);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.74, 64, 64),
            new THREE.MeshBasicMaterial({
                color: 0x9fd9ff,
                transparent: true,
                opacity: 0.14,
                side: THREE.BackSide,
            })
        );
        globeGroup.add(atmosphere);

        const grid = new THREE.Mesh(
            new THREE.SphereGeometry(1.66, 24, 24),
            new THREE.MeshBasicMaterial({
                color: 0xb8efff,
                wireframe: true,
                transparent: true,
                opacity: 0.18,
            })
        );
        globeGroup.add(grid);

        const light1 = new THREE.DirectionalLight(0xffffff, 2.2);
        light1.position.set(3, 2, 5);
        threeScene.add(light1);

        const light2 = new THREE.AmbientLight(0x4f6b88, 1.2);
        threeScene.add(light2);

        const rimLight = new THREE.DirectionalLight(0x6ecbff, 1.1);
        rimLight.position.set(-4, -1, -2);
        threeScene.add(rimLight);

        function updateCanvasPosition() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            globeRenderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        updateCanvasPosition();
        window.addEventListener("resize", updateCanvasPosition);

        const helpText = add([
            text("R: Terug naar de hub", { size: 14 }),
            pos(width() / 2, height() - 40),
            anchor("center"),
            color(rgb(205, 225, 255)),
            z(45),
        ]);

        const returnHint = add([
            text("", { size: 14 }),
            pos(width() / 2, height() - 64),
            anchor("center"),
            color(rgb(255, 255, 180)),
            z(45),
        ]);

        let animationFrameId = 0;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            globeGroup.rotation.y += 0.0045;
            globeGroup.rotation.x = Math.sin(time() * 0.35) * 0.08;
            atmosphere.scale.setScalar(1 + Math.sin(time() * 2.2) * 0.015);
            title.angle = Math.sin(time() * 1.8) * 1.2;
            subtitle.scale = vec2(1 + Math.sin(time() * 2.5) * 0.01);
            returnHint.text = "Welkom tot PLANEET X!";
            globeRenderer.render(threeScene, camera);
        }

        animate();

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(20, 30, 50)),
            opacity(1),
            fixed(),
            z(200),
        ]);
        tween(1, 0, 0.6, (v) => {
            fadeIn.opacity = v;
        }, easings.easeOutQuad);

        function cleanup() {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", updateCanvasPosition);
            if (globeCanvas.parentElement) {
                document.body.removeChild(globeCanvas);
            }
        }

        onKeyPress("r", () => {
            cleanup();
            go("hub");
        });

        onSceneLeave(() => {
            cleanup();
        });
    });
}
