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
            keterangan: "Fokus pada Alpha Centauri, Proxima b, Sirius, TRAPPIST-1 dengan 7 eksoplanet berbatu, pulsar, dan debu antarbintang di Lengan Orion.",
            skala: "250 - 1.500 tahun cahaya"
        },
        3: {
            id: 3,
            nama: "Galaksi Bima Sakti & Satelit",
            cameraPos: new THREE.Vector3(0, 9500, 3200),
            targetPos: new THREE.Vector3(0, 0, -1800),
            keterangan: "Melihat struktur menyeluruh Bima Sakti (palang, 6 lengan spiral volumetrik, Sagittarius A*) di mana Tata Surya kita berada tepat di dalam piringan bintang Lengan Orion.",
            skala: "1.500 - 15.000 tahun cahaya"
        },
        4: {
            id: 4,
            nama: "Subgrup Andromeda & M33",
            cameraPos: new THREE.Vector3(-12000, 14000, 34000),
            targetPos: new THREE.Vector3(-18000, 7500, 22000),
            keterangan: "Menjelajahi Galaksi Andromeda (M31) beserta satelitnya M32 & M110, objek Mayall II (G1), serta Galaksi Triangulum (M33) dengan monster pembentuk bintang NGC 604.",
            skala: "15.000 - 40.000 tahun cahaya"
        },
        5: {
            id: 5,
            nama: "Semesta Lokal: 49 Galaksi",
            cameraPos: new THREE.Vector3(15000, 42000, 36000),
            targetPos: new THREE.Vector3(-7000, 3000, 10000),
            keterangan: "Tampilan makrokosmik seluruh 49 galaksi di Grup Lokal secara bebas dan realistis tanpa garis penghubung, mencakup galaksi spiral, eliptis, katai sferoid, dan ireguler.",
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

    // Cinematic Cosmic Tour with NASA internal objects
    const tourTargets = [
        { name: "Matahari", stage: 1, text: "Fase 1: Memulai dari Jantung Tata Surya (Matahari)" },
        { name: "Bumi", stage: 1, text: "Fase 1: Planet Bumi & Satelit Alami Bulan" },
        { name: "Jupiter", stage: 1, text: "Fase 1: Raksasa Gas Jupiter & Bulan-Bulan Galilea" },
        { name: "Alpha Centauri A", stage: 2, text: "Fase 2: Sistem Bintang Terdekat Alpha Centauri" },
        { name: "Proxima Centauri b", stage: 2, text: "Fase 2: Eksoplanet Berbatu Proxima Centauri b" },
        { name: "Lokasi Tata Surya Kita", stage: 3, text: "Fase 3: Posisi Tata Surya di Lengan Orion Bima Sakti" },
        { name: "Sagittarius A*", stage: 3, text: "Fase 3: Lubang Hitam Supermasif Pusat Bima Sakti (Sagittarius A*)" },
        { name: "30 Doradus (Nebula Tarantula / NGC 2070)", stage: 3, text: "Objek NASA: Monster Pembentuk Bintang 30 Doradus di Awan Magellan Besar" },
        { name: "R136a1 (Bintang Paling Masif yang Diketahui)", stage: 3, text: "Objek NASA: Bintang Hypermasif R136a1 (≈250× Massa Matahari)" },
        { name: "NGC 346 (Pabrik Bintang SMC)", stage: 3, text: "Objek NASA: Kompleks Pembibitan Bintang Purba NGC 346 di SMC" },
        { name: "Galaksi Andromeda (M31 / NGC 224)", stage: 4, text: "Fase 4: Raksasa Spiral Andromeda (M31)" },
        { name: "M31* (Pusat Lubang Hitam Supermasif Andromeda)", stage: 4, text: "Objek NASA: Lubang Hitam 100-230 Juta Massa Matahari di Inti Andromeda" },
        { name: "Mayall II (G1 / NGC-224-G1)", stage: 4, text: "Objek NASA: Gugus Bola Raksasa Mayall II (G1) di Andromeda" },
        { name: "NGC 604 (Monster Pembibitan Bintang M33)", stage: 4, text: "Objek NASA: Daerah H II Raksasa NGC 604 di Galaksi Triangulum" },
        { name: "Messier 54 (M54 - Inti Sgr dSph)", stage: 3, text: "Objek NASA: M54, Inti Sejati Galaksi Katai Sagittarius" },
        { name: "All 49 Galaxies", stage: 5, text: "Fase 5: Menatap Keseluruhan 49 Galaksi Kosmik di Sekitar Kita" }
    ];

    function startCinematicTour(findObjectCallback, onTourStatusUpdate) {
        isTourRunning = true;
        tourStep = 0;

        function nextTourStep() {
            if (!isTourRunning) return;
            const target = tourTargets[tourStep];
            if (onTourStatusUpdate) onTourStatusUpdate(target.text, tourStep + 1, tourTargets.length);

            if (target.name === "All 49 Galaxies") {
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
            }, 6500);
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
