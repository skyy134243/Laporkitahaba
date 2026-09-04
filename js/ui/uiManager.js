export function createUIManager(stageManager, interactiveObjects, onObjectSelected) {
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
        document.getElementById('sp-sumber').innerText = data.sumber ? `Sumber: ${data.sumber}` : 'Sumber: NASA / ESA';

        const badge = document.getElementById('sp-badge');
        if (badge) badge.innerText = data.kategori || 'KOSMIK';

        const dataSection = document.getElementById('sp-data-section');
        const dataContainer = document.getElementById('sp-data');
        if (data.data && Object.keys(data.data).length > 0) {
            dataSection.style.display = 'block';
            let html = '';
            for (const key in data.data) {
                html += `<div><b>${key}:</b> ${data.data[key]}</div>`;
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
    resetBtn.addEventListener('click', () => {
        stageManager.setStage(1);
    });

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

    // Search bar functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 1) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const matches = [];
        for (let i = 0; i < interactiveObjects.length; i++) {
            const obj = interactiveObjects[i];
            const name = (obj.userData && obj.userData.nama) ? obj.userData.nama : '';
            const type = (obj.userData && obj.userData.tipe) ? obj.userData.tipe : '';
            if (name.toLowerCase().includes(query) || type.toLowerCase().includes(query)) {
                matches.push({ mesh: obj, name, type });
                if (matches.length >= 10) break;
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
                    showObjectInfo(selected.mesh.userData);
                    stageManager.flyToObject(selected.mesh);
                    if (onObjectSelected) onObjectSelected(selected.mesh);
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

    // Morphological Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.filter;

            // Trigger stage 5 to show filtered view
            stageManager.setStage(5);
        });
    });

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

    return {
        showObjectInfo,
        setActiveStageButton
    };
}
