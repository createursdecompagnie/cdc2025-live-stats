# 🐾 CDC2025 - Guide Installation Serveur Local

## 📋 Résumé du Problème

**Situation actuelle:**
- ✅ Les données Streamlabs Charity arrivent dans `out/live_stats.json`
- ❌ `cagnotte_config.json` n'est pas mis à jour en temps réel
- ❌ GitHub Pages a des limites de requêtes (60/heure non authentifiées)
- ❌ Pas de refresh vrai temps réel

**Solution:**
Serveur Node.js local sur ton NAS ou Mac Mini = **refresh illimité + rapide** sans dépendre de GitHub!

---

## 🚀 Installation Rapide

### 1️⃣ Prérequis: Node.js

**Sur Mac Mini:**
```bash
# Installer Homebrew si pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js
brew install node

# Vérifier
node --version
npm --version
```

**Sur NAS Synology:**
1. Aller dans Package Center
2. Chercher "Node.js"
3. Installer la version récente
4. Note l'adresse IP du NAS (ex: 192.168.1.100)

**Vérifier l'installation:**
```bash
node --version  # Doit afficher v18+ ou v20+
npm --version   # Doit afficher 9+ ou 10+
```

---

### 2️⃣ Installer les dépendances

```bash
# Aller dans le dossier du projet
cd /chemin/vers/cdc2025-live-stats

# Installer Express (framework serveur)
npm install express cors
```

---

### 3️⃣ Lancer le serveur

```bash
# Démarrer le serveur local
node local-server.js

# Tu devrais voir:
# 🚀 CDC2025 LOCAL SERVER
# ====================================================
# 📍 Serveur démarré sur http://localhost:3000
# 🔄 Refresh automatique: 5000ms
```

**Le serveur tourne maintenant en arrière-plan!**

---

## 🎬 Configuration OBS

### Option 1: Même Machine (Développement)
```
Source navigateur → http://localhost:3000/cdc_goal_widget.html
```

### Option 2: Depuis une autre machine (Mac Mini → Ordi Stream)

D'abord, trouve l'**adresse IP locale** du Mac Mini:
```bash
# Sur Mac Mini
ifconfig | grep "inet "

# Résultat: 192.168.1.100 (exemple)
```

Puis dans OBS:
```
Source navigateur → http://192.168.1.100:3000/cdc_goal_widget.html
```

### Option 3: Avec Paramètres Visuels

```
http://localhost:3000/cdc_goal_widget.html?fontScale=1.5&textColor=%23ffffff&accentColor=%23ff0000&shadowIntensity=0.8
```

**Paramètres disponibles:**
- `textColor` → Couleur texte (hex)
- `accentColor` → Couleur accent (hex)
- `shadowIntensity` → Intensité ombre (0-1)
- `showCents` → Afficher centimes (true/false)

---

## 📊 Endpoints Disponibles

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `/cagnotte_config.json` | Données cagnotte brutes | API programmatique |
| `/live_stats.json` | Stats créateurs | API programmatique |
| `/cdc_goal_widget.html` | Widget cagnotte HTML | OBS Source |
| `/` | Page info serveur | Diagnostic |

**Exemple API:**
```bash
curl http://localhost:3000/cagnotte_config.json

# Résultat:
# {"brut":1234,"ajouts":100,"lastModified":"2025-11-06T..."}
```

---

## 🔄 Démarrage Automatique

### Mac Mini (avec LaunchAgent)

1. Créer fichier `~/.config/launchd.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cdc2025.localserver</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/chemin/vers/cdc2025-live-stats/local-server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

2. Activer:
```bash
launchctl load ~/.config/launchd.plist
```

---

## 🐛 Dépannage

### "Module express not found"
```bash
# Réinstaller les dépendances
npm install express cors
```

### "Port 3000 already in use"
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
PORT=3001 node local-server.js
```

### Les données ne s'actualisent pas
```bash
# Vérifier que cagnotte_config.json existe
ls -la cagnotte_config.json

# Vérifier que out/live_stats.json existe
ls -la out/live_stats.json

# Vérifier les permissions
chmod 644 cagnotte_config.json
chmod 644 out/live_stats.json
```

### "Cannot find module"
```bash
# Réinstaller tout
rm -rf node_modules package-lock.json
npm install
```

---

## 🔐 Sécurité (Important!)

⚠️ **Ce serveur est conçu pour un réseau local uniquement**

Pour une utilisation sur internet:
1. Utiliser un firewall/proxy
2. Ajouter une authentification
3. Utiliser HTTPS avec certificat SSL
4. Limiter les requêtes avec rate-limiting

---

## 📈 Performance

**Avantages par rapport à GitHub Pages:**
- ✅ Refresh **illimité** (pas de limites API)
- ✅ Latence **très basse** (réseau local)
- ✅ **Autonome** (pas de dépendances GitHub)
- ✅ **Temps réel** (1 seconde refresh)

**Specs requises:**
- RAM: 50-100 MB
- CPU: Minimal (Node.js très léger)
- Réseau: Local Ethernet (recommandé)

---

## 🎓 Prochaines étapes

**Pour aller plus loin:**

1. Connecter directement Streamlabs API (auto-sync)
2. Ajouter interface web de configuration
3. Créer dashboard avec historique cagnotte
4. Synchroniser avec base de données locale

---

## 💬 Questions?

Vérifier les logs du serveur:
```bash
# Relancer avec logs détaillés
NODE_DEBUG=* node local-server.js
```

Les données doivent s'afficher à chaque refresh:
```
✅ Cagnotte mise à jour: 1234€ + 100€ = 1334€
✅ Stats mises à jour: 5 live, 2500 viewers
```
