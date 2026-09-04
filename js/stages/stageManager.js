import * as THREE from 'three';

export function createStageManager(camera, controls) {
    let currentStage = 1;
    let isTourRunning = false;
    let tourStep = 0;
    let tourTimer = null;
    let animationId = null;

    const stagesConfig = {
        1: {
            id: 1,
            nama: "Tata Surya & Wahana",
            cameraPos: new THREE.Vector3(0, 110, 240),
            targetPos: new THREE.Vector3(0, 0, 0),
            keterangan: "Fokus pada Matahari, 8 planet, sabuk asteroid, komet, serta wahana antariksa penjelajah NASA (Hubble, JWST, Voyager).",
            skala: "0 - 250 unit astronomis"
        },
        2: {
            id: 2,
            nama: "Bintang Tetangga & Eksoplanet",
            cameraPos: new THREE.Vector3(320, 280, 550),
            targetPos: new THREE.Vector3(450, 30, 200),
            keterangan: "Fokus pada Alpha Centauri, Proxima b, Sirius, TRAPPIST-1 dengan 7 eksoplanet berbatu, pulsar, dan debu antarbintang.",
            skala: "250 - 1.500 tahun cahaya"
        },
        3: {
            id: 3,
            nama: "Galaksi Bima Sakti",
            cameraPos: new THREE.Vector3(0, 5500, -9000),
            targetPos: new THREE.Vector3(0, 0, -15000),
            keterangan: "Melihat struktur menyeluruh Bima Sakti (palang, 6 lengan spiral, Sagittarius A*) beserta satelit LMC, SMC, dan Sgr dSph.",
            skala: "1.500 - 15.000 tahun cahaya"
        },
        4: {
            id: 4,
            nama: "Subgrup Andromeda & M33",
            cameraPos: new THREE.Vector3(-18000, 12000, 38000),
            targetPos: new THREE.Vector3(-22800, 8360, 29640),
            keterangan: "Menjelajahi Galaksi Andromeda (M31) beserta satelitnya M32 & M110, serta Galaksi Triangulum (M33).",
            skala: "15.000 - 40.000 tahun cahaya"
        },
        5: {
            id: 5,
            nama: "Web Kosmik: 49 Galaksi",
            cameraPos: new THREE.Vector3(12000, 36000, 38000),
            targetPos: new THREE.Vector3(-10000, 2000, 8000),
            keterangan: "Tampilan makrokosmik seluruh 49 galaksi di Grup Lokal yang saling terhubung oleh filamen jaring gravitasi kosmik.",
            skala: "Hingga 80.000 unit kosmik"
        }
    };

    // Fly camera smoothly using cubic ease-out
    function flyCamera(targetCameraPos, targetLookAt, duration = 1200, onComplete = null) {
        if (animationId) cancelAnimationFrame(animationId);

        const startCam = camera.position.clone();
        const startTarget = controls.target.clone();
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1.0);
            const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            camera.position.lerpVectors(startCam, targetCameraPos, ease);
            controls.target.lerpVectors(startTarget, targetLookAt, ease);

            if (progress < 1.0) {
                animationId = requestAnimationFrame(step);
            } else {
                if (onComplete) onComplete();
            }
        }
        animationId = requestAnimationFrame(step);
    }

    function setStage(stageNumber, duration = 1400) {
        const stage = stagesConfig[stageNumber];
        if (!stage) return;
        currentStage = stageNumber;
        flyCamera(stage.cameraPos, stage.targetPos, duration);
        return stage;
    }

    function flyToObject(objectMesh, customDistance = null) {
        const targetPos = new THREE.Vector3();
        objectMesh.getWorldPosition(targetPos);

        let size = 6;
        if (objectMesh.geometry) {
            if (!objectMesh.geometry.boundingSphere) objectMesh.geometry.computeBoundingSphere();
            const maxScale = Math.max(objectMesh.scale.x, objectMesh.scale.y, objectMesh.scale.z, 0.001);
            size = (objectMesh.geometry.boundingSphere ? objectMesh.geometry.boundingSphere.radius : 6) * maxScale;
        }

        const distance = customDistance || THREE.MathUtils.clamp(size * 5.5, 14, 3800);
        const dir = camera.position.clone().sub(controls.target);
        if (dir.lengthSq() < 0.0001) dir.set(0, 0.35, 1);
        dir.normalize();

        const newCamPos = targetPos.clone().addScaledVector(dir, distance);
        flyCamera(newCamPos, targetPos, 1100);
    }

    // Cinematic Cosmic Tour
    const tourTargets = [
        { name: "Matahari", stage: 1, text: "Fase 1: Memulai dari Jantung Tata Surya (Matahari)" },
        { name: "Bumi", stage: 1, text: "Fase 1: Melintasi Planet Bumi & Bulan" },
        { name: "Jupiter", stage: 1, text: "Fase 1: Menyusuri Sabuk Asteroid menuju Raksasa Gas Jupiter" },
        { name: "Alpha Centauri A", stage: 2, text: "Fase 2: Menjelajahi Sistem Bintang Terdekat Alpha Centauri" },
        { name: "Proxima Centauri b", stage: 2, text: "Fase 2: Mengamati Eksoplanet Berbatu Proxima Centauri b" },
        { name: "Sagittarius A*", stage: 3, text: "Fase 3: Menyelam ke Lubang Hitam Pusat Bima Sakti (Sagittarius A*)" },
        { name: "Awan Magellan Besar (LMC)", stage: 3, text: "Fase 3: Mengorbit Galaksi Satelit Awan Magellan Besar" },
        { name: "Galaksi Andromeda (M31)", stage: 4, text: "Fase 4: Menyambut Raksasa Spiral Tetangga Andromeda (M31)" },
        { name: "Galaksi Triangulum (M33)", stage: 4, text: "Fase 4: Mengagumi Lengan Biru Flocculent Triangulum (M33)" },
        { name: "Cosmic Web", stage: 5, text: "Fase 5: Menatap Web Kosmik Jaring 49 Galaksi Grup Lokal" }
    ];

    function startCinematicTour(findObjectCallback, onTourStatusUpdate) {
        isTourRunning = true;
        tourStep = 0;

        function nextTourStep() {
            if (!isTourRunning) return;
            const target = tourTargets[tourStep];
            if (onTourStatusUpdate) onTourStatusUpdate(target.text, tourStep + 1, tourTargets.length);

            if (target.name === "Cosmic Web") {
                setStage(5, 2000);
            } else {
                const mesh = findObjectCallback(target.name);
                if (mesh) {
                    flyToObject(mesh);
                } else {
                    setStage(target.stage, 1500);
                }
            }

            tourTimer = setTimeout(() => {
                tourStep = (tourStep + 1) % tourTargets.length;
                if (isTourRunning) nextTourStep();
            }, 6000);
        }

        nextTourStep();
    }

    function stopCinematicTour() {
        isTourRunning = false;
        if (tourTimer) clearTimeout(tourTimer);
    }

    return {
        stagesConfig,
        getCurrentStage: () => currentStage,
        setStage,
        flyToObject,
        flyCamera,
        startCinematicTour,
        stopCinematicTour,
        isTourPlaying: () => isTourRunning
    };
}
