import * as THREE from 'three';
import { buatTeksturPartikelBundar, buatTeksturGalaksi, buatTeksturMilkomeda } from './textureGenerator.js';

/**
 * Modul Eksperimen Tabrakan Bima Sakti & Andromeda (Milkomeda Merger Simulation)
 * Berdasarkan model astrofisika dan simulasi superkomputer NASA Hubble & ESA Gaia.
 */
export function createCollisionExperiment(scene, camera, controls) {
    const experimentGroup = new THREE.Group();
    experimentGroup.name = "CollisionExperimentGroup";
    experimentGroup.visible = false;
    scene.add(experimentGroup);

    // Simulation State
    let isRunning = false;
    let isPlaying = false;
    let simTime = 0.0; // in Billion Years (Ga), range: 0.0 to 7.0
    let speedMultiplier = 1.0;
    let savedCameraPos = new THREE.Vector3();
    let savedTargetPos = new THREE.Vector3();

    // Particle sprite texture
    const particleTexture = buatTeksturPartikelBundar();

    // Constants (Optimized for smooth 60 FPS across all GPUs)
    const COUNT_MW = 8000;
    const COUNT_AND = 9500;
    const COUNT_STARBURST = 1800;
    const TOTAL_PARTICLES = COUNT_MW + COUNT_AND + COUNT_STARBURST;

    // Buffers for Particle System
    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    const colors = new Float32Array(TOTAL_PARTICLES * 3);
    const sizes = new Float32Array(TOTAL_PARTICLES);

    // Metadata arrays for procedural deterministic simulation
    const mwInitial = [];
    const andInitial = [];
    const starburstInitial = [];

    // Helper: random in range
    function rnd(min, max) { return min + Math.random() * (max - min); }

    // Helper: Box-Muller normal distribution
    function rndNormal(mean = 0, stdev = 1) {
        let u = 1 - Math.random();
        let v = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + z * stdev;
    }

    // 1. Initialize Milky Way Particles (Barred Spiral, optimized ~8,000 particles)
    for (let i = 0; i < COUNT_MW; i++) {
        const isCore = i < 1800;
        const isBar = !isCore && i < 3200;
        let r, phi, z;

        if (isCore) {
            r = Math.pow(Math.random(), 2.2) * 220;
            phi = Math.random() * Math.PI * 2;
            z = rndNormal(0, 45) * (1 - r / 250);
        } else if (isBar) {
            const length = (Math.random() - 0.5) * 440;
            const width = rndNormal(0, 35);
            r = Math.sqrt(length * length + width * width);
            phi = Math.atan2(width, length) + 0.45; // Bar angle
            z = rndNormal(0, 28);
        } else {
            // Spiral arms
            const arm = i % 4;
            const t = Math.pow(Math.random(), 1.2);
            r = 160 + t * 740;
            const armOffset = (arm * Math.PI / 2) + 2.2 * Math.log(t * 7 + 1);
            phi = armOffset + rndNormal(0, 0.22);
            z = rndNormal(0, 18) * Math.exp(-r / 700);
        }

        // Color palette based on ESA Gaia natural starlight
        const col = new THREE.Color();
        if (isCore) {
            col.setHSL(0.11 + Math.random() * 0.05, 0.85, 0.82); // Warm golden ivory
        } else if (Math.random() > 0.82) {
            col.setHSL(0.58 + Math.random() * 0.05, 0.75, 0.85); // Young blue/azure clusters
        } else if (Math.random() > 0.94) {
            col.setHSL(0.96, 0.8, 0.75); // Rose H II knots
        } else {
            col.setHSL(0.12, 0.35, 0.88); // Natural starlight warm white
        }

        const size = isCore ? rnd(9.0, 16.0) : rnd(5.0, 10.0);

        // Escape tail sensitivity (outer stars have higher vulnerability to tidal forces)
        const tidalSensitivity = Math.pow(Math.max(0, (r - 180) / 720), 1.8);
        const escapeDir = Math.random() > 0.5 ? 1 : -1;

        mwInitial.push({
            r0: r,
            phi0: phi,
            z0: z,
            omega: (140 / (r + 80)) * 0.9,
            tidalSensitivity,
            escapeDir,
            col,
            baseSize: size,
            ellipticalDispersion: new THREE.Vector3(rndNormal(0, 1), rndNormal(0, 0.8), rndNormal(0, 1)).normalize()
        });
    }

    // 2. Initialize Andromeda (M31) Particles (Vast massive disk, optimized ~9,500 particles)
    // Andromeda disk inclination matrix (tilted ~77 degrees)
    const andRotationMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.72, 0.45, -0.65));

    for (let i = 0; i < COUNT_AND; i++) {
        const isCore = i < 2200;
        let r, phi, z;

        if (isCore) {
            r = Math.pow(Math.random(), 2.0) * 280;
            phi = Math.random() * Math.PI * 2;
            z = rndNormal(0, 60) * (1 - r / 300);
        } else {
            const arm = i % 2;
            const t = Math.pow(Math.random(), 1.15);
            r = 190 + t * 960; // Andromeda is significantly larger than MW
            const armOffset = (arm * Math.PI) + 1.85 * Math.log(t * 8 + 1);
            phi = armOffset + rndNormal(0, 0.25);
            z = rndNormal(0, 22) * Math.exp(-r / 900);
        }

        const col = new THREE.Color();
        if (isCore) {
            col.setHSL(0.13, 0.9, 0.85); // Brilliant bright cream core
        } else if (Math.random() > 0.80) {
            col.setHSL(0.57, 0.8, 0.86); // Azure stars
        } else {
            col.setHSL(0.12, 0.3, 0.84); // Disk stars
        }

        const size = isCore ? rnd(9.5, 17.0) : rnd(5.0, 10.5);
        const tidalSensitivity = Math.pow(Math.max(0, (r - 220) / 930), 1.7);
        const escapeDir = Math.random() > 0.5 ? 1 : -1;

        andInitial.push({
            r0: r,
            phi0: phi,
            z0: z,
            omega: (160 / (r + 100)) * 0.85,
            tidalSensitivity,
            escapeDir,
            col,
            baseSize: size,
            ellipticalDispersion: new THREE.Vector3(rndNormal(0, 1), rndNormal(0, 0.85), rndNormal(0, 1)).normalize()
        });
    }

    // 3. Initialize Starburst Particles (Optimized ~1,800 gas shock particles)
    for (let i = 0; i < COUNT_STARBURST; i++) {
        starburstInitial.push({
            offset: new THREE.Vector3(rndNormal(0, 220), rndNormal(0, 120), rndNormal(0, 220)),
            phaseOffset: Math.random() * Math.PI * 2,
            speed: rnd(0.6, 1.8),
            baseCol: new THREE.Color().setHSL(Math.random() > 0.4 ? 0.92 : 0.52, 0.95, 0.75),
            size: rnd(12.0, 26.0)
        });
    }

    // Create Particle Buffer Geometry
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 8.0,
        vertexColors: true,
        map: particleTexture,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    experimentGroup.add(particlePoints);

    // =========================================================================
    // PHOTOREALISTIC GALAXY DISCS (MATCHING MAIN SIMULATOR VISUALS & ESA DATA)
    // =========================================================================
    // 1. Milky Way Photorealistic Disc (Barred Spiral, ESA Gaia starlight)
    const mwTexture = buatTeksturGalaksi({
        inti: '#fff2df',
        bar: '#f5d098',
        lengan: '#faf3eb',
        debu: '#120c08',
        tepi: '#adcbf8'
    }, 'spiral_berpalang', 2048);

    const mwDiscGeo = new THREE.PlaneGeometry(1600, 1600);
    const mwDiscMat = new THREE.MeshBasicMaterial({
        map: mwTexture,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const mwDiscMesh = new THREE.Mesh(mwDiscGeo, mwDiscMat);
    mwDiscMesh.rotation.x = -Math.PI / 2;
    experimentGroup.add(mwDiscMesh);

    // 2. Andromeda (M31) Photorealistic Disc (Massive Grand Spiral, 77-deg tilt)
    const andTexture = buatTeksturGalaksi({
        inti: '#fff6ea',
        bar: '#ffe7c4',
        lengan: '#ded5c8',
        debu: '#151010',
        tepi: '#b5d4f5'
    }, 'spiral', 2048);

    const andDiscGeo = new THREE.PlaneGeometry(2100, 2100);
    const andDiscMat = new THREE.MeshBasicMaterial({
        map: andTexture,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const andDiscMesh = new THREE.Mesh(andDiscGeo, andDiscMat);
    andDiscMesh.rotation.set(0.72, 0.45, -0.65);
    experimentGroup.add(andDiscMesh);

    // 3. Newly Formed Galaxy Milkomeda Disc (Post-Merger Giant Elliptical)
    const milkomedaTexture = buatTeksturMilkomeda(2048);
    const milkomedaDiscGeo = new THREE.PlaneGeometry(2600, 2600);
    const milkomedaDiscMat = new THREE.MeshBasicMaterial({
        map: milkomedaTexture,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const milkomedaDiscMesh = new THREE.Mesh(milkomedaDiscGeo, milkomedaDiscMat);
    milkomedaDiscMesh.rotation.x = -Math.PI / 2;
    experimentGroup.add(milkomedaDiscMesh);

    // 4. Radiant Starburst Shockwave Flash (Expanding Shimmering Core Burst)
    const flashGeo = new THREE.SphereGeometry(180, 32, 32);
    const flashMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const starburstFlash = new THREE.Mesh(flashGeo, flashMat);
    experimentGroup.add(starburstFlash);

    // 5. Dual Relativistic Cosmic Plasma Jets
    const jetGroup = new THREE.Group();
    const jetGeo = new THREE.CylinderGeometry(10, 50, 1100, 16, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const jetNorth = new THREE.Mesh(jetGeo, jetMat);
    jetNorth.position.y = 550;
    const jetSouth = new THREE.Mesh(jetGeo, jetMat);
    jetSouth.position.y = -550;
    jetSouth.rotation.z = Math.PI;
    jetGroup.add(jetNorth, jetSouth);
    experimentGroup.add(jetGroup);

    // =========================================================================
    // SUPERMASSIVE BLACK HOLES (Sgr A* & M31*) & SOLAR SYSTEM MARKER
    // =========================================================================
    // 1. Sagittarius A* (Milky Way Center)
    const sgrAGroup = new THREE.Group();
    const sgrACore = new THREE.Mesh(
        new THREE.SphereGeometry(14, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    const sgrADisk = new THREE.Mesh(
        new THREE.RingGeometry(16, 42, 32),
        new THREE.MeshBasicMaterial({ color: 0xffaa33, side: THREE.DoubleSide, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    sgrADisk.rotation.x = Math.PI / 2;
    sgrAGroup.add(sgrACore, sgrADisk);
    experimentGroup.add(sgrAGroup);

    // 2. M31* (Andromeda Center, ~25x more massive)
    const m31Group = new THREE.Group();
    const m31Core = new THREE.Mesh(
        new THREE.SphereGeometry(22, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    const m31Disk = new THREE.Mesh(
        new THREE.RingGeometry(25, 68, 32),
        new THREE.MeshBasicMaterial({ color: 0x66ccff, side: THREE.DoubleSide, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    m31Disk.rotation.x = Math.PI / 2;
    m31Group.add(m31Core, m31Disk);
    experimentGroup.add(m31Group);

    // 3. Merged Supermassive Black Hole & Gravitational Wave Rings
    const mergerGWRing = new THREE.Mesh(
        new THREE.RingGeometry(30, 36, 48),
        new THREE.MeshBasicMaterial({ color: 0xff00aa, side: THREE.DoubleSide, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending })
    );
    mergerGWRing.rotation.x = Math.PI / 2;
    experimentGroup.add(mergerGWRing);

    // 4. Solar System Tracker Beacon (Sun in the Orion Arm)
    const sunBeacon = new THREE.Group();
    const sunDot = new THREE.Mesh(
        new THREE.SphereGeometry(8, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffea00 })
    );
    const sunHalo = new THREE.Mesh(
        new THREE.RingGeometry(14, 26, 24),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
    );
    sunHalo.rotation.x = Math.PI / 2;
    sunBeacon.add(sunDot, sunHalo);
    experimentGroup.add(sunBeacon);

    // =========================================================================
    // ASTROPHYSICAL TRAJECTORY ENGINE (ORBITAL INTEGRATION OVER TIME T)
    // =========================================================================
    /**
     * Menghitung posisi pusat kedua galaksi pada waktu t (miliar tahun)
     */
    function getGalacticCenters(t) {
        const mwCenter = new THREE.Vector3();
        const andCenter = new THREE.Vector3();

        if (t <= 4.0) {
            // Fase 1: Pendekatan Infall (0.0 -> 4.0 Ga)
            const p = t / 4.0;
            // Percepatan gravitasi nonlinier
            const easeP = Math.pow(p, 2.1);
            mwCenter.lerpVectors(new THREE.Vector3(1350, -120, -1100), new THREE.Vector3(-140, -40, 110), easeP);
            andCenter.lerpVectors(new THREE.Vector3(-1650, 180, 1350), new THREE.Vector3(160, 50, -130), easeP);
        } else if (t <= 5.2) {
            // Fase 2: Papasan Pertama & Menuju Apocenter (4.0 -> 5.2 Ga)
            const p = (t - 4.0) / 1.2;
            const easeP = Math.sin(p * Math.PI / 2); // Perlambatan saat menjauh
            mwCenter.lerpVectors(new THREE.Vector3(-140, -40, 110), new THREE.Vector3(-550, 130, 520), easeP);
            andCenter.lerpVectors(new THREE.Vector3(160, 50, -130), new THREE.Vector3(680, -160, -620), easeP);
        } else if (t <= 6.0) {
            // Fase 3: Pembalikan & Tabrakan Kedua (5.2 -> 6.0 Ga)
            const p = (t - 5.2) / 0.8;
            const easeP = Math.pow(p, 1.8);
            mwCenter.lerpVectors(new THREE.Vector3(-550, 130, 520), new THREE.Vector3(-45, 15, 30), easeP);
            andCenter.lerpVectors(new THREE.Vector3(680, -160, -620), new THREE.Vector3(50, -20, -35), easeP);
        } else {
            // Fase 4 & 5: Damped Inspiral & Coalescence (6.0 -> 7.0 Ga)
            const p = (t - 6.0) / 1.0;
            const decay = Math.exp(-p * 4.5);
            const angle = p * 16.0;
            const sep = 75 * decay;

            mwCenter.set(Math.cos(angle) * sep, Math.sin(angle * 0.7) * sep * 0.35, Math.sin(angle) * sep);
            andCenter.set(-Math.cos(angle) * sep * 1.1, -Math.sin(angle * 0.7) * sep * 0.4, -Math.sin(angle) * sep * 1.1);
        }

        return { mwCenter, andCenter };
    }

    /**
     * Hitung posisi Matahari sepanjang tabrakan
     */
    function getSunPosition(t, mwCenter, andCenter) {
        const sunPos = new THREE.Vector3();
        const baseSunR = 260; // 26,000 ly from Sgr A* in Orion Spur
        const baseAngle = 1.1 + t * 0.35; // Sun's galactic orbit

        if (t <= 3.8) {
            // Masih di piringan Lengan Orion Bima Sakti
            sunPos.set(
                mwCenter.x + Math.cos(baseAngle) * baseSunR,
                mwCenter.y + 12,
                mwCenter.z + Math.sin(baseAngle) * baseSunR
            );
        } else if (t <= 5.4) {
            // Terlempar oleh gaya pasang surut gravitasi ke ekor pasang surut luar
            const p = (t - 3.8) / 1.6;
            const tailR = baseSunR + p * 620;
            const tailAngle = baseAngle + p * 1.8;
            sunPos.set(
                mwCenter.x + Math.cos(tailAngle) * tailR - p * 300,
                mwCenter.y + p * 180,
                mwCenter.z + Math.sin(tailAngle) * tailR + p * 350
            );
        } else {
            // Berorbit di halo luar galaksi Milkomeda (aman, tanpa tabrakan bintang)
            const p = (t - 5.4) / 1.6;
            const haloR = 750 + Math.sin(p * 3) * 60;
            const orbitAngle = baseAngle + 2.5 + p * 1.2;
            sunPos.set(
                Math.cos(orbitAngle) * haloR,
                Math.sin(orbitAngle * 0.8) * 320,
                Math.sin(orbitAngle) * haloR
            );
        }
        return sunPos;
    }

    /**
     * Update Seluruh Posisi Partikel Berdasarkan Waktu Simulasi t
     */
    function updateSimulation(t) {
        simTime = Math.max(0.0, Math.min(7.0, t));
        const { mwCenter, andCenter } = getGalacticCenters(simTime);

        // 1. Update Black Holes
        sgrAGroup.position.copy(mwCenter);
        m31Group.position.copy(andCenter);
        sgrADisk.rotation.z += 0.04;
        m31Disk.rotation.z += 0.03;

        // 1b. Update Photorealistic Discs & Post-Collision Starburst Flash
        mwDiscMesh.position.copy(mwCenter);
        mwDiscMesh.rotation.z = simTime * 0.4;
        andDiscMesh.position.copy(andCenter);
        andDiscMesh.rotation.z = -simTime * 0.35;

        const midPoint = new THREE.Vector3().addVectors(mwCenter, andCenter).multiplyScalar(0.5);

        if (simTime <= 3.8) {
            // Unperturbed stage
            mwDiscMat.opacity = 0.85;
            andDiscMat.opacity = 0.88;
            milkomedaDiscMat.opacity = 0.0;
            starburstFlash.material.opacity = 0.0;
            jetMat.opacity = 0.0;
        } else if (simTime <= 5.6) {
            // First encounter and tidal tail ripping: discs warp and soften
            const p = (simTime - 3.8) / 1.8;
            mwDiscMat.opacity = 0.85 * (1 - p * 0.5);
            andDiscMat.opacity = 0.88 * (1 - p * 0.5);
            milkomedaDiscMat.opacity = 0.0;
            starburstFlash.material.opacity = 0.0;
            jetMat.opacity = 0.0;
        } else if (simTime <= 6.5) {
            // Peak second collision, blinding starburst flash & jet eruption!
            const fadeOld = Math.max(0, 1 - (simTime - 5.6) / 0.6);
            mwDiscMat.opacity = fadeOld * 0.42;
            andDiscMat.opacity = fadeOld * 0.42;

            const flashP = Math.sin(((simTime - 5.6) / 0.9) * Math.PI);
            starburstFlash.position.copy(midPoint);
            const flashScale = 1.0 + flashP * 4.5;
            starburstFlash.scale.set(flashScale, flashScale, flashScale);
            starburstFlash.material.opacity = Math.min(0.95, flashP * 1.2);
            flashMat.color.setHSL(0.56 + Math.sin(simTime * 14.0) * 0.08, 0.95, 0.92);

            // Relativistic plasma jets
            jetGroup.position.copy(midPoint);
            jetMat.opacity = flashP * 0.88;
            jetGroup.rotation.y += 0.06;

            // Milkomeda starts to bloom
            if (simTime >= 6.1) {
                const bloomP = (simTime - 6.1) / 0.4;
                milkomedaDiscMat.opacity = Math.min(0.95, bloomP * 0.85);
                const mScale = 0.5 + bloomP * 0.5;
                milkomedaDiscMesh.scale.set(mScale, mScale, mScale);
            } else {
                milkomedaDiscMat.opacity = 0.0;
            }
        } else {
            // Milkomeda fully formed & stabilized!
            mwDiscMat.opacity = 0.0;
            andDiscMat.opacity = 0.0;
            starburstFlash.material.opacity = 0.0;
            jetMat.opacity = Math.max(0, 1 - (simTime - 6.5) * 2.2) * 0.4;
            milkomedaDiscMat.opacity = 0.95;
            milkomedaDiscMesh.scale.set(1.0, 1.0, 1.0);
            milkomedaDiscMesh.rotation.z = simTime * 0.08;
        }

        // Merger Gravitational Wave Pulse when t >= 6.4
        if (simTime >= 6.4) {
            const gwP = (simTime - 6.4) / 0.6;
            mergerGWRing.visible = true;
            mergerGWRing.scale.set(1 + gwP * 25, 1 + gwP * 25, 1 + gwP * 25);
            mergerGWRing.material.opacity = Math.max(0, (1 - gwP) * 0.85);
            mergerGWRing.position.set(0, 0, 0);

            // Once merged, fade individual black holes into a single supermassive core
            const fade = Math.max(0, 1 - (simTime - 6.5) * 2.5);
            sgrADisk.material.opacity = fade * 0.9;
            m31Disk.material.opacity = fade * 0.9;
        } else {
            mergerGWRing.visible = false;
            sgrADisk.material.opacity = 0.9;
            m31Disk.material.opacity = 0.9;
        }

        // 2. Update Solar System Beacon
        const sunPos = getSunPosition(simTime, mwCenter, andCenter);
        sunBeacon.position.copy(sunPos);
        sunHalo.rotation.z += 0.02;

        // 3. Update Milky Way Particles
        let pIdx = 0;
        const posArr = positions;
        const colArr = colors;
        const szArr = sizes;

        // Perturbation parameters
        const tidalPhase = Math.max(0, simTime - 3.8);
        const mergerPhase = Math.max(0, simTime - 5.8);

        for (let i = 0; i < COUNT_MW; i++) {
            const p = mwInitial[i];
            const currentAngle = p.phi0 + p.omega * (simTime * 2.2);

            let x = Math.cos(currentAngle) * p.r0;
            let y = p.z0;
            let z = Math.sin(currentAngle) * p.r0;

            if (tidalPhase > 0) {
                // Tidal stream deformation (bridges and sweeping counter-tails)
                const str = Math.min(1.0, tidalPhase / 1.6) * p.tidalSensitivity;
                if (p.escapeDir > 0) {
                    // Tidal tail flying outwards
                    x += Math.cos(currentAngle + tidalPhase * 1.5) * (str * 750);
                    y += Math.sin(tidalPhase * 1.8) * (str * 320);
                    z += Math.sin(currentAngle + tidalPhase * 1.5) * (str * 750);
                } else {
                    // Tidal bridge pulled towards Andromeda
                    const toAnd = new THREE.Vector3().subVectors(andCenter, mwCenter).normalize();
                    x += toAnd.x * (str * 580);
                    y += toAnd.y * (str * 250);
                    z += toAnd.z * (str * 580);
                }
            }

            // Relaxation into Milkomeda Elliptical Galaxy
            if (mergerPhase > 0) {
                const mergeBlend = Math.min(1.0, mergerPhase / 1.0);
                const ellipR = p.r0 * (0.85 + Math.sin(i) * 0.4) * (1 + mergeBlend * 0.35);
                const targetX = p.ellipticalDispersion.x * ellipR;
                const targetY = p.ellipticalDispersion.y * ellipR * 0.75;
                const targetZ = p.ellipticalDispersion.z * ellipR;

                x = THREE.MathUtils.lerp(x, targetX, mergeBlend);
                y = THREE.MathUtils.lerp(y, targetY, mergeBlend);
                z = THREE.MathUtils.lerp(z, targetZ, mergeBlend);
            }

            // World position
            if (mergerPhase >= 1.0) {
                posArr[pIdx * 3] = x;
                posArr[pIdx * 3 + 1] = y;
                posArr[pIdx * 3 + 2] = z;
            } else {
                const blendCenter = Math.min(1.0, mergerPhase / 1.0);
                posArr[pIdx * 3] = THREE.MathUtils.lerp(mwCenter.x + x, x, blendCenter);
                posArr[pIdx * 3 + 1] = THREE.MathUtils.lerp(mwCenter.y + y, y, blendCenter);
                posArr[pIdx * 3 + 2] = THREE.MathUtils.lerp(mwCenter.z + z, z, blendCenter);
            }

            colArr[pIdx * 3] = p.col.r;
            colArr[pIdx * 3 + 1] = p.col.g;
            colArr[pIdx * 3 + 2] = p.col.b;
            szArr[pIdx] = p.baseSize;

            pIdx++;
        }

        // 4. Update Andromeda Particles
        for (let i = 0; i < COUNT_AND; i++) {
            const p = andInitial[i];
            const currentAngle = p.phi0 + p.omega * (simTime * 2.0);

            // Local disk coordinate
            let localVec = new THREE.Vector3(
                Math.cos(currentAngle) * p.r0,
                p.z0,
                Math.sin(currentAngle) * p.r0
            );

            // Apply Andromeda's initial 77-degree tilt
            localVec.applyMatrix4(andRotationMatrix);

            if (tidalPhase > 0) {
                const str = Math.min(1.0, tidalPhase / 1.6) * p.tidalSensitivity;
                if (p.escapeDir > 0) {
                    localVec.x -= (str * 900) * Math.sin(tidalPhase * 1.4);
                    localVec.y += (str * 420);
                    localVec.z += (str * 850) * Math.cos(tidalPhase * 1.4);
                } else {
                    const toMW = new THREE.Vector3().subVectors(mwCenter, andCenter).normalize();
                    localVec.addScaledVector(toMW, str * 680);
                }
            }

            if (mergerPhase > 0) {
                const mergeBlend = Math.min(1.0, mergerPhase / 1.0);
                const ellipR = p.r0 * (0.95 + Math.cos(i) * 0.45) * (1 + mergeBlend * 0.4);
                const targetX = p.ellipticalDispersion.x * ellipR;
                const targetY = p.ellipticalDispersion.y * ellipR * 0.8;
                const targetZ = p.ellipticalDispersion.z * ellipR;

                localVec.lerp(new THREE.Vector3(targetX, targetY, targetZ), mergeBlend);
            }

            if (mergerPhase >= 1.0) {
                posArr[pIdx * 3] = localVec.x;
                posArr[pIdx * 3 + 1] = localVec.y;
                posArr[pIdx * 3 + 2] = localVec.z;
            } else {
                const blendCenter = Math.min(1.0, mergerPhase / 1.0);
                posArr[pIdx * 3] = THREE.MathUtils.lerp(andCenter.x + localVec.x, localVec.x, blendCenter);
                posArr[pIdx * 3 + 1] = THREE.MathUtils.lerp(andCenter.y + localVec.y, localVec.y, blendCenter);
                posArr[pIdx * 3 + 2] = THREE.MathUtils.lerp(andCenter.z + localVec.z, localVec.z, blendCenter);
            }

            colArr[pIdx * 3] = p.col.r;
            colArr[pIdx * 3 + 1] = p.col.g;
            colArr[pIdx * 3 + 2] = p.col.b;
            szArr[pIdx] = p.baseSize;

            pIdx++;
        }

        // 5. Update Starburst Particles (Gas Shock & Intense Star Formation)
        // High intensity during collisions (t around 4.0 - 4.5 and 5.8 - 6.4)
        let starburstAlpha = 0.05;
        if (simTime >= 3.8 && simTime <= 4.7) {
            starburstAlpha = 0.85 * Math.sin(((simTime - 3.8) / 0.9) * Math.PI);
        } else if (simTime >= 5.6 && simTime <= 6.5) {
            starburstAlpha = 1.0 * Math.sin(((simTime - 5.6) / 0.9) * Math.PI);
        }

        const midPoint = new THREE.Vector3().addVectors(mwCenter, andCenter).multiplyScalar(0.5);

        for (let i = 0; i < COUNT_STARBURST; i++) {
            const p = starburstInitial[i];
            const spread = 1.0 + starburstAlpha * 2.2;
            const px = midPoint.x + p.offset.x * spread;
            const py = midPoint.y + p.offset.y * spread;
            const pz = midPoint.z + p.offset.z * spread;

            posArr[pIdx * 3] = px;
            posArr[pIdx * 3 + 1] = py;
            posArr[pIdx * 3 + 2] = pz;

            // Flash starburst colors when collisions ignite gas
            colArr[pIdx * 3] = p.baseCol.r * (0.2 + starburstAlpha * 1.5);
            colArr[pIdx * 3 + 1] = p.baseCol.g * (0.2 + starburstAlpha * 1.5);
            colArr[pIdx * 3 + 2] = p.baseCol.b * (0.2 + starburstAlpha * 1.5);
            szArr[pIdx] = p.size * (0.4 + starburstAlpha * 1.6);

            pIdx++;
        }

        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.color.needsUpdate = true;
        particleGeometry.attributes.size.needsUpdate = true;
    }

    // Phase Data and Scientific Facts
    const PHASES = [
        {
            fase: 1,
            waktu: 0.0,
            rentang: "T = 0.0 - 3.8 Miliar Tahun",
            judul: "Masa Kini & Pendekatan Gravitasi",
            jarak: "2.500.000 Tahun Cahaya",
            kecepatan: "110 km/detik",
            starburst: "Normal (1 - 2 Massa Matahari/thn)",
            surya: "Berada tenang di Lengan Orion Bima Sakti (26.000 ly dari Sgr A*).",
            deskripsi: "Bima Sakti dan Andromeda saling mendekat di bawah tarikan gravitasi timbal balik dan materi gelap (Dark Matter). Dari Bumi, Andromeda tampak sebagai bercak samar di langit malam."
        },
        {
            fase: 2,
            waktu: 4.2,
            rentang: "T = 3.9 - 4.6 Miliar Tahun",
            judul: "Papasan Pertama & Ekor Pasang Surut",
            jarak: "120.000 Tahun Cahaya (Saling Menerobos)",
            kecepatan: "420 km/detik (Puncak)",
            starburst: "Tinggi (>40 Massa Matahari/thn)",
            surya: "Terdorong oleh gangguan pasang surut gravitasi ke jembatan materi terluar.",
            deskripsi: "Kedua piringan galaksi saling menembus. Gaya pasang surut gravitasi mencabik lengan spiral dan melontarkan miliaran bintang menjadi ekor pasang surut raksasa (tidal tails) dan jembatan antargalaksi."
        },
        {
            fase: 3,
            waktu: 5.2,
            rentang: "T = 4.7 - 5.6 Miliar Tahun",
            judul: "Pembalikan Apocenter & Gesekan Dinamis",
            jarak: "850.000 Tahun Cahaya (Titik Balik)",
            kecepatan: "160 km/detik (Melambat)",
            starburst: "Sedang (10 - 20 Massa Matahari/thn)",
            surya: "Melayang di pita bintang pasang surut yang melengkung indah di ruang antargalaksi.",
            deskripsi: "Setelah papasan pertama, kedua inti galaksi saling menjauh hingga mencapai jarak apocenter. Namun, gesekan dinamis materi gelap menahan momentum keduanya dan menariknya kembali."
        },
        {
            fase: 4,
            waktu: 6.0,
            rentang: "T = 5.7 - 6.4 Miliar Tahun",
            judul: "Tabrakan Frontal & Kilau Ledakan Starburst",
            jarak: "30.000 Tahun Cahaya (Plunge Frontal)",
            kecepatan: "500 km/detik",
            starburst: "Ekstrem (>120 Massa Matahari/thn)",
            surya: "Matahari melintas di kawasan luar; langit dipenuhi ledakan kilau jutaan bintang baru yang membara.",
            deskripsi: "Tabrakan kedua terjadi secara frontal. Awan gas molekuler bertubrukan hebat, memicu kompresi gelombang kejut, ledakan kilau cahaya starburst yang berpendar terang menyilaukan, dan semburan jet plasma relativistik dari lubang hitam."
        },
        {
            fase: 5,
            waktu: 6.8,
            rentang: "T = 6.5 - 7.0+ Miliar Tahun",
            judul: "Kelahiran Galaksi Baru: Milkomeda",
            jarak: "0 Tahun Cahaya (Tersatukan Sempurna)",
            kecepatan: "Stabil / Relaksasi Virial",
            starburst: "Tenang (Gas Telah Menyatu Menjadi Bintang Baru)",
            surya: "Tersapu aman ke halo luar Milkomeda (~85.000 ly) tanpa pernah bertabrakan fisik dengan bintang lain.",
            deskripsi: "Setelah ledakan kilau mereda, seluruh materi bintang berelaksasi membentuk galaksi eliptis raksasa baru: Milkomeda (Mildromeda). Lubang hitam Sgr A* dan M31* menyatu menjadi satu supermassive black hole tunggal di jantung Milkomeda."
        }
    ];

    function getCurrentPhaseInfo(t) {
        if (t < 3.9) return PHASES[0];
        if (t < 4.7) return PHASES[1];
        if (t < 5.6) return PHASES[2];
        if (t < 6.4) return PHASES[3];
        return PHASES[4];
    }

    // Callbacks for UI
    let onStateChangeCallback = null;

    function notifyStateChange() {
        if (onStateChangeCallback) {
            const phaseInfo = getCurrentPhaseInfo(simTime);
            onStateChangeCallback({
                simTime,
                isPlaying,
                speedMultiplier,
                phaseInfo
            });
        }
    }

    return {
        startExperiment(onStateChange) {
            if (isRunning) return;
            isRunning = true;
            onStateChangeCallback = onStateChange;

            // Save camera state
            savedCameraPos.copy(camera.position);
            savedTargetPos.copy(controls.target);

            // Hide normal universe objects
            for (let i = 0; i < scene.children.length; i++) {
                const child = scene.children[i];
                if (child !== experimentGroup && !child.isLight) {
                    child.userData._prevVisible = child.visible;
                    child.visible = false;
                }
            }

            experimentGroup.visible = true;

            // Animate camera to overview position
            const startCam = camera.position.clone();
            const startTarget = controls.target.clone();
            const targetCam = new THREE.Vector3(0, 2400, 3600);
            const targetLook = new THREE.Vector3(0, 0, 0);
            const startTime = performance.now();
            const duration = 1500;

            function flyStep(now) {
                const p = Math.min((now - startTime) / duration, 1.0);
                const ease = 1 - Math.pow(1 - p, 3);
                camera.position.lerpVectors(startCam, targetCam, ease);
                controls.target.lerpVectors(startTarget, targetLook, ease);
                controls.update();
                if (p < 1.0) requestAnimationFrame(flyStep);
            }
            requestAnimationFrame(flyStep);

            // Initialize simulation at current time
            updateSimulation(simTime);
            isPlaying = true;
            notifyStateChange();
        },

        stopExperiment() {
            if (!isRunning) return;
            isRunning = false;
            isPlaying = false;
            experimentGroup.visible = false;

            // Restore normal universe objects
            for (let i = 0; i < scene.children.length; i++) {
                const child = scene.children[i];
                if (child !== experimentGroup && !child.isLight && child.userData._prevVisible !== undefined) {
                    child.visible = child.userData._prevVisible;
                }
            }

            // Restore camera
            const startCam = camera.position.clone();
            const startTarget = controls.target.clone();
            const startTime = performance.now();
            const duration = 1200;

            function flyBackStep(now) {
                const p = Math.min((now - startTime) / duration, 1.0);
                const ease = 1 - Math.pow(1 - p, 3);
                camera.position.lerpVectors(startCam, savedCameraPos, ease);
                controls.target.lerpVectors(startTarget, savedTargetPos, ease);
                controls.update();
                if (p < 1.0) requestAnimationFrame(flyBackStep);
            }
            requestAnimationFrame(flyBackStep);
        },

        setTime(t) {
            updateSimulation(t);
            notifyStateChange();
        },

        setPlaying(playing) {
            isPlaying = playing;
            notifyStateChange();
        },

        togglePlay() {
            isPlaying = !isPlaying;
            notifyStateChange();
            return isPlaying;
        },

        setSpeed(spd) {
            speedMultiplier = spd;
            notifyStateChange();
        },

        jumpToPhase(phaseNumber) {
            const p = PHASES.find(x => x.fase === phaseNumber);
            if (p) {
                this.setTime(p.waktu);
            }
        },

        reset() {
            this.setTime(0.0);
            isPlaying = false;
            notifyStateChange();
        },

        update(delta) {
            if (!isRunning) return;

            if (isPlaying) {
                // Advance time: 1 second of real time corresponds to ~0.15 Ga at 1x speed
                let nextTime = simTime + delta * 0.16 * speedMultiplier;
                if (nextTime > 7.0) {
                    nextTime = 0.0; // Loop seamlessly
                }
                updateSimulation(nextTime);
                notifyStateChange();
            } else {
                // Subtle accretion disk spin even when paused
                sgrADisk.rotation.z += delta * 0.5;
                m31Disk.rotation.z += delta * 0.4;
                sunHalo.rotation.z += delta * 0.3;
            }
        },

        isRunning() { return isRunning; },
        isPlaying() { return isPlaying; },
        getTime() { return simTime; },
        getSpeed() { return speedMultiplier; }
    };
}
