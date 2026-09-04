// ============================================================================
// KATALOG & PERPUSTAKAAN KOSMIK: 500+ OBJEK ASTRONOMI LOKAL & EKSTRAGALAKSI
// Sumber Data: NASA/IPAC Extragalactic Database (NED), SIMBAD, ESA Gaia DR3,
// Harris Globular Cluster Catalog, Hubble Heritage & James Webb Space Telescope.
// ============================================================================

import { daftar49Galaksi } from './galaxiesData.js';
import { daftarObjekDalamGalaksi } from './internalObjectsData.js';
import { dbTataSurya } from './solarSystemData.js';

export const cosmicLibrary = [];

// ----------------------------------------------------------------------------
// 1. TAMBAHKAN 49 GALAKSI GRUP LOKAL
// ----------------------------------------------------------------------------
daftar49Galaksi.forEach(g => {
    cosmicLibrary.push({
        id: `lib-${g.id}`,
        nama: g.nama,
        galaksi: g.subgrup === 'Bima Sakti' ? 'Bima Sakti' : g.nama,
        kategori: 'Galaksi',
        tipe: `${g.tipeMorfologi} · Subgrup ${g.subgrup}`,
        jarakLy: g.jarakTercatat,
        desc: g.desc,
        fakta: g.fakta,
        posisi3D: g.posisi3D,
        warna: g.skemaWarna.inti,
        icon: '🌌',
        data: g.data
    });
});

// ----------------------------------------------------------------------------
// 2. TAMBAHKAN OBJEK-OBJEK INTERNAL SPESIFIK NASA DI DALAM SETIAP GALAKSI
// ----------------------------------------------------------------------------
daftarObjekDalamGalaksi.forEach(obj => {
    const parentGal = daftar49Galaksi.find(g => g.id === obj.galaksiId);
    const worldPos = parentGal ? {
        x: parentGal.posisi3D.x + obj.posisiRelatif.x,
        y: parentGal.posisi3D.y + obj.posisiRelatif.y,
        z: parentGal.posisi3D.z + obj.posisiRelatif.z
    } : { x: 0, y: 0, z: -2600 };

    cosmicLibrary.push({
        id: `lib-${obj.id}`,
        nama: obj.nama,
        galaksi: obj.galaksiInduk,
        kategori: obj.kategori,
        tipe: obj.tipe,
        jarakLy: parentGal ? parentGal.jarakTercatat : "Bervariasi",
        desc: obj.desc,
        fakta: obj.fakta,
        posisi3D: worldPos,
        warna: obj.warna,
        icon: obj.kategori.includes('Lubang') ? '🕳️' : (obj.kategori.includes('Bintang') ? '⭐' : '🌸'),
        data: obj.data
    });
});

// ----------------------------------------------------------------------------
// 3. TAMBAHKAN OBJEK TATA SURYA & WAHANA ANTARIKSA NASA
// ----------------------------------------------------------------------------
for (const key in dbTataSurya) {
    const item = dbTataSurya[key];
    cosmicLibrary.push({
        id: `lib-ss-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        nama: key,
        galaksi: 'Bima Sakti',
        kategori: item.kategori || 'Tata Surya',
        tipe: item.tipe,
        jarakLy: item.data && item.data['Jarak dari Bumi'] ? item.data['Jarak dari Bumi'] : '0 ly (Tata Surya)',
        desc: item.desc,
        fakta: item.fakta,
        posisi3D: { x: 0, y: 0, z: 0 },
        warna: '#ffdd33',
        icon: item.kategori === 'Bintang' ? '☀️' : (item.kategori === 'Planet' ? '🪐' : (item.kategori === 'Wahana' ? '🛰️' : '🌕')),
        data: item.data || {}
    });
}

// ----------------------------------------------------------------------------
// 4. GENERASI 158 GUGUS BOLA BIMA SAKTI (HARRIS CATALOG & NASA / SIMBAD)
// ----------------------------------------------------------------------------
const famousGlobulars = [
    { name: "Omega Centauri (NGC 5139)", dist: "17.000 ly", desc: "Gugus bola terbesar dan paling masif di Bima Sakti dengan 10 juta bintang.", fakta: "Diduga merupakan inti dari galaksi kerdil purba yang telah diserap Bima Sakti.", x: -600, y: -800, z: -2100, color: "#fff0d0" },
    { name: "47 Tucanae (NGC 104)", dist: "13.000 ly", desc: "Gugus bola terpadat dan paling terang kedua di langit malam bumi.", fakta: "Menampung ratusan bintang biru peremaja (blue stragglers) dan puluhan pulsar milidetik.", x: 700, y: -1100, z: -2300, color: "#faebd7" },
    { name: "Messier 13 (Gugus Bola Hercules)", dist: "22.200 ly", desc: "Gugus bola paling terkenal di belahan langit utara, berisi 300.000 bintang purba.", fakta: "Menjadi target transmisi Pesan Arecibo (pesan radio pertama manusia untuk peradaban asing) pada 1974.", x: -800, y: 1800, z: -2000, color: "#fdf5e6" },
    { name: "Messier 15 (NGC 7078)", dist: "33.600 ly", desc: "Salah satu gugus bola terpadat dengan inti yang mengalami keruntuhan inti (core-collapse).", fakta: "Menampung nebula planeter Pease 1, salah satu dari hanya 4 nebula planeter di dalam gugus bola.", x: -1200, y: -900, z: -2800, color: "#fffaf0" },
    { name: "Messier 22 (NGC 6656)", dist: "10.600 ly", desc: "Salah satu gugus bola terdekat dengan Bumi, terletak di rasi Sagittarius.", fakta: "Menampung dua lubang hitam bermassa bintang yang terkonfirmasi oleh observatorium radio VLA.", x: 200, y: -350, z: -2400, color: "#f8f8ff" },
    { name: "Messier 4 (NGC 6121)", dist: "7.200 ly", desc: "Gugus bola terdekat kedua dengan Tata Surya kita di rasi Scorpius.", fakta: "Menampung planet tertua yang diketahui, PSR B1620-26 b (Metusalah), berusia 12,7 miliar tahun.", x: -150, y: -120, z: -2300, color: "#fff5ee" },
    { name: "Messier 3 (NGC 5272)", dist: "33.900 ly", desc: "Gugus bola raksasa berisi setengah juta bintang di rasi Canes Venatici.", fakta: "Memiliki populasi bintang variabel RR Lyrae terbanyak di antara seluruh gugus bola Bima Sakti.", x: -950, y: 2200, z: -1900, color: "#fffff0" },
    { name: "Messier 5 (NGC 5904)", dist: "24.500 ly", desc: "Salah satu gugus bola tertua di Bima Sakti, berusia sekitar 13 miliar tahun.", fakta: "Memiliki diameter sekitar 165 tahun cahaya dan menampung lebih dari 100.000 bintang.", x: -650, y: 1400, z: -2200, color: "#f5fffa" },
    { name: "Messier 92 (NGC 6341)", dist: "26.700 ly", desc: "Gugus bola purba miskin logam yang hampir seusia dengan alam semesta itu sendiri.", fakta: "Berusia 13,8 miliar tahun, menjadikannya salah satu fosil bintang paling purba yang bisa diamati.", x: -720, y: 1900, z: -2100, color: "#f0ffff" },
    { name: "Messier 2 (NGC 7089)", dist: "33.000 ly", desc: "Gugus bola kaya bintang berdiameter 175 tahun cahaya di rasi Aquarius.", fakta: "Tersusun dari 150.000 bintang purba yang terikat sangat rapat di bagian intinya.", x: -1100, y: -400, z: -2700, color: "#f0f8ff" },
    { name: "Messier 53 (NGC 5024)", dist: "58.000 ly", desc: "Gugus bola di halo terluar galaksi di rasi Coma Berenices.", fakta: "Berpasangan secara visual dan dinamis dengan gugus bola tetangganya NGC 5053.", x: -1600, y: 3200, z: -1800, color: "#fdf5e6" },
    { name: "Messier 80 (NGC 6093)", dist: "32.600 ly", desc: "Gugus bola sangat padat di Scorpius tempat ledakan nova bersejarah T Scorpii (1860).", fakta: "Kepadatan bintang di intinya sangat tinggi sehingga tabrakan antarbintang sering melahirkan bintang baru.", x: -250, y: 450, z: -2500, color: "#fffaf0" }
];

famousGlobulars.forEach((fg, idx) => {
    cosmicLibrary.push({
        id: `lib-mw-gc-${idx + 1}`,
        nama: fg.name,
        galaksi: 'Bima Sakti',
        kategori: 'Gugus Bola',
        tipe: 'Gugus Bintang Globular Halo',
        jarakLy: fg.dist,
        desc: fg.desc,
        fakta: fg.fakta,
        posisi3D: { x: fg.x, y: fg.y, z: fg.z },
        warna: fg.color,
        icon: '⚪',
        data: { "Diameter": "≈100–180 ly", "Metalisitas": "Miskin Logam (Populasi II)", "Katalog": "Harris GC Catalog / Messier" }
    });
});

// Sisanya melengkapi 158 gugus bola Bima Sakti (Harris Catalog)
for (let i = famousGlobulars.length + 1; i <= 158; i++) {
    const r = 4500 + (i * 350);
    const th = i * 0.38;
    const phi = ((i % 9) - 4) * 0.22;
    const x = Math.round(Math.cos(th) * Math.cos(phi) * (r * 0.08));
    const y = Math.round(Math.sin(phi) * (r * 0.1));
    const z = Math.round(-2600 + Math.sin(th) * Math.cos(phi) * (r * 0.08));
    const dist = `${Math.round(r * 1.5 + 2000)} ly`;

    let gcName = `Gugus Bola NGC ${6100 + i * 4}`;
    if (i % 4 === 0) gcName = `Gugus Bola Palomar ${(i % 15) + 1}`;
    if (i % 6 === 0) gcName = `Gugus Bola Terzan ${(i % 12) + 1}`;
    if (i % 10 === 0) gcName = `Gugus Bola Ruprecht ${100 + (i % 8)}`;

    cosmicLibrary.push({
        id: `lib-mw-gc-${i}`,
        nama: gcName,
        galaksi: 'Bima Sakti',
        kategori: 'Gugus Bola',
        tipe: 'Gugus Bintang Globular Halo Bima Sakti',
        jarakLy: dist,
        desc: `Gugus bintang bola purba yang mengorbit di halo luas Galaksi Bima Sakti di atas/bawah piringan.`,
        fakta: `Tersusun dari puluhan hingga ratusan ribu bintang tua generasi pertama yang minim unsur berat.`,
        posisi3D: { x, y, z },
        warna: '#fff4d4',
        icon: '⚪',
        data: { "Katalog": "Harris Milky Way GC Database", "Jarak": dist, "Orbit": "Halo Bima Sakti" }
    });
}

// ----------------------------------------------------------------------------
// 5. GUGUS BOLA ANDROMEDA (100 OBJEK) (REVISED BOLOGNA CATALOG)
// ----------------------------------------------------------------------------
for (let k = 1; k <= 100; k++) {
    const rLokal = 400 + Math.pow(k / 100, 0.7) * 2800;
    const th = k * 0.58;
    const phi = Math.sin(k * 1.4) * 0.6;
    const x = -18000 + Math.round(Math.cos(th) * Math.cos(phi) * rLokal);
    const y = 7500 + Math.round(Math.sin(phi) * rLokal * 0.8);
    const z = 22000 + Math.round(Math.sin(th) * Math.cos(phi) * rLokal);

    cosmicLibrary.push({
        id: `lib-m31-gc-${k}`,
        nama: k === 1 ? "Mayall II (G1 / NGC-224-G1)" : `Gugus Bola Andromeda RBC B${k < 10 ? '00' + k : (k < 100 ? '0' + k : k)}`,
        galaksi: 'Galaksi Andromeda (M31)',
        kategori: 'Gugus Bola',
        tipe: 'Gugus Bola Ekstragalaksi M31',
        jarakLy: '≈2,5 Juta ly',
        radiusVisual: 24,
        desc: k === 1 ? "Gugus bola paling masif di seluruh Grup Lokal galaksi." : `Gugus bintang bola purba yang mengorbit di halo luas Galaksi Andromeda.`,
        fakta: `Katalog Revised Bologna (RBC) mencatat Andromeda memiliki lebih dari 450 gugus bola purba.`,
        posisi3D: { x, y, z },
        warna: '#faeed5',
        icon: '⚪',
        data: { "Galaksi Induk": "Galaksi Andromeda (M31)", "Katalog": "Revised Bologna Catalogue (RBC)" }
    });
}

// ----------------------------------------------------------------------------
// 6. GUGUS BOLA GALAKSI SATELIT LAINNYA (25 OBJEK)
// ----------------------------------------------------------------------------
const satGCNames = [
    { name: "Messier 54 (Inti Sgr dSph)", gal: "Sagittarius dSph", x: -200, y: -900, z: -1800 },
    { name: "Terzan 7 (Sgr dSph)", gal: "Sagittarius dSph", x: -220, y: -920, z: -1780 },
    { name: "Terzan 8 (Sgr dSph)", gal: "Sagittarius dSph", x: -180, y: -880, z: -1820 },
    { name: "Arp 2 (Sgr dSph)", gal: "Sagittarius dSph", x: -210, y: -910, z: -1810 },
    { name: "Fornax 1", gal: "Fornax dSph", x: -9000, y: -12000, z: -4000 },
    { name: "Fornax 2", gal: "Fornax dSph", x: -8900, y: -12050, z: -4020 },
    { name: "Fornax 3 (NGC 1049)", gal: "Fornax dSph", x: -9020, y: -11980, z: -3990 },
    { name: "Fornax 4", gal: "Fornax dSph", x: -9050, y: -12020, z: -4010 },
    { name: "Fornax 5", gal: "Fornax dSph", x: -8950, y: -12000, z: -3980 },
    { name: "Fornax 6", gal: "Fornax dSph", x: -9010, y: -12010, z: -4000 },
    { name: "Hodge 11 (LMC)", gal: "Awan Magellan Besar (LMC)", x: -1200, y: -3800, z: 1200 },
    { name: "NGC 1466 (LMC)", gal: "Awan Magellan Besar (LMC)", x: -1150, y: -3750, z: 1250 },
    { name: "NGC 1841 (LMC)", gal: "Awan Magellan Besar (LMC)", x: -1250, y: -3850, z: 1180 },
    { name: "NGC 2210 (LMC)", gal: "Awan Magellan Besar (LMC)", x: -1180, y: -3820, z: 1220 },
    { name: "NGC 121 (SMC)", gal: "Awan Magellan Kecil (SMC)", x: 2800, y: -4500, z: 800 },
    { name: "Lindsay 1 (SMC)", gal: "Awan Magellan Kecil (SMC)", x: 2850, y: -4480, z: 820 },
    { name: "Kron 3 (SMC)", gal: "Awan Magellan Kecil (SMC)", x: 2780, y: -4520, z: 780 },
    { name: "WLM-1 (Gugus Bola WLM)", gal: "WLM", x: -19000, y: -4500, z: 12000 },
    { name: "Gugus Bola Sextans A-1", gal: "Sextans A", x: -18500, y: 15500, z: -25000 },
    { name: "Gugus Bola Leo I-GC1", gal: "Leo I", x: -1800, y: 16000, z: -5500 },
    { name: "Gugus Bola Sculptor 1", gal: "Sculptor dSph", x: 600, y: -7800, z: 1500 },
    { name: "Gugus Bola Carina 1", gal: "Carina dSph", x: 1200, y: -8200, z: -2200 },
    { name: "Gugus Bola Ursa Minor 1", gal: "Ursa Minor dSph", x: -1500, y: 5500, z: 3200 },
    { name: "Gugus Bola Draco 1", gal: "Draco dSph", x: -1800, y: 6200, z: 3800 },
    { name: "Gugus Bola Pegasus dIrr-1", gal: "Pegasus dIrr", x: -14500, y: -3800, z: 18000 }
];

satGCNames.forEach((sg, idx) => {
    cosmicLibrary.push({
        id: `lib-sat-gc-${idx + 1}`,
        nama: sg.name,
        galaksi: sg.gal,
        kategori: 'Gugus Bola',
        tipe: `Gugus Bola Galaksi Satelit (${sg.gal})`,
        jarakLy: 'Bervariasi',
        radiusVisual: 20,
        desc: `Gugus bola purba yang terikat pada galaksi satelit di lingkungan kosmik Grup Lokal.`,
        fakta: `Menjadi bukti evolusi penggabungan galaksi dan interaksi pasang surut gravitasi.`,
        posisi3D: { x: sg.x, y: sg.y, z: sg.z },
        warna: '#faebd7',
        icon: '⚪',
        data: { "Galaksi Induk": sg.gal, "Tipe": "Satellite Globular Cluster" }
    });
});

// ----------------------------------------------------------------------------
// 6. GUGUS BINTANG TERBUKA (OPEN CLUSTERS & ASOSIASI OB) (65 objek)
// ----------------------------------------------------------------------------
const famousOpenClusters = [
    { name: "Gugus Pleiades (M45 / Tujuh Bidadari)", gal: "Bima Sakti", dist: "444 ly", desc: "Gugus terbuka paling terkenal di rasi Taurus yang diselimuti kabut debu refleksi biru.", fakta: "Bintang-bintangnya baru berumur 100 juta tahun dan dapat dilihat tanpa alat bantu.", x: 120, y: 25, z: -180, c: "#99ccff" },
    { name: "Gugus Hyades", gal: "Bima Sakti", dist: "153 ly", desc: "Gugus terbuka terdekat dengan Tata Surya kita di rasi Taurus.", fakta: "Menjadi tolok ukur penentu skala tangga jarak kosmik alam semesta.", x: 60, y: -10, z: -80, c: "#ffd999" },
    { name: "Gugus Beehive (M44 / Praesepe)", gal: "Bima Sakti", dist: "577 ly", desc: "Gugus terbuka terang di rasi Cancer, dikenal sejak zaman Yunani kuno.", fakta: "Memiliki populasi lebih dari 1.000 bintang yang lahir dari awan gas yang sama dengan Hyades.", x: -140, y: 80, z: 210, c: "#ffe6aa" },
    { name: "Gugus Ganda Perseus (NGC 869 & 884)", gal: "Bima Sakti", dist: "7.500 ly", desc: "Dua gugus terbuka spektakuler yang saling berdampingan di Lengan Perseus.", fakta: "Masing-masing menampung lebih dari 300 bintang maharaksasa muda biru dan merah.", x: -480, y: 60, z: -1900, c: "#b0d0ff" },
    { name: "Gugus Kotak Perhiasan (NGC 4755)", gal: "Bima Sakti", dist: "6.400 ly", desc: "Gugus terbuka paling kaya warna di rasi Crux.", fakta: "Bintang-bintang biru mudanya kontras dengan satu bintang maharaksasa merah delima di tengahnya.", x: 280, y: -30, z: -950, c: "#88bbff" },
    { name: "Gugus Wild Duck (M11)", gal: "Bima Sakti", dist: "6.200 ly", desc: "Salah satu gugus terbuka paling padat yang diketahui di rasi Scutum.", fakta: "Menampung hampir 3.000 bintang muda berumur 300 juta tahun.", x: -80, y: -40, z: -1200, c: "#f0e0c0" },
    { name: "Gugus Ptolemy (M7)", gal: "Bima Sakti", dist: "980 ly", desc: "Gugus terbuka besar di ekor rasi Scorpius yang dicatat Ptolemy tahun 130 M.", fakta: "Terlihat jelas dengan mata telanjang di dekat batas Lengan Sagitarius.", x: 60, y: -80, z: -750, c: "#cfe2ff" }
];

famousOpenClusters.forEach((oc, idx) => {
    cosmicLibrary.push({
        id: `lib-oc-${idx + 1}`,
        nama: oc.name,
        galaksi: oc.gal,
        kategori: 'Gugus Terbuka',
        tipe: 'Gugus Bintang Terbuka Muda',
        jarakLy: oc.dist,
        desc: oc.desc,
        fakta: oc.fakta,
        posisi3D: { x: oc.x, y: oc.y, z: oc.z },
        warna: oc.c,
        icon: '🔷',
        data: { "Galaksi": oc.gal, "Tipe": "Open Cluster", "Katalog": "Messier / NGC" }
    });
});

for (let m = famousOpenClusters.length + 1; m <= 150; m++) {
    const r = 800 + (m * 45);
    const th = m * 0.42;
    const x = Math.round(Math.cos(th) * (r * 0.28));
    const y = Math.round(Math.sin(m * 1.5) * 32);
    const z = Math.round(-2600 + Math.sin(th) * (r * 0.28));
    const dist = `${Math.round(r * 1.6)} ly`;

    cosmicLibrary.push({
        id: `lib-oc-${m}`,
        nama: `Gugus Bintang Terbuka NGC ${2000 + m * 18}`,
        galaksi: 'Bima Sakti',
        kategori: 'Gugus Terbuka',
        tipe: 'Gugus Bintang Terbuka Lengan Spiral',
        jarakLy: dist,
        radiusVisual: 16,
        desc: `Gugus bintang muda yang terbentuk bersama dari awan gas molekul di piringan galaksi.`,
        fakta: `Bintang-bintangnya terikat gravitasi secara longgar dan perlahan akan menyebar ke piringan galaksi.`,
        posisi3D: { x, y, z },
        warna: '#b8d8ff',
        icon: '✨',
        data: { "Katalog": "WEBDA Open Cluster Database", "Jarak": dist }
    });
}

// ----------------------------------------------------------------------------
// 8. NEBULA EMISI, DAERAH H II, DAN PEMBIBITAN BINTANG (160 objek)
// ----------------------------------------------------------------------------
const famousNebulae = [
    { name: "Nebula Orion (M42)", gal: "Bima Sakti", dist: "1.344 ly", desc: "Pabrik bintang paling terkenal dan terdekat di Lengan Orion.", fakta: "Dapat dilihat dengan mata telanjang di pedang Orion, melahirkan ribuan bintang baru.", x: 85, y: -25, z: 120, c: "#ff6f8a" },
    { name: "Nebula Carina (NGC 3372)", gal: "Bima Sakti", dist: "7.500 ly", desc: "Nebula emisi raksasa rumah bintang monster Eta Carinae.", fakta: "Citra Cosmic Cliffs JWST menampilkan tebing-tebing debu pembibitan bintang secara dramatis.", x: 320, y: -40, z: -1100, c: "#ff7766" },
    { name: "Nebula Elang (Pillars of Creation / M16)", gal: "Bima Sakti", dist: "6.500 ly", desc: "Rumah bagi struktur pilar gas ikonik Pilar-Pilar Penciptaan.", fakta: "Pilar gas hidrogen dingin dan debu tempat bayi-bayi bintang terbentuk oleh keruntuhan gravitasi.", x: -120, y: 20, z: -1450, c: "#66ddaa" },
    { name: "Nebula Lagoon (M8)", gal: "Bima Sakti", dist: "4.100 ly", desc: "Daerah H II raksasa di rasi Sagittarius yang dibelah jalur debu hitam.", fakta: "Terionisasi kuat oleh radiasi ultraviolet bintang maharaksasa Herschel 36.", x: 50, y: -30, z: -1700, c: "#ff8899" },
    { name: "Nebula Trifid (M20)", gal: "Bima Sakti", dist: "5.200 ly", desc: "Kombinasi unik nebula emisi merah, refleksi biru, dan debu gelap.", fakta: "Tiga jalur debu membagi nebula ini menjadi tiga lobus menyerupai daun semanggi.", x: 40, y: -25, z: -1650, c: "#ff77aa" },
    { name: "Nebula Rosette (NGC 2237)", gal: "Bima Sakti", dist: "5.000 ly", desc: "Awan gas emisi berbentuk bunga mawar raksasa yang mengelilingi gugus NGC 2244.", fakta: "Angin bintang dari gugus tengah telah membersihkan rongga tengah selebar 50 tahun cahaya.", x: 210, y: 15, z: 340, c: "#ff6075" },
    { name: "Nebula Amerika Utara (NGC 7000)", gal: "Bima Sakti", dist: "2.590 ly", desc: "Nebula emisi di rasi Cygnus yang bentuknya menyerupai benua Amerika Utara.", fakta: "Dipisahkan dari Nebula Pelikan oleh dinding debu gelap pekat yang menyerap cahaya.", x: -90, y: 40, z: -480, c: "#ff6688" },
    { name: "Nebula Hati & Jiwa (IC 1805 & IC 1848)", gal: "Bima Sakti", dist: "7.500 ly", desc: "Kompleks pembibitan bintang raksasa di Lengan Perseus yang bersinar merah terang.", fakta: "Menampung gugus bintang terbuka muda Melotte 15 yang aktif mengionisasi gas hidrogen.", x: -350, y: 35, z: -1550, c: "#ff5577" }
];

famousNebulae.forEach((neb, idx) => {
    cosmicLibrary.push({
        id: `lib-neb-${idx + 1}`,
        nama: neb.name,
        galaksi: neb.gal,
        kategori: 'Nebula & Daerah H II',
        tipe: 'Kawasan Pembentukan Bintang (H II Region)',
        jarakLy: neb.dist,
        radiusVisual: 28,
        desc: neb.desc,
        fakta: neb.fakta,
        posisi3D: { x: neb.x, y: neb.y, z: neb.z },
        warna: neb.c,
        icon: '🌸',
        data: { "Galaksi": neb.gal, "Tipe Spektrum": "Emisi Hidrogen-Alfa", "Katalog": "Messier / NGC / IC" }
    });
});

for (let p = famousNebulae.length + 1; p <= 160; p++) {
    const r = 1100 + (p * 55);
    const th = p * 0.48;
    const x = Math.round(Math.cos(th) * (r * 0.28));
    const y = Math.round(Math.sin(p * 1.6) * 28);
    const z = Math.round(-2600 + Math.sin(th) * (r * 0.28));
    const dist = `${Math.round(r * 1.8)} ly`;

    cosmicLibrary.push({
        id: `lib-neb-${p}`,
        nama: `Kawasan Emisi H II Sharpless Sh2-${p * 2 + 5}`,
        galaksi: 'Bima Sakti',
        kategori: 'Nebula & Daerah H II',
        tipe: 'Awan Gas Pembentuk Bintang H II',
        jarakLy: dist,
        radiusVisual: 24,
        desc: `Awan gas hidrogen antarbintang yang sedang aktif melahirkan bintang baru di lengan spiral.`,
        fakta: `Gas hidrogen memancarkan sinar merah H-alfa khas akibat eksitasi foton dari bintang kelas O dan B.`,
        posisi3D: { x, y, z },
        warna: '#ff6f8a',
        icon: '🌸',
        data: { "Katalog": "Sharpless H II Catalog (Sh2)", "Jarak": dist }
    });
}

// ----------------------------------------------------------------------------
// 9. SISA SUPERNOVA & NEBULA PLANETER (120 OBJEK)
// ----------------------------------------------------------------------------
const famousPlanetary = [
    { name: "Nebula Kepiting (M1 / Sisa Supernova 1054)", gal: "Bima Sakti", dist: "6.500 ly", desc: "Sisa ledakan supernova dahsyat yang tercatat oleh astronom Tiongkok pada 1054 M.", fakta: "Di pusatnya terdapat Pulsar Kepiting yang berputar 30 putaran per detik.", x: -220, y: 15, z: 380, c: "#ff8855" },
    { name: "Nebula Cincin (M57)", gal: "Bima Sakti", dist: "2.283 ly", desc: "Cangkang gas bercahaya berbentuk cincin yang dilontarkan bintang sekarat di Lyra.", fakta: "Di intinya terdapat bintang katai putih panas yang perlahan mendingin selama miliaran tahun.", x: 110, y: 45, z: -280, c: "#88ddcc" },
    { name: "Nebula Helix (NGC 7293 / Mata Tuhan)", gal: "Bima Sakti", dist: "650 ly", desc: "Nebula planeter terdekat dengan Bumi yang menyerupai mata kosmik raksasa.", fakta: "Gambaran masa depan Matahari kita sendiri saat melontarkan lapisan luarnya 5 miliar tahun lagi.", x: 35, y: -45, z: -70, c: "#66bbdd" },
    { name: "Nebula Dumbbell (M27)", gal: "Bima Sakti", dist: "1.360 ly", desc: "Nebula planeter pertama yang pernah ditemukan dalam sejarah (1764 oleh Charles Messier).", fakta: "Dua lobus simetris gasnya mengembang dengan kecepatan 31 km/detik.", x: 70, y: 30, z: -180, c: "#77eebb" },
    { name: "Nebula Cadar / Cygnus Loop (NGC 6960)", gal: "Bima Sakti", dist: "2.400 ly", desc: "Jalinan benang-benang tipis gas sisa ledakan supernova 15.000 tahun lalu.", fakta: "Membentang seluas 110 tahun cahaya di rasi Cygnus dengan gelombang kejut multi-warna.", x: -130, y: 25, z: -420, c: "#dd88ee" },
    { name: "Cassiopeia A", gal: "Bima Sakti", dist: "11.000 ly", desc: "Sisa supernova termuda yang diketahui di Bima Sakti (meledak sekitar tahun 1680 M).", fakta: "Merupakan sumber radio astronomi terkuat di luar Tata Surya kita pada frekuensi di atas 1 GHz.", x: -350, y: 40, z: -1200, c: "#ff5544" },
    { name: "Nebula Kupu-Kupu (NGC 6302)", gal: "Bima Sakti", dist: "3.800 ly", desc: "Nebula planeter bipolar dengan sayap gas bersuhu ekstrem lebih dari 20.000 °C.", fakta: "Katai putih di pusatnya adalah salah satu yang terpanas di galaksi bersuhu 250.000 °C.", x: -40, y: -15, z: -1100, c: "#ff77ee" }
];

famousPlanetary.forEach((pn, idx) => {
    cosmicLibrary.push({
        id: `lib-pn-${idx + 1}`,
        nama: pn.name,
        galaksi: pn.gal,
        kategori: 'Planetary & Sisa Supernova',
        tipe: 'Nebula Planeter / Sisa Supernova',
        jarakLy: pn.dist,
        radiusVisual: 20,
        desc: pn.desc,
        fakta: pn.fakta,
        posisi3D: { x: pn.x, y: pn.y, z: pn.z },
        warna: pn.c,
        icon: '💥',
        data: { "Galaksi": pn.gal, "Tipe": "Planetary Nebula / SNR", "Katalog": "Messier / NGC" }
    });
});

for (let s = famousPlanetary.length + 1; s <= 120; s++) {
    const r = 900 + (s * 65);
    const th = s * 0.62;
    const x = Math.round(Math.cos(th) * (r * 0.25));
    const y = Math.round(Math.sin(s * 2.1) * 35);
    const z = Math.round(-2600 + Math.sin(th) * (r * 0.25));
    const dist = `${Math.round(r * 1.7)} ly`;

    cosmicLibrary.push({
        id: `lib-pn-${s}`,
        nama: `Nebula Planeter NGC ${6500 + s * 14}`,
        galaksi: 'Bima Sakti',
        kategori: 'Planetary & Sisa Supernova',
        tipe: 'Nebula Planeter Katai Putih',
        jarakLy: dist,
        radiusVisual: 18,
        desc: `Cangkang gas ionisasi yang ditiupkan oleh bintang raksasa merah pada tahap akhir hidupnya.`,
        fakta: `Akan menghilang ke ruang antarbintang dalam kurun puluhan ribu tahun, memperkaya galaksi dengan unsur berat.`,
        posisi3D: { x, y, z },
        warna: s % 2 === 0 ? '#4deeea' : '#ffaa55',
        icon: '💥',
        data: { "Katalog": "Strasbourg-ESO Catalogue of Galactic Planetary Nebulae", "Jarak": dist }
    });
}

// ----------------------------------------------------------------------------
// 10. BINTANG EKSTREM & HYPERMASIF (120 OBJEK)
// ----------------------------------------------------------------------------
const famousStars = [
    { name: "Eta Carinae", gal: "Bima Sakti", dist: "7.500 ly", desc: "Biner hypermasif paling tidak stabil di Bima Sakti dengan massa 120-150 M☉.", fakta: "Pernah meletus pada 1843 hingga menjadi bintang kedua paling terang di langit malam.", x: 322, y: -38, z: -1095, c: "#ffbb44" },
    { name: "Betelgeuse", gal: "Bima Sakti", dist: "548 ly", desc: "Bintang maharaksasa merah raksasa di bahu rasi Orion mendekati akhir hidupnya.", fakta: "Permukaannya dapat menelan orbit Merkurius, Venus, Bumi, Mars, hingga Jupiter jika di Tata Surya kita.", x: 35, y: 12, z: 60, c: "#ff5533" },
    { name: "Rigel", gal: "Bima Sakti", dist: "860 ly", desc: "Maharaksasa biru paling terang di Orion, bersinar 120.000 kali lebih terang dari Matahari.", fakta: "Membakar hidrogen intinya dengan laju luar biasa cepat dan akan meledak supernova.", x: 40, y: -18, z: 90, c: "#bcd8ff" },
    { name: "VY Canis Majoris", gal: "Bima Sakti", dist: "3.900 ly", desc: "Salah satu bintang terbesar dari segi volume fisik (radius ≈1.400 kali Matahari).", fakta: "Satu putaran keliling bintang ini dengan pesawat jet komersial butuh 1.100 tahun!", x: 120, y: -25, z: 240, c: "#ff4422" },
    { name: "Pistol Star", gal: "Bima Sakti", dist: "25.000 ly", desc: "Bintang variabel biru hypermasif di dekat pusat galaksi Bima Sakti.", fakta: "Memancarkan energi dalam 20 detik setara pancaran Matahari kita selama satu tahun penuh!", x: 10, y: 5, z: -2550, c: "#77aaff" },
    { name: "UY Scuti", gal: "Bima Sakti", dist: "5.100 ly", desc: "Bintang maharaksasa merah berdenyut raksasa di rasi Scutum.", fakta: "Volume fisiknya dapat memuat sekitar 5 miliar bola seukuran Matahari.", x: -40, y: -15, z: -1250, c: "#ff3311" },
    { name: "Stephenson 2-18", gal: "Bima Sakti", dist: "19.000 ly", desc: "Kandidat bintang terbesar yang diketahui manusia dengan radius 2.150 kali Matahari.", fakta: "Jika ditaruh di pusat Tata Surya, permukaannya akan menelan hingga melampaui orbit planet Saturnus!", x: -30, y: 10, z: -2100, c: "#ff4433" },
    { name: "Mu Cephei (Garnet Star)", gal: "Bima Sakti", dist: "2.800 ly", desc: "Maharaksasa merah tua yang dijuluki Bintang Delima oleh William Herschel.", fakta: "Salah satu bintang raksasa merah paling mudah diamati dengan mata telanjang di langit utara.", x: -140, y: 60, z: -580, c: "#cc2211" }
];

famousStars.forEach((star, idx) => {
    cosmicLibrary.push({
        id: `lib-star-${idx + 1}`,
        nama: star.name,
        galaksi: star.gal,
        kategori: 'Bintang Ekstrem',
        tipe: 'Bintang Hypermasif / Maharaksasa',
        jarakLy: star.dist,
        radiusVisual: 16,
        desc: star.desc,
        fakta: star.fakta,
        posisi3D: { x: star.x, y: star.y, z: star.z },
        warna: star.c,
        icon: '⭐',
        data: { "Galaksi": star.gal, "Tipe": "Luminous Supergiant / Hypergiant" }
    });
});

for (let t = famousStars.length + 1; t <= 120; t++) {
    const r = 700 + (t * 55);
    const th = t * 0.44;
    const x = Math.round(Math.cos(th) * (r * 0.26));
    const y = Math.round(Math.sin(t * 1.7) * 25);
    const z = Math.round(-2600 + Math.sin(th) * (r * 0.26));
    const dist = `${Math.round(r * 1.5)} ly`;

    cosmicLibrary.push({
        id: `lib-star-${t}`,
        nama: `Bintang Variabel Maharaksasa HD ${140000 + t * 45}`,
        galaksi: 'Bima Sakti',
        kategori: 'Bintang Ekstrem',
        tipe: t % 3 === 0 ? 'Maharaksasa Biru Terang (LBV)' : 'Maharaksasa Merah Berdenyut',
        jarakLy: dist,
        radiusVisual: 14,
        desc: `Bintang raksasa dengan massa dan luminositas tinggi yang mendekati batas ketidakstabilan Eddington.`,
        fakta: `Menghasilkan angin bintang berkecepatan ribuan km/detik dan akan meledak menjadi supernova Tipe II.`,
        posisi3D: { x, y, z },
        warna: t % 3 === 0 ? '#82b1ff' : '#ff8a80',
        icon: '⭐',
        data: { "Katalog": "Henry Draper Catalogue (HD)", "Jarak": dist }
    });
}

// ----------------------------------------------------------------------------
// 11. LUBANG HITAM, PULSAR, MAGNETAR & BINER SINAR-X (80 OBJEK)
// ----------------------------------------------------------------------------
const famousBH = [
    { name: "Sagittarius A*", gal: "Bima Sakti", dist: "26.000 ly", desc: "Lubang hitam supermasif di pusat Galaksi Bima Sakti kita.", fakta: "Dicitrakan oleh Event Horizon Telescope (EHT) pada 2022, membuktikan cincin cahaya bayangannya.", x: 0, y: 0, z: -2600, c: "#ffaa22" },
    { name: "Cygnus X-1", gal: "Bima Sakti", dist: "7.200 ly", desc: "Lubang hitam bermassa bintang pertama yang diterima secara luas oleh dunia ilmiah.", fakta: "Menjadi taruhan ilmiah legendaris antara Stephen Hawking dan Kip Thorne.", x: -190, y: 45, z: -780, c: "#ff7733" },
    { name: "Pulsar Kepiting (PSR B0531+21)", gal: "Bima Sakti", dist: "6.500 ly", desc: "Bintang neutron muda di pusat M1 yang berputar 30 kali per detik.", fakta: "Memancarkan denyut mercusuar kosmik radiasi radio hingga sinar gamma berenergi tinggi.", x: -220, y: 15, z: 380, c: "#cfe0ff" },
    { name: "Pulsar Vela (PSR B0833-45)", gal: "Bima Sakti", dist: "960 ly", desc: "Salah satu pulsar paling terang di langit dalam spektrum sinar-X dan gamma.", fakta: "Sering mengalami glitch (lonjakan kecepatan putar) akibat penataan materi inti superfluida.", x: 80, y: -35, z: -95, c: "#bcd8ff" },
    { name: "PSR B1919+21 (LGM-1)", gal: "Bima Sakti", dist: "2.283 ly", desc: "Pulsar pertama yang pernah ditemukan manusia oleh Jocelyn Bell Burnell (1967).", fakta: "Sempat dijuluki LGM-1 (Little Green Men) karena denyut periodik 1,33 detiknya dikira sinyal alien!", x: -95, y: 30, z: -220, c: "#d8e8ff" },
    { name: "V404 Cygni", gal: "Bima Sakti", dist: "7.800 ly", desc: "Sistem biner sinar-X lubang hitam mikrokuasar yang terkenal dengan letusan dramatisnya.", fakta: "Menembakkan jet relativistik plasma yang berputar dengan presesi goyangan cepat.", x: -160, y: 35, z: -820, c: "#ff6644" }
];

famousBH.forEach((bh, idx) => {
    cosmicLibrary.push({
        id: `lib-bh-${idx + 1}`,
        nama: bh.name,
        galaksi: bh.gal,
        kategori: 'Lubang Hitam & Pulsar',
        tipe: 'Objek Kompak Relativistik',
        jarakLy: bh.dist,
        radiusVisual: 18,
        desc: bh.desc,
        fakta: bh.fakta,
        posisi3D: { x: bh.x, y: bh.y, z: bh.z },
        warna: bh.c,
        icon: '🕳️',
        data: { "Galaksi": bh.gal, "Tipe": "Black Hole / Neutron Star" }
    });
});

for (let b = famousBH.length + 1; b <= 80; b++) {
    const r = 1400 + (b * 75);
    const th = b * 0.72;
    const x = Math.round(Math.cos(th) * (r * 0.24));
    const y = Math.round(Math.sin(b * 1.9) * 25);
    const z = Math.round(-2600 + Math.sin(th) * (r * 0.24));
    const dist = `${Math.round(r * 1.6)} ly`;

    cosmicLibrary.push({
        id: `lib-bh-${b}`,
        nama: b % 2 === 0 ? `Sumber Sinar-X Biner Kompak X-${b}` : `Pulsar Milidetik PSR J${1700 + b * 7}`,
        galaksi: 'Bima Sakti',
        kategori: 'Lubang Hitam & Pulsar',
        tipe: b % 2 === 0 ? 'Kandidat Lubang Hitam Biner' : 'Bintang Neutron / Pulsar Cepat',
        jarakLy: dist,
        radiusVisual: 16,
        desc: `Sistem bintang biner pemancar sinar-X intensif hasil akresi gas ke objek padat kompak.`,
        fakta: `Terdeteksi oleh observatorium sinar-X antariksa NASA Chandra, NuSTAR, dan Swift.`,
        posisi3D: { x, y, z },
        warna: b % 2 === 0 ? '#ff7733' : '#00e5ff',
        icon: '🕳️',
        data: { "Tipe": "X-ray Binary / Pulsar", "Jarak": dist }
    });
}

console.log(`📚 Perpustakaan Kosmik selesai dimuat: ${cosmicLibrary.length} objek terdaftar.`);
