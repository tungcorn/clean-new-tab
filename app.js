/**
 * Clean New Tab - A minimal new tab extension
 * @description Replaces the default new tab page with a clean, customizable interface
 * @version 1.0.0
 * @license MIT
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Default background images from Unsplash */
const defaultBgs = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=1920',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920',
    'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920',
];

/** Default quick links */
const defaultLinks = [
    { name: 'Telegram', url: 'https://web.telegram.org' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'ChatGPT', url: 'https://chat.openai.com' },
    { name: 'Spotify', url: 'https://open.spotify.com' },
];

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Get saved links from localStorage
 * @returns {Array} Array of link objects
 */
function getLinks() {
    const saved = localStorage.getItem('quickLinks');
    return saved ? JSON.parse(saved) : [...defaultLinks];
}

/**
 * Save links to localStorage
 * @param {Array} links - Array of link objects to save
 */
function saveLinks(links) {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

/**
 * Get background from chrome.storage.local (supports unlimited storage for high-res images)
 * @param {Function} callback - Callback function with background URL
 */
function getBackground(callback) {
    if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['background'], function (result) {
            callback(result.background || defaultBgs[0]);
        });
    } else {
        // Fallback for testing in browser
        callback(localStorage.getItem('background') || defaultBgs[0]);
    }
}

/**
 * Save background to chrome.storage.local
 * @param {string} url - Background URL or base64 data
 * @param {Function} callback - Optional callback after save
 */
function saveBackground(url, callback) {
    if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ background: url }, function () {
            if (callback) callback();
        });
    } else {
        // Fallback for testing in browser
        localStorage.setItem('background', url);
        if (callback) callback();
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get favicon URL for a given website
 * @param {string} url - Website URL
 * @returns {string} Favicon URL
 */
function getFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        return 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
    } catch (e) {
        return '';
    }
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

/**
 * Render quick links to the DOM
 */
function renderLinks() {
    const container = document.getElementById('quickLinks');
    const links = getLinks();

    let html = '';
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        html += '<a href="' + link.url + '" class="link" data-index="' + i + '">' +
            '<button class="delete-btn" data-index="' + i + '">×</button>' +
            '<div class="link-icon">' +
            '<img src="' + getFavicon(link.url) + '" alt="" onerror="this.style.display=\'none\'">' +
            '</div>' +
            '<div class="link-name">' + link.name + '</div>' +
            '</a>';
    }

    // Show add button only when there's at least 1 link
    if (links.length > 0) {
        html += '<div class="add-link" id="addLinkCard">' +
            '<div class="link-icon">+</div>' +
            '<div class="link-name">Add New</div>' +
            '</div>';
    }

    container.innerHTML = html;

    // Add click handler for add button (only if exists)
    const addCard = document.getElementById('addLinkCard');
    if (addCard) {
        addCard.addEventListener('click', function () {
            document.getElementById('settingsPanel').classList.add('show');
            document.getElementById('addForm').classList.add('show');
        });
    }

    // Add delete handlers
    const deleteBtns = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            deleteLink(index);
        });
    }
}

/**
 * Render background options in settings panel
 */
function renderBgOptions() {
    const container = document.getElementById('bgOptions');
    getBackground(function (currentBg) {
        let html = '';
        for (let i = 0; i < defaultBgs.length; i++) {
            const bg = defaultBgs[i];
            const selectedClass = bg === currentBg ? 'selected' : '';
            html += '<div class="bg-option ' + selectedClass + '" style="background-image: url(\'' + bg + '\')" data-bg="' + bg + '"></div>';
        }

        container.innerHTML = html;

        // Add click handlers
        const options = container.querySelectorAll('.bg-option');
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', function () {
                selectBg(this.getAttribute('data-bg'));
            });
        }
    });
}

/**
 * Apply background to the page
 */
function applyBackground() {
    getBackground(function (bg) {
        if (bg) {
            document.body.classList.add('has-bg');
            document.body.style.backgroundImage = 'url("' + bg + '")';
        }
    });
}

/**
 * Select and apply a new background
 * @param {string} url - Background URL or base64 data
 */
function selectBg(url) {
    saveBackground(url, function () {
        applyBackground();
        renderBgOptions();
    });
}

// ============================================================================
// LINK MANAGEMENT
// ============================================================================

/**
 * Add a new link
 */
function addLink() {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (name && url) {
        const links = getLinks();
        links.push({ name: name, url: url });
        saveLinks(links);
        renderLinks();
        nameInput.value = '';
        urlInput.value = '';
        document.getElementById('addForm').classList.remove('show');
    }
}

/**
 * Delete a link by index
 * @param {number} index - Index of link to delete
 */
function deleteLink(index) {
    const links = getLinks();
    links.splice(index, 1);
    saveLinks(links);
    renderLinks();
}

/**
 * Reset all settings to default
 */
function resetToDefault() {
    if (confirm('Are you sure you want to reset to default?')) {
        localStorage.removeItem('quickLinks');
        // Also clear chrome.storage.local
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.remove(['background'], function () {
                renderLinks();
                applyBackground();
                renderBgOptions();
                document.body.classList.remove('edit-mode');
            });
        } else {
            localStorage.removeItem('background');
            renderLinks();
            applyBackground();
            renderBgOptions();
            document.body.classList.remove('edit-mode');
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Settings button toggle
    document.getElementById('settingsBtn').addEventListener('click', function () {
        const panel = document.getElementById('settingsPanel');
        panel.classList.toggle('show');
        renderBgOptions();
    });

    // Apply custom background from URL
    document.getElementById('applyBgBtn').addEventListener('click', function () {
        const url = document.getElementById('customBgUrl').value.trim();
        if (url) {
            selectBg(url);
            document.getElementById('customBgUrl').value = '';
        }
    });

    // Toggle edit mode for links
    document.getElementById('toggleEditBtn').addEventListener('click', function () {
        document.body.classList.toggle('edit-mode');
        this.textContent = document.body.classList.contains('edit-mode')
            ? '✅ Done'
            : '✏️ Edit';
    });

    // Show add link form
    document.getElementById('showAddFormBtn').addEventListener('click', function () {
        document.getElementById('addForm').classList.toggle('show');
    });

    // Add link button
    document.getElementById('addLinkBtn').addEventListener('click', addLink);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetToDefault);

    // Local background file picker
    document.getElementById('chooseBgBtn').addEventListener('click', function () {
        document.getElementById('localBgInput').click();
    });

    document.getElementById('localBgInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                // Save full quality image to chrome.storage.local (unlimited storage)
                selectBg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Close panel when clicking outside
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('settingsPanel');
        const btn = document.getElementById('settingsBtn');
        const addCard = document.getElementById('addLinkCard');
        if (!panel.contains(e.target) && !btn.contains(e.target) && addCard && e.target !== addCard && !addCard.contains(e.target)) {
            panel.classList.remove('show');
        }
        if (!panel.contains(e.target) && !btn.contains(e.target) && !addCard) {
            panel.classList.remove('show');
        }
    });

    // Initialize the page
    renderLinks();
    applyBackground();
});
