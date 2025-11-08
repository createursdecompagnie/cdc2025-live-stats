# 🔧 DÉPANNAGE - AUTO-PUSH GITHUB SUR MAC MINI

## ⚠️ Problèmes courants et solutions

### 1. **"Permission denied (publickey)"**

**Cause**: Clé SSH non configurée ou pas reconnue par GitHub

**Solutions**:
```bash
# Générer nouvelle clé SSH
ssh-keygen -t ed25519 -C "votre_email@github.com"

# Vérifier si clé existe
ls -la ~/.ssh/id_ed25519

# Tester connexion
ssh -T git@github.com
```

**Résultat attendu**:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### 2. **"The authenticity of host 'github.com' can't be established"**

**Cause**: Première connexion SSH à GitHub (clé d'hôte non connue)

**Solution**: Accepter la clé en première connexion
```bash
ssh -T git@github.com
# Tapez 'yes' quand demandé
```

---

### 3. **Push hang/freezes (sans sortir de l'erreur)**

**Cause**: Problème réseau ou timeout SSH sur Mac (courant!)

**Solutions**:

a) Configurer SSH pour Mac (augmenter timeout):
```bash
cat >> ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    UseKeychain yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
```

b) Ajouter clé à SSH Agent:
```bash
ssh-add -K ~/.ssh/id_ed25519
```

c) Tester de nouveau:
```bash
ssh -T git@github.com
```

---

### 4. **"fatal: Could not read from remote repository"**

**Cause**: URL distante mal configurée ou repo non accessible

**Solution**: Vérifier et reconfigurer l'URL
```bash
# Voir URL actuelle
git remote -v

# Si en HTTPS (lent/problématique), convertir en SSH
git remote set-url origin git@github.com:createursdecompagnie/cdc2025-live-stats.git

# Vérifier
git remote -v
```

---

### 5. **Auto-push continue à ne pas fonctionner**

**Diagnostic complet**:
```bash
# 1. Exécuter le script de test
node test-git-push.js

# 2. Vérifier les logs du auto-push avec output
node auto-push-simple.js

# 3. Si toujours bloqué, essayer manuelleement
cd /chemin/vers/cdc2025-live-stats
git status
git add cagnotte_config.json
git commit -m "Test manuel"
git push -v origin main  # -v pour verbose
```

---

### 6. **Clé SSH pas reconnue après redémarrage Mac**

**Cause**: Clé non chargée en SSH Agent après redémarrage

**Solution - Persistent SSH Agent**:

Ajouter au fichier `~/.zshrc` (ou `~/.bash_profile`):
```bash
# SSH Agent persistent
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)" > /dev/null
    ssh-add -K ~/.ssh/id_ed25519 2>/dev/null
fi
```

Puis relancer terminal.

---

### 7. **Erreur: "No such file or directory"**

**Cause**: Node.js ne trouve pas `git` ou fichier config

**Solution**:
```bash
# Vérifier que Node.js voit Git
which git

# Vérifier chemin complet si besoin
/usr/local/bin/git --version

# Si installé via Homebrew, ajouter au PATH
export PATH="/usr/local/bin:$PATH"
```

---

## 🚀 CONFIGURATION COMPLÈTE SUR MAC MINI

**Suivre ces étapes dans l'ordre** (une seule fois):

```bash
# 1. Exécuter le setup script
bash setup-git-mac.sh

# 2. Vérifier la configuration
node test-git-push.js

# 3. Relancer auto-push
node auto-push-simple.js
```

---

## 📊 MONITORING CONTINU

Pour tester que ça fonctionne vraiment:

```bash
# Terminal 1: Démarrer auto-push avec output
node auto-push-simple.js

# Terminal 2: Modifier la config
echo '{"brut":100,"ajouts":0,"total":100,"lastModified":"2025-11-07T12:00:00Z"}' > cagnotte_config.json

# Vérifier dans Terminal 1 que le push s'exécute
```

---

## 📞 DEBUG AVANCÉ

Si rien ne fonctionne encore:

```bash
# Verbose maximum
GIT_TRACE=1 GIT_SSH_COMMAND="ssh -vvv" node auto-push-simple.js

# Vérifier les permissions du fichier config
ls -la cagnotte_config.json
ls -la .git/config

# Vérifier écriture sur disque
touch test.txt && rm test.txt
```

---

## ✅ CHECKLIST FINALE

- [ ] SSH key générée: `ls ~/.ssh/id_ed25519`
- [ ] SSH Agent actif: `ssh-add -l` (montre la clé)
- [ ] GitHub SSH fonctionne: `ssh -T git@github.com`
- [ ] URL distante en SSH: `git remote -v` (commence par `git@github.com`)
- [ ] Fichier config accessible: `cat cagnotte_config.json`
- [ ] Auto-push démarre: `node auto-push-simple.js`
- [ ] Push réussit: Voir "✅ PUSH réussi" dans logs

---

**Besoin d'aide?** Exécuter et envoyer output de:
```bash
node test-git-push.js
```
