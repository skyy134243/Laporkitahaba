import * as THREE from 'three';
import { daftar49Galaksi } from '../data/galaxiesData.js';
import { buatTeksturGalaksi, buatTeksturPartikelBundar } from './textureGenerator.js';

export function createGalaxyFactory(scene, interactiveObjects) {
    const galaxyGroups = [];
    const galaxyMeshMap = new Map();
    const spriteTex = buatTeksturPartikelBundar();

    function acakGaussian(mean = 0, std = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
    }

    // Build 3D volumetric particle system for a galaxy
    function buildGalaxyVolumetric(galaxy) {
        const radius = galaxy.ukuranVisual;
        const style = galaxy.gayaVisual;
        const colorCore = new THREE.Color(galaxy.skemaWarna.inti);
        const colorArm = new THREE.Color(galaxy.skemaWarna.lengan);
        const colorBar = new THREE.Color(galaxy.skemaWarna.bar || galaxy.skemaWarna.inti);
        const colorEdge = new THREE.Color(galaxy.skemaWarna.tepi || galaxy.skemaWarna.lengan);

        const group = new THREE.Group();
        group.position.set(galaxy.posisi3D.x, galaxy.posisi3D.y, galaxy.posisi3D.z);

        // Adjust particle count dynamically based on visual importance
        let particleCount = 1200;
        if (galaxy.id === 'milky-way') particleCount = 28000;
        else if (galaxy.id === 'andromeda') particleCount = 18000;
        else if (galaxy.id === 'triangulum') particleCount = 9000;
        else if (galaxy.kategoriMorfologi === 'Spiral') particleCount = 4500;
        else if (galaxy.kategoriMorfologi === 'Eliptis') particleCount = 2800;
        else particleCount = 1600;

        const positions = [];
        const colors = [];

        if (style === 'katai_sferoid' || style === 'eliptis_kompak') {
            // Spheroidal / Elliptical 3D distribution
            const isElongated = style === 'eliptis_kompak';
            for (let i = 0; i < particleCount; i++) {
                const u = Math.random(), v = Math.random();
                const theta = u * Math.PI * 2;
                const phi = Math.acos(2 * v - 1);
                const rNorm = Math.pow(Math.random(), 0.75);
                const r = rNorm * radius * 0.9;

                const x = r * Math.sin(phi) * Math.cos(theta) * (isElongated ? 1.35 : 1.0);
                const y = r * Math.cos(phi) * 0.75;
                const z = r * Math.sin(phi) * Math.sin(theta);

                positions.push(x, y, z);

                const c = new THREE.Color().lerpColors(colorCore, colorEdge, rNorm);
                const brightness = 0.4 + (1 - rNorm) * 0.6;
                colors.push(c.r * brightness, c.g * brightness, c.b * brightness);
            }
        } else if (style === 'ireguler') {
            // Asymmetric irregular distribution with clumpy OB associations
            const numClumps = 6 + Math.floor(Math.random() * 8);
            const clumpCenters = [];
            for (let c = 0; c < numClumps; c++) {
                clumpCenters.push({
                    x: (Math.random() - 0.5) * radius * 0.8,
                    y: (Math.random() - 0.5) * radius * 0.25,
                    z: (Math.random() - 0.5) * radius * 0.8,
                    r: (0.15 + Math.random() * 0.25) * radius,
                    color: Math.random() > 0.4 ? colorArm : colorCore
                });
            }

            for (let i = 0; i < particleCount; i++) {
                const clump = clumpCenters[Math.floor(Math.random() * clumpCenters.length)];
                const x = clump.x + acakGaussian(0, clump.r * 0.4);
                const y = clump.y + acakGaussian(0, clump.r * 0.2);
                const z = clump.z + acakGaussian(0, clump.r * 0.4);

                positions.push(x, y, z);

                const c = clump.color.clone();
                const brightness = 0.5 + Math.random() * 0.5;
                colors.push(c.r * brightness, c.g * brightness, c.b * brightness);
            }
        } else {
            // Spiral / Barred Spiral / Flocculent
            const numArms = style === 'flocculent' ? 6 : 4;
            const barAngle = 0.6;

            // Bar particles
            if (style === 'spiral_berpalang') {
                const barCount = Math.round(particleCount * 0.18);
                for (let i = 0; i < barCount; i++) {
                    const len = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), 0.7) * radius * 0.35;
                    const w = (1 - Math.abs(len) / (radius * 0.36)) * radius * 0.08;
                    const xLocal = len;
                    const zLocal = acakGaussian(0, w * 0.5);
                    const y = acakGaussian(0, radius * 0.04);

                    const x = xLocal * Math.cos(barAngle) - zLocal * Math.sin(barAngle);
                    const z = xLocal * Math.sin(barAngle) + zLocal * Math.cos(barAngle);

                    positions.push(x, y, z);
                    const c = new THREE.Color().lerpColors(colorCore, colorBar, Math.random());
                    colors.push(c.r * 0.9, c.g * 0.9, c.b * 0.9);
                }
            }

            // Arm particles
            const armCount = Math.round(particleCount * 0.82);
            for (let i = 0; i < armCount; i++) {
                const arm = i % numArms;
                const offset = (arm / numArms) * Math.PI * 2 + barAngle;
                const rNorm = Math.pow(Math.random(), 1.6);
                const r = radius * 0.08 + rNorm * radius * 0.92;

                const spiralTurn = 2.8 * Math.log(rNorm * 10 + 1);
                const theta = offset + spiralTurn + acakGaussian(0, 0.18);

                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;
                const y = acakGaussian(0, (1 - rNorm) * radius * 0.05 + radius * 0.015);

                positions.push(x, y, z);

                let c;
                const rnd = Math.random();
                if (rnd > 0.92) {
                    c = new THREE.Color(0xff8ab2); // HII starburst
                } else if (rnd > 0.7) {
                    c = colorEdge.clone(); // young blue/violet stars
                } else {
                    c = new THREE.Color().lerpColors(colorCore, colorArm, rNorm);
                }
                const brightness = 0.5 + (1 - rNorm * 0.5) * 0.5;
                colors.push(c.r * brightness, c.g * brightness, c.b * brightness);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            map: spriteTex,
            size: Math.max(1.8, radius * 0.005),
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            sizeAttenuation: true,
            blending: THREE.NormalBlending
        });

        const pointsMesh = new THREE.Points(geo, mat);
        group.add(pointsMesh);

        // Photographic backdrop plane
        const tex = buatTeksturGalaksi(galaxy.skemaWarna, galaxy.gayaVisual, 1024);
        const planeMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), planeMat);
        plane.rotation.x = Math.PI / 2.4;
        plane.rotation.z = Math.random() * 0.6;
        group.add(plane);

        // Interactive bounding collider sphere
        const colliderGeo = new THREE.SphereGeometry(radius * 0.95, 12, 12);
        const colliderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, wireframe: false });
        const collider = new THREE.Mesh(colliderGeo, colliderMat);

        collider.userData = {
            id: galaxy.id,
            nama: galaxy.nama,
            kategori: "Galaksi",
            tipe: `${galaxy.tipeMorfologi} · Subgrup ${galaxy.subgrup}`,
            desc: galaxy.desc,
            fakta: galaxy.fakta,
            data: {
                "Tipe Morfologi": galaxy.tipeMorfologi,
                "Jarak dari Bumi": galaxy.jarakTercatat,
                "Diameter": `≈${galaxy.diameterLy.toLocaleString()} tahun cahaya`,
                "Estimasi Bintang": galaxy.estimasiBintang,
                "Rasi Bintang": galaxy.rasi,
                "Kecepatan Radial": galaxy.kecepatanRadial,
                "Penemu / Sejarah": galaxy.penemu,
                ...galaxy.data
            },
            sumber: "NASA/IPAC Extragalactic Database (NED) · Gaia DR3 · Hubble"
        };
        interactiveObjects.push(collider);
        group.add(collider);

        galaxyMeshMap.set(galaxy.id, collider);
        scene.add(group);
        galaxyGroups.push({ group, galaxy, rotSpeed: 0.00003 + (Math.random() * 0.00003) });

        return group;
    }

    // Connect Cosmic Web Filaments (Gravitational bridges between galaxy clusters)
    function buildCosmicWebFilaments() {
        const linesGroup = new THREE.Group();
        const mwPos = new THREE.Vector3(0, 0, -15000);
        const andPos = new THREE.Vector3(-22800, 8360, 29640);
        const triPos = new THREE.Vector3(-7744, 9680, 20812);

        // Backbone filaments between Milky Way, Andromeda, and Triangulum
        const majorFilaments = [
            [mwPos, andPos],
            [andPos, triPos],
            [triPos, mwPos]
        ];

        const lineMat = new THREE.LineBasicMaterial({
            color: 0x6b46c1,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending
        });

        majorFilaments.forEach(([p1, p2]) => {
            const points = [];
            const count = 30;
            for (let i = 0; i <= count; i++) {
                const t = i / count;
                const p = new THREE.Vector3().lerpVectors(p1, p2, t);
                p.x += (Math.sin(t * Math.PI) * 400);
                p.y += (Math.sin(t * Math.PI * 2) * 250);
                points.push(p);
            }
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            linesGroup.add(new THREE.Line(geo, lineMat));
        });

        // Delicate filament branches to satellites and isolated dwarf galaxies
        const branchMat = new THREE.LineBasicMaterial({
            color: 0x4299e1,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending
        });

        daftar49Galaksi.forEach(g => {
            if (g.id === 'milky-way' || g.id === 'andromeda' || g.id === 'triangulum') return;
            let center = mwPos;
            if (g.subgrup === 'Andromeda') center = andPos;
            else if (g.subgrup === 'Triangulum') center = triPos;

            const targetPos = new THREE.Vector3(g.posisi3D.x, g.posisi3D.y, g.posisi3D.z);
            const geo = new THREE.BufferGeometry().setFromPoints([center, targetPos]);
            linesGroup.add(new THREE.Line(geo, branchMat));
        });

        scene.add(linesGroup);
        return linesGroup;
    }

    function initGalaxies() {
        for (let i = 0; i < daftar49Galaksi.length; i++) {
            buildGalaxyVolumetric(daftar49Galaksi[i]);
        }
        buildCosmicWebFilaments();
    }

    function update(delta) {
        for (let i = 0; i < galaxyGroups.length; i++) {
            galaxyGroups[i].group.rotation.y += galaxyGroups[i].rotSpeed;
        }
    }

    function getGalaxyMesh(id) {
        return galaxyMeshMap.get(id);
    }

    return {
        initGalaxies,
        update,
        getGalaxyMesh
    };
}
