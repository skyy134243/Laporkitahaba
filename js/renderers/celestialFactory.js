import * as THREE from 'three';
import { dbTataSurya } from '../data/solarSystemData.js';
import {
    buatTeksturBerbatu,
    buatTeksturGasRaksasa,
    buatTeksturBumi,
    buatTeksturBintang
} from './textureGenerator.js';

export function createCelestialFactory(scene, interactiveObjects) {
    const kF = 0.2;
    const orbitingBodies = [];
    const rotatingMeshes = [];
    const pulsars = [];

    function registerInteractive(mesh, dbKey, customData = null) {
        const info = customData || dbTataSurya[dbKey];
        if (info) {
            mesh.userData = {
                nama: info.nama || dbKey,
                kategori: info.kategori || "Objek Langit",
                tipe: info.tipe || "Objek Kosmik",
                desc: info.desc || "-",
                fakta: info.fakta || "-",
                data: info.data || null,
                sumber: info.sumber || "NASA / ESA / IAU"
            };
            interactiveObjects.push(mesh);
        }
        return mesh;
    }

    function createOrbitalRing(radius, parentGroup = scene, color = 0x33334e, opacity = 0.35) {
        if (radius <= 0) return;
        const segments = 64;
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const ring = new THREE.Line(geo, mat);
        parentGroup.add(ring);
    }

    function buildPlanet(name, radius, textureMaterial, orbitRadius, orbitSpeed, parentGroup = scene) {
        createOrbitalRing(orbitRadius, parentGroup);
        const pivot = new THREE.Group();
        parentGroup.add(pivot);

        const seg = THREE.MathUtils.clamp(Math.round(radius * 16), 24, 48);
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, seg, seg), textureMaterial);
        mesh.position.x = orbitRadius;

        registerInteractive(mesh, name);
        pivot.add(mesh);

        orbitingBodies.push({ pivot, speed: orbitSpeed });
        rotatingMeshes.push({ mesh, speed: 0.005 });

        return { pivot, mesh, orbitSpeed };
    }

    function buildSpacecraft(name, boxSize, colorHex, orbitRadius, orbitSpeed, parentMesh) {
        const pivot = new THREE.Group();
        parentMesh.add(pivot);

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(boxSize, boxSize * 0.6, boxSize * 0.6),
            new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.7, roughness: 0.3, emissive: colorHex, emissiveIntensity: 0.2 })
        );
        body.position.x = orbitRadius;

        const panelMat = new THREE.MeshStandardMaterial({ color: 0x162a52, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.4 });
        const p1 = new THREE.Mesh(new THREE.PlaneGeometry(boxSize * 2.2, boxSize * 0.8), panelMat);
        p1.position.x = -boxSize * 1.5;
        body.add(p1);

        const p2 = new THREE.Mesh(new THREE.PlaneGeometry(boxSize * 2.2, boxSize * 0.8), panelMat);
        p2.position.x = boxSize * 1.5;
        body.add(p2);

        registerInteractive(body, name);
        pivot.add(body);

        orbitingBodies.push({ pivot, speed: orbitSpeed });
        return { pivot, mesh: body };
    }

    function buildDeepSpaceProbe(name, position, size = 1.6) {
        const geo = new THREE.ConeGeometry(size * 0.35, size, 6);
        const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2, emissive: 0x3388ff, emissiveIntensity: 0.25 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(position);

        const antenna = new THREE.Mesh(new THREE.CircleGeometry(size * 0.6, 14), new THREE.MeshStandardMaterial({ color: 0xe8e8e8, side: THREE.DoubleSide, metalness: 0.5 }));
        antenna.rotation.x = Math.PI / 2;
        antenna.position.y = size * 0.7;
        mesh.add(antenna);

        registerInteractive(mesh, name);
        scene.add(mesh);
        return mesh;
    }

    function buildPulsar(name, position, colorHex = '#bcd9ff') {
        const group = new THREE.Group();
        group.position.copy(position);
        scene.add(group);

        const core = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: colorHex }));
        group.add(core);

        const jetMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
        const jetGeo = new THREE.ConeGeometry(0.9, 15, 12, 1, true);
        const jetTop = new THREE.Mesh(jetGeo, jetMat);
        jetTop.position.y = 7.5;
        group.add(jetTop);

        const jetBottom = new THREE.Mesh(jetGeo, jetMat);
        jetBottom.position.y = -7.5;
        jetBottom.rotation.x = Math.PI;
        group.add(jetBottom);

        const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.8, 24), new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        registerInteractive(core, name);
        pulsars.push(group);
        return group;
    }

    function buildBlackHole(name, position, radius = 1.8) {
        const group = new THREE.Group();
        group.position.copy(position);
        scene.add(group);

        const eventHorizon = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        group.add(eventHorizon);

        const disk1 = new THREE.Mesh(
            new THREE.RingGeometry(radius * 1.3, radius * 3.5, 48),
            new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        disk1.rotation.x = Math.PI / 2.3;
        group.add(disk1);

        const disk2 = new THREE.Mesh(
            new THREE.RingGeometry(radius * 1.3, radius * 3.5, 48),
            new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
        );
        disk2.rotation.x = Math.PI / 2.3 + 0.25;
        group.add(disk2);

        registerInteractive(eventHorizon, name);
        pulsars.push({ isBlackHoleDisk: true, disk1, disk2 });
        return group;
    }

    function buildProceduralAsteroids(count = 420, innerR = 33, outerR = 41, height = 3.5) {
        const group = new THREE.Group();
        scene.add(group);

        const geoSm = new THREE.IcosahedronGeometry(0.25, 1);
        const matC = new THREE.MeshStandardMaterial({ color: 0x423d38, roughness: 0.9, flatShading: true });
        const matS = new THREE.MeshStandardMaterial({ color: 0x9a8065, roughness: 0.8, flatShading: true });

        for (let i = 0; i < count; i++) {
            const isC = Math.random() < 0.75;
            const mesh = new THREE.Mesh(geoSm, isC ? matC : matS);
            const r = innerR + Math.random() * (outerR - innerR);
            const angle = Math.random() * Math.PI * 2;
            mesh.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * height, Math.sin(angle) * r);
            mesh.scale.setScalar(0.6 + Math.random() * 0.9);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            mesh.userData = {
                nama: `Asteroid Sabuk Utama #${i + 1}`,
                kategori: "Asteroid",
                tipe: isC ? "Asteroid Karbonan (C-type)" : "Asteroid Silikat (S-type)",
                desc: isC ? "Asteroid gelap purba kaya karbon di Sabuk Utama." : "Asteroid berbatu silikat campuran nikel-besi di Sabuk Utama.",
                fakta: "Sabuk Asteroid merupakan sisa-sisa protoplanet yang gagal bersatu membentuk planet akibat gangguan gravitasi Jupiter.",
                data: { "Orbit": `${r.toFixed(1)} unit`, "Klasifikasi": isC ? "C-type (Karbonan)" : "S-type (Silikat)" },
                sumber: "NASA JPL Small-Body Database"
            };
            interactiveObjects.push(mesh);
            group.add(mesh);
        }
        return group;
    }

    // Initialize the complete Solar System
    function initSolarSystem() {
        const sunMat = new THREE.MeshBasicMaterial({ map: buatTeksturBintang('#ffdd33', '#fff5b0', 512, 256) });
        const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 48), sunMat);
        registerInteractive(sun, "Matahari");
        scene.add(sun);
        rotatingMeshes.push({ mesh: sun, speed: 0.001 });

        // Inner planets
        const merc = buildPlanet("Merkurius", 0.5, new THREE.MeshStandardMaterial({ map: buatTeksturBerbatu('#9a9a9a', 35) }), 11, 0.02 * kF);
        const ven = buildPlanet("Venus", 0.9, new THREE.MeshStandardMaterial({ map: buatTeksturBerbatu('#e3bb76', 10, '#c99a52') }), 16, 0.007 * kF);
        const earth = buildPlanet("Bumi", 1.1, new THREE.MeshStandardMaterial({ map: buatTeksturBumi() }), 23, 0.005 * kF);
        const mars = buildPlanet("Mars", 0.7, new THREE.MeshStandardMaterial({ map: buatTeksturBerbatu('#b23a15', 30, '#7a2a10') }), 30, 0.004 * kF);

        // Moons
        buildPlanet("Bulan", 0.28, new THREE.MeshStandardMaterial({ map: buatTeksturBerbatu('#c9c9c9', 30) }), 2.2, 0.015 * kF, earth.mesh);
        buildPlanet("Phobos", 0.14, new THREE.MeshStandardMaterial({ color: 0x8a7a6a }), 1.3, 0.05 * kF, mars.mesh);
        buildPlanet("Deimos", 0.10, new THREE.MeshStandardMaterial({ color: 0x9a8a7a }), 1.9, 0.03 * kF, mars.mesh);

        // Asteroids
        buildProceduralAsteroids(400, 33, 41, 3.5);

        // Outer gas giants
        const jup = buildPlanet("Jupiter", 2.6, new THREE.MeshStandardMaterial({ map: buatTeksturGasRaksasa(['#d9822b','#e8a55a','#c9711f','#f0c087']) }), 46, 0.0017 * kF);
        const sat = buildPlanet("Saturnus", 2.1, new THREE.MeshStandardMaterial({ map: buatTeksturGasRaksasa(['#e6cc85','#f0dca0','#d4b56e']) }), 60, 0.0012 * kF);
        const uran = buildPlanet("Uranus", 1.4, new THREE.MeshStandardMaterial({ map: buatTeksturGasRaksasa(['#66ccff','#7fd4ff','#4fb8ec']) }), 74, 0.0009 * kF);
        const nep = buildPlanet("Neptunus", 1.4, new THREE.MeshStandardMaterial({ map: buatTeksturGasRaksasa(['#3366ff','#4a7bff','#274fd1']) }), 86, 0.0006 * kF);
        const plut = buildPlanet("Pluto", 0.6, new THREE.MeshStandardMaterial({ map: buatTeksturBerbatu('#b3866b', 20, '#e8ddc8') }), 100, 0.0005 * kF);

        // Saturn Rings
        const ringGeo = new THREE.RingGeometry(2.5, 4.0, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xccb366, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const satRing = new THREE.Mesh(ringGeo, ringMat);
        satRing.rotation.x = Math.PI / 2;
        sat.mesh.add(satRing);

        // Jovian Moons
        buildPlanet("Io", 0.32, new THREE.MeshStandardMaterial({ color: 0xd9c14a }), 3.3, 0.045 * kF, jup.mesh);
        buildPlanet("Europa", 0.28, new THREE.MeshStandardMaterial({ color: 0xd8cfc0 }), 4.1, 0.036 * kF, jup.mesh);
        buildPlanet("Ganymede", 0.48, new THREE.MeshStandardMaterial({ color: 0x9a8f7d }), 5.1, 0.028 * kF, jup.mesh);
        buildPlanet("Callisto", 0.44, new THREE.MeshStandardMaterial({ color: 0x716857 }), 6.2, 0.02 * kF, jup.mesh);

        // Saturnian Moons
        buildPlanet("Mimas", 0.14, new THREE.MeshStandardMaterial({ color: 0xbdbdbd }), 4.4, 0.05 * kF, sat.mesh);
        buildPlanet("Enceladus", 0.18, new THREE.MeshStandardMaterial({ color: 0xf0f0f5 }), 5.0, 0.042 * kF, sat.mesh);
        buildPlanet("Titan", 0.52, new THREE.MeshStandardMaterial({ color: 0xe0a95c }), 6.2, 0.025 * kF, sat.mesh);

        // Uranian / Neptunian Moons
        buildPlanet("Miranda", 0.14, new THREE.MeshStandardMaterial({ color: 0xa9a9b8 }), 2.1, 0.05 * kF, uran.mesh);
        buildPlanet("Titania", 0.32, new THREE.MeshStandardMaterial({ color: 0xbfb6ad }), 3.1, 0.03 * kF, uran.mesh);
        buildPlanet("Oberon", 0.31, new THREE.MeshStandardMaterial({ color: 0x9d968d }), 3.9, 0.024 * kF, uran.mesh);
        buildPlanet("Triton", 0.38, new THREE.MeshStandardMaterial({ color: 0xcdd7e0 }), 2.7, -0.03 * kF, nep.mesh);
        buildPlanet("Charon", 0.32, new THREE.MeshStandardMaterial({ color: 0x8f8f8f }), 1.5, 0.02 * kF, plut.mesh);

        // Satellites & Spacecrafts
        buildSpacecraft("Hubble Space Telescope", 0.12, 0xdfe6f0, 1.6, 0.07 * kF, earth.mesh);
        buildSpacecraft("James Webb Space Telescope", 0.18, 0xd4af37, 8.5, 0.006 * kF, earth.mesh);

        // Deep space probes
        buildDeepSpaceProbe("Voyager 1", new THREE.Vector3(-125, 60, -105), 2.0);
        buildDeepSpaceProbe("Voyager 2", new THREE.Vector3(-95, -70, 118), 1.9);

        // Neighboring star systems
        const alphaGroup = new THREE.Group();
        alphaGroup.position.set(450, 30, 200);
        scene.add(alphaGroup);

        const aA = new THREE.Mesh(new THREE.SphereGeometry(5.5, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
        registerInteractive(aA, "Alpha Centauri A");
        alphaGroup.add(aA);

        const aB = new THREE.Mesh(new THREE.SphereGeometry(4.0, 24, 24), new THREE.MeshBasicMaterial({ color: 0xff9933 }));
        aB.position.x = 25;
        registerInteractive(aB, "Alpha Centauri B", {
            nama: "Alpha Centauri B",
            kategori: "Bintang",
            tipe: "Bintang Deret Utama Kelas K",
            desc: "Bintang kedua dalam sistem biner Alpha Centauri, sedikit lebih dingin dari Matahari.",
            fakta: "Mengorbit Alpha Centauri A dalam periode sekitar 80 tahun.",
            data: { "Jarak": "≈4,37 tahun cahaya", "Massa": "0,9 × Matahari" }
        });
        alphaGroup.add(aB);

        const prox = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff5533 }));
        prox.position.set(488, 18, 178);
        registerInteractive(prox, "Proxima Centauri");
        scene.add(prox);

        const proxB = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), new THREE.MeshStandardMaterial({ color: 0xc98a5e }));
        proxB.position.set(492, 18, 178);
        registerInteractive(proxB, "Proxima Centauri b");
        scene.add(proxB);

        // Sirius
        const sirius = new THREE.Mesh(new THREE.SphereGeometry(6.2, 24, 24), new THREE.MeshBasicMaterial({ color: 0xd8eeff }));
        sirius.position.set(-380, 80, 260);
        registerInteractive(sirius, "Sirius A");
        scene.add(sirius);

        // TRAPPIST-1
        const trappist = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff4422 }));
        trappist.position.set(620, -40, -320);
        registerInteractive(trappist, "TRAPPIST-1");
        scene.add(trappist);

        // Pulsars & Black Holes
        buildPulsar("Pulsar Kepiting (PSR B0531+21)", new THREE.Vector3(-900, 150, -600));
        buildBlackHole("Sagittarius A*", new THREE.Vector3(0, 0, -15000), 2.5);

        return { sun, earth, mars, jup, sat };
    }

    function update(delta) {
        for (let i = 0; i < orbitingBodies.length; i++) {
            orbitingBodies[i].pivot.rotation.y += orbitingBodies[i].speed;
        }
        for (let i = 0; i < rotatingMeshes.length; i++) {
            rotatingMeshes[i].mesh.rotation.y += rotatingMeshes[i].speed;
        }
        for (let i = 0; i < pulsars.length; i++) {
            const p = pulsars[i];
            if (p.isBlackHoleDisk) {
                p.disk1.rotation.z += 0.01;
                p.disk2.rotation.z -= 0.007;
            } else {
                p.rotation.y += 0.03;
            }
        }
    }

    return {
        initSolarSystem,
        update
    };
}
