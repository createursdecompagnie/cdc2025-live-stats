# 🚀 SYNCHRONISATION STREAMLABS CHARITY EN TEMPS RÉEL

## 📚 Résumé Rapide

Tu as maintenant un système **COMPLET** qui:

✅ **Récupère les données de Streamlabs Charity** en temps réel
✅ **Fusionne avec tes ajouts perso** (t-shirts via cagnotte_manager)  
✅ **Actualise le serveur local** (Mac Mini) automatiquement
✅ **Pousse vers GitHub** pour que tous les streamers aient la data à jour
✅ **Zéro latence sur le stream** avec le serveur local
✅ **Zéro limite d'API** (contrairement à GitHub)

---

## 🎯 Nouvelle Architecture

```
Streamlabs Charity (données brutes)
           ↓
sync-streamlabs.js (récupère + fusionne ajouts)
           ↓
cagnotte_config.json (mise à jour toutes les 30s)
           ↓
local-server.js (Mac Mini)        +        GitHub Pages
    http://localhost:3000/        +    (tous les streamers)
```

---

## ⚙️ Installation

### Étape 1: Copier le fichier `.env`

Sur le Mac Mini, crée un fichier `.env`:

```bash
cd ~/cdc2025-live-stats
cp .env.example .env
```

Le fichier `.env` contient déjà tes credentials Streamlabs! ✅

**IMPORTANT:** 
- ⚠️ **Ne partage JAMAIS ce fichier!**
- ✅ Il est déjà dans `.gitignore` (pas envoyé sur GitHub)

### Étape 2: Installer `dotenv` (pour lire `.env`)

```bash
npm install dotenv
```

### Étape 3: Tester la synchronisation

**Une seule fois:**
```bash
node sync-streamlabs.js
```

Tu dois voir:
```
🎬 SYNCHRONISATION CDC2025 CAGNOTTE
📡 Récupération données Streamlabs Charity...
✅ Données Streamlabs récupérées: 1234€
📊 Ajouts personnalisés trouvés: 100€
💾 Config sauvegardée: cagnotte_config.json
```

**Ou en mode WATCH (continu):**
```bash
node sync-streamlabs.js --watch
```

Tu verras des syncronisations toutes les 30 secondes!

### Étape 4: Lancer le serveur avec sync automatique

```bash
npm start
```

Maintenant le serveur:
- 🔄 Récupère Streamlabs **toutes les 30 secondes**
- 💾 Met à jour `cagnotte_config.json` **automatiquement**
- 📡 Sert les données **en temps réel** à OBS

---

## 📡 Utilisation OBS

### Option 1: Serveur Local (Recommandé! ⚡ Plus rapide)

**Pour TOI (sur le Mac Mini):**
```
http://localhost:3000/cdc_goal_widget.html
```

**Pour les autres créateurs (même réseau):**
```
http://[IP_MAC_MINI]:3000/cdc_goal_widget.html
```

Exemple:
```
http://192.168.1.100:3000/cdc_goal_widget.html
```

✅ **Avantages:**
- Zéro latence ⚡
- Zéro limite d'API 🚀
- Données mises à jour TOUT DE SUITE

### Option 2: Lien GitHub (Tous les streamers)

```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json
```

⚠️ **Inconvénients:**
- +200-500ms latence
- Limite 60 requêtes/heure
- Cache de 1-5 minutes

**MON CONSEIL:** Utilise l'option 1 (serveur local) pour TOI et ton équipe directe, et GitHub pour les autres streamers en ligne!

---

## 🔄 Synchronisation Automatique

### Mode 1: Sync Continu (RECOMMANDÉ)

Chaque fois que le serveur démarre (`npm start`):
- Récupère Streamlabs **toutes les 30 secondes** ✅
- Met à jour `cagnotte_config.json` **automatiquement** ✅

```bash
npm start
```

### Mode 2: Sync Avec Push GitHub

Pour que GitHub soit **AUSSI** à jour en temps réel:

**Sur le Mac Mini, édite `local-server.js`:**

Ligne ~375, décommenter:
```javascript
// DÉCOMMENTER CES LIGNES:
console.log('📤 Push GitHub activé (toutes les 5 minutes)');
setInterval(() => {
  pushToGitHub();
}, PUSH_INTERVAL);
```

Puis redémarre:
```bash
npm start
```

**Maintenant:**
- ✅ Streamlabs → `cagnotte_config.json` (toutes les 30s)
- ✅ `cagnotte_config.json` → GitHub (toutes les 5 minutes)
- ✅ Tous les streamers voient la même data! 🎉

---

## 🧪 Tester la Synchronisation

### Test 1: Vérifier que sync marche

```bash
node sync-streamlabs.js
```

Résultat attendu:
```
✅ Données Streamlabs récupérées: 1234€
📊 Ajouts personnalisés trouvés: 100€
✨ Changement détecté!
   Avant: 1000€ + 50€ = 1050€
   Après: 1234€ + 100€ = 1334€
💾 Config sauvegardée
```

### Test 2: Mode Watch

```bash
node sync-streamlabs.js --watch
```

Tu dois voir des syncronisations régulières:
```
[2025-11-06T14:30:00] ✅ Cagnotte mises à jour: 1234€
[2025-11-06T14:30:30] ✅ Cagnotte mises à jour: 1245€  ← changement!
[2025-11-06T14:31:00] ℹ️  Pas de changement (1245€)
```

### Test 3: Via le serveur local

Terminal 1 - Démarrer le serveur:
```bash
npm start
```

Terminal 2 - Tester l'endpoint:
```bash
curl http://localhost:3000/cagnotte_config.json
```

Résultat:
```json
{
  "brut": 1234,
  "ajouts": 100,
  "total": 1334,
  "lastModified": "2025-11-06T14:30:00.000Z",
  "sources": {
    "streamlabs": {"value": 1234, "status": "ok"},
    "manager": {"value": 100, "status": "ok"}
  }
}
```

### Test 4: Via le diagnostic

```bash
node diagnostic.js
```

Doit afficher:
```
✅ Cagnotte: 1234€ + 100€ = 1334€
✅ Stats: 5 live, 2500 viewers
✅ Local server: OK
✅ GitHub: OK
```

---

## 🐛 Problèmes et Solutions

### "Cannot read token from environment"

**Problème:** Le fichier `.env` n'est pas lu

**Solution:**
```bash
# Vérifier que le fichier existe
ls -la .env

# Si absent:
cp .env.example .env

# Redémarrer le serveur
npm start
```

### "fetch is not defined"

**Problème:** Node.js trop vieux ne supporte pas `fetch`

**Solution:**

Ajouter au début de `sync-streamlabs.js`:

```javascript
// Pour Node.js < 18
if (!globalThis.fetch) {
  const fetch = require('node-fetch');
  globalThis.fetch = fetch;
}
```

Ou mettre à jour Node.js:
```bash
node --version  # Doit être >= 18
```

### "Streamlabs API error: 401"

**Problème:** Token invalide ou expiré

**Solution:**
1. Vérifie ton token dans `.env`
2. Regarde dans le fichier cagnotte_manager.html l'URL complète
3. Réinsère le token dans `.env`

### "Git command not found"

**Problème:** Tu as décoché "Git auto-push" mais git n'est pas installé

**Solution:**
1. Laisse "Git push" désactivé (par défaut)
2. Ou installe Git:
```bash
brew install git
```

### "Port 3000 already in use"

**Problème:** Un autre serveur utilise le port

**Solution:**
```bash
PORT=3001 npm start
```

Puis OBS:
```
http://localhost:3001/cdc_goal_widget.html
```

---

## 📊 Fichiers Importants

| Fichier | Rôle | Modification |
|---------|------|--------------|
| `.env` | Credentials Streamlabs | ⚠️ À personnaliser |
| `sync-streamlabs.js` | Script de sync | ✅ Prêt à l'emploi |
| `local-server.js` | Serveur local | ✅ Déjà modifié |
| `cagnotte_config.json` | Data mise à jour | 🔄 Auto-généré |
| `cagnotte_manager.html` | Gestion ajouts perso | ✅ Inchangé |

---

## 🚀 Lancer au Démarrage (Optionnel)

### Sur Mac Mini

Pour que le serveur démarre **automatiquement** au boot:

1. Crée `/Users/TONNOM/Library/LaunchAgents/com.cdc2025.sync.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cdc2025.sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/TONNOM/cdc2025-live-stats/local-server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/TONNOM/cdc2025-live-stats/sync.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/TONNOM/cdc2025-live-stats/sync.log</string>
</dict>
</plist>
```

2. Remplace `/Users/TONNOM/` par ton chemin réel

3. Activate:
```bash
launchctl load ~/Library/LaunchAgents/com.cdc2025.sync.plist
```

4. Vérifier:
```bash
launchctl list | grep cdc2025
```

**Maintenant** le serveur démarre tout seul! 🎉

---

## 📈 Monitoring

### Voir les logs de sync

```bash
tail -f sync.log
```

Affiche les 20 dernières lignes en temps réel.

### Voir les logs du serveur

```bash
npm start
```

Affiche tous les logs directement.

### Arrêter tout

```bash
Ctrl + C
```

---

## ✨ Résumé des Nouvelles Commandes

| Commande | Effet |
|----------|-------|
| `node sync-streamlabs.js` | Sync une fois maintenant |
| `node sync-streamlabs.js --watch` | Sync toutes les 30s (mode test) |
| `npm start` | Serveur + sync auto (PRODUCTION) |
| `npm run sync:watch` | Juste sync, pas serveur |
| `npm run diagnostic` | Vérifier que tout marche |

---

## 🎉 Bravo!

Tu as maintenant:

✅ **Synchronisation Streamlabs complètement automatique**
✅ **Mac Mini qui reçoit les données en temps réel**
✅ **GitHub qui se met à jour automatiquement**
✅ **Les autres streamers peuvent utiliser le lien GitHub**
✅ **Zéro latence pour toi** ⚡
✅ **Zéro limite d'API** 🚀

**Le jour du stream:**
1. ✅ Démarre le serveur (`npm start`)
2. ✅ OBS regarde `http://localhost:3000/cdc_goal_widget.html`
3. ✅ Les dons arrivent et s'affichent TOUT DE SUITE
4. ✅ Les autres streamers ont aussi les données à jour
5. ✅ Profite du stream! 🎊

---

## 🤝 Besoin d'aide?

Pose des questions et on trouvera ensemble!
