# 🚀 Backend Setup - Modification Directe de config.json

## 🎯 **Pourquoi un Backend ?**

Le navigateur ne peut **PAS** modifier directement les fichiers locaux pour des raisons de sécurité. 
Pour avoir une vraie modification directe du fichier `config.json`, nous avons besoin d'un serveur backend.

## 📦 **Installation**

### **1. Installer Node.js**
Si pas déjà installé : [nodejs.org](https://nodejs.org)

### **2. Installer les dépendances**
```bash
cd /Users/abdoulayekante/CascadeProjects/Voicebot/linktree_clone
npm install
```

### **3. Démarrer le serveur**
```bash
npm start
```

## 🌐 **URLs avec Backend**

Une fois le serveur démarré :
- **Site principal** : http://localhost:3000
- **Admin panel** : http://localhost:3000/admin.html
- **API** : http://localhost:3000/api/config

## ✅ **Avantages du Backend**

### **Avec Backend (Recommandé) :**
- ✅ **Modification directe** de config.json
- ✅ **Pas de téléchargement** de fichiers
- ✅ **Sauvegarde instantanée**
- ✅ **Synchronisation automatique**
- ✅ **Expérience fluide**

### **Sans Backend (Actuel) :**
- ❌ **Téléchargement** de fichiers
- ❌ **Remplacement manuel** requis
- ❌ **Pas de sauvegarde directe**

## 🔄 **Comment ça marche**

### **Avec le serveur Node.js :**
1. **Créez un lien** dans l'admin
2. **API POST** `/api/config` appelée automatiquement
3. **Fichier config.json modifié** directement sur le serveur
4. **Site mis à jour** instantanément !

### **API Endpoints :**
- `GET /api/config` - Récupère la configuration
- `POST /api/config` - Sauvegarde la configuration

## 🛠️ **Commandes Utiles**

```bash
# Démarrer le serveur
npm start

# Démarrer en mode développement (auto-restart)
npm run dev

# Arrêter le serveur
Ctrl+C
```

## 🔧 **Dépannage**

### **Port déjà utilisé :**
```bash
# Changer le port dans server.js
const PORT = 3001; // Au lieu de 3000
```

### **Erreur de permissions :**
```bash
# Sur Mac/Linux
sudo npm install
```

### **Modules manquants :**
```bash
npm install express cors
```

## 🎯 **Test du Backend**

1. **Démarrez le serveur** : `npm start`
2. **Ouvrez** : http://localhost:3000/admin.html
3. **Créez un lien** dans l'admin
4. **Vérifiez** que config.json est modifié automatiquement
5. **Rafraîchissez** le site → Le lien est là !

## 💡 **Alternative Simple**

Si vous ne voulez pas installer Node.js, vous pouvez continuer avec le système actuel de téléchargement de fichiers. C'est juste moins pratique mais ça marche !

---

**Recommandation** : Utilisez le backend pour une expérience optimale ! 🚀
