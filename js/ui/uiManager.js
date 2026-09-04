export function createUIManager(stageManager, interactiveObjects, cosmicLibrary = [], onObjectSelected, collisionExperiment = null) {
    const dasbor = document.getElementById('dasbor-kiri');
    const toggleBtn = document.getElementById('dasbor-toggle');
    const sidePanel = document.getElementById('side-panel');
    const closeBtn = document.getElementById('close-btn');
    const resetBtn = document.getElementById('reset-view-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const tourBtn = document.getElementById('tour-btn');
    const tourHud = document.getElementById('tour-hud');
    const tourStatusText = document.getElementById('tour-status-text');
    const stopTourBtn = document.getElementById('stop-tour-btn');

    // Cosmic Library Elements
    const cosmicLibBtn = document.getElementById('cosmic-lib-btn');
    const libraryModal = document.getElementById('library-modal');
    const closeLibBtn = document.getElementById('close-lib-btn');
    const libSearchInput = document.getElementById('lib-search-input');
    const libCatButtons = document.querySelectorAll('.lib-cat-btn');
    const libHostButtons = document.querySelectorAll('.lib-host-btn');
    const libGrid = document.getElementById('library-grid');
    const libCountLabel = document.getElementById('lib-count-label');

    // Collision Experiment HUD Elements
    const collisionExpBtn = document.getElementById('collision-exp-btn');
    const collisionHud = document.getElementById('collision-hud');
    const closeCollisionBtn = document.getElementById('close-collision-btn');
    const expTimeLabel = document.getElementById('exp-time-label');
    const expDistLabel = document.getElementById('exp-dist-label');
    const expSpeedLabel = document.getElementById('exp-speed-label');
    const expStarburstLabel = document.getElementById('exp-starburst-label');
    const expSunLabel = document.getElementById('exp-sun-label');
    const expPhaseBadge = document.getElementById('exp-phase-badge');
    const expPhaseTitle = document.getElementById('exp-phase-title');
    const expPhaseDesc = document.getElementById('exp-phase-desc');
    const expTimelineSlider = document.getElementById('exp-timeline-slider');
    const expPlayBtn = document.getElementById('exp-play-btn');
    const expResetBtn = document.getElementById('exp-reset-btn');
    const expSpeedButtons = document.querySelectorAll('.exp-speed-btn');
    const phaseJumpButtons = document.querySelectorAll('.phase-jump-btn');

    // Dashboard folding modes (Penuh -> Ringkas -> Sembunyi -> Penuh)
    const modes = ['penuh', 'ringkas', 'sembunyi'];
    const modeLabels = { penuh: 'Dasbor', ringkas: 'Ringkas', sembunyi: 'Tampilkan' };
    const modeIcons = { penuh: '☰', ringkas: '▤', sembunyi: '☰' };
    let currentModeIndex = 0;

    function applyDashboardMode(mode) {
        dasbor.classList.remove('penuh', 'ringkas', 'sembunyi');
        dasbor.classList.add(mode);
        toggleBtn.querySelector('.label').textContent = modeLabels[mode];
        toggleBtn.firstChild.textContent = modeIcons[mode] + ' ';
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        applyDashboardMode(modes[currentModeIndex]);
    });

    // Side panel display
    function showObjectInfo(data) {
        if (!data) return;
        document.getElementById('sp-title').innerText = data.nama || 'Objek Kosmik';
        document.getElementById('sp-subtitle').innerText = data.tipe || '-';
        document.getElementById('sp-desc').innerText = data.desc || '-';
        document.getElementById('sp-fact').innerText = data.fakta || '-';
        document.getElementById('sp-sumber').innerText = data.sumber ? `Sumber: ${data.sumber}` : 'Sumber: NASA / ESA / NED / SIMBAD';

        const badge = document.getElementById('sp-badge');
        if (badge) badge.innerText = data.kategori || 'KOSMIK';

        const dataSection = document.getElementById('sp-data-section');
        const dataContainer = document.getElementById('sp-data');
        
        let details = data.data || {};
        if (Object.keys(details).length === 0) {
            if (data.jarakLy) details["Jarak Tercatat"] = data.jarakLy;
            if (data.galaksi) details["Galaksi Host"] = data.galaksi;
            if (data.kategori) details["Kategori"] = data.kategori;
        }

        if (Object.keys(details).length > 0) {
            dataSection.style.display = 'block';
            let html = '';
            for (const key in details) {
                html += `<div><b>${key}:</b> ${details[key]}</div>`;
            }
            dataContainer.innerHTML = html;
        } else {
            dataSection.style.display = 'none';
        }

        sidePanel.classList.add('active');
    }

    closeBtn.addEventListener('click', () => {
        sidePanel.classList.remove('active');
    });

    // Reset View Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            stageManager.setStage(1);
        });
    }

    // Stage Navigation Buttons
    const stageButtons = document.querySelectorAll('.stage-btn');
    stageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stageNum = parseInt(btn.dataset.stage);
            setActiveStageButton(stageNum);
            stageManager.setStage(stageNum);
        });
    });

    function setActiveStageButton(stageNum) {
        stageButtons.forEach(b => {
            if (parseInt(b.dataset.stage) === stageNum) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    // Helper: find mesh in interactiveObjects or return plain object
    function findTargetOrMesh(item) {
        for (let i = 0; i < interactiveObjects.length; i++) {
            const obj = interactiveObjects[i];
            if (obj.userData && (obj.userData.nama === item.nama || obj.userData.id === item.id)) {
                return obj;
            }
        }
        return item;
    }

    // Comprehensive Search across both Interactive Meshes AND Cosmic Library (575+ objects)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 1) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const matches = [];
        const seenNames = new Set();

        // 1. Search in 3D interactive scene meshes
        for (let i = 0; i < interactiveObjects.length; i++) {
            const obj = interactiveObjects[i];
            const name = (obj.userData && obj.userData.nama) ? obj.userData.nama : '';
            const type = (obj.userData && obj.userData.tipe) ? obj.userData.tipe : '';
            if (name.toLowerCase().includes(query) || type.toLowerCase().includes(query)) {
                if (!seenNames.has(name)) {
                    seenNames.add(name);
                    matches.push({ target: obj, name, type, isMesh: true, data: obj.userData });
                    if (matches.length >= 12) break;
                }
            }
        }

        // 2. Search in Cosmic Library (575 items)
        if (matches.length < 12 && cosmicLibrary.length > 0) {
            for (let i = 0; i < cosmicLibrary.length; i++) {
                const lib = cosmicLibrary[i];
                if (!seenNames.has(lib.nama)) {
                    const matchName = lib.nama.toLowerCase().includes(query);
                    const matchType = lib.tipe.toLowerCase().includes(query);
                    const matchGal = lib.galaksi.toLowerCase().includes(query);
                    const matchDesc = lib.desc.toLowerCase().includes(query);
                    if (matchName || matchType || matchGal || matchDesc) {
                        seenNames.add(lib.nama);
                        const target = findTargetOrMesh(lib);
                        matches.push({ target, name: lib.nama, type: `${lib.tipe} · ${lib.galaksi}`, isMesh: target.isObject3D, data: lib });
                        if (matches.length >= 12) break;
                    }
                }
            }
        }

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map((m, idx) => `
                <div class="search-item" data-idx="${idx}">
                    <span class="search-item-name">${m.name}</span>
                    <span class="search-item-meta">${m.type}</span>
                </div>
            `).join('');
            searchResults.classList.add('active');

            const itemEls = searchResults.querySelectorAll('.search-item');
            itemEls.forEach((el, idx) => {
                el.addEventListener('click', () => {
                    const selected = matches[idx];
                    searchResults.classList.remove('active');
                    searchInput.value = selected.name;
                    showObjectInfo(selected.data);
                    stageManager.flyToObject(selected.target);
                    if (onObjectSelected && selected.isMesh) onObjectSelected(selected.target);
                });
            });
        } else {
            searchResults.innerHTML = '<div style="padding:12px 15px; color:#94a3b8; font-size:12px;">Objek tidak ditemukan</div>';
            searchResults.classList.add('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // Morphological Filter buttons (Stage 5)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            stageManager.setStage(5);
        });
    });

    // =========================================================================
    // COSMIC LIBRARY (PERPUSTAKAAN KOSMIK - 500+ OBJEK ASTRONOMI NASA / ESA)
    // =========================================================================
    let activeCategory = 'all';
    let activeHost = 'all';
    let libSearchQuery = '';

    function openCosmicLibrary() {
        if (!libraryModal) return;
        libraryModal.classList.add('active');
        renderLibraryGrid();
    }

    function closeCosmicLibrary() {
        if (!libraryModal) return;
        libraryModal.classList.remove('active');
    }

    if (cosmicLibBtn) cosmicLibBtn.addEventListener('click', openCosmicLibrary);
    if (closeLibBtn) closeLibBtn.addEventListener('click', closeCosmicLibrary);

    // Close on outside click
    if (libraryModal) {
        libraryModal.addEventListener('click', (e) => {
            if (e.target === libraryModal) {
                closeCosmicLibrary();
            }
        });
    }

    // Category filter click
    libCatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            libCatButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.cat;
            renderLibraryGrid();
        });
    });

    // Host Galaxy filter click
    libHostButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            libHostButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeHost = btn.dataset.host;
            renderLibraryGrid();
        });
    });

    // Library live search
    if (libSearchInput) {
        libSearchInput.addEventListener('input', (e) => {
            libSearchQuery = e.target.value.trim().toLowerCase();
            renderLibraryGrid();
        });
    }

    function renderLibraryGrid() {
        if (!libGrid || !cosmicLibrary) return;

        const filtered = cosmicLibrary.filter(item => {
            // Category filter
            if (activeCategory !== 'all') {
                if (activeCategory === 'Tata Surya') {
                    if (!item.kategori.includes('Tata Surya') && !item.kategori.includes('Misi NASA')) return false;
                } else if (activeCategory === 'Planetary & Sisa Supernova') {
                    if (!item.kategori.includes('Planetary') && !item.kategori.includes('Supernova')) return false;
                } else if (!item.kategori.includes(activeCategory)) {
                    return false;
                }
            }

            // Host Galaxy filter
            if (activeHost !== 'all') {
                if (activeHost === 'Bima Sakti') {
                    if (item.galaksi !== 'Bima Sakti' && !item.galaksi.includes('Bima Sakti')) return false;
                } else if (activeHost === 'Galaksi Andromeda') {
                    if (!item.galaksi.includes('Andromeda') && !item.galaksi.includes('M31')) return false;
                } else if (activeHost === 'Awan Magellan Besar') {
                    if (!item.galaksi.includes('Magellan Besar') && !item.galaksi.includes('LMC')) return false;
                } else if (activeHost === 'Awan Magellan Kecil') {
                    if (!item.galaksi.includes('Magellan Kecil') && !item.galaksi.includes('SMC')) return false;
                } else if (activeHost === 'Galaksi Triangulum') {
                    if (!item.galaksi.includes('Triangulum') && !item.galaksi.includes('M33')) return false;
                } else if (activeHost === 'Satelit') {
                    const isMajor = item.galaksi.includes('Bima Sakti') || item.galaksi.includes('Andromeda') || item.galaksi.includes('LMC') || item.galaksi.includes('SMC') || item.galaksi.includes('Triangulum');
                    if (isMajor) return false;
                }
            }

            // Search query
            if (libSearchQuery.length > 0) {
                const text = `${item.nama} ${item.tipe} ${item.galaksi} ${item.desc} ${item.kategori}`.toLowerCase();
                if (!text.includes(libSearchQuery)) return false;
            }

            return true;
        });

        // Update count label
        if (libCountLabel) {
            libCountLabel.textContent = `Menampilkan ${filtered.length} objek dari total ${cosmicLibrary.length} objek`;
        }

        // Render card elements
        if (filtered.length === 0) {
            libGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                    <div style="font-size: 36px; margin-bottom: 12px;">🔭</div>
                    <div style="font-size: 16px; font-weight: 600; color: #cbd5e1;">Tidak ada objek astronomi yang cocok</div>
                    <div style="font-size: 13px; margin-top: 6px;">Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua".</div>
                </div>
            `;
            return;
        }

        // Limit initial rendered cards for instant responsiveness if list is huge
        const displayList = filtered.slice(0, 200);

        libGrid.innerHTML = displayList.map(item => `
            <div class="lib-card" data-id="${item.id}">
                <div>
                    <div class="lib-card-top">
                        <span class="lib-badge">${item.kategori}</span>
                        <span class="lib-host-badge">${item.galaksi}</span>
                    </div>
                    <div class="lib-card-title">${item.icon || '✨'} ${item.nama}</div>
                    <div class="lib-card-type">${item.tipe}</div>
                    <div class="lib-card-distance">📍 Jarak: ${item.jarakLy}</div>
                    <p class="lib-card-desc">${item.desc}</p>
                </div>
                <div class="lib-card-actions">
                    <button class="lib-fly-btn" data-id="${item.id}">🚀 Terbang ke Objek</button>
                </div>
            </div>
        `).join('') + (filtered.length > 200 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #94a3b8; font-size: 13px;">
                (Menampilkan 200 objek pertama. Gunakan kolom pencarian atau filter kategori di atas untuk menyaring objek spesifik)
            </div>
        ` : '');

        // Attach click handlers to cards and fly buttons
        libGrid.querySelectorAll('.lib-card').forEach(card => {
            const id = card.dataset.id;
            const item = cosmicLibrary.find(x => x.id === id);
            if (!item) return;

            card.addEventListener('click', (e) => {
                closeCosmicLibrary();
                showObjectInfo(item);
                const target = findTargetOrMesh(item);
                stageManager.flyToObject(target);
                if (onObjectSelected && target.isObject3D) onObjectSelected(target);
            });
        });
    }

    // Cinematic Cosmic Tour control
    tourBtn.addEventListener('click', () => {
        if (stageManager.isTourPlaying()) {
            stageManager.stopCinematicTour();
            tourBtn.classList.remove('playing');
            tourBtn.innerText = '🎬 Tur Sinematik';
            tourHud.classList.remove('active');
        } else {
            tourBtn.classList.add('playing');
            tourBtn.innerText = '⏹ Hentikan Tur';
            tourHud.classList.add('active');

            stageManager.startCinematicTour(
                (targetName) => {
                    for (let i = 0; i < interactiveObjects.length; i++) {
                        if (interactiveObjects[i].userData && interactiveObjects[i].userData.nama === targetName) {
                            showObjectInfo(interactiveObjects[i].userData);
                            return interactiveObjects[i];
                        }
                    }
                    return null;
                },
                (statusText, step, total) => {
                    tourStatusText.innerText = `[${step}/${total}] ${statusText}`;
                }
            );
        }
    });

    stopTourBtn.addEventListener('click', () => {
        stageManager.stopCinematicTour();
        tourBtn.classList.remove('playing');
        tourBtn.innerText = '🎬 Tur Sinematik';
        tourHud.classList.remove('active');
    });

    // =========================================================================
    // COLLISION EXPERIMENT EVENT HANDLERS
    // =========================================================================
    function onSimulationStateUpdate(state) {
        if (!state) return;
        const { simTime, isPlaying, speedMultiplier, phaseInfo } = state;

        if (expTimeLabel) expTimeLabel.textContent = `T +${simTime.toFixed(2)} Miliar Tahun`;
        if (expDistLabel) expDistLabel.textContent = phaseInfo.jarak;
        if (expSpeedLabel) expSpeedLabel.textContent = phaseInfo.kecepatan;
        if (expStarburstLabel) expStarburstLabel.textContent = phaseInfo.starburst;
        if (expSunLabel) expSunLabel.textContent = phaseInfo.surya;
        if (expPhaseBadge) expPhaseBadge.textContent = `FASE ${phaseInfo.fase}`;
        if (expPhaseTitle) expPhaseTitle.textContent = phaseInfo.judul;
        if (expPhaseDesc) expPhaseDesc.textContent = phaseInfo.deskripsi;
        if (expTimelineSlider) expTimelineSlider.value = simTime.toFixed(2);

        if (expPlayBtn) {
            expPlayBtn.innerHTML = isPlaying ? '⏸ Pause' : '▶ Putar';
        }

        phaseJumpButtons.forEach(btn => {
            if (parseInt(btn.dataset.phase) === phaseInfo.fase) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    if (collisionExpBtn && collisionExperiment) {
        collisionExpBtn.addEventListener('click', () => {
            closeCosmicLibrary();
            sidePanel.classList.remove('active');
            applyDashboardMode('sembunyi');

            collisionHud.classList.add('active');
            collisionExperiment.startExperiment(onSimulationStateUpdate);
        });
    }

    if (closeCollisionBtn && collisionExperiment) {
        closeCollisionBtn.addEventListener('click', () => {
            collisionHud.classList.remove('active');
            collisionExperiment.stopExperiment();
            applyDashboardMode('penuh');
        });
    }

    if (expPlayBtn && collisionExperiment) {
        expPlayBtn.addEventListener('click', () => {
            collisionExperiment.togglePlay();
        });
    }

    if (expResetBtn && collisionExperiment) {
        expResetBtn.addEventListener('click', () => {
            collisionExperiment.reset();
        });
    }

    if (expTimelineSlider && collisionExperiment) {
        expTimelineSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            collisionExperiment.setTime(val);
        });
    }

    expSpeedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!collisionExperiment) return;
            const spd = parseFloat(btn.dataset.speed);
            collisionExperiment.setSpeed(spd);
            expSpeedButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    phaseJumpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!collisionExperiment) return;
            const phase = parseInt(btn.dataset.phase);
            collisionExperiment.jumpToPhase(phase);
        });
    });

    return {
        showObjectInfo,
        setActiveStageButton,
        openCosmicLibrary,
        closeCosmicLibrary
    };
}
