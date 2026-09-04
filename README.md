# 🌌 Cosmic Galaxy Simulator (49 Galaksi NASA & Tata Surya)

Simulasi 3D kosmik interaktif berbasis **Three.js** yang memodelkan Tata Surya lengkap dan **49 Galaksi di lingkungan Bima Sakti (Grup Lokal & sekitarnya)** menggunakan data astronomis resmi dari **NASA/IPAC Extragalactic Database (NED)**, **ESA Gaia DR3**, dan **Teleskop Luar Angkasa Hubble**.

Proyek ini telah dikonversi dari HTML monolitik menjadi **framework web modular modern** yang siap dijalankan secara lokal di Antigravity dan langsung dapat di-deploy ke **Vercel** dengan konfigurasi otomatis.

---

## ✨ Fitur Utama

1. **49 Galaksi Berdasarkan Data NASA**:
   - **Galaksi Spiral Raksasa**: Bima Sakti (Milky Way), Andromeda (M31), dan Triangulum (M33).
   - **Galaksi Satelit Masif & Terkenal**: Awan Magellan Besar (LMC), Awan Magellan Kecil (SMC), Sagittarius dSph, Fornax, Sculptor, Draco, Leo I–V, M32, M110, NGC 147, NGC 185, dsb.
   - **Galaksi Katai Ireguler & Starburst**: IC 10, IC 1613, WLM (Wolf-Lundmark-Melotte), Barnard's Galaxy (NGC 6822), Aquarius Dwarf, dsb.
   - Dilengkapi data kunci astronomis: Tipe morfologi Hubble, jarak (tahun cahaya), diameter, estimasi jumlah bintang, kecepatan radial, penemu, dan fakta ilmiah unik.

2. **5 Alur Fase Kosmik (Cosmic Stages)**:
   - **Fase 1: Tata Surya & Wahana Antariksa** (Matahari, planet, bulan, 500+ asteroid beraneka tipe C/S/M/V, Hubble, JWST, Voyager 1 & 2).
   - **Fase 2: Bintang Tetangga & Eksoplanet** (Alpha Centauri A/B, Proxima b, Sirius A/B, sistem TRAPPIST-1 dengan 7 planet berbatu, pulsar, dan lubang hitam).
   - **Fase 3: Galaksi Bima Sakti** (Pusat galaksi Sagittarius A*, palang pusat, 6 lengan spiral volumetrik, dan galaksi satelit pengiring).
   - **Fase 4: Subgrup Andromeda & Triangulum** (Struktur spiral M31, M32, M110, satelit kerdil Andromeda I–IX, dan lengan flocculent M33).
   - **Fase 5: Web Kosmik 49 Galaksi** (Tampilan makrokosmik seluruh 49 galaksi yang terhubung oleh filamen jaring gravitasi kosmik).

3. **Performa Teroptimasi & Anti-Lag**:
   - *Procedural Texture Caching*: Mencegah pembekuan browser (*freeze*) saat pertama kali dimuat.
   - *Logarithmic Depth Buffer*: Menghilangkan *Z-fighting* / kedipan grafis pada rentang skala kosmik 0.1 hingga 150.000 unit.
   - *Soft Particle Point Sprites*: Partikel bintang bundar bergradasi radial lembut untuk tekstur kosmik realistis.

4. **UI & Navigasi Modern**:
   - **Pencarian Cepat & Teleport**: Ketik nama galaksi/planet/objek untuk terbang langsung ke koordinatnya.
   - **Filter Morfologi Galaksi**: Menyaring tampilan galaksi berdasarkan kategori Spiral, Eliptis, Katai Sferoid, dan Ireguler.
   - **Tur Sinematik Otomatis**: Kamera terbang mengitari objek-objek kosmik paling spektakuler secara otomatis.
   - **Dasbor Responsif Glassmorphism**: Pilihan mode Penuh, Ringkas, atau Sembunyi.

---

## 📁 Struktur Framework

```
cosmic-galaxy-simulator/
├── index.html              # Entry point aplikasi
├── vercel.json             # Konfigurasi deployment Vercel
├── package.json            # Manifest proyek
├── README.md               # Dokumentasi proyek
├── css/
│   └── style.css           # Styling glassmorphism futuristik & UI responsif
└── js/
    ├── main.js             # Setup Three.js, logarithmic depth buffer, render loop
    ├── data/
    │   ├── solarSystemData.js   # Database Tata Surya, wahana, bintang tetangga
    │   └── galaxiesData.js      # Database LENGKAP 49 Galaksi NASA / NED / Gaia
    ├── renderers/
    │   ├── textureGenerator.js  # Generator tekstur prosedural teroptimasi
    │   ├── celestialFactory.js  # Pembuat planet, bulan, satelit, asteroid, pulsar
    │   └── galaxyFactory.js     # Pembuat galaksi kosmik 3D & filamen web
    ├── stages/
    │   └── stageManager.js      # Controller 5 alur fase kosmik & tur sinematik
    └── ui/
        └── uiManager.js         # Pengendali dasbor, filter, pencarian & panel info
```

---

## 🚀 Cara Menjalankan di Antigravity / Lokal

1. Buka folder `cosmic-galaxy-simulator` di VS Code / Antigravity.
2. Jalankan server lokal:
   - Menggunakan ekstensi **Live Server** di editor (klik kanan `index.html` -> *Open with Live Server*).
   - Atau menggunakan terminal:
     ```bash
     npx serve .
     ```
3. Buka browser di alamat `http://localhost:3000` (atau port yang tertera).

---

## ☁️ Cara Deploy ke Vercel

Proyek ini telah dilengkapi `vercel.json` dan struktur statis murni sehingga **100% kompatibel dengan Vercel**:

### Metode 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Metode 2: Import dari GitHub
1. Push repositori ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) -> Klik **Add New Project**.
3. Pilih repositori GitHub Anda dan klik **Deploy**. Vercel akan langsung mempublikasikan situs tanpa perlu konfigurasi tambahan.
