// ============================================================================
// DATABASE TATA SURYA, BINTANG TETANGGA, WAHANA & OBJEK LANGIT LOKAL
// Sumber Data: NASA Solar System Exploration, JPL Horizons, SIMBAD, Gaia DR3
// ============================================================================

export const dbTataSurya = {
    // --- BINTANG UTAMA TATA SURYA ---
    "Matahari": {
        kategori: "Bintang",
        tipe: "Bintang Utama (Katai Kuning, kelas G2V)",
        desc: "Pusat tata surya yang menahan seluruh planet, bulan, dan asteroid dengan gravitasinya. Energinya berasal dari reaksi fusi nuklir hidrogen menjadi helium di intinya.",
        fakta: "Menyumbang 99,8% massa total Tata Surya, dengan diameter sekitar 1.392.000 km (109 kali Bumi) dan suhu permukaan sekitar 5.500°C.",
        data: { "Diameter": "≈1.392.000 km", "Suhu permukaan": "≈5.500 °C", "Usia": "≈4,6 miliar tahun", "Jarak dari Pusat Galaksi": "≈26.000 tahun cahaya" },
        sumber: "NASA Solar System Dynamics"
    },

    // --- PLANET-PLANET UTAMA ---
    "Merkurius": {
        kategori: "Planet",
        tipe: "Planet Terestrial",
        desc: "Planet terdekat dari Matahari dengan permukaan penuh kawah purba akibat tidak memiliki atmosfer pelindung yang berarti.",
        fakta: "Suhu ekstrem berkisar dari -180°C di malam hari hingga 430°C di siang hari — rentang suhu terbesar di Tata Surya.",
        data: { "Diameter": "4.879 km", "Jarak dari Matahari": "≈58 juta km", "Rotasi": "59 hari Bumi", "Bulan": "Tidak ada" },
        sumber: "NASA Planetary Fact Sheet"
    },
    "Venus": {
        kategori: "Planet",
        tipe: "Planet Terestrial",
        desc: "Sering disebut kembaran Bumi karena ukurannya mirip, namun efek rumah kaca ekstrem menjadikannya planet terpanas di Tata Surya.",
        fakta: "Berotasi sangat lambat dan terbalik (retrograde) — satu hari Venus (243 hari Bumi) lebih panjang dari satu tahunnya (225 hari Bumi).",
        data: { "Diameter": "12.104 km", "Tekanan udara": "≈90x Bumi", "Rotasi": "243 hari (retrograde)", "Bulan": "Tidak ada" },
        sumber: "NASA Planetary Fact Sheet"
    },
    "Bumi": {
        kategori: "Planet",
        tipe: "Planet Terestrial",
        desc: "Satu-satunya planet yang diketahui memiliki kehidupan, dengan 71% permukaannya ditutupi lautan air cair dan biosfer yang dinamis.",
        fakta: "Medan magnetnya yang dihasilkan inti besi cair melindungi atmosfer dari radiasi kosmik dan angin matahari mematikan.",
        data: { "Diameter": "12.742 km", "Rotasi": "24 jam", "Revolusi": "365,25 hari", "Bulan alami": "1 (Bulan)" },
        sumber: "NASA Earth Science"
    },
    "Bulan": {
        kategori: "Bulan",
        tipe: "Satelit Alami Bumi",
        desc: "Satu-satunya satelit alami Bumi, mengatur siklus pasang surut air laut lewat tarikan gravitasi dan menstabilkan kemiringan poros Bumi.",
        fakta: "Diperkirakan terbentuk dari puing tabrakan raksasa antara Bumi purba dengan protoplanet seukuran Mars bernama Theia sekitar 4,5 miliar tahun lalu.",
        data: { "Diameter": "3.474 km", "Jarak dari Bumi": "≈384.400 km", "Perubahan jarak": "menjauh ≈3,8 cm/tahun" },
        sumber: "NASA Lunar Science"
    },
    "Mars": {
        kategori: "Planet",
        tipe: "Planet Terestrial",
        desc: "Planet merah berdebu yang kaya akan besi oksida di permukaannya, target utama misi eksplorasi manusia dan pencarian jejak air purba.",
        fakta: "Memiliki Valles Marineris, ngarai raksasa sepanjang ±4.000 km, dan Olympus Mons, gunung berapi tertinggi di Tata Surya (±22 km).",
        data: { "Diameter": "6.779 km", "Rotasi": "24,6 jam", "Bulan alami": "2 (Phobos, Deimos)" },
        sumber: "NASA Mars Exploration Program"
    },
    "Phobos": {
        kategori: "Bulan",
        tipe: "Satelit Alami Mars",
        desc: "Bulan Mars yang lebih besar dan lebih dekat, mengorbit sangat rendah dan perlahan spiral mendekati Mars.",
        fakta: "Mengorbit Mars hanya dalam 7 jam 39 menit dan diperkirakan akan hancur menjadi cincin dalam 30-50 juta tahun mendatang.",
        data: { "Diameter": "≈22 km", "Periode orbit": "7 jam 39 menit" },
        sumber: "NASA JPL"
    },
    "Deimos": {
        kategori: "Bulan",
        tipe: "Satelit Alami Mars",
        desc: "Bulan Mars yang lebih kecil dan lebih jauh, berbentuk lonjong tidak beraturan dan dilapisi lapisan debu regolith tebal.",
        fakta: "Gravitasinya sangat lemah sehingga kecepatan lepasnya hanya sekitar 20 km/jam — seorang atlet bisa melompat lepas ke luar angkasa.",
        data: { "Diameter": "≈12 km", "Periode orbit": "≈30,3 jam" },
        sumber: "NASA JPL"
    },
    "Jupiter": {
        kategori: "Planet",
        tipe: "Planet Raksasa Gas",
        desc: "Planet terbesar di Tata Surya, sebagian besar tersusun dari hidrogen dan helium dengan medan magnet super masif.",
        fakta: "Bintik Merah Raksasa adalah badai antisiklon yang telah berlangsung minimal 350 tahun, cukup besar untuk menelan Bumi.",
        data: { "Diameter": "139.820 km", "Rotasi": "≈10 jam (tercepat di Tata Surya)", "Bulan diketahui": "95+" },
        sumber: "NASA Juno Mission"
    },
    "Io": {
        kategori: "Bulan",
        tipe: "Satelit Alami Jupiter (Bulan Galilea)",
        desc: "Bulan vulkanik paling aktif di Tata Surya, permukaannya terus-menerus diperbarui oleh letusan ratusan gunung berapi belerang.",
        fakta: "Aktivitas vulkaniknya dipicu oleh pemanasan pasang surut gravitasi Jupiter, Europa, dan Ganymede.",
        data: { "Diameter": "3.643 km", "Ditemukan": "1610 oleh Galileo Galilei" },
        sumber: "NASA Galileo / Juno"
    },
    "Europa": {
        kategori: "Bulan",
        tipe: "Satelit Alami Jupiter (Bulan Galilea)",
        desc: "Bulan es dengan lautan air asin cair di bawah keraknya yang memiliki volume air lebih banyak daripada seluruh lautan Bumi.",
        fakta: "Menjadi target utama misi NASA Europa Clipper untuk mencari bukti lingkungan yang berpotensi menopang kehidupan mikrobia.",
        data: { "Diameter": "3.122 km", "Tebal kerak es": "≈15-25 km" },
        sumber: "NASA Europa Clipper Mission"
    },
    "Ganymede": {
        kategori: "Bulan",
        tipe: "Satelit Alami Jupiter (Bulan Galilea)",
        desc: "Bulan terbesar di Tata Surya, bahkan lebih besar daripada planet Merkurius dan memiliki medan magnet intrinsik sendiri.",
        fakta: "Satu-satunya satelit alami di Tata Surya yang memiliki magnetosfer sendiri yang dihasilkan oleh dinamo inti logam cairnya.",
        data: { "Diameter": "5.268 km", "Struktur": "Inti besi, mantel silikat, mantel es" },
        sumber: "NASA / ESA JUICE"
    },
    "Callisto": {
        kategori: "Bulan",
        tipe: "Satelit Alami Jupiter (Bulan Galilea)",
        desc: "Bulan Galilea terluar dengan permukaan tertua dan paling dipenuhi kawah di Tata Surya.",
        fakta: "Hampir tidak mengalami aktivitas tektonik selama 4 miliar tahun, menjadikannya arsip fosil tabrakan zaman pembentukan awal Tata Surya.",
        data: { "Diameter": "4.821 km", "Usia permukaan": "≈4 miliar tahun" },
        sumber: "NASA Galileo Mission"
    },
    "Saturnus": {
        kategori: "Planet",
        tipe: "Planet Raksasa Gas",
        desc: "Raksasa gas ikonik dengan sistem cincin spektakuler yang membentang ratusan ribu kilometer namun tebalnya hanya puluhan meter.",
        fakta: "Kepadatan rata-rata Saturnus lebih ringan daripada air — secara teori planet ini bisa mengapung di lautan air raksasa.",
        data: { "Diameter": "116.460 km", "Bulan diketahui": "146+", "Lebar cincin": "hingga 282.000 km" },
        sumber: "NASA Cassini Mission"
    },
    "Titan": {
        kategori: "Bulan",
        tipe: "Satelit Alami Saturnus",
        desc: "Satu-satunya bulan di Tata Surya dengan atmosfer tebal nitrogen dan danau hidrokarbon cair (metana/etana) di permukaannya.",
        fakta: "Memiliki siklus hidrologi aktif yang mirip Bumi, namun menggunakan metana cair alih-alih air untuk hujan, sungai, dan lautannya.",
        data: { "Diameter": "5.150 km", "Tekanan atmosfer": "1,5 kali Bumi" },
        sumber: "NASA Cassini-Huygens / Dragonfly"
    },
    "Enceladus": {
        kategori: "Bulan",
        tipe: "Satelit Alami Saturnus",
        desc: "Bulan es kecil yang menyemburkan geyser uap air dan senyawa organik dari celah retakan hangat 'garis harimau' di kutub selatannya.",
        fakta: "Geysernya membentuk cincin E Saturnus dan membuktikan adanya lautan air hangat bersumber ventilasi hidrotermal di bawah esnya.",
        data: { "Diameter": "≈504 km", "Kandungan geyser": "Air, garam, metana, molekul organik" },
        sumber: "NASA Cassini Mission"
    },
    "Mimas": {
        kategori: "Bulan",
        tipe: "Satelit Alami Saturnus",
        desc: "Bulan kecil Saturnus yang terkenal karena kemiripannya dengan stasiun luar angkasa Death Star dari fiksi ilmiah.",
        fakta: "Kawah Herschel di permukaannya berdiameter 130 km — sepertiga diameter total Mimas. Benturan lebih kuat sedikit saja akan menghancurkannya.",
        data: { "Diameter": "≈396 km", "Kawah utama": "Herschel" },
        sumber: "NASA Cassini"
    },
    "Uranus": {
        kategori: "Planet",
        tipe: "Planet Raksasa Es",
        desc: "Raksasa es unik berwarna biru-pucat akibat gas metana yang berputar menggelinding miring dengan poros hampir 98 derajat.",
        fakta: "Kemungkinan pernah bertabrakan dahsyat dengan protoplanet seukuran Bumi miliaran tahun lalu yang membalikkan poros rotasinya secara permanen.",
        data: { "Diameter": "50.724 km", "Suhu atmosfer": "hingga -224 °C", "Bulan diketahui": "28" },
        sumber: "NASA Voyager 2"
    },
    "Miranda": {
        kategori: "Bulan",
        tipe: "Satelit Alami Uranus",
        desc: "Bulan Uranus dengan topografi paling terfragmentasi dan dramatis, penuh tebing sesar raksasa Verona Rupes setinggi 20 km.",
        fakta: "Verona Rupes adalah tebing tertinggi yang diketahui di Tata Surya; seseorang yang melompat dari puncaknya butuh 12 menit untuk mendarat.",
        data: { "Diameter": "≈472 km", "Tinggi tebing": "≈20 km" },
        sumber: "NASA Voyager 2"
    },
    "Titania": {
        kategori: "Bulan",
        tipe: "Satelit Alami Uranus",
        desc: "Bulan terbesar Uranus dengan permukaan campuran es dan batuan yang dibelah ngarai patahan tektonik besar.",
        fakta: "Dinamai dari tokoh Ratu Peri dalam karya William Shakespeare 'A Midsummer Night's Dream'.",
        data: { "Diameter": "≈1.578 km", "Suhu permukaan": "-203 °C" },
        sumber: "NASA Voyager 2"
    },
    "Oberon": {
        kategori: "Bulan",
        tipe: "Satelit Alami Uranus",
        desc: "Bulan terbesar kedua Uranus dengan permukaan gelap yang banyak dipenuhi kawah kuno.",
        fakta: "Dasar beberapa kawahnya tertutup material gelap yang diduga rembesan es karbon atau hidrokarbon dari interiornya.",
        data: { "Diameter": "≈1.523 km" },
        sumber: "NASA Voyager 2"
    },
    "Neptunus": {
        kategori: "Planet",
        tipe: "Planet Raksasa Es",
        desc: "Planet terjauh di Tata Surya dengan atmosfer biru tua dinamis dan badai angin supersonik tercepat di Tata Surya.",
        fakta: "Kecepatan angin di lapisan atas atmosfernya dapat melesat melampaui 2.100 km/jam, melampaui kecepatan suara di Bumi.",
        data: { "Diameter": "49.244 km", "Kecepatan angin": "hingga ≈2.100 km/jam", "Bulan": "16" },
        sumber: "NASA Voyager 2"
    },
    "Triton": {
        kategori: "Bulan",
        tipe: "Satelit Alami Neptunus",
        desc: "Bulan terbesar Neptunus dengan orbit retrograde, objek Sabuk Kuiper purba yang tertangkap oleh gravitasi raksasa Neptunus.",
        fakta: "Memiliki cryovolcano (gunung es aktif) yang menyemburkan gas nitrogen beku setinggi 8 km ke atmosfer tipisnya.",
        data: { "Diameter": "≈2.707 km", "Suhu permukaan": "-235 °C (salah satu terdingin)" },
        sumber: "NASA Voyager 2"
    },
    "Pluto": {
        kategori: "Planet Kerdil",
        tipe: "Planet Kerdil Sabuk Kuiper",
        desc: "Dunia es berbatu di Sabuk Kuiper yang memiliki dataran es nitrogen berbentuk hati raksasa bernama Tombaugh Regio.",
        fakta: "Bersama bulannya Charon membentuk sistem biner pasang surut terkunci ganda yang selalu menghadapkan sisi yang sama satu sama lain.",
        data: { "Diameter": "2.377 km", "Bulan diketahui": "5 (Charon, Styx, Nix, Kerberos, Hydra)" },
        sumber: "NASA New Horizons Mission"
    },
    "Charon": {
        kategori: "Bulan",
        tipe: "Satelit Alami Pluto",
        desc: "Bulan terbesar Pluto yang ukurannya lebih dari setengah diameter Pluto sendiri, membuat titik pusat gravitasinya berada di ruang bebas antara keduanya.",
        fakta: "Kutub utara Charon memiliki tudung kemerahan raksasa bernama Mordor Macula yang tersusun dari molekul tholin organik.",
        data: { "Diameter": "≈1.212 km" },
        sumber: "NASA New Horizons Mission"
    },

    // --- ASTEROID & KOMET UTAMA ---
    "Ceres": {
        kategori: "Asteroid",
        tipe: "Planet Kerdil & Asteroid Sabuk Utama",
        desc: "Objek terbesar di Sabuk Asteroid antara Mars dan Jupiter, satu-satunya asteroid yang cukup masif untuk membentuk bola gravitasi seimbang.",
        fakta: "Wahana Dawn menemukan titik-titik terang kaya garam natrium karbonat di Kawah Occator, bukti aktivitas kriovulkanik air bawah permukaan.",
        data: { "Diameter": "≈940 km", "Massa": "≈30% massa total sabuk asteroid" },
        sumber: "NASA Dawn Mission"
    },
    "Vesta": {
        kategori: "Asteroid",
        tipe: "Asteroid Sabuk Utama (Protoplanet Utuh)",
        desc: "Asteroid tercerah di langit malam, memiliki struktur berlapis (inti besi, mantel, kerak) mirip planet kebumian.",
        fakta: "Kawah kutub selatan Rheasilvia memiliki puncak sentral setinggi 22 km — hampir setara Olympus Mons di Mars.",
        data: { "Diameter": "≈525 km", "Ditemukan": "1807" },
        sumber: "NASA Dawn Mission"
    },
    "Komet Halley (1P/Halley)": {
        kategori: "Komet",
        tipe: "Komet Periodik",
        desc: "Komet periodik paling terkenal dalam peradaban manusia yang melintasi Bumi setiap 75-76 tahun sekali.",
        fakta: "Terakhir mendekati Bumi pada 1986 dan diperkirakan akan kembali menghiasi langit malam pada pertengahan tahun 2061.",
        data: { "Periode orbit": "≈76 tahun", "Ukuran inti": "15 × 8 km" },
        sumber: "NASA JPL Small-Body Database"
    },
    "'Oumuamua": {
        kategori: "Objek Antarbintang",
        tipe: "Pengembara Antarbintang (1I/2017 U1)",
        desc: "Objek pertama asal luar Tata Surya yang terkonfirmasi melintas menembus ruang antariksa kita pada Oktober 2017.",
        fakta: "Bentuknya sangat pipih memanjang menyerupai cerutu dan mengalami percepatan non-gravitasi misterius saat menjauhi Matahari.",
        data: { "Kecepatan": "≈87,3 km/detik", "Asal": "Ruang antarbintang di luar Tata Surya" },
        sumber: "NASA JPL / Pan-STARRS"
    },

    // --- WAHANA ANTARIKSA MANUSIA (NASA/ESA) ---
    "Voyager 1": {
        kategori: "Wahana",
        tipe: "Wahana Antarbintang (Objek Buatan Manusia Terjauh)",
        desc: "Wahana antariksa penjelajah NASA yang diluncurkan tahun 1977 dan resmi menembus heliopause ke ruang antarbintang pada Agustus 2012.",
        fakta: "Membawa Piringan Emas (Golden Record) berisi bahasa, musik, suara, dan gambar Bumi; per 2026 berjarak lebih dari 24 miliar km dari Bumi.",
        data: { "Jarak": "≈170 SA (≈25,5 miliar km)", "Waktu sinyal radio": "≈23 jam satu arah" },
        sumber: "NASA JPL Voyager Interstellar Mission"
    },
    "Voyager 2": {
        kategori: "Wahana",
        tipe: "Wahana Antarbintang",
        desc: "Satu-satunya wahana manusia yang pernah mengunjungi seluruh empat planet raksasa Tata Surya: Jupiter, Saturnus, Uranus, dan Neptunus.",
        fakta: "Memasuki ruang antarbintang pada November 2018 dan instrumen plasmanya masih aktif mengirim data hingga saat ini.",
        data: { "Diluncurkan": "1977", "Jarak": "≈142,5 SA (≈21,3 miliar km)" },
        sumber: "NASA JPL Voyager"
    },
    "James Webb Space Telescope": {
        kategori: "Wahana",
        tipe: "Observatorium Antariksa Inframerah (Titik L2)",
        desc: "Teleskop antariksa paling canggih dalam sejarah dengan cermin heksagonal berlapis emas 6,5 meter yang mengorbit di titik Lagrange L2.",
        fakta: "Mampu mendeteksi cahaya inframerah dari bintang dan galaksi purba pertama yang lahir hanya 300 juta tahun setelah peristiwa Big Bang.",
        data: { "Diameter cermin": "6,5 meter", "Orbit": "Lagrange Point 2 (≈1,5 juta km dari Bumi)" },
        sumber: "NASA / ESA / CSA Webb Telescope"
    },
    "Hubble Space Telescope": {
        kategori: "Wahana",
        tipe: "Observatorium Antariksa Optik & UV",
        desc: "Teleskop antariksa legendaris NASA/ESA yang merevolusi kosmologi modern sejak diluncurkan ke orbit rendah Bumi pada April 1990.",
        fakta: "Menghasilkan lebih dari 1,5 juta pengamatan ilmiah dan menentukan usia alam semesta secara akurat pada angka 13,8 miliar tahun.",
        data: { "Ketinggian orbit": "≈535 km", "Usia operasional": "35+ tahun" },
        sumber: "NASA / ESA Hubble"
    },

    // --- BINTANG TETANGGA & SISTEM EKSOPLANET ---
    "Alpha Centauri A": {
        kategori: "Bintang",
        tipe: "Bintang Biner Deret Utama (Kelas G2V)",
        desc: "Bintang primer dalam sistem bintang triple Alpha Centauri, berukuran dan bersuhu sangat mirip dengan Matahari kita.",
        fakta: "Terletak hanya sekitar 4,37 tahun cahaya dari Bumi, menjadikannya sistem bintang terdekat di lingkungan kosmik Tata Surya.",
        data: { "Jarak dari Bumi": "≈4,37 tahun cahaya", "Massa": "1,1 × Matahari", "Suhu": "≈5.790 K" },
        sumber: "NASA / ESO"
    },
    "Proxima Centauri": {
        kategori: "Bintang",
        tipe: "Bintang Katai Merah (Kelas M5.5Ve)",
        desc: "Bintang tunggal terdekat dengan Matahari kita, bintang suar aktif yang menaungi eksoplanet seukuran Bumi Proxima b.",
        fakta: "Meskipun merupakan tetangga terdekat pada jarak 4,24 tahun cahaya, cahayanya terlalu redup untuk dilihat tanpa bantuan teleskop.",
        data: { "Jarak dari Bumi": "≈4,24 tahun cahaya", "Eksoplanet": "Proxima b, c, d" },
        sumber: "NASA Exoplanet Archive"
    },
    "Proxima Centauri b": {
        kategori: "Eksoplanet",
        tipe: "Super-Bumi Berbatu di Zona Layak Huni",
        desc: "Eksoplanet terdekat yang pernah dikonfirmasi manusia di luar Tata Surya, mengorbit Proxima Centauri dalam zona air cair.",
        fakta: "Memiliki massa minimum 1,07 kali Bumi dan menyelesaikan satu tahun orbit hanya dalam waktu 11,2 hari Bumi.",
        data: { "Jarak": "≈4,24 tahun cahaya", "Massa": "≈1,07 × Bumi", "Periode orbit": "11,2 hari" },
        sumber: "NASA Exoplanet Archive"
    },
    "Sirius A": {
        kategori: "Bintang",
        tipe: "Bintang Deret Utama Kelas A (A1V)",
        desc: "Bintang paling terang di langit malam Bumi dari rasi Canis Major, bersinar 25 kali lebih terang dari Matahari.",
        fakta: "Ditemani oleh Sirius B ('The Pup'), katai putih pertama yang pernah ditemukan oleh astronom.",
        data: { "Jarak dari Bumi": "≈8,6 tahun cahaya", "Massa": "≈2,06 × Matahari" },
        sumber: "NASA / SIMBAD"
    },
    "TRAPPIST-1": {
        kategori: "Bintang",
        tipe: "Bintang Katai Merah Ultra-Dingin (Kelas M8V)",
        desc: "Sistem luar biasa di rasi Aquarius yang menaungi tujuh eksoplanet berbatu seukuran Bumi, tiga di antaranya berada di zona layak huni.",
        fakta: "Ketujuh planetnya terikat dalam resonansi orbital orbital matematika harmonis yang sangat stabil.",
        data: { "Jarak dari Bumi": "≈40 tahun cahaya", "Jumlah planet": "7 planet seukuran Bumi" },
        sumber: "NASA Exoplanet Exploration / Spitzer / JWST"
    },

    // --- PUSAT GALAKSI & OBJEK EKSTREM ---
    "Sagittarius A*": {
        kategori: "Lubang Hitam",
        tipe: "Lubang Hitam Supermasif Pusat Bima Sakti",
        desc: "Pusat gravitasi raksasa di jantung Galaksi Bima Sakti kita yang mengikat ratusan miliar bintang dalam putaran galaksi.",
        fakta: "Citra bayangan cincin cahayanya berhasil ditangkap langsung oleh kolaborasi global Event Horizon Telescope (EHT) pada Mei 2022.",
        data: { "Massa": "≈4,3 juta × Matahari", "Jarak dari Tata Surya": "≈26.000 tahun cahaya", "Diameter horizon": "≈24 juta km" },
        sumber: "NASA / Event Horizon Telescope Collaboration"
    },
    "Pulsar Kepiting (PSR B0531+21)": {
        kategori: "Pulsar",
        tipe: "Bintang Neutron Pemancar Berkas Radio & Sinar-X",
        desc: "Sisa inti bintang runtuh berputar super cepat di pusat Nebula Kepiting hasil ledakan supernova bersejarah tahun 1054 Masehi.",
        fakta: "Berputar sekitar 30 kali per detik dengan medan magnet triliunan kali lipat lebih kuat dari medan magnet Bumi.",
        data: { "Jarak": "≈6.500 tahun cahaya", "Kecepatan putar": "≈30 putaran/detik", "Diameter": "≈20 km" },
        sumber: "NASA Chandra X-ray Observatory"
    }
};
