# 🐾 CDC2025 - Solutions de Synchronisation

## 🔍 Diagnostic: Pourquoi les données ne sont pas à jour?

### Situation Actuelle
```
Streamlabs Charity $$ → out/live_stats.json ✅
                    ↓
            cagnotte_config.json ❌ (pas d'auto-update)
                    ↓
        GitHub Pages CDN (cache)
```

**Problèmes identifiés:**
1. ❌ `cagnotte_config.json` n'est pas mis à jour automatiquement
2. ❌ GitHub Pages a des **limites API** (60 requêtes/heure)
3. ❌ Latence **+200-500ms** (CDN global)
4. ❌ Pas de refresh en temps réel

---

## ✅ Solutions Proposées

### 1️⃣ Solution LOCALE (Recommandée) 🏆

**Serveur Node.js sur Mac Mini ou NAS Synology**

**Avantages:**
- ✅ **Refresh illimité** (pas de limites API)
- ✅ **Temps réel** (latence <50ms)
- ✅ **Autonome** (pas de dépendances GitHub)
- ✅ **Facile à installer** (Node.js + npm)

**Installation:**
```bash
# Aller dans le dossier
cd cdc2025-live-stats

# Installer dépendances
npm install

# Lancer le serveur
npm start

# Ou simplement
node local-server.js
```

**Utilisation dans OBS:**
```
Source navigateur → http://localhost:3000/cdc_goal_widget.html
```

**Ou depuis autre machine:**
```
http://192.168.1.100:3000/cdc_goal_widget.html
(remplacer par l'IP du Mac Mini/NAS)
```

### 2️⃣ Solution GitHub Pages (Fallback)

**Si vous n'avez pas de Mac Mini/NAS:**

**Limitation:**
- ⚠️ 60 requêtes/heure sans authentification
- ⚠️ Latence +200ms
- ⚠️ Cache de 1-5 minutes

**URL:**
```
https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html
```

---

## 🔧 Vérifier que tout fonctionne

### Test Rapide

**Diagnostic complet:**
```bash
node diagnostic.js
```

**Ou selon le mode:**
```bash
node diagnostic.js local    # Vérifier serveur local
node diagnostic.js github   # Vérifier GitHub Pages
```

**Résultat attendu:**
```
✅ Cagnotte mise à jour: 1234€ + 100€ = 1334€
✅ Stats mises à jour: 5 live, 2500 viewers
```

### API Directe

**Tester manuellement:**
```bash
# Depuis terminal
curl http://localhost:3000/cagnotte_config.json

# Résultat:
# {"brut":1234,"ajouts":100,"lastModified":"2025-11-06T..."}
```

---

## 📊 Comparaison des Solutions

| Critère | Local Server | GitHub Pages |
|---------|--------------|--------------|
| **Latence** | <50ms 🚀 | +200-500ms 🐌 |
| **Refresh Limite** | Illimité ∞ | 60/heure ⚠️ |
| **Installation** | 5 min ⚡ | Immédiat 📥 |
| **Coût** | 0€ | 0€ |
| **Accessibilité** | Réseau local | Internet |
| **Temps réel** | Oui ✅ | Non ❌ |

---

## 🎬 Recommandation pour CDC2025

**Pour un événement en direct:**
1. ✅ **Utiliser le serveur local** (meilleur refresh)
2. 📱 **Sur Mac Mini** (déjà utilisé pour stream)
3. 🔌 **Connecté en Ethernet** (pas de WiFi flaky)
4. ⚙️ **Démarrage automatique** (voir `LOCAL_SERVER_GUIDE.md`)

**Commande de démarrage simple:**
```bash
# Depuis le dossier cdc2025-live-stats
npm start

# Puis dans OBS:
# Source navigateur → http://localhost:3000/cdc_goal_widget.html
```

---

## 🐛 Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| "Module not found" | `npm install` |
| "Port 3000 already in use" | `PORT=3001 npm start` |
| "Cannot connect to local" | Vérifier que le serveur est lancé |
| "GitHub pages lent" | Utiliser le serveur local |
| "Données pas à jour" | Redémarrer le serveur (`npm start`) |

---

## 📚 Documentation Complète

Voir fichier: **`LOCAL_SERVER_GUIDE.md`**

Contient:
- ✅ Installation pas-à-pas (Mac/NAS)
- ✅ Configuration OBS
- ✅ Paramètres URL
- ✅ Démarrage automatique
- ✅ Sécurité réseau
- ✅ Performance & specs

---

## ✨ Prochaines Améliorations

**Possibles:** (non urgent)
1. Synchronisation directe API Streamlabs
2. Interface web de configuration
3. Dashboard historique cagnotte
4. Base de données locale (SQLite)
5. Alertes en temps réel

**Contact:** Pour des questions, vérifier les logs:
```bash
NODE_DEBUG=* npm start
```
