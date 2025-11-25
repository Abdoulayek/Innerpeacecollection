// Simple Node.js server for config management
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get config
app.get('/api/config', async (req, res) => {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading config:', error);
        res.status(500).json({ error: 'Failed to read config' });
    }
});

// Save config
app.post('/api/config', async (req, res) => {
    try {
        const configData = JSON.stringify(req.body, null, 2);
        await fs.writeFile(CONFIG_FILE, configData, 'utf8');
        console.log('✅ Config saved successfully!');
        res.json({ success: true, message: 'Config saved successfully!' });
    } catch (error) {
        console.error('Error saving config:', error);
        res.status(500).json({ error: 'Failed to save config' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📝 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`🌐 Site: http://localhost:${PORT}`);
});

module.exports = app;
