import * as THREE from 'three';
import { daftar49Galaksi } from '../data/galaxiesData.js';
import { daftarObjekDalamGalaksi } from '../data/internalObjectsData.js';
import { buatTeksturGalaksi, buatTeksturPartikelBundar } from './textureGenerator.js';

export function createGalaxyFactory(scene, interactiveObjects) {
    const galaxyGroups = [];
    const galaxyMeshMap = new Map();
    const internalObjectMeshes = [];
    const spriteTex = buatTeksturPartikelBundar();

    function acakGaussian(mean = 0, std = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
    }

    // Color gradient based on ESA Gaia DR3 "Anatomy of the Milky Way"
    const stopGradienGaia = [
        { t: 0.00, c: new THREE.Color(0xfff3d6) }, // Inti — kuning-emas hangat
        { t: 0.14, c: new THREE.Color(0xffd9a0) }, // Bulge — keemasan bersinar
        { t: 0.30, c: new THREE.Color(0xe0b8a8) }, // Area dalam — jambu-tan berdebu
        { t: 0.45, c: new THREE.Color(0xab8a9a) }, // Batas setengah diameter — ungu-abu pudar
        { t: 0.62, c: new THREE.Color(0x8a7a92) }, // Lengan tengah — mauve-abu
        { t: 0.80, c: new THREE.Color(0x6f6478) }, // Lengan luar — abu-ungu redup
        { t: 1.00, c: new THREE.Color(0x4a4552) }  // Ujung lengan — abu gelap keunguan
    ];

    const stopGradienAndromeda = [
        { t: 0.00, c: new THREE.Color(0xfff2c8) }, // Inti M31 — kuning-emas terang
        { t: 0.15, c: new THREE.Color(0xf0c98a) }, // Bulge — keemasan berdebu
        { t: 0.35, c: new THREE.Color(0xd4926a) }, // Lengan dalam — pita debu cokelat-jingga
        { t: 0.55, c: new THREE.Color(0xb07aa0) }, // Lengan tengah — mauve-magenta
        { t: 0.75, c: new THREE.Color(0x8a63c8) }, // Lengan luar — ungu-biru
        { t: 1.00, c: new THREE.Color(0x5c3f96) }  // Tepi cakram — ungu nila
    ];

    const stopGradienTriangulum = [
        { t: 0.00, c: new THREE.Color(0xfdf6e0) }, // Inti pucat kekuningan
        { t: 0.20, c: new THREE.Color(0xbcd9ee) }, // Lengan dalam — biru-putih
        { t: 0.50, c: new THREE.Color(0x7ec8e3) }, // Lengan sian
        { t: 0.80, c: new THREE.Color(0x4a78b0) }, // Lengan luar — biru
        { t: 1.00, c: new THREE.Color(0x2c3f6e) }  // Tepi — biru nila gelap
    ];

    function warnaRadial(t, gradien) {
        t = THREE.MathUtils.clamp(t, 0, 1);
        for (let i = 0; i < gradien.length - 1; i++) {
            const a = gradien[i], b = gradien[i + 1];
            if (t >= a.t && t <= b.t) {
                const lt = (t - a.t) / (b.t - a.t || 1);
                return new THREE.Color().lerpColors(a.c, b.c, lt);
            }
        }
        return gradien[gradien.length - 1].c.clone();
    }

    // Build 3D volumetric particle system for a galaxy based on ESA & Hubble morphology
    function buildGalaxyVolumetric(galaxy) {
        const radius = galaxy.ukuranVisual;
        const style = galaxy.gayaVisual;
        const isMilkyWay = galaxy.id === 'milky-way';
        const isAndromeda = galaxy.id === 'andromeda';
        const isTriangulum = galaxy.id === 'triangulum';

        const group = new THREE.Group();
        group.position.set(galaxy.posisi3D.x, galaxy.posisi3D.y, galaxy.posisi3D.z);

        let particleCount = 1200;
        if (isMilkyWay) particleCount = 38000;
        else if (isAndromeda) particleCount = 22000;
        else if (isTriangulum) particleCount = 10000;
        else if (galaxy.kategoriMorfologi === 'Spiral') particleCount = 4500;
        else if (galaxy.kategoriMorfologi === 'Eliptis') particleCount = 2600;
        else particleCount = 1500;

        const positions = [];
        const colors = [];

        let activeGradien = stopGradienGaia;
        if (isAndromeda) activeGradien = stopGradienAndromeda;
        else if (isTriangulum) activeGradien = stopGradienTriangulum;

        if (style === 'katai_sferoid' || style === 'eliptis_kompak') {
            const isElongated = style === 'eliptis_kompak';
            const coreColor = new THREE.Color(galaxy.skemaWarna.inti);
            const edgeColor = new THREE.Color(galaxy.skemaWarna.tepi || galaxy.skemaWarna.lengan);

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

                const c = new THREE.Color().lerpColors(coreColor, edgeColor, rNorm);
                const brightness = 0.4 + (1 - rNorm) * 0.6;
                colors.push(c.r * brightness, c.g * brightness, c.b * brightness);
            }
        } else if (style === 'ireguler') {
            const numClumps = 8;
            const clumpCenters = [];
            const armCol = new THREE.Color(galaxy.skemaWarna.lengan);
            const coreCol = new THREE.Color(galaxy.skemaWarna.inti);

            for (let c = 0; c < numClumps; c++) {
                clumpCenters.push({
                    x: (Math.random() - 0.5) * radius * 0.8,
                    y: (Math.random() - 0.5) * radius * 0.22,
                    z: (Math.random() - 0.5) * radius * 0.8,
                    r: (0.15 + Math.random() * 0.25) * radius,
                    color: Math.random() > 0.4 ? armCol : coreCol
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
            const numArms = style === 'flocculent' ? 8 : (isMilkyWay ? 6 : 4);
            const barAngle = isMilkyWay ? 0.75 : 0.5;

            // Bar particles
            if (style === 'spiral_berpalang') {
                const barCount = Math.round(particleCount * 0.2);
                for (let i = 0; i < barCount; i++) {
                    const len = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), 0.7) * radius * 0.35;
                    const normLen = Math.abs(len) / (radius * 0.36);
                    const w = (1 - normLen * 0.75) * radius * 0.07;
                    const xLocal = len;
                    const zLocal = acakGaussian(0, w * 0.5);
                    const y = acakGaussian(0, (1 - normLen) * radius * 0.06 + radius * 0.015);

                    const x = xLocal * Math.cos(barAngle) - zLocal * Math.sin(barAngle);
                    const z = xLocal * Math.sin(barAngle) + zLocal * Math.cos(barAngle);

                    positions.push(x, y, z);
                    const c = warnaRadial(normLen * 0.3, activeGradien);
                    const b = 0.7 + Math.random() * 0.3;
                    colors.push(c.r * b, c.g * b, c.b * b);
                }
            }

            // Arm particles
            const armCount = Math.round(particleCount * 0.8);
            for (let i = 0; i < armCount; i++) {
                const arm = i % numArms;
                const offset = (arm / numArms) * Math.PI * 2 + barAngle;
                const rNorm = Math.pow(Math.random(), 1.7);
                const r = radius * 0.07 + rNorm * radius * 0.93;

                const spiralTurn = 2.9 * Math.log(rNorm * 11 + 1);
                const theta = offset + spiralTurn + acakGaussian(0, 0.16);

                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;
                const y = acakGaussian(0, (1 - rNorm) * radius * 0.04 + radius * 0.012);

                positions.push(x, y, z);

                let c = warnaRadial(rNorm, activeGradien);
                const rnd = Math.random();
                if (rnd > 0.93) {
                    c = new THREE.Color(0xff8ab4); // HII starburst pink
                } else if (rnd > 0.78) {
                    c = new THREE.Color(0xa0c0ff); // Young hot blue stars
                }

                const fade = 1 - THREE.MathUtils.smoothstep(rNorm, 0.75, 1.0);
                const brightness = (0.55 + Math.random() * 0.45) * (0.15 + 0.85 * fade);
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
            opacity: 0.92,
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
        plane.rotation.x = Math.PI / 2.3;
        plane.rotation.z = Math.random() * 0.5;
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
            sumber: "NASA/IPAC Extragalactic Database (NED) · ESA Gaia DR3 · Hubble"
        };
        interactiveObjects.push(collider);
        group.add(collider);

        galaxyMeshMap.set(galaxy.id, collider);
        scene.add(group);
        galaxyGroups.push({ group, galaxy, rotSpeed: 0.00003 + (Math.random() * 0.00003) });

        return group;
    }

    // Build specific prominent NASA objects inside galaxies
    function buildInternalGalaxyObjects() {
        for (let i = 0; i < daftarObjekDalamGalaksi.length; i++) {
            const objData = daftarObjekDalamGalaksi[i];
            const parentGalaxy = daftar49Galaksi.find(g => g.id === objData.galaksiId);
            if (!parentGalaxy) continue;

            const worldPos = new THREE.Vector3(
                parentGalaxy.posisi3D.x + objData.posisiRelatif.x,
                parentGalaxy.posisi3D.y + objData.posisiRelatif.y,
                parentGalaxy.posisi3D.z + objData.posisiRelatif.z
            );

            // Visual mesh representation
            const objGroup = new THREE.Group();
            objGroup.position.copy(worldPos);
            scene.add(objGroup);

            // Glowing central sphere
            const sphereGeo = new THREE.SphereGeometry(objData.radiusVisual * 0.4, 16, 16);
            const sphereMat = new THREE.MeshBasicMaterial({
                color: objData.warna,
                transparent: true,
                opacity: 0.85
            });
            const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
            objGroup.add(coreMesh);

            // Surrounding nebula halo ring / gas aura
            const auraGeo = new THREE.RingGeometry(objData.radiusVisual * 0.45, objData.radiusVisual * 1.1, 24);
            const auraMat = new THREE.MeshBasicMaterial({
                color: objData.warna,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.45,
                blending: THREE.AdditiveBlending
            });
            const auraMesh = new THREE.Mesh(auraGeo, auraMat);
            auraMesh.rotation.x = Math.PI / 2.2;
            objGroup.add(auraMesh);

            // Interactive collider
            const colliderGeo = new THREE.SphereGeometry(objData.radiusVisual * 1.2, 10, 10);
            const colliderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
            const collider = new THREE.Mesh(colliderGeo, colliderMat);

            collider.userData = {
                id: objData.id,
                nama: objData.nama,
                kategori: objData.kategori,
                tipe: `${objData.tipe} (Di dalam ${objData.galaksiInduk})`,
                desc: objData.desc,
                fakta: objData.fakta,
                data: {
                    "Galaksi Induk": objData.galaksiInduk,
                    "Kategori Objek": objData.kategori,
                    ...objData.data
                },
                sumber: objData.sumber
            };

            interactiveObjects.push(collider);
            objGroup.add(collider);
            internalObjectMeshes.push({ group: objGroup, aura: auraMesh, core: coreMesh });
        }
    }

    function initGalaxies() {
        // Build 49 galaxies without line connectors
        for (let i = 0; i < daftar49Galaksi.length; i++) {
            buildGalaxyVolumetric(daftar49Galaksi[i]);
        }
        // Build internal prominent NASA objects inside the galaxies
        buildInternalGalaxyObjects();
    }

    function update(delta) {
        for (let i = 0; i < galaxyGroups.length; i++) {
            galaxyGroups[i].group.rotation.y += galaxyGroups[i].rotSpeed;
        }
        for (let i = 0; i < internalObjectMeshes.length; i++) {
            internalObjectMeshes[i].aura.rotation.z += 0.008;
            internalObjectMeshes[i].core.rotation.y += 0.005;
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
