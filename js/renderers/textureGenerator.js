import * as THREE from 'three';

// Reusable canvas and caching dictionary to prevent memory leaks and main-thread freezes
const textureCache = new Map();

export function createCrispCanvasTexture(canvas, maxAnisotropy = 16) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export function buatTeksturBerbatu(warnaDasarHex, jumlahKawah = 40, warnaAksen = null, lebar = 1024, tinggi = 512, maxAnisotropy = 16) {
    const cacheKey = `rocky_${warnaDasarHex}_${jumlahKawah}_${warnaAksen}_${lebar}`;
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = lebar;
    canvas.height = tinggi;
    const ctx = canvas.getContext('2d');
    const sk = lebar / 512;

    ctx.fillStyle = warnaDasarHex;
    ctx.fillRect(0, 0, lebar, tinggi);

    // Fast noise pass using fillRect instead of individual arc paths
    const noiseCount = Math.round(600 * sk);
    for (let i = 0; i < noiseCount; i++) {
        const x = Math.random() * lebar;
        const y = Math.random() * tinggi;
        const s = (2 + Math.random() * 6) * sk;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.14)';
        ctx.fillRect(x, y, s, s);
    }

    // Impact craters with radial gradients
    for (let i = 0; i < jumlahKawah * sk; i++) {
        const x = Math.random() * lebar;
        const y = Math.random() * tinggi;
        const r = (2 + Math.random() * 9) * sk;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, 'rgba(0,0,0,0.6)');
        grad.addColorStop(0.7, 'rgba(0,0,0,0.25)');
        grad.addColorStop(1, 'rgba(255,255,255,0.12)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (r > 4 * sk) {
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = Math.max(1, 0.8 * sk);
            ctx.beginPath();
            ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    if (warnaAksen) {
        ctx.fillStyle = warnaAksen;
        for (let i = 0; i < 8 * sk; i++) {
            ctx.globalAlpha = 0.2 + Math.random() * 0.2;
            ctx.beginPath();
            ctx.ellipse(Math.random() * lebar, Math.random() * tinggi, (15 + Math.random() * 30) * sk, (6 + Math.random() * 12) * sk, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
    textureCache.set(cacheKey, tex);
    return tex;
}

export function buatTeksturGasRaksasa(warnaPita, lebar = 1024, tinggi = 512, maxAnisotropy = 16) {
    const cacheKey = `gas_${warnaPita.join('_')}_${lebar}`;
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = lebar;
    canvas.height = tinggi;
    const ctx = canvas.getContext('2d');
    const sk = lebar / 512;

    let y = 0;
    while (y < tinggi) {
        const tebal = (6 + Math.random() * 16) * sk;
        ctx.fillStyle = warnaPita[Math.floor(Math.random() * warnaPita.length)];
        ctx.fillRect(0, y, lebar, tebal);
        y += tebal;
    }

    // Atmospheric turbulence
    const waves = Math.round(80 * sk);
    for (let i = 0; i < waves; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = (1 + Math.random() * 2) * sk;
        const yy = Math.random() * tinggi;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        for (let x = 0; x <= lebar; x += 32 * sk) {
            ctx.lineTo(x, yy + Math.sin(x * 0.03 + i) * 8 * sk);
        }
        ctx.stroke();
    }

    // Storm vortices
    for (let i = 0; i < 8 * sk; i++) {
        const x = Math.random() * lebar;
        const yy = Math.random() * tinggi;
        const r = (10 + Math.random() * 25) * sk;
        const g = ctx.createRadialGradient(x, yy, 0, x, yy, r);
        g.addColorStop(0, 'rgba(255,255,255,0.18)');
        g.addColorStop(0.6, 'rgba(255,200,100,0.1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(x, yy, r, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
    textureCache.set(cacheKey, tex);
    return tex;
}

export function buatTeksturBumi(lebar = 1024, tinggi = 512, maxAnisotropy = 16) {
    const cacheKey = `earth_${lebar}`;
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = lebar;
    canvas.height = tinggi;
    const ctx = canvas.getContext('2d');
    const sk = lebar / 512;

    // Ocean blue
    ctx.fillStyle = '#154f9e';
    ctx.fillRect(0, 0, lebar, tinggi);

    // Continents
    const landColors = ['#2f7d3c', '#4a8f3f', '#8a7a4a', '#3d6b2e', '#6b8f3f', '#c9a856'];
    for (let i = 0; i < 28 * sk; i++) {
        ctx.fillStyle = landColors[Math.floor(Math.random() * landColors.length)];
        ctx.beginPath();
        ctx.ellipse(Math.random() * lebar, (0.2 + Math.random() * 0.6) * tinggi, (18 + Math.random() * 45) * sk, (10 + Math.random() * 25) * sk, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Clouds
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 22 * sk; i++) {
        ctx.globalAlpha = 0.35 + Math.random() * 0.25;
        ctx.beginPath();
        ctx.ellipse(Math.random() * lebar, Math.random() * tinggi, (20 + Math.random() * 40) * sk, (6 + Math.random() * 12) * sk, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Polar caps
    ctx.fillStyle = '#f0f4ff';
    ctx.fillRect(0, 0, lebar, 12 * sk);
    ctx.fillRect(0, tinggi - 12 * sk, lebar, 12 * sk);

    const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
    textureCache.set(cacheKey, tex);
    return tex;
}

export function buatTeksturBintang(warnaInti, warnaAksen, lebar = 512, tinggi = 256, maxAnisotropy = 16) {
    const cacheKey = `star_${warnaInti}_${warnaAksen}_${lebar}`;
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = lebar;
    canvas.height = tinggi;
    const ctx = canvas.getContext('2d');
    const sk = lebar / 256;

    ctx.fillStyle = warnaInti;
    ctx.fillRect(0, 0, lebar, tinggi);

    const spots = 400 * sk;
    for (let i = 0; i < spots; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? warnaAksen : warnaInti;
        ctx.globalAlpha = 0.2 + Math.random() * 0.4;
        ctx.fillRect(Math.random() * lebar, Math.random() * tinggi, 2 * sk, 2 * sk);
    }
    ctx.globalAlpha = 1.0;

    const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
    textureCache.set(cacheKey, tex);
    return tex;
}

export function buatTeksturGalaksi(skemaWarna, gaya = 'spiral', size = 2048, maxAnisotropy = 16) {
    const cacheKey = `galaxy_${skemaWarna.inti}_${skemaWarna.lengan}_${gaya}_${size}`;
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const sk = size / 1024;

    ctx.clearRect(0, 0, size, size);

    if (gaya === 'katai_sferoid' || gaya === 'eliptis_kompak') {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.48);
        g.addColorStop(0, 'rgba(255,250,235,1)');
        g.addColorStop(0.18, skemaWarna.inti + 'dd');
        g.addColorStop(0.45, skemaWarna.lengan + '77');
        g.addColorStop(0.75, skemaWarna.tepi + '25');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
        ctx.fill();

        const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
        textureCache.set(cacheKey, tex);
        return tex;
    }

    if (gaya === 'ireguler') {
        // Asymmetric luminous clumps
        for (let i = 0; i < 16; i++) {
            const ox = cx + (Math.random() - 0.5) * size * 0.4;
            const oy = cy + (Math.random() - 0.5) * size * 0.35;
            const r = (40 + Math.random() * 120) * sk;
            const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
            g.addColorStop(0, skemaWarna.inti + 'cc');
            g.addColorStop(0.5, skemaWarna.lengan + '66');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(ox, oy, r, 0, Math.PI * 2);
            ctx.fill();
        }
        const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
        textureCache.set(cacheKey, tex);
        return tex;
    }

    // Spiral / Flocculent / Barred Spiral
    const gHalo = ctx.createRadialGradient(cx, cy, size * 0.02, cx, cy, size * 0.5);
    gHalo.addColorStop(0, 'rgba(255,248,225,0.98)');
    gHalo.addColorStop(0.15, 'rgba(255,225,160,0.85)');
    gHalo.addColorStop(0.35, 'rgba(220,180,180,0.45)');
    gHalo.addColorStop(0.65, 'rgba(130,120,160,0.18)');
    gHalo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gHalo;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Central bar if applicable
    if (gaya === 'spiral_berpalang') {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.5);
        const barPoints = Math.round(2500 * sk);
        for (let i = 0; i < barPoints; i++) {
            const p = (Math.random() < 0.5 ? -1 : 1) * Math.pow(Math.random(), 0.7) * size * 0.18;
            const w = (1 - Math.abs(p) / (size * 0.19)) * size * 0.04;
            const y = (Math.random() - 0.5) * w;
            ctx.fillStyle = Math.random() > 0.6 ? skemaWarna.inti : skemaWarna.bar;
            ctx.globalAlpha = 0.5 + Math.random() * 0.4;
            ctx.fillRect(p, y, 2 * sk, 2 * sk);
        }
        ctx.restore();
        ctx.globalAlpha = 1.0;
    }

    // Spiral Arms
    const numArms = gaya === 'flocculent' ? 8 : 4;
    for (let arm = 0; arm < numArms; arm++) {
        const offset = (arm / numArms) * Math.PI * 2;
        const points = Math.round((gaya === 'flocculent' ? 2500 : 4500) * sk);
        for (let i = 0; i < points; i++) {
            const t = i / points;
            const r = size * 0.06 + t * size * 0.42;
            const theta = offset + 2.4 * Math.log(t * 12 + 1) + (Math.random() - 0.5) * 0.15;
            const x = cx + Math.cos(theta) * r;
            const y = cy + Math.sin(theta) * r * 0.95;

            const rnd = Math.random();
            if (rnd > 0.94) {
                ctx.fillStyle = '#ff8cb4'; // HII region
            } else if (rnd > 0.75) {
                ctx.fillStyle = skemaWarna.tepi || '#7090ff'; // Young stars
            } else {
                ctx.fillStyle = skemaWarna.lengan;
            }
            ctx.globalAlpha = (1 - t * 0.7) * (0.35 + Math.random() * 0.5);
            ctx.fillRect(x, y, (1.2 + Math.random() * 2.4) * sk, (1.2 + Math.random() * 2.4) * sk);
        }
    }

    // Golden Core
    const gCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.12);
    gCore.addColorStop(0, 'rgba(255,255,250,1)');
    gCore.addColorStop(0.3, 'rgba(255,240,200,0.95)');
    gCore.addColorStop(0.7, 'rgba(255,210,140,0.5)');
    gCore.addColorStop(1, 'rgba(255,180,100,0)');
    ctx.fillStyle = gCore;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    const tex = createCrispCanvasTexture(canvas, maxAnisotropy);
    textureCache.set(cacheKey, tex);
    return tex;
}

export function buatTeksturPartikelBundar() {
    const cacheKey = 'particle_round_sprite';
    if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.28, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.65, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = createCrispCanvasTexture(canvas, 1);
    textureCache.set(cacheKey, tex);
    return tex;
}
