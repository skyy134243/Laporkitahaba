Rencana Transformasi & Pengembangan Simulasi Kosmik: 49 Galaksi NASA & Framework Siap Vercel / Antigravity
Dokumen ini memuat rencana menyeluruh untuk menganalisis, mengidentifikasi kekurangan file HTML saat ini, menambahkan pendataan akurat NASA untuk 49 galaksi di sekitar Bima Sakti kita (Local Group & Kosmik Sekitar), merestrukturisasi sistem rendering volumetrik 3D kosmik, serta mengubah arsitektur monolitik HTML menjadi framework modular modern dengan sistem Alur Fase Berjenjang (Cosmic Stages) yang siap dijalankan di Antigravity dan di-deploy ke Vercel.

1. Identifikasi Masalah & Kekurangan pada HTML Saat Ini
Bottleneck Performa Tekstur Kanvas (Heavy CPU/GPU Freeze):
File lama menghasilkan banyak kanvas resolusi 4096×2048 piksel secara sinkron di main thread pada saat loading (buatTeksturBerbatu, buatTeksturGasRaksasa, buatTeksturGalaksiSpiral). Hal ini menyebabkan browser freeze (macet beberapa detik) saat pertama kali dimuat.
Solusi: Optimasi generator tekstur dengan caching pintar, procedural shader/material Three.js ringan, serta pemakaian LOD (Level of Detail) atau resolusi bertingkat.
Keterbatasan Galaksi (Baru ada 3 galaksi utama + segelintir katai):
Saat ini baru ada Bima Sakti, Andromeda, Triangulum, dan beberapa katai kecil.
Solusi: Menambahkan 46 galaksi tambahan (total tepat 49 galaksi) dengan data astronomi NASA / Extragalactic Database (NED) / Gaia / Hubble lengkap (koordinat 3D, tipe morfologi Hubble, jarak ly, diameter, jumlah bintang, fakta sejarah penemuan).
Depth Buffer & Z-Fighting pada Rentang Skala Ekstrem:
camera.near = 0.1 dan camera.far = 80000 tanpa logarithmicDepthBuffer: true menyebabkan kedip visual (Z-fighting) pada objek yang berdekatan atau cincin orbit.
Solusi: Mengaktifkan logarithmicDepthBuffer: true pada WebGLRenderer dan membagi jarak pandang berdasarkan fase aktif.
Ketiadaan Alur Fase / Stage Kosmik (Semua Objek Menumpuk Sekaligus):
Pengguna harus zoom manual dari ukuran planet (0.5 unit) hingga galaksi 38.000 unit tanpa navigasi level kosmik.
Solusi: Membangun Cosmic Stage Manager (5 Fase Kosmik) yang memungkinkan pengguna berpindah fokus skala secara teratur dan sinematik.
Arsitektur Monolitik:
Lebih dari 1.100 baris kode bertumpuk dalam satu file .html tunggal, menyulitkan ekspansi dan pemeliharaan.
Solusi: Memecah menjadi struktur modular modern (ES Modules) yang ramah Vercel dan Antigravity, serta menyediakan file bundel/distribution standalone agar tetap bisa dijalankan langsung di browser lokal tanpa dependency rumit.
2. Struktur Framework Siap Vercel & Antigravity
Proyek akan dibuat di:
C:\Users\asus\.gemini\antigravity\scratch\cosmic-galaxy-simulator


cosmic-galaxy-simulator/
├── index.html              # Entry point aplikasi (Clean, modern, responsive UI)
├── vercel.json             # Konfigurasi deployment instan untuk Vercel
├── package.json            # Manifest proyek (scripts, metadata, compatibility)
├── css/
│   └── style.css           # Styling glassmorphism futuristik, responsive dasbor, panel & selector stage
├── js/
│   ├── main.js             # Inisialisasi Three.js scene, render loop, event listener
│   ├── config.js           # Konstanta skala kosmik, konfigurasi kamera & kontrol
│   ├── data/
│   │   ├── solarSystemData.js   # Database Tata Surya, wahana NASA, bintang tetangga
│   │   └── galaxiesData.js      # Database LENGKAP 49 Galaksi NASA (Local Group & sekitarnya)
│   ├── stages/
│   │   └── stageManager.js      # Controller 5 Fase Kosmik (Stage 1 s/d Stage 5)
│   ├── renderers/
│   │   ├── textureGenerator.js  # Generator tekstur prosedural teroptimasi (anti-freeze)
│   │   ├── celestialFactory.js  # Pembuat planet, satelit, bintang, pulsar, black hole
│   │   └── galaxyFactory.js     # Pembuat galaksi kosmik 3D (Spiral, Eliptis, Katai, Ireguler)
│   └── ui/
│       ├── dashboard.js         # Dasbor kiri (lipat/ringkas/sembunyi), legenda interaktif
│       ├── infoPanel.js         # Side panel detail objek, data kunci, fakta NASA
│       ├── searchBar.js         # Fitur pencarian instan untuk seluruh 49 galaksi & objek langit
│       └── stageUI.js           # Navigasi visual tombol 5 Fase Kosmik & mode tur sinematik
└── README.md               # Dokumentasi alur proyek, cara menjalankan lokal & deploy Vercel
3. Database NASA: 49 Galaksi di Lingkungan Bima Sakti (Grup Lokal)
Simulasi akan memuat tepat 49 Galaksi dengan parameter astronomis akurat dari NASA Extragalactic Database (NED) / Hubble / Gaia:

No	Nama Galaksi	Tipe Morfologi	Jarak dari Bumi	Diameter	Estimasi Bintang
1	Bima Sakti (Milky Way)	SBbc (Spiral Berpalang)	0 ly (Rumah Kita)	≈100.000–180.000 ly	100–400 Miliar
2	Awan Magellan Besar (LMC)	SB(s)m (Katai Ireguler/Spiral)	≈163.000 ly	≈14.000 ly	≈20 Miliar
3	Awan Magellan Kecil (SMC)	SB(s)m pec (Katai Ireguler)	≈200.000 ly	≈7.000 ly	≈3 Miliar
4	Sagittarius Dwarf Spheroidal (Sgr dSph)	dSph / dE (Katai Sferoid)	≈70.000 ly	≈10.000 ly	≈100 Juta
5	Canis Major Overdensity	Irr / dSph (Katai Terdisrupsi)	≈25.000 ly	≈5.000 ly	≈1 Miliar
6	Ursa Major I Dwarf (UMa I)	dSph (Katai Sferoid)	≈330.000 ly	≈2.000 ly	Beberapa Juta
7	Ursa Major II Dwarf (UMa II)	dSph (Katai Sferoid Ultra-redup)	≈98.000 ly	≈1.500 ly	≈1 Juta
8	Ursa Minor Dwarf	dSph (Katai Sferoid)	≈225.000 ly	≈2.000 ly	≈10 Juta
9	Draco Dwarf	dSph (Katai Sferoid)	≈260.000 ly	≈2.500 ly	≈10 Juta
10	Sculptor Dwarf	dSph (Katai Sferoid)	≈280.000 ly	≈3.000 ly	≈15 Juta
11	Sextans Dwarf	dSph (Katai Sferoid)	≈290.000 ly	≈2.500 ly	≈12 Juta
12	Fornax Dwarf	dSph (Katai Sferoid Bersatelit)	≈460.000 ly	≈6.000 ly	≈100 Juta
13	Carina Dwarf	dSph (Katai Sferoid)	≈330.000 ly	≈2.000 ly	≈15 Juta
14	Leo I (Regulus Dwarf)	dSph (Katai Sferoid Terjauh Bima Sakti)	≈820.000 ly	≈3.500 ly	≈30 Juta
15	Leo II (Leo B)	dSph (Katai Sferoid)	≈670.000 ly	≈2.800 ly	≈20 Juta
16	Leo IV Dwarf	dSph (Ultra-faint Dwarf)	≈500.000 ly	≈1.200 ly	≈1 Juta
17	Leo V Dwarf	dSph (Ultra-faint Dwarf)	≈570.000 ly	≈1.000 ly	≈500.000
18	Leo T Dwarf	dIrr / dSph (Transisional Aktif Gas)	≈1.370.000 ly	≈2.000 ly	≈5 Juta
19	Bootes I Dwarf	dSph (Katai Sferoid Ultra-redup)	≈197.000 ly	≈1.500 ly	≈1 Juta
20	Bootes II Dwarf	dSph (Katai Sferoid Ultra-redup)	≈136.000 ly	≈800 ly	≈200.000
21	Bootes III Dwarf	dSph (Katai Terurai Pasang Surut)	≈150.000 ly	≈2.500 ly	≈2 Juta
22	Coma Berenices Dwarf	dSph (Ultra-faint Dwarf)	≈143.000 ly	≈1.000 ly	≈500.000
23	Canes Venatici I Dwarf (CVn I)	dSph (Katai Sferoid)	≈711.000 ly	≈3.000 ly	≈10 Juta
24	Canes Venatici II Dwarf (CVn II)	dSph (Ultra-faint Dwarf)	≈490.000 ly	≈1.200 ly	≈1 Juta
25	Hercules Dwarf	dSph (Katai Sferoid Terdistorsi)	≈430.000 ly	≈2.200 ly	≈2 Juta
26	Corona Borealis II Dwarf	dSph (Ultra-faint Dwarf)	≈460.000 ly	≈1.000 ly	≈500.000
27	Crater II Dwarf (The Feeble Giant)	dSph (Raksasa Redup)	≈380.000 ly	≈7.000 ly	≈5 Juta
28	Hydrus I Dwarf	dSph (Ultra-faint Dwarf)	≈91.000 ly	≈1.100 ly	≈300.000
29	Tucana II Dwarf	dSph (Ultra-faint Dwarf)	≈190.000 ly	≈1.400 ly	≈1 Juta
30	Galaksi Andromeda (M31 / NGC 224)	SA(s)b (Spiral Raksasa)	≈2.500.000 ly	≈220.000 ly	≈1 Triliun
31	Messier 32 (M32 / NGC 221)	cE2 (Eliptis Kompak)	≈2.490.000 ly	≈6.500 ly	≈3 Miliar
32	Messier 110 (M110 / NGC 205)	dE5 pec (Eliptis Katai)	≈2.690.000 ly	≈15.000 ly	≈10 Miliar
33	NGC 147 (DDO 3)	dE5 pec (Eliptis Katai)	≈2.530.000 ly	≈10.000 ly	≈2 Miliar
34	NGC 185 (UGC 396)	dE3 pec (Eliptis Katai Aktif)	≈2.080.000 ly	≈9.700 ly	≈2 Miliar
35	Andromeda I	dSph (Katai Sferoid Andromeda)	≈2.430.000 ly	≈3.000 ly	≈20 Juta
36	Andromeda II	dSph (Katai Sferoid Andromeda)	≈2.220.000 ly	≈3.200 ly	≈25 Juta
37	Andromeda III	dSph (Katai Sferoid Andromeda)	≈2.440.000 ly	≈2.500 ly	≈15 Juta
38	Andromeda V	dSph (Katai Sferoid Andromeda)	≈2.520.000 ly	≈2.000 ly	≈10 Juta
39	Andromeda VII (Cassiopeia Dwarf)	dSph (Katai Sferoid Andromeda)	≈2.580.000 ly	≈3.500 ly	≈30 Juta
40	Andromeda IX	dSph (Ultra-faint Andromeda)	≈2.500.000 ly	≈1.800 ly	≈2 Juta
41	Galaksi Triangulum (M33 / NGC 598)	SA(s)cd (Spiral Flocculent)	≈2.730.000 ly	≈60.000 ly	≈40 Miliar
42	IC 10	dIrr (Katai Starburst)	≈2.200.000 ly	≈5.000 ly	≈500 Juta
43	IC 1613 (Caldwell 51)	IB(s)m (Katai Ireguler Murni)	≈2.380.000 ly	≈11.000 ly	≈1 Miliar
44	Wolf-Lundmark-Melotte (WLM)	IB(s)m (Ireguler Terisolasi)	≈3.040.000 ly	≈8.000 ly	≈800 Juta
45	Barnard's Galaxy (NGC 6822)	IB(s)m (Katai Ireguler)	≈1.630.000 ly	≈7.000 ly	≈1 Miliar
46	Pisces Dwarf (LGS 3)	dIrr / dSph (Transisional)	≈2.510.000 ly	≈3.000 ly	≈20 Juta
47	Pegasus Dwarf Irregular (DDO 216)	dIrr (Katai Ireguler)	≈3.000.000 ly	≈5.500 ly	≈100 Juta
48	Aquarius Dwarf (DDO 210)	IB(s)m (Katai Terpencil)	≈3.200.000 ly	≈3.500 ly	≈50 Juta
49	Tucana Dwarf	dSph (Katai Sferoid Terisolasi)	≈2.870.000 ly	≈2.500 ly	≈15 Juta
4. Alur 5 Fase Kosmik (Cosmic Stages)
Setiap fase memiliki target kamera, rentang zoom pandang, label visual, dan objek aktif:

Fase 1: Tata Surya & Wahana (Solar System & Human Spacecrafts)
Fokus: Matahari, planet-planet, satelit alami, 500+ asteroid, komet, ISS, Hubble, JWST, Voyager.
Skala: 0 s/d 200 unit.
Fase 2: Lingkungan Bintang Tetangga (Interstellar Neighborhood)
Fokus: Alpha Centauri (A, B, Proxima b), Sirius A/B, Barnard's Star, TRAPPIST-1, pulsar Vela/Kepiting, nebula lokal.
Skala: 200 s/d 1.500 unit.
Fase 3: Galaksi Bima Sakti & Pengiringnya (Milky Way & Satellites)
Fokus: Sagittarius A*, struktur palang dan 6 lengan spiral Bima Sakti, LMC, SMC, Sgr dSph, Fornax, Sculptor, dsb.
Skala: 1.500 s/d 15.000 unit.
Fase 4: Subgrup Andromeda & Triangulum (Andromeda & Triangulum Subgroups)
Fokus: Andromeda (M31) beserta satelit eliptis M32, M110, NGC 147, NGC 185, And I-IX, serta galaksi Triangulum (M33).
Skala: 15.000 s/d 40.000 unit.
Fase 5: Jaringan Kosmik Grup Lokal (Cosmic Web - All 49 Galaxies)
Fokus: Tampilan makrokosmik seluruh 49 galaksi, garis jaring gravitasi / filament kosmik, selector kategori morfologi, serta tombol Cinematic Cosmic Tour otomatis yang terbang mengitari galaksi-galaksi pilihan secara spektakuler.
Skala: 0 s/d 80.000 unit.
5. Rencana Verifikasi
Pengujian Sintaks & Struktur File:
Memastikan semua modul ES6 (import/export) terhubung rapi tanpa circular dependency.
Memastikan vercel.json dan konfigurasi static serve valid.
Pengujian Performa & Rendering Three.js:
Memastikan tidak ada browser lag saat inisialisasi awal.
Memastikan logarithmicDepthBuffer mencegah z-fighting.
Memeriksa akurasi klik raycaster pada seluruh 49 galaksi dan objek langit.
Pengujian Fitur UI & Interaktivitas:
Selector 5 Fase Kosmik (tombol transisi mulus).
Search bar (mencari galaksi/objek dan kamera langsung terbang ke sana).
Filter morfologi (Spiral, Eliptis, Katai, Ireguler).
Mode dasbor (Penuh / Ringkas / Sembunyi).
Tur Sinematik Kosmik otomatis.
