MASTER CODE BLUEPRINT: SIMULASI 3D BIMA SAKTI THREE.JS (BERBASIS DATA ESA GAIA)Blueprint ini merinci implementasi teknis secara komprehensif, mulai dari perhitungan matematika partikel di sisi CPU (JavaScript) hingga manipulasi piksel di sisi GPU (GLSL Shaders).BAGIAN I: IMPLEMENTASI KUSTOM SHADER (GLSL)Jangan pernah menggunakan THREE.PointsMaterial standar karena akan menghasilkan titik persegi yang kaku. Kita wajib menggunakan THREE.ShaderMaterial.1. Vertex Shader (galaxyVertexShader)Bertanggung jawab untuk menghitung posisi ruang 3D, mengubah ukuran partikel berdasarkan jarak kamera (size attenuation), serta memberikan variasi fase kedipan (twinkling).OpenGL Shading Languageuniform float uTime;
uniform float uSize;

attribute float size;
attribute vec3 customColor;
attribute float phase;

varying vec3 vColor;
varying float vPhase;

void main() {
    vColor = customColor;
    vPhase = phase;

    // Menghitung posisi koordinat partikel di dalam ruang dunia (World Space)
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Rumus ukuran partikel berdasarkan jarak perspektif kamera (Distance Attenuation)
    // Partikel yang jauh akan mengecil, partikel dekat akan membesar secara natural
    gl_PointSize = size * (300.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}
2. Fragment Shader (galaxyFragmentShader)Bertanggung jawab untuk merender bentuk titik agar menjadi bola cahaya lembut menggunakan gl_PointCoord dan menerapkan Additive Blending.OpenGL Shading Languageuniform samplerintis uTexture; // Opsional: tekstur partikel atau prosedural
varying vec3 vColor;
varying float vPhase;

void main() {
    // Menghitung jarak piksel dari titik pusat partikel (Koordinat UV internal titik: 0.0 sampai 1.0)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // Jika jarak lebih dari 0.5 (di luar lingkaran), buang piksel (discard) untuk membentuk lingkaran halus
    if (dist > 0.5) {
        discard;
    }

n    // Fungsi peluruhan cahaya gauss (Gaussian smooth falloff) dari pusat ke tepi lingkaran
    float alpha = smoothstep(0.5, 0.0, dist);

    // Menggabungkan warna bintang dengan intensitas alpha yang lembut
    gl_FragColor = vec4(vColor, alpha * 0.8);
}
BAGIAN II: ALGORITMA MATEMATIKA GENERATOR PARTIKEL (CPU JAVASCRIPT)Berikut adalah logika spesifik yang harus dituliskan dalam perulangan loop Float32Array untuk menghasilkan struktur anatomis Bima Sakti secara akurat.1. Generator Palang & Inti Pusat (Stellar Bar & Bulge)JavaScript// Alokasi memori untuk 30% partikel bagian inti dan palang pusat
for (let i = 0; i < particleCount * 0.3; i++) {
    // Menggunakan distribusi radius eksponensial/Plummer terkompresi
    let r = Math.pow(Math.random(), 2.5) * 15.0; 
    let theta = Math.random() * Math.PI * 2.0;

    // Meregangkan sumbu X secara matematis untuk membentuk struktur palang (Bar)
    let x = Math.cos(theta) * r * 1.8; 
    let y = Math.sin(theta) * r * 0.8;
    
    // Ketebalan vertikal inti (Bulge thickness) yang tinggi di pusat
    let z = (Math.random() - 0.5) * (3.0 / (1.0 + r * 0.5));

    // Menerapkan matriks rotasi sudut palang galaksi (~25 derajat)
    let angleBar = 0.436; // 25 derajat dalam radian
    let rx = x * Math.cos(angleBar) - y * Math.sin(angleBar);
    let ry = x * Math.sin(angleBar) + y * Math.cos(angleBar);

    positions[i * 3]     = rx;
    positions[i * 3 + 1] = ry;
    positions[i * 3 + 2] = z;

    // Pemetaan warna Populasi Bintang II: Putih cemerlang ke Jingga Keemasan (#ffffff ke #ffaa33)
    colors[i * 3]     = 1.0; 
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; 
    colors[i * 3 + 2] = 0.3 + Math.random() * 0.4;
    
    scales[i] = Math.random() * 2.5 + 1.0;
}
2. Generator Lengan Spiral Logaritmik (Logarithmic Spiral Arms)JavaScriptconst armCount = 4; // 4 Lengan utama: Perseus, Scutum-Centaurus, Sagittarius, Orion Spur
const pitchAngle = 0.35; // Konstanta sudut gulungan spiral

for (let i = Math.floor(particleCount * 0.3); i < particleCount * 0.9; i++) {
    let armIndex = Math.floor(Math.random() * armCount);
    let r = 5.0 + Math.random() * 45.0; // Jarak radial dari pusat ke tepi luar
    
    // Persamaan spiral logaritmik: theta = (ln(r / a)) / tan(pitch) + offset_lengan
    let theta = (Math.log(r / 5.0) / Math.tan(pitchAngle)) + (armIndex * ((Math.PI * 2) / armCount));

    // Menambahkan dispersi sudut Gaussian (Gaussian Angular Scatter) agar tidak terlalu kaku
    let scatterTheta = theta + (Math.random() - 0.5) * 0.6;
    let scatterR = r + (Math.random() - 0.5) * 3.0;

    let x = Math.cos(scatterTheta) * scatterR;
    let y = Math.sin(scatterTheta) * scatterR;

    // Profil ketebalan piringan luar (Thin Disc) yang sangat tipis
    let z = (Math.random() - 0.5) * (1.2 * (1.0 - (r / 50.0)));

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Pemetaan warna lengan spiral: Putih Kebiruan (#aaccff) untuk bintang muda panas
    // Menyisipkan klaster khusus Magenta/Pink (#ff3366) untuk wilayah HII Star-Forming
    let isHII = Math.random() < 0.08; // 8% probabilitas wilayah pembentukan bintang aktif
    if (isHII) {
        colors[i * 3]     = 1.0; // Merah tinggi
        colors[i * 3 + 1] = 0.2; // Hijau rendah
        colors[i * 3 + 2] = 0.5; // Biru sedang -> Magenta (#ff3366)
        scales[i] = Math.random() * 3.5 + 2.0; // Ukuran lebih besar untuk nebula
    } else {
        colors[i * 3]     = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0; // Biru dominan
        scales[i] = Math.random() * 1.8 + 0.8;
    }
}
BAGIAN III: MATRIKS PARAMETER KONFIGURASI ASTRONOMIS 1:1Tabel spesifikasi numerik mutlak yang wajib dipatuhi oleh kode generator untuk menjamin akurasi skala visual:Parameter AnatomiNilai / Konfigurasi AngkaKeterangan Fisik / VisualRadius Maksimal Piringan50.0 unit (Skala WebGL)Merepresentasikan diameter galaksi ~100.000 tahun cahaya.Posisi Matahari (Sun)Vector3(18.0, 6.0, 0.2)Terletak di Orion Spur, berjarak setara $\approx 26.000$ tahun cahaya dari pusat.Sudut Kemiringan Palang25° - 30°Rotasi sumbu elips inti terhadap orientasi lengan spiral.Blending Mode RendererTHREE.AdditiveBlendingMemastikan penumpukan cahaya antar partikel memancarkan efek glow kosmik.Depth Write StatedepthWrite: falseMencegah masalah z-sorting artifact pada rendering partikel transparan skala besar.
