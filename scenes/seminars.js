import * as THREE from 'three';

export default function() {
    scene("seminars", (info) => {
        setGravity(0);

        const bgColor = rgb(
            Math.floor(info.color[0] * 0.1),
            Math.floor(info.color[1] * 0.1),
            Math.floor(info.color[2] * 0.1)
        );
        add([rect(width(), height()), pos(0, 0), color(bgColor), fixed(), z(-20)]);

        // Kaplay UI elements
        const monument = add([
            rect(width() * 0.85, 480, { radius: 12 }),
            pos(width() / 2, height() / 2 - 20),
            anchor("center"),
            color(rgb(20, 20, 30)),
            outline(4, rgb(info.color[0], info.color[1], info.color[2])),
            opacity(1),
        ]);

        monument.add([
            text(info.title.toUpperCase(), { size: 32 }),
            pos(0, -200),
            anchor("center"),
            color(rgb(info.color[0], info.color[1], info.color[2])),
        ]);

        // Placeholder for the 3D model (Kaplay space)
        const threeJsContainer = monument.add([
            rect(400, 220),
            pos(0, -60), // Positioned above the text
            anchor("center"),
            color(rgb(10, 10, 15)),
            outline(2, rgb(100, 100, 100)),
        ]);

        monument.add([
            text(info.text, { size: 16, width: width() * 0.75, align: "center", lineSpacing: 8 }),
            pos(0, 110),
            anchor("center"),
            color(rgb(255, 255, 255)),
        ]);

        monument.add([
            text(info.flair, { size: 14 }),
            pos(0, 210),
            anchor("center"),
            color(rgb(info.color[0], info.color[1], info.color[2])),
            opacity(0.8),
        ]);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 220);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const canvas3d = renderer.domElement;
        canvas3d.style.position = 'absolute';
        canvas3d.style.pointerEvents = 'none'; 
        document.body.appendChild(canvas3d);

        function updateCanvasPosition() {
            const canvas = document.querySelector("canvas");
            if (!canvas) return;
            
            const rect = canvas.getBoundingClientRect();
            const scaleX = rect.width / width();
            const scaleY = rect.height / height();
            
            // Map the container's relative position to the screen
            const containerPos = threeJsContainer.pos;
            const monumentPos = monument.pos;
            
            // Calculate absolute pixel position relative to the game canvas
            const centerX = rect.left + (monumentPos.x + containerPos.x) * scaleX;
            const centerY = rect.top + (monumentPos.y + containerPos.y) * scaleY;

            canvas3d.style.left = `${centerX - (200 * scaleX)}px`;
            canvas3d.style.top = `${centerY - (110 * scaleY)}px`;
            canvas3d.style.width = `${400 * scaleX}px`;
            canvas3d.style.height = `${220 * scaleY}px`;
            canvas3d.style.zIndex = "5"; 
        }

        updateCanvasPosition();
        window.addEventListener('resize', updateCanvasPosition);

        const threeScene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 400 / 220, 0.1, 1000);
        camera.position.z = 4;

        const geometry = new THREE.SphereGeometry(1.2, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(info.color[0]/255, info.color[1]/255, info.color[2]/255),
            metalness: 0.6,
            roughness: 0.4,
            wireframe: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        threeScene.add(mesh);

        const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
        light1.position.set(2, 2, 5);
        threeScene.add(light1);

        const light2 = new THREE.AmbientLight(0x404040, 1);
        threeScene.add(light2);

        let fidelityLevel = 2; // 0: low, 1: mid, 2: high
        const fidelities = [
            { w: 6, h: 4 },   // Low: Looks like a crystal
            { w: 12, h: 8 },  // Mid: Polygonal look
            { w: 48, h: 32 }  // High: Smooth sphere
        ];

        function updateFidelity() {
            const f = fidelities[fidelityLevel];
            mesh.geometry.dispose();
            mesh.geometry = new THREE.SphereGeometry(1.2, f.w, f.h);
            fidelityText.text = `FIDELITY: ${["LOW (6-poly)", "MEDIUM (12-poly)", "HIGH (Smooth)"][fidelityLevel]}`;
        }

        const fidelityText = monument.add([
            text("FIDELITY: HIGH (Smooth)", { size: 14 }),
            pos(0, -180),
            anchor("center"),
            color(rgb(150, 150, 150)),
        ]);

        monument.add([
            text("Druk op 'F' om fidelity te wijzigen", { size: 12 }),
            pos(0, 225),
            anchor("center"),
            color(rgb(100, 100, 100)),
        ]);

        onKeyPress("f", () => {
            fidelityLevel = (fidelityLevel + 1) % 3;
            updateFidelity();
        });

        const animate = () => {
            if (canvas3d.parentElement) {
                requestAnimationFrame(animate);
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
                renderer.render(threeScene, camera);
            }
        };
        animate();

        const player = add([
            sprite("bean"),
            pos(width() / 2, height() - 100),
            area(),
            anchor("center"),
            z(10),
        ]);

        const SPEED = 400;
        onKeyDown("left", () => player.move(-SPEED, 0));
        onKeyDown("right", () => player.move(SPEED, 0));
        onKeyDown("up", () => player.move(0, -SPEED));
        onKeyDown("down", () => player.move(0, SPEED));

        const returnPortal = add([
            circle(28),
            pos(width() / 2, height() - 35),
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
            fixed(),
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
            player.pos.x = clamp(player.pos.x, 20, width() - 20);
            player.pos.y = clamp(player.pos.y, 20, height() - 20);
            updateCanvasPosition();
            if (onReturn && isKeyPressed("e")) {
                cleanup();
                go("hub");
            }
        });

        function cleanup() {
            if (canvas3d.parentElement) {
                document.body.removeChild(canvas3d);
            }
            window.removeEventListener('resize', updateCanvasPosition);
        }

        onSceneLeave(() => {
            cleanup();
        });

        const fadeIn = add([
            rect(width(), height()),
            pos(0, 0),
            color(rgb(info.color[0], info.color[1], info.color[2])),
            opacity(1),
            fixed(),
            z(100),
        ]);
        tween(1, 0, 0.6, (val) => fadeIn.opacity = val, easings.easeOutQuad);
    });
}
