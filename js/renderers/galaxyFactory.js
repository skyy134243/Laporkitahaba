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

    // Exact color stops sampled from the ESA Gaia "Anatomy of the Milky Way" reference image
    const stopGradienGaia = [
        { t: 0.00, c: new THREE.Color(0xffffff) }, // Inti — putih-krem menyala terang
        { t: 0.12, c: new THREE.Color(0xfff2cc) }, // Bulge sentral — keemasan intens
        { t: 0.28, c: new THREE.Color(0xffd994) }, // Transisi bar ke lengan — keemasan hangat
        { t: 0.42, c: new THREE.Color(0xc09e85) }, // Lengan dalam — peachy-tan berdebu
        { t: 0.60, c: new THREE.Color(0x8c7088) }, // Lengan tengah — mauve berdebu
        { t: 0.80, c: new THREE.Color(0x4d485c) }, // Lengan luar — slate-purple berasap
        { t: 1.00, c: new THREE.Color(0x282432) }  // Ujung cakram — indigo-abu redup menjuntai pudar
    ];

    const stopGradienAndromeda = [
        { t: 0.00, c: new THREE.Color(0xfff2c8) },
        { t: 0.15, c: new THREE.Color(0xf0c98a) },
        { t: 0.35, c: new THREE.Color(0xd4926a) },
        { t: 0.55, c: new THREE.Color(0xb07aa0) },
        { t: 0.75, c: new THREE.Color(0x8a63c8) },
        { t: 1.00, c: new THREE.Color(0x5c3f96) }
    ];

    const stopGradienTriangulum = [
        { t: 0.00, c: new THREE.Color(0xfdf6e0) },
        { t: 0.20, c: new THREE.Color(0xbcd9ee) },
        { t: 0.50, c: new THREE.Color(0x7ec8e3) },
        { t: 0.80, c: new THREE.Color(0x4a78b0) },
        { t: 1.00, c: new THREE.Color(0x2c3f6e) }
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

    // =========================================================================
    // BUILD MILKY WAY TO MATCH ESA GAIA "ANATOMY OF THE MILKY WAY" ACCURATELY:
    // 1. Left panel: Tilted central bar (~28°), logarithmic spiral arms, mauve & pink H II knots
    // 2. Right panel: Peanut/boxy bulge, razor-thin disc with midplane dark dust line, spherical halo & globular clusters
    // 3. Sun located in Orion Spur at (0, 0, 0) inside the disk, halfway between core and edge!
    // =========================================================================
    function buildMilkyWayESA(galaxy) {
        const radius = galaxy.ukuranVisual; // 6500 units
        const group = new THREE.Group();
        group.position.set(galaxy.posisi3D.x, galaxy.posisi3D.y, galaxy.posisi3D.z); // (0, 0, -2600)

        const barAngle = 0.48; // ≈27.5 degrees, matching the ESA diagram left panel tilt
        const numArms = 6; // Scutum-Centaurus, Perseus, Sagittarius, Norma, Outer Arm, & Orion Spur

        const posStars = [];
        const colStars = [];

        const posDust = [];
        const colDust = [];

        // ---------------------------------------------------------------------
        // A. PEANUT / BOXY BULGE (Matching right panel of ESA diagram)
        // ---------------------------------------------------------------------
        const bulgeCount = 18000;
        const bulgeSigma = 750;
        for (let i = 0; i < bulgeCount; i++) {
            const rSample = bulgeSigma * Math.sqrt(-Math.log(Math.max(Math.random(), 1e-6)));
            const thLokal = Math.random() * Math.PI * 2;
            const xLokal = Math.cos(thLokal) * rSample * 1.5; // Elongated along the bar axis
            const zLokal = Math.sin(thLokal) * rSample;

            const x = xLokal * Math.cos(barAngle) - zLokal * Math.sin(barAngle);
            const z = xLokal * Math.sin(barAngle) + zLokal * Math.cos(barAngle);

            const normR = Math.min(rSample / (bulgeSigma * 2.0), 1);
            // Boxy / peanut bulge height profile: thickest around core, puffing up vertically like ESA edge-on panel
            const bulgeHeight = (1 - normR * 0.45) * 360;
            const y = acakGaussian(0, bulgeHeight * 0.4);

            posStars.push(x, y, z);

            const c = warnaRadial(normR * 0.25, stopGradienGaia);
            const bright = 0.85 + Math.random() * 0.35;
            colStars.push(c.r * bright, c.g * bright, c.b * bright);
        }

        // ---------------------------------------------------------------------
        // B. CENTRAL BAR (Matching ESA diagram left panel)
        // ---------------------------------------------------------------------
        const barCount = 12000;
        for (let i = 0; i < barCount; i++) {
            const len = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), 0.72) * radius * 0.36;
            const normLen = Math.abs(len) / (radius * 0.37);
            const w = (1 - normLen * 0.75) * radius * 0.08;
            const xLocal = len;
            const zLocal = acakGaussian(0, w * 0.45);
            // Tapered bar thickness
            const y = acakGaussian(0, (1 - normLen) * 160 + 25);

            const x = xLocal * Math.cos(barAngle) - zLocal * Math.sin(barAngle);
            const z = xLocal * Math.sin(barAngle) + zLocal * Math.cos(barAngle);

            posStars.push(x, y, z);
            const c = warnaRadial(normLen * 0.35, stopGradienGaia);
            const bright = 0.75 + Math.random() * 0.35;
            colStars.push(c.r * bright, c.g * bright, c.b * bright);
        }

        // ---------------------------------------------------------------------
        // C. THIN DISC & SPIRAL ARMS (Matching both left and right panels)
        // ---------------------------------------------------------------------
        const discCount = 42000;
        for (let i = 0; i < discCount; i++) {
            const arm = i % numArms;
            const offset = (arm / numArms) * Math.PI * 2 + barAngle;
            const rNorm = Math.pow(Math.random(), 1.6);
            const r = radius * 0.08 + rNorm * radius * 0.92;

            // Logarithmic spiral turn
            const spiralTurn = 2.85 * Math.log(rNorm * 11 + 1);
            const theta = offset + spiralTurn + acakGaussian(0, 0.16);

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            // RAZOR-THIN DISC: scale height is small (40-60 units) to match the ESA edge-on view!
            const discThickness = (1 - rNorm * 0.4) * 55 + 14;
            const y = acakGaussian(0, discThickness * 0.5);

            posStars.push(x, y, z);

            let c = warnaRadial(rNorm, stopGradienGaia);
            const rnd = Math.random();
            // Pink H II knots scattered along the spiral arms (matching the pink dots in ESA left panel!)
            if (rnd > 0.93) {
                c = new THREE.Color(0xff6e99); // H II starburst pink
            } else if (rnd > 0.82) {
                c = new THREE.Color(0xaec8ff); // Young hot OB star associations
            }

            const fade = 1 - THREE.MathUtils.smoothstep(rNorm, 0.75, 1.0);
            const brightness = (0.55 + Math.random() * 0.45) * (0.12 + 0.88 * fade);
            colStars.push(c.r * brightness, c.g * brightness, c.b * brightness);
        }

        // ---------------------------------------------------------------------
        // D. MIDPLANE DARK DUST LANE (The dark horizontal line cutting the edge-on disc in ESA right panel!)
        // ---------------------------------------------------------------------
        const dustCount = 8500;
        for (let i = 0; i < dustCount; i++) {
            const rNorm = 0.12 + Math.random() * 0.82;
            const r = rNorm * radius;
            const theta = Math.random() * Math.PI * 2;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            // Confined tightly to the disc midplane (y ≈ 0)
            const y = acakGaussian(0, 10);

            posDust.push(x, y, z);
            // Dark reddish-brown to black dust
            const darkTone = 0.04 + Math.random() * 0.08;
            colDust.push(darkTone * 1.2, darkTone * 0.7, darkTone * 0.4);
        }

        // ---------------------------------------------------------------------
        // E. STELLAR HALO & GLOBULAR CLUSTERS (Spherical glow above & below disc)
        // ---------------------------------------------------------------------
        const haloCount = 6500;
        for (let i = 0; i < haloCount; i++) {
            const u = Math.random(), v = Math.random();
            const theta = u * Math.PI * 2;
            const phi = Math.acos(2 * v - 1);
            const rNorm = Math.pow(Math.random(), 0.65);
            const r = 1200 + rNorm * radius * 1.4;

            // Quasi-spherical halo (flattening ratio ~0.88)
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi) * 0.88;
            const z = r * Math.sin(phi) * Math.sin(theta);

            posStars.push(x, y, z);

            const c = new THREE.Color(0xb89578); // Faint golden-brown halo stars
            const brightness = 0.15 + Math.random() * 0.22;
            colStars.push(c.r * brightness, c.g * brightness, c.b * brightness);
        }

        // Add Stars Particles Mesh
        const geoStars = new THREE.BufferGeometry();
        geoStars.setAttribute('position', new THREE.Float32BufferAttribute(posStars, 3));
        geoStars.setAttribute('color', new THREE.Float32BufferAttribute(colStars, 3));
        const matStars = new THREE.PointsMaterial({
            map: spriteTex,
            size: 2.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.94,
            depthWrite: false,
            sizeAttenuation: true,
            blending: THREE.NormalBlending
        });
        group.add(new THREE.Points(geoStars, matStars));

        // Add Dark Dust Lane Particles Mesh
        const geoDust = new THREE.BufferGeometry();
        geoDust.setAttribute('position', new THREE.Float32BufferAttribute(posDust, 3));
        geoDust.setAttribute('color', new THREE.Float32BufferAttribute(colDust, 3));
        const matDust = new THREE.PointsMaterial({
            map: spriteTex,
            size: 3.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            sizeAttenuation: true,
            blending: THREE.NormalBlending
        });
        group.add(new THREE.Points(geoDust, matDust));

        // Photographic disc backdrop
        const tex = buatTeksturGalaksi(galaxy.skemaWarna, 'spiral_berpalang', 2048);
        const planeMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), planeMat);
        plane.rotation.x = Math.PI / 2;
        group.add(plane);

        // Interactive collider
        const colliderGeo = new THREE.SphereGeometry(radius * 0.95, 12, 12);
        const colliderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
        const collider = new THREE.Mesh(colliderGeo, colliderMat);
        collider.userData = {
            id: galaxy.id,
            nama: galaxy.nama,
            kategori: "Galaksi",
            tipe: `${galaxy.tipeMorfologi} · Rumah Tata Surya Kita`,
            desc: galaxy.desc,
            fakta: galaxy.fakta,
            data: {
                "Tipe Morfologi": galaxy.tipeMorfologi,
                "Model Visual": "ESA Gaia 'Anatomy of the Milky Way'",
                "Lokasi Tata Surya": "Lengan Orion (≈26.000 ly dari Pusat)",
                "Pusat Galaksi": "Sagittarius A* (Lubang Hitam Supermasif)",
                "Diameter Piringan": `≈${galaxy.diameterLy.toLocaleString()} tahun cahaya`,
                "Estimasi Bintang": galaxy.estimasiBintang,
                ...galaxy.data
            },
            sumber: "European Space Agency (ESA.int/gaia) · NASA/JPL-Caltech"
        };
        interactiveObjects.push(collider);
        group.add(collider);

        galaxyMeshMap.set(galaxy.id, collider);
        scene.add(group);
        galaxyGroups.push({ group, galaxy, rotSpeed: 0.000025 });

        return group;
    }

    // Build standard volumetric representation for the other 48 galaxies
    function buildGalaxyVolumetric(galaxy) {
        if (galaxy.id === 'milky-way') {
            return buildMilkyWayESA(galaxy);
        }

        const radius = galaxy.ukuranVisual;
        const style = galaxy.gayaVisual;
        const isAndromeda = galaxy.id === 'andromeda';
        const isTriangulum = galaxy.id === 'triangulum';

        const group = new THREE.Group();
        group.position.set(galaxy.posisi3D.x, galaxy.posisi3D.y, galaxy.posisi3D.z);

        let particleCount = 1500;
        if (isAndromeda) particleCount = 24000;
        else if (isTriangulum) particleCount = 11000;
        else if (galaxy.kategoriMorfologi === 'Spiral') particleCount = 4500;
        else if (galaxy.kategoriMorfologi === 'Eliptis') particleCount = 2600;

        const positions = [];
        const colors = [];

        let activeGradien = isAndromeda ? stopGradienAndromeda : (isTriangulum ? stopGradienTriangulum : stopGradienGaia);

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
            // Spiral
            const numArms = style === 'flocculent' ? 8 : 4;
            const barAngle = isAndromeda ? 0.5 : 0.6;

            for (let i = 0; i < particleCount; i++) {
                const arm = i % numArms;
                const offset = (arm / numArms) * Math.PI * 2 + barAngle;
                const rNorm = Math.pow(Math.random(), 1.7);
                const r = radius * 0.07 + rNorm * radius * 0.93;

                const spiralTurn = 2.9 * Math.log(rNorm * 11 + 1);
                const theta = offset + spiralTurn + acakGaussian(0, 0.16);

                const x = Math.cos(theta) * r;
                const z = Math.sin(theta) * r;
                const y = acakGaussian(0, (1 - rNorm) * radius * 0.045 + radius * 0.012);

                positions.push(x, y, z);
                let c = warnaRadial(rNorm, activeGradien);
                const rnd = Math.random();
                if (rnd > 0.93) {
                    c = new THREE.Color(0xff8ab4);
                } else if (rnd > 0.78) {
                    c = new THREE.Color(0xa0c0ff);
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

        group.add(new THREE.Points(geo, mat));

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

        const colliderGeo = new THREE.SphereGeometry(radius * 0.95, 12, 12);
        const colliderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
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

    // Build internal prominent NASA objects inside the galaxies
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

            const objGroup = new THREE.Group();
            objGroup.position.copy(worldPos);
            scene.add(objGroup);

            const sphereGeo = new THREE.SphereGeometry(objData.radiusVisual * 0.4, 16, 16);
            const sphereMat = new THREE.MeshBasicMaterial({
                color: objData.warna,
                transparent: true,
                opacity: 0.85
            });
            const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
            objGroup.add(coreMesh);

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
        for (let i = 0; i < daftar49Galaksi.length; i++) {
            buildGalaxyVolumetric(daftar49Galaksi[i]);
        }
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
