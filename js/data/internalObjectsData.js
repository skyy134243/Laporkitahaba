// ============================================================================
// DATABASE OBJEK-OBJEK SPESIFIK NASA DI DALAM SETIAP GALAKSI
// Sumber Data: NASA/IPAC Extragalactic Database (NED), NASA Hubble Site,
// NASA Chandra X-ray Observatory, James Webb Space Telescope (JWST), & ESA Gaia.
// ============================================================================

export const daftarObjekDalamGalaksi = [
    // ------------------------------------------------------------------------
    // OBJEK DI DALAM AWAN MAGELLAN BESAR (LMC)
    // ------------------------------------------------------------------------
    {
        id: "lmc-30-doradus",
        nama: "30 Doradus (Nebula Tarantula / NGC 2070)",
        galaksiInduk: "Awan Magellan Besar (LMC)",
        galaksiId: "lmc",
        kategori: "Nebula Ekstragalaksi",
        tipe: "Daerah H II Pembentuk Bintang Raksasa",
        posisiRelatif: { x: 80, y: 30, z: -40 },
        radiusVisual: 85,
        warna: "#ff7aa8",
        desc: "Wilayah pembentukan bintang paling masif dan bercahaya di seluruh Grup Lokal galaksi. Jika terletak sedekat Nebula Orion dengan Bumi, cahayanya akan menerangi langit malam dan melemparkan bayangan seperti Bulan purnama!",
        fakta: "Menampung gugus bintang sentral R136 yang berisi puluhan bintang paling masif dan paling panas yang pernah ditemukan oleh Teleskop Hubble dan JWST.",
        data: {
            "Diameter": "≈1.000 tahun cahaya",
            "Massa gas": "≈450.000 massa Matahari",
            "Laju kelahiran bintang": "Sangat tinggi (Starburst lokal)"
        },
        sumber: "NASA / ESA Hubble & Webb Space Telescopes"
    },
    {
        id: "lmc-r136a1",
        nama: "R136a1 (Bintang Paling Masif yang Diketahui)",
        galaksiInduk: "Awan Magellan Besar (LMC)",
        galaksiId: "lmc",
        kategori: "Bintang Ekstrem",
        tipe: "Bintang Wolf-Rayet Hypermasif (WN5h)",
        posisiRelatif: { x: 82, y: 31, z: -38 },
        radiusVisual: 18,
        warna: "#b0d4ff",
        desc: "Bintang paling masif dan bercahaya yang pernah dicatat oleh umat manusia, terletak di jantung gugus R136 di Nebula Tarantula.",
        fakta: "Memiliki massa sekitar 200 hingga 250 kali massa Matahari dan bersinar lebih dari 4,7 juta kali lebih terang dari Matahari kita!",
        data: {
            "Massa": "≈200–250 × Matahari",
            "Luminositas": "≈4.700.000 × Matahari",
            "Suhu permukaan": "≈46.000 °C (Matahari hanya 5.500 °C)"
        },
        sumber: "NASA / VLT / Hubble Space Telescope"
    },
    {
        id: "lmc-sn1987a",
        nama: "Sisa Supernova 1987A (SN 1987A)",
        galaksiInduk: "Awan Magellan Besar (LMC)",
        galaksiId: "lmc",
        kategori: "Sisa Supernova",
        tipe: "Sisa Ledakan Supernova Tipe II",
        posisiRelatif: { x: -60, y: -45, z: 50 },
        radiusVisual: 45,
        warna: "#ff9944",
        desc: "Ledakan bintang paling spektakuler dan paling dekat yang teramati dalam era astronomi modern sejak ditemukannya teleskop (Februari 1987).",
        fakta: "Pengamatan JWST tahun 2024 berhasil menemukan bukti langsung pertama keberadaan bintang neutron yang baru lahir di tengah cincin puing cincin gas SN 1987A.",
        data: {
            "Tahun meledak": "1987 Masehi",
            "Cincin material": "Cincin gas bercahaya 'Untaian Mutiara'",
            "Sisa inti": "Bintang neutron muda terdeteksi oleh JWST"
        },
        sumber: "NASA / ESA / CSA James Webb Space Telescope"
    },
    {
        id: "lmc-n44",
        nama: "N44 (Superbubble Kosmik)",
        galaksiInduk: "Awan Magellan Besar (LMC)",
        galaksiId: "lmc",
        kategori: "Nebula Emisi",
        tipe: "Superbubble Gas Raksasa",
        posisiRelatif: { x: -110, y: 60, z: -30 },
        radiusVisual: 70,
        warna: "#70c0ff",
        desc: "Gelembung gas raksasa selebar 250 tahun cahaya yang ditiup oleh angin bintang gabungan dari puluhan bintang masif dan ledakan supernova purba di dalamnya.",
        fakta: "Lubang tengahnya yang tampak kosong sebenarnya merupakan ruang bertekanan tinggi yang mendorong pembentukan bintang-bintang baru di pinggirannya.",
        data: {
            "Lebar celah": "≈250 tahun cahaya",
            "Morfologi": "Gelembung rongga gas antarbintang"
        },
        sumber: "NASA Hubble Heritage Project"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM AWAN MAGELLAN KECIL (SMC)
    // ------------------------------------------------------------------------
    {
        id: "smc-ngc-346",
        nama: "NGC 346 (Pabrik Bintang SMC)",
        galaksiInduk: "Awan Magellan Kecil (SMC)",
        galaksiId: "smc",
        kategori: "Nebula Ekstragalaksi",
        tipe: "Kompleks Pembentuk Bintang & Proto-Bintang",
        posisiRelatif: { x: 40, y: 25, z: -20 },
        radiusVisual: 55,
        warna: "#ff88bb",
        desc: "Kawasan pembibitan bintang paling terang dan dinamis di Awan Magellan Kecil. Karena SMC miskin logam berat, kondisi di NGC 346 meniru kondisi era pembentukan bintang pada saat alam semesta berusia muda (Cosmic Noon).",
        fakta: "Teleskop James Webb mengungkap ribuan protobintang (bayi bintang) yang masih terbungkus kepompong debu sedang aktif menyerap materi.",
        data: {
            "Diameter": "≈200 tahun cahaya",
            "Populasi": "Ribuan bintang protostellar muda"
        },
        sumber: "NASA / ESA / CSA JWST Mission"
    },
    {
        id: "smc-ngc-602",
        nama: "NGC 602 (Nebula 'Flying Wing')",
        galaksiInduk: "Awan Magellan Kecil (SMC)",
        galaksiId: "smc",
        kategori: "Gugus Bintang & Nebula",
        tipe: "Gugus Bintang Terbuka Muda dalam Cangkang Gas",
        posisiRelatif: { x: -50, y: -30, z: 35 },
        radiusVisual: 45,
        warna: "#88ccff",
        desc: "Gugus bintang muda berusia hanya sekitar 5 juta tahun yang memahat kolom-kolom gas dan debu di sekelilingnya menjadi bentuk sayap melengkung indah.",
        fakta: "Radiasi ultraviolet dari bintang-bintang panas di tengahnya sedang mengikis awan debu di sekitarnya, menyingkap pembentukan planet ekstrasurya.",
        data: {
            "Usia gugus": "≈5 juta tahun",
            "Kandungan debu": "Kolom debu pekat mirip Pilar-Pilar Penciptaan"
        },
        sumber: "NASA Hubble Space Telescope"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM GALAKSI ANDROMEDA (M31)
    // ------------------------------------------------------------------------
    {
        id: "m31-nucleus-bh",
        nama: "M31* (Pusat Lubang Hitam Supermasif Andromeda)",
        galaksiInduk: "Galaksi Andromeda (M31)",
        galaksiId: "andromeda",
        kategori: "Lubang Hitam",
        tipe: "Lubang Hitam Supermasif Pusat M31",
        posisiRelatif: { x: 0, y: 0, z: 0 },
        radiusVisual: 90,
        warna: "#ffaa33",
        desc: "Jantung gravitasi Galaksi Andromeda yang menampung lubang hitam supermasif bermassa raksasa 100 hingga 230 juta kali massa Matahari — jauh lebih masif dari Sagittarius A* milik Bima Sakti kita (yang hanya 4,3 juta kali massa Matahari).",
        fakta: "Dikelilingi piringan bintang ganda asimetris (P1 dan P2) yang sempat membingungkan para astronom karena tampak seolah Andromeda memiliki dua inti terpisah.",
        data: {
            "Massa": "≈100–230 juta × Matahari",
            "Radius Horizon": "≈300–700 juta km",
            "Fenomena inti": "Piringan bintang eksentrik ganda P1/P2"
        },
        sumber: "NASA / Hubble Space Telescope & Chandra X-ray"
    },
    {
        id: "m31-mayall-ii",
        nama: "Mayall II (G1 / NGC-224-G1)",
        galaksiInduk: "Galaksi Andromeda (M31)",
        galaksiId: "andromeda",
        kategori: "Gugus Bola Ekstrasurya",
        tipe: "Gugus Bola Terbesar di Seluruh Grup Lokal",
        posisiRelatif: { x: 850, y: 400, z: -600 },
        radiusVisual: 60,
        warna: "#fff0c0",
        desc: "Gugus bintang bola paling masif di seluruh Grup Lokal, dua kali lipat lebih masif daripada Omega Centauri milik Bima Sakti.",
        fakta: "Diduga kuat bukan gugus bola biasa, melainkan sisa inti padat dari galaksi kerdil purba yang pernah ditelan oleh Andromeda miliaran tahun lalu, menaungi kandidat lubang hitam bermassa menengah (IMBH).",
        data: {
            "Massa": "≈10 juta × Matahari",
            "Kandidat Black Hole IMBH": "≈20.000 × Matahari",
            "Jarak dari pusat Andromeda": "≈130.000 tahun cahaya"
        },
        sumber: "NASA / ESA Hubble Space Telescope"
    },
    {
        id: "m31-ngc-206",
        nama: "NGC 206 (Asosiasi Bintang Raksasa Andromeda)",
        galaksiInduk: "Galaksi Andromeda (M31)",
        galaksiId: "andromeda",
        kategori: "Asosiasi Bintang",
        tipe: "Asosiasi OB Terbesar di Lengan Spiral M31",
        posisiRelatif: { x: -620, y: -250, z: 450 },
        radiusVisual: 75,
        warna: "#99b8ff",
        desc: "Kumpulan bintang muda biru maharaksasa terbesar dan paling terang di piringan Andromeda, terlihat sebagai gumpalan cahaya terang yang membelah pita debu spiral M31.",
        fakta: "Menampung lebih dari 300 bintang kelas O dan B maharaksasa yang bersinar jutaan kali lipat lebih terang dari Matahari kita.",
        data: {
            "Bentang ukuran": "≈4.000 tahun cahaya",
            "Populasi": "Bintang super-raksasa biru muda"
        },
        sumber: "NASA Hubble Space Telescope"
    },
    {
        id: "m31-dust-ring",
        nama: "Cincin Debu 10-kpc Andromeda",
        galaksiInduk: "Galaksi Andromeda (M31)",
        galaksiId: "andromeda",
        kategori: "Cincin Kosmik",
        tipe: "Cincin Gas & Debu Pembentuk Bintang Resonansi",
        posisiRelatif: { x: 300, y: 120, z: 200 },
        radiusVisual: 110,
        warna: "#d48050",
        desc: "Struktur cincin debu masif berjarak sekitar 32.000 tahun cahaya (10 kpc) dari inti Andromeda tempat sebagian besar kelahiran bintang baru terjadi saat ini.",
        fakta: "Model superkomputer NASA/Spitzer membuktikan cincin ini terbentuk akibat tabrakan langsung melintasi piringan oleh galaksi katai M32 sekitar 210 juta tahun lalu.",
        data: {
            "Jari-jari cincin": "≈10 kiloparsec (≈32.600 ly)",
            "Asal usul": "Gelombang kejut benturan pasang surut M32"
        },
        sumber: "NASA Spitzer Space Telescope"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM GALAKSI TRIANGULUM (M33)
    // ------------------------------------------------------------------------
    {
        id: "m33-ngc-604",
        nama: "NGC 604 (Monster Pembibitan Bintang M33)",
        galaksiInduk: "Galaksi Triangulum (M33)",
        galaksiId: "triangulum",
        kategori: "Nebula Ekstragalaksi",
        tipe: "Daerah H II Terbesar Kedua di Grup Lokal",
        posisiRelatif: { x: 180, y: 70, z: -90 },
        radiusVisual: 80,
        warna: "#ff6699",
        desc: "Wilayah pembentukan bintang emisi raksasa yang membentang selebar hampir 1.500 tahun cahaya — lebih dari 40 kali lebih besar daripada seluruh Nebula Orion di galaksi kita!",
        fakta: "Menampung lebih dari 200 bintang kelas O dan Wolf-Rayet yang sangat masif, bersinar terang di spektrum sinar-X dan ultraviolet.",
        data: {
            "Diameter": "≈1.500 tahun cahaya",
            "Populasi": "200+ bintang Wolf-Rayet & Kelas O masif"
        },
        sumber: "NASA / ESA Hubble & Chandra Observatories"
    },
    {
        id: "m33-ngc-595",
        nama: "NGC 595",
        galaksiInduk: "Galaksi Triangulum (M33)",
        galaksiId: "triangulum",
        kategori: "Nebula Ekstragalaksi",
        tipe: "Kompleks H II Masif Kedua di M33",
        posisiRelatif: { x: -90, y: -40, z: 60 },
        radiusVisual: 50,
        warna: "#ff80aa",
        desc: "Wilayah pembentukan bintang terbesar kedua di Galaksi Triangulum yang kaya akan bintang-bintang Wolf-Rayet muda.",
        fakta: "Teleskop Hubble mendeteksi angin radiasi dahsyat yang meniup cangkang-cangkang gas berongga di intinya.",
        data: {
            "Diameter": "≈400 tahun cahaya",
            "Tipe": "Giant H II Region"
        },
        sumber: "NASA Hubble Space Telescope"
    },
    {
        id: "m33-x7",
        nama: "M33 X-7 (Lubang Hitam Bintang Raksasa)",
        galaksiInduk: "Galaksi Triangulum (M33)",
        galaksiId: "triangulum",
        kategori: "Lubang Hitam Bintang",
        tipe: "Biner Gerhana Sinar-X Lubang Hitam",
        posisiRelatif: { x: 70, y: -50, z: 40 },
        radiusVisual: 25,
        warna: "#ff3322",
        desc: "Salah satu lubang hitam bermassa bintang terbesar yang pernah terdeteksi, dengan massa sekitar 15,7 kali massa Matahari.",
        fakta: "Mengorbit bintang pendamping maharaksasa kelas O yang bermassa 70 kali massa Matahari dan mengalami gerhana sinar-X setiap 3,45 hari.",
        data: {
            "Massa lubang hitam": "≈15,7 × Matahari",
            "Massa bintang pendamping": "≈70 × Matahari",
            "Periode orbit": "3,45 hari"
        },
        sumber: "NASA Chandra X-ray Observatory"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM SAGITTARIUS DWARF SPHEROIDAL (Sgr dSph)
    // ------------------------------------------------------------------------
    {
        id: "sgr-m54",
        nama: "Messier 54 (M54 - Inti Sgr dSph)",
        galaksiInduk: "Sagittarius Dwarf Spheroidal (Sgr dSph)",
        galaksiId: "sgr-dsph",
        kategori: "Gugus Bola Ekstrasurya",
        tipe: "Inti Sejati Galaksi Katai Sagittarius",
        posisiRelatif: { x: 0, y: 0, z: 0 },
        radiusVisual: 35,
        warna: "#ffddaa",
        desc: "Gugus bola yang awalnya dikira anggota Bima Sakti biasa, namun pada 1994 terbukti merupakan inti nuklir padat dari Galaksi Katai Sagittarius yang sedang ditelan Bima Sakti!",
        fakta: "Menjadikannya gugus bola ekstragalaksi pertama yang pernah ditemukan dalam sejarah (oleh Charles Messier pada 1778).",
        data: {
            "Massa": "≈1,5 juta × Matahari",
            "Kandidat Black Hole IMBH": "≈9.400 × Matahari"
        },
        sumber: "NASA / ESA Hubble Space Telescope"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM FORNAX DWARF
    // ------------------------------------------------------------------------
    {
        id: "fornax-3-ngc1049",
        nama: "Fornax 3 (NGC 1049)",
        galaksiInduk: "Fornax Dwarf",
        galaksiId: "fornax-dwarf",
        kategori: "Gugus Bola Ekstrasurya",
        tipe: "Gugus Bola Tertua & Terbesar di Fornax",
        posisiRelatif: { x: 20, y: 15, z: -10 },
        radiusVisual: 30,
        warna: "#f0dfbb",
        desc: "Gugus bola paling menonjol dari 6 gugus bola yang dimiliki galaksi kerdil Fornax, ditemukan oleh John Herschel pada tahun 1835.",
        fakta: "Bahkan lebih padat bintang dan lebih terang daripada galaksi kerdil induknya saat diamati di teleskop kecil.",
        data: {
            "Usia": "≈12 miliar tahun",
            "Ditemukan": "1835 oleh John Herschel"
        },
        sumber: "NASA / ESO"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM IC 10 (STARBURST GALAXY)
    // ------------------------------------------------------------------------
    {
        id: "ic10-x1",
        nama: "IC 10 X-1 (Biner Lubang Hitam Monster)",
        galaksiInduk: "IC 10",
        galaksiId: "ic-10",
        kategori: "Lubang Hitam Bintang",
        tipe: "Biner Sinar-X Wolf-Rayet Masif",
        posisiRelatif: { x: -15, y: 10, z: 20 },
        radiusVisual: 22,
        warna: "#ff4466",
        desc: "Sistem biner sinar-X yang menaungi lubang hitam bermassa bintang terberat di Grup Lokal, bermassa 23 hingga 34 kali massa Matahari!",
        fakta: "Pasangan bintang Wolf-Rayet-nya diperkirakan akan meledak menjadi lubang hitam kedua dalam beberapa ratus ribu tahun ke depan, membentuk calon penggabungan gelombang gravitasi (LIGO/Virgo).",
        data: {
            "Massa Black Hole": "≈23–34 × Matahari",
            "Massa Wolf-Rayet": "≈35 × Matahari"
        },
        sumber: "NASA Chandra X-ray Observatory"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM BARNARD'S GALAXY (NGC 6822)
    // ------------------------------------------------------------------------
    {
        id: "ngc6822-hubble-v",
        nama: "Hubble V (Nebula Bercahaya NGC 6822)",
        galaksiInduk: "Barnard's Galaxy (NGC 6822)",
        galaksiId: "barnard-galaxy",
        kategori: "Nebula Ekstragalaksi",
        tipe: "Daerah H II Starburst Terang",
        posisiRelatif: { x: 25, y: -18, z: 12 },
        radiusVisual: 28,
        warna: "#70ddff",
        desc: "Wilayah pembentukan bintang paling terang dan berdensitas tinggi di Barnard's Galaxy, dicitrakan dengan detail luar biasa oleh Teleskop Hubble.",
        fakta: "Dinamai untuk menghormati astronom legendaris Edwin Hubble yang meneliti galaksi ini pada tahun 1925.",
        data: {
            "Diameter": "≈200 tahun cahaya",
            "Luminositas ionisasi": "200 kali Nebula Orion"
        },
        sumber: "NASA Hubble Heritage Project"
    },

    // ------------------------------------------------------------------------
    // OBJEK DI DALAM WOLF-LUNDMARK-MELOTTE (WLM)
    // ------------------------------------------------------------------------
    {
        id: "wlm-1",
        nama: "Gugus Bola WLM-1",
        galaksiInduk: "Wolf-Lundmark-Melotte (WLM)",
        galaksiId: "wlm",
        kategori: "Gugus Bola Ekstrasurya",
        tipe: "Satu-satunya Gugus Bola Purba di Galaksi WLM",
        posisiRelatif: { x: -20, y: 15, z: -15 },
        radiusVisual: 24,
        warna: "#e0d8b8",
        desc: "Satu-satunya gugus bola yang diketahui mengorbit galaksi terpencil WLM di pinggiran Grup Lokal.",
        fakta: "Usianya hampir setua alam semesta (≈13 miliar tahun), membuktikan bahwa sistem gugus bola bahkan dapat lahir di galaksi kerdil paling sunyi.",
        data: {
            "Usia": "≈13,0 miliar tahun",
            "Keberadaan": "Gugus bola soliter"
        },
        sumber: "NASA / Hubble Space Telescope"
    }
];
