// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.config = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.setupEventListeners();
        this.checkAuth();
    }

    async loadConfig() {
        try {
            // Try to load from API first
            const response = await fetch('/api/config');
            if (response.ok) {
                this.config = await response.json();
                console.log('✅ Config loaded from API');
                return;
            }
        } catch (error) {
            console.log('API not available, trying config.json...');
        }
        
        try {
            // Fallback to config.json
            const response = await fetch('config.json');
            this.config = await response.json();
            console.log('✅ Config loaded from file');
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            users: [
                {
                    id: 1,
                    username: "alama",
                    password: "alama123",
                    role: "admin",
                    createdAt: new Date().toISOString()
                }
            ],
            siteConfig: {
                title: "Innerpeacecollection",
                description: "Discover the art of luxury beauty perfumes, skincare, and timeless elegance that bring you inner peace.",
                profileImage: "https://ugc.production.linktr.ee/4dced3e5-0496-4436-8292-3357b2950197_ab8249e046582b035428bd4d15a31e51.webp?io=true&size=avatar-v3_0"
            },
            socialLinks: [],
            collections: [],
            links: [],
            analytics: {
                totalClicks: 0,
                dailyClicks: {},
                linkClicks: {}
            }
        };
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Sync config button
        document.getElementById('syncConfigBtn').addEventListener('click', () => {
            this.saveConfig();
        });

        // Refresh analytics button
        document.getElementById('refreshAnalyticsBtn').addEventListener('click', () => {
            this.loadAnalyticsData();
            this.showNotification('Analytics refreshed!', 'success');
        });

        // Navigation tabs
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add buttons
        document.getElementById('addLinkBtn').addEventListener('click', () => {
            this.openLinkModal();
        });

        document.getElementById('addCollectionBtn').addEventListener('click', () => {
            this.openCollectionModal();
        });

        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.openUserModal();
        });

        // Forms
        document.getElementById('linkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLinkForm();
        });

        document.getElementById('collectionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCollectionForm();
        });

        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserForm();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Modal close buttons
        document.querySelectorAll('.close, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal || e.target.closest('.modal').id;
                this.closeModal(modalId);
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    checkAuth() {
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        const user = this.config.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('adminUser', JSON.stringify(user));
            this.showDashboard();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.style.display = 'block';
        }
    }

    handleLogout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('currentUser').textContent = `Welcome, ${this.currentUser.username}`;
        this.loadDashboardData();
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load tab-specific data
        switch (tabName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'links':
                this.loadLinksData();
                break;
            case 'collections':
                this.loadCollectionsData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    loadDashboardData() {
        // Update stats
        document.getElementById('totalLinks').textContent = this.config.links.filter(l => l.active).length;
        document.getElementById('totalClicks').textContent = this.config.analytics.totalClicks;
        document.getElementById('totalCollections').textContent = this.config.collections.filter(c => c.active).length;
        document.getElementById('totalUsers').textContent = this.config.users.length;

        // Load recent activity
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        
        // Get real activity from localStorage or config
        let activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        
        // If no real activity, show placeholder
        if (activities.length === 0) {
            activities = [
                { action: 'Admin panel opened', item: 'Dashboard accessed', time: 'Just now', type: 'system' },
                { action: 'No activity yet', item: 'Start clicking links to see real stats!', time: '', type: 'info' }
            ];
        }

        // Sort by timestamp (newest first) and limit to 10
        activities = activities
            .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
            .slice(0, 10);

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <strong>${activity.action}:</strong> ${activity.item}
                <div style="font-size: 0.8rem; color: #6B7280; margin-top: 5px;">
                    ${activity.time || this.getTimeAgo(activity.timestamp)}
                </div>
            </div>
        `).join('');
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return 'Unknown time';
        
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    addActivity(action, item, type = 'action') {
        let activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        
        const newActivity = {
            action,
            item,
            type,
            timestamp: new Date().toISOString(),
            time: 'Just now'
        };
        
        activities.unshift(newActivity);
        
        // Keep only last 50 activities
        activities = activities.slice(0, 50);
        
        localStorage.setItem('recentActivity', JSON.stringify(activities));
        
        // Refresh activity display if on dashboard
        if (document.querySelector('.tab-content.active')?.id === 'dashboard') {
            this.loadRecentActivity();
        }
    }

    async loadAnalyticsData() {
        const analyticsContainer = document.getElementById('analyticsContainer');
        if (!analyticsContainer) return;

        // Reload config to get latest analytics
        await this.loadConfig();

        const totalClicks = this.config.analytics.totalClicks || 0;
        const totalLinks = this.config.links.length;
        const totalCollections = this.config.collections.length;

        // Calculate today's clicks
        const today = new Date().toISOString().split('T')[0];
        const todayClicks = this.config.analytics.dailyClicks[today] || 0;

        // Generate link performance table
        const linkPerformanceHtml = this.config.links.map(link => {
            const linkClicks = this.config.analytics.linkClicks[link.id] || 0;
            return `
                <div class="link-performance-item">
                    <span class="link-name">${link.title}</span>
                    <span class="link-clicks">${linkClicks} clicks</span>
                </div>
            `;
        }).join('');

        analyticsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🔗</div>
                    <div class="stat-content">
                        <div class="stat-number">${totalLinks}</div>
                        <div class="stat-label">Total Links</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📁</div>
                    <div class="stat-content">
                        <div class="stat-number">${totalCollections}</div>
                        <div class="stat-label">Collections</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👆</div>
                    <div class="stat-content">
                        <div class="stat-number">${totalClicks}</div>
                        <div class="stat-label">Total Clicks</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-number">${todayClicks}</div>
                        <div class="stat-label">Today's Clicks</div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>📈 Link Performance</h3>
                <div class="link-performance">
                    ${linkPerformanceHtml}
                </div>
            </div>
        `;
    }

    loadLinksData() {
        const linksContainer = document.getElementById('linksList');
        
        linksContainer.innerHTML = this.config.links.map(link => {
            const collection = this.config.collections.find(c => c.id === link.collectionId);
            const isImage = link.image.startsWith('http');
            
            return `
                <div class="link-item">
                    <div class="link-image">
                        ${isImage ? `<img src="${link.image}" alt="${link.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` : link.image}
                    </div>
                    <div class="link-info">
                        <h3>${link.title}</h3>
                        <p>${link.description}</p>
                        <div class="link-stats">
                            <span>👆 ${link.clicks} clicks</span>
                            <span>📁 ${collection ? collection.name : 'No Collection'}</span>
                            <span>${link.active ? '✅ Active' : '❌ Inactive'}</span>
                        </div>
                    </div>
                    <div class="link-actions">
                        <button class="edit-btn" onclick="adminPanel.editLink(${link.id})">Edit</button>
                        <button class="delete-btn" onclick="adminPanel.deleteLink(${link.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadCollectionsData() {
        const collectionsContainer = document.getElementById('collectionsList');
        
        collectionsContainer.innerHTML = this.config.collections.map(collection => {
            const linkCount = this.config.links.filter(l => l.collectionId === collection.id).length;
            
            return `
                <div class="collection-item">
                    <div class="link-image">📁</div>
                    <div class="link-info">
                        <h3>${collection.name}</h3>
                        <p>${linkCount} links in this collection</p>
                        <div class="link-stats">
                            <span>${collection.active ? '✅ Active' : '❌ Inactive'}</span>
                        </div>
                    </div>
                    <div class="link-actions">
                        <button class="edit-btn" onclick="adminPanel.editCollection(${collection.id})">Edit</button>
                        <button class="delete-btn" onclick="adminPanel.deleteCollection(${collection.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAnalyticsData() {
        // Load link performance
        const performanceContainer = document.getElementById('linkPerformance');
        const sortedLinks = [...this.config.links].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
        
        performanceContainer.innerHTML = sortedLinks.map(link => `
            <div class="performance-item">
                <span>${link.title}</span>
                <span>${link.clicks} clicks</span>
            </div>
        `).join('');

        // Load daily clicks (mock data for now)
        const dailyContainer = document.getElementById('dailyClicks');
        const today = new Date().toDateString();
        dailyContainer.innerHTML = `
            <div class="performance-item">
                <span>Today (${today})</span>
                <span>${Math.floor(Math.random() * 50)} clicks</span>
            </div>
            <div class="performance-item">
                <span>Yesterday</span>
                <span>${Math.floor(Math.random() * 80)} clicks</span>
            </div>
            <div class="performance-item">
                <span>This Week</span>
                <span>${Math.floor(Math.random() * 300)} clicks</span>
            </div>
        `;
    }

    loadUsersData() {
        const usersContainer = document.getElementById('usersList');
        
        usersContainer.innerHTML = this.config.users.map(user => `
            <div class="user-item">
                <div class="link-image">👤</div>
                <div class="link-info">
                    <h3>${user.username}</h3>
                    <p>Role: ${user.role}</p>
                    <div class="link-stats">
                        <span>Created: ${new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="link-actions">
                    ${user.id !== this.currentUser.id ? `<button class="delete-btn" onclick="adminPanel.deleteUser(${user.id})">Delete</button>` : '<span style="color: #6B7280;">Current User</span>'}
                </div>
            </div>
        `).join('');
    }

    loadSettingsData() {
        document.getElementById('siteTitle').value = this.config.siteConfig.title;
        document.getElementById('siteDescription').value = this.config.siteConfig.description;
        document.getElementById('profileImage').value = this.config.siteConfig.profileImage;
    }

    // Modal functions
    openLinkModal(linkId = null) {
        const modal = document.getElementById('linkModal');
        const form = document.getElementById('linkForm');
        const title = document.getElementById('linkModalTitle');
        
        // Populate collections dropdown
        const collectionsSelect = document.getElementById('linkCollection');
        collectionsSelect.innerHTML = this.config.collections.map(collection => 
            `<option value="${collection.id}">${collection.name}</option>`
        ).join('');

        if (linkId) {
            const link = this.config.links.find(l => l.id === linkId);
            title.textContent = 'Edit Link';
            document.getElementById('linkId').value = link.id;
            document.getElementById('linkTitle').value = link.title;
            document.getElementById('linkDescription').value = link.description;
            document.getElementById('linkUrl').value = link.url;
            document.getElementById('linkImage').value = link.image;
            document.getElementById('linkCollection').value = link.collectionId;
        } else {
            title.textContent = 'Add Link';
            form.reset();
            document.getElementById('linkId').value = '';
        }

        modal.style.display = 'block';
    }

    openCollectionModal(collectionId = null) {
        const modal = document.getElementById('collectionModal');
        const form = document.getElementById('collectionForm');
        const title = document.getElementById('collectionModalTitle');

        if (collectionId) {
            const collection = this.config.collections.find(c => c.id === collectionId);
            title.textContent = 'Edit Collection';
            document.getElementById('collectionId').value = collection.id;
            document.getElementById('collectionName').value = collection.name;
        } else {
            title.textContent = 'Add Collection';
            form.reset();
            document.getElementById('collectionId').value = '';
        }

        modal.style.display = 'block';
    }

    openUserModal() {
        const modal = document.getElementById('userModal');
        const form = document.getElementById('userForm');
        form.reset();
        modal.style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Save functions
    saveLinkForm() {
        const formData = new FormData(document.getElementById('linkForm'));
        const linkData = {
            title: formData.get('linkTitle'),
            description: formData.get('linkDescription'),
            url: formData.get('linkUrl'),
            image: formData.get('linkImage'),
            collectionId: parseInt(formData.get('linkCollection')),
            active: true,
            clicks: 0
        };

        const linkId = formData.get('linkId');
        
        if (linkId) {
            // Edit existing link
            const linkIndex = this.config.links.findIndex(l => l.id === parseInt(linkId));
            this.config.links[linkIndex] = { ...this.config.links[linkIndex], ...linkData };
            this.addActivity('Link updated', linkData.title, 'edit');
            this.showNotification('Link updated successfully!', 'success');
        } else {
            // Add new link
            const newId = Math.max(...this.config.links.map(l => l.id), 0) + 1;
            const newOrder = this.config.links.filter(l => l.collectionId === linkData.collectionId).length + 1;
            this.config.links.push({ id: newId, order: newOrder, ...linkData });
            this.addActivity('New link added', linkData.title, 'create');
            this.showNotification('Link added successfully!', 'success');
        }

        this.saveConfig();
        this.closeModal('linkModal');
        this.loadLinksData();
        this.loadDashboardData();
    }

    saveCollectionForm() {
        const formData = new FormData(document.getElementById('collectionForm'));
        const collectionData = {
            name: formData.get('collectionName'),
            active: true
        };

        const collectionId = formData.get('collectionId');
        
        if (collectionId) {
            // Edit existing collection
            const collectionIndex = this.config.collections.findIndex(c => c.id === parseInt(collectionId));
            this.config.collections[collectionIndex] = { ...this.config.collections[collectionIndex], ...collectionData };
            this.addActivity('Collection updated', collectionData.name, 'edit');
            this.showNotification('Collection updated successfully!', 'success');
        } else {
            // Add new collection
            const newId = Math.max(...this.config.collections.map(c => c.id), 0) + 1;
            const newOrder = this.config.collections.length + 1;
            this.config.collections.push({ id: newId, order: newOrder, ...collectionData });
            this.addActivity('New collection added', collectionData.name, 'create');
            this.showNotification('Collection added successfully!', 'success');
        }

        this.saveConfig();
        this.closeModal('collectionModal');
        this.loadCollectionsData();
        this.loadDashboardData();
    }

    saveUserForm() {
        const formData = new FormData(document.getElementById('userForm'));
        const userData = {
            username: formData.get('newUsername'),
            password: formData.get('newPassword'),
            role: formData.get('userRole'),
            createdAt: new Date().toISOString()
        };

        // Check if username already exists
        if (this.config.users.find(u => u.username === userData.username)) {
            this.showNotification('Username already exists!', 'error');
            return;
        }

        const newId = Math.max(...this.config.users.map(u => u.id), 0) + 1;
        this.config.users.push({ id: newId, ...userData });

        this.addActivity('New user added', userData.username, 'create');
        this.saveConfig();
        this.closeModal('userModal');
        this.loadUsersData();
        this.loadDashboardData();
        this.showNotification('User added successfully!', 'success');
    }

    saveSettings() {
        this.config.siteConfig.title = document.getElementById('siteTitle').value;
        this.config.siteConfig.description = document.getElementById('siteDescription').value;
        this.config.siteConfig.profileImage = document.getElementById('profileImage').value;

        this.addActivity('Site settings updated', 'Configuration changed', 'edit');
        this.saveConfig();
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Edit functions
    editLink(linkId) {
        this.openLinkModal(linkId);
    }

    editCollection(collectionId) {
        this.openCollectionModal(collectionId);
    }

    // Delete functions
    deleteLink(linkId) {
        const link = this.config.links.find(l => l.id === linkId);
        if (confirm('Are you sure you want to delete this link?')) {
            this.config.links = this.config.links.filter(l => l.id !== linkId);
            this.addActivity('Link deleted', link ? link.title : 'Unknown link', 'delete');
            this.saveConfig();
            this.loadLinksData();
            this.loadDashboardData();
            this.showNotification('Link deleted successfully!', 'success');
        }
    }

    deleteCollection(collectionId) {
        const linksInCollection = this.config.links.filter(l => l.collectionId === collectionId);
        if (linksInCollection.length > 0) {
            this.showNotification('Cannot delete collection with links. Move or delete links first.', 'error');
            return;
        }

        const collection = this.config.collections.find(c => c.id === collectionId);
        if (confirm('Are you sure you want to delete this collection?')) {
            this.config.collections = this.config.collections.filter(c => c.id !== collectionId);
            this.addActivity('Collection deleted', collection ? collection.name : 'Unknown collection', 'delete');
            this.saveConfig();
            this.loadCollectionsData();
            this.loadDashboardData();
            this.showNotification('Collection deleted successfully!', 'success');
        }
    }

    deleteUser(userId) {
        const user = this.config.users.find(u => u.id === userId);
        if (confirm('Are you sure you want to delete this user?')) {
            this.config.users = this.config.users.filter(u => u.id !== userId);
            this.addActivity('User deleted', user ? user.username : 'Unknown user', 'delete');
            this.saveConfig();
            this.loadUsersData();
            this.loadDashboardData();
            this.showNotification('User deleted successfully!', 'success');
        }
    }

    // Utility functions
    async saveConfig() {
        // Save to localStorage for admin panel
        localStorage.setItem('siteConfig', JSON.stringify(this.config));
        
        // Try to save via API first
        try {
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.config)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Config saved via API!');
                this.showNotification('Configuration saved successfully!', 'success');
                return;
            }
        } catch (error) {
            console.log('API not available, using file download...');
        }
        
        // Fallback: download file
        try {
            const dataStr = JSON.stringify(this.config, null, 2);
            await this.saveToConfigFile(dataStr);
            console.log('📁 Config file downloaded!');
            this.showNotification('Config file downloaded! Replace your config.json with the downloaded file.', 'success');
        } catch (error) {
            console.error('Error saving config:', error);
            const dataStr = JSON.stringify(this.config, null, 2);
            console.log('📝 Copy this to config.json manually:', dataStr);
            this.showNotification('Save failed. Check console to copy JSON manually.', 'error');
        }
    }

    async saveToConfigFile(jsonData) {
        // Method 1: Try using File System Access API (modern browsers)
        if ('showSaveFilePicker' in window) {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: 'config.json',
                    types: [{
                        description: 'JSON files',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
                
                const writable = await fileHandle.createWritable();
                await writable.write(jsonData);
                await writable.close();
                
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('File System Access API failed, trying alternative...');
                }
            }
        }
        
        // Method 2: Auto-download the file
        this.downloadConfigFile(jsonData);
        this.showNotification('Config file downloaded! Replace your config.json with the downloaded file.', 'success');
    }

    downloadConfigFile(jsonData) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Track link clicks (to be called from main site)
    trackLinkClick(linkId) {
        const link = this.config.links.find(l => l.id === linkId);
        if (link) {
            link.clicks++;
            this.config.analytics.totalClicks++;
            
            const today = new Date().toDateString();
            if (!this.config.analytics.dailyClicks[today]) {
                this.config.analytics.dailyClicks[today] = 0;
            }
            this.config.analytics.dailyClicks[today]++;
            
            this.saveConfig();
        }
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Export for use in main site
window.adminPanel = adminPanel;
