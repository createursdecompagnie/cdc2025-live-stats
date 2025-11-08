# 🍎 SETUP AUTO-PUSH GITHUB POUR MAC MINI

## 📋 Résumé

Sur le Mac mini qui vérifie la cagnotte, le push automatique ne fonctionne pas. Ce guide configure Git et SSH pour que **`auto-push-simple.js` fonctionne correctement**.

---

## 🚀 DÉMARRAGE RAPIDE (5 minutes)

### 1. Configuration SSH & Git (une seule fois)

```bash
cd /chemin/vers/cdc2025-live-stats
bash setup-git-mac.sh
```

Ce script:
- ✅ Génère une clé SSH si besoin
- ✅ Configure l'utilisateur Git
- ✅ Teste la connexion GitHub
- ✅ Convertit l'URL en SSH si nécessaire

### 2. Vérifier que tout fonctionne

```bash
node test-git-push.js
```

**Devrait voir**: ✅ à côté de chaque vérification

### 3. Lancer l'auto-push

```bash
bash run-auto-push.sh
```

**Devrait voir**:
```
🚀 AUTO-PUSH GITHUB - MODE MONITORING
✅ SSH GitHub: OK
✅ Repo Git: Propre

🎬 DÉMARRAGE AUTO-PUSH
🔍 Vérification initiale...
```

---

## ⚙️ CONFIGURATION PERMANENTE

Pour que `auto-push-simple.js` démarre **automatiquement** au redémarrage du Mac:

### Option 1: Launch Agent (Recommandé)

1. Créer le fichier Launch Agent:
```bash
mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.cdc2025.autopush.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cdc2025.autopush</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/chemin/vers/cdc2025-live-stats/auto-push-simple.js</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>/chemin/vers/cdc2025-live-stats</string>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <true/>
    
    <key>StandardOutPath</key>
    <string>/var/log/cdc2025-autopush.log</string>
    
    <key>StandardErrorPath</key>
    <string>/var/log/cdc2025-autopush-error.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
        <key>HOME</key>
        <string>$HOME</string>
    </dict>
</dict>
</plist>
EOF
```

2. **Important**: Remplacer `/chemin/vers/` par le chemin réel (ex: `/Users/username/projets/cdc2025-live-stats`)

3. Charger le Launch Agent:
```bash
launchctl load ~/Library/LaunchAgents/com.cdc2025.autopush.plist
```

4. Vérifier qu'il fonctionne:
```bash
# Voir les logs
tail -f /var/log/cdc2025-autopush.log

# Ou directement
launchctl list | grep cdc2025
```

5. Pour désactiver:
```bash
launchctl unload ~/Library/LaunchAgents/com.cdc2025.autopush.plist
```

### Option 2: Script de démarrage simple

Ajouter au `~/.zshrc`:
```bash
# Auto-push CDC2025
nohup node /chemin/vers/cdc2025-live-stats/auto-push-simple.js > /tmp/autopush.log 2>&1 &
```

---

## 🔍 DÉPANNAGE

### Problème: "Permission denied (publickey)"

```bash
# Vérifier la clé SSH
ssh -T git@github.com

# Si erreur, régénérer
ssh-keygen -t ed25519 -C "votre_email@github.com"

# Puis ajouter à GitHub: https://github.com/settings/ssh/new
```

### Problème: Auto-push hang/freeze

Ajouter au `~/.ssh/config`:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### Problème: Clé SSH oubliée après redémarrage

Ajouter au `~/.zshrc`:
```bash
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)" > /dev/null
    ssh-add -K ~/.ssh/id_ed25519 2>/dev/null
fi
```

### Tout déboguer

```bash
# Diagnostic complet
node test-git-push.js

# Avec verbose Git
GIT_TRACE=1 node auto-push-simple.js

# Voir les logs du Launch Agent
log stream --predicate 'process == "auto-push-simple.js"' --level debug
```

---

## 📊 VÉRIFICATION FINALE

Avant de laisser tourner 24/7:

1. ✅ SSH fonctionne:
   ```bash
   ssh -T git@github.com
   ```

2. ✅ Test-git-push.js passe:
   ```bash
   node test-git-push.js
   ```

3. ✅ Auto-push démarre sans erreur:
   ```bash
   bash run-auto-push.sh
   # Attendre 1-2 minutes, puis Ctrl+C
   ```

4. ✅ Vérifier sur GitHub que le commit a été pushé (voir l'historique du repo)

---

## 📞 AIDE RAPIDE

| Problème | Commande |
|----------|----------|
| Tester connexion SSH | `ssh -T git@github.com` |
| Voir config Git | `git config --list` |
| Voir URL distante | `git remote -v` |
| Voir clés SSH | `ls -la ~/.ssh/` |
| Voir logs auto-push | `tail -f /var/log/cdc2025-autopush.log` |
| Arrêter auto-push | `pkill -f "node auto-push-simple.js"` |
| Test complet | `node test-git-push.js` |

---

## 🎯 RÉSUMÉ DU FLOW

```
1. bash setup-git-mac.sh      # Configure SSH & Git
   ↓
2. node test-git-push.js      # Vérifie que tout fonctionne
   ↓
3. bash run-auto-push.sh      # Démarre en test
   ↓
4. launchctl load ...         # Lance au démarrage (optionnel)
```

---

**Besoin d'aide?** Exécute `node test-git-push.js` et envoie l'output! 🚀
