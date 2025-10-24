# 🤖 GitHub Actions - Configuration automatique

## ✅ Avantages

- ✅ **Gratuit** (2000 minutes/mois pour repos publics)
- ✅ Ton PC peut être **éteint**
- ✅ Mise à jour **toutes les 5 minutes** automatiquement
- ✅ Tourne 24/7 sur les serveurs GitHub

---

## 📋 ÉTAPE 1 : Créer les credentials Twitch (2 min)

### A. Aller sur Twitch Dev

1. Va sur https://dev.twitch.tv/console/apps
2. Connecte-toi avec ton compte Twitch

### B. Créer l'application

1. Clique sur **Register Your Application**
2. Remplis le formulaire :
   - **Name** : `CDC2025-Stats` (ou un autre nom)
   - **OAuth Redirect URLs** : `http://localhost`
   - **Category** : `Website Integration`
3. Clique sur **Create**

### C. Récupérer les credentials

1. Clique sur **Manage** à côté de ton application
2. **Copie le Client ID** (une longue chaîne de caractères)
3. Clique sur **New Secret**
4. **Copie le Client Secret** (tu ne pourras plus le revoir après !)

📋 **Note-les quelque part** :
```
Client ID: abc123def456...
Client Secret: xyz789uvw012...
```

---

## 📋 ÉTAPE 2 : Ajouter les secrets dans GitHub (1 min)

### A. Aller dans les settings

1. Va sur ton dépôt : https://github.com/createursdecompagnie/cdc2025-live-stats
2. Clique sur **Settings** (⚙️ en haut)
3. Dans le menu gauche, clique sur **Secrets and variables** > **Actions**

### B. Ajouter les secrets

1. Clique sur **New repository secret**
2. **Name** : `TWITCH_CLIENT_ID`
   **Secret** : Colle ton Client ID
   Clique sur **Add secret**

3. Clique sur **New repository secret** encore
4. **Name** : `TWITCH_CLIENT_SECRET`
   **Secret** : Colle ton Client Secret
   Clique sur **Add secret**

✅ Tu devrais maintenant avoir 2 secrets dans la liste !

---

## 📋 ÉTAPE 3 : Pousser les fichiers vers GitHub (1 min)

### A. Ajouter les nouveaux fichiers

```powershell
cd C:\Users\coren\Downloads\cdc2025_overlays\TwitchStats\TwitchTeamLiveStats

# Ajouter les fichiers
git add .github/workflows/update-stats.yml
git add update_stats_twitch.py
git commit -m "Add GitHub Actions automation"
git push
```

---

## 📋 ÉTAPE 4 : Activer GitHub Actions (30 sec)

### A. Vérifier que c'est activé

1. Va sur ton dépôt GitHub
2. Clique sur l'onglet **Actions** (en haut)
3. Si tu vois un message pour activer les workflows, clique sur **I understand my workflows, go ahead and enable them**

### B. Lancer manuellement (pour tester)

1. Dans l'onglet **Actions**
2. Clique sur **Update CDC2025 Live Stats** dans la liste de gauche
3. Clique sur **Run workflow** (bouton bleu à droite)
4. Clique sur **Run workflow** dans le menu déroulant

⏰ Attends 30-60 secondes et tu verras le workflow s'exécuter !

---

## ✅ C'EST FAIT !

### 🎯 Résultat

- GitHub va maintenant exécuter le script **toutes les 5 minutes**
- Les stats seront mises à jour automatiquement
- Ton PC peut être **éteint** ! 🎉

### 📊 Voir les logs

1. Va dans l'onglet **Actions**
2. Clique sur une exécution pour voir les logs
3. Tu verras les chaînes live et le nombre de viewers

### 🔄 Fréquence

**Par défaut : toutes les 5 minutes**

Pour changer la fréquence, édite `.github/workflows/update-stats.yml` :

```yaml
schedule:
  - cron: '*/5 * * * *'  # Toutes les 5 minutes
  # - cron: '*/10 * * * *'  # Toutes les 10 minutes
  # - cron: '*/2 * * * *'  # Toutes les 2 minutes (pas recommandé)
```

⚠️ **Limite GitHub** : Ne descends pas en dessous de 2 minutes pour éviter les abus.

---

## 🧪 Tester localement (optionnel)

### Si tu veux tester le script sur ton PC avant :

Crée un fichier `.twitch_credentials.json` :

```json
{
  "client_id": "ton_client_id_ici",
  "client_secret": "ton_client_secret_ici"
}
```

Lance le script :
```powershell
py update_stats_twitch.py
```

---

## ❓ Questions fréquentes

### Le workflow ne se lance pas ?

- Vérifie que GitHub Actions est activé (onglet Actions)
- Vérifie que les secrets sont bien ajoutés (Settings > Secrets)
- Le premier cron peut prendre 5-10 minutes pour démarrer

### Comment voir si ça marche ?

- Va dans l'onglet **Actions** de ton dépôt
- Tu verras l'historique des exécutions avec ✅ ou ❌

### Ça consomme combien ?

- ~30 secondes par exécution
- 12 exécutions/heure × 24h = 288 exécutions/jour
- 288 × 0.5 minutes = **144 minutes/jour** (~4320 minutes/mois)
- Limite gratuite : 2000 minutes/mois ⚠️

**Solution** : Passe à toutes les **10 minutes** au lieu de 5 :
```yaml
cron: '*/10 * * * *'
```
Ça fait 4320/2 = **2160 minutes/mois** (encore un peu trop)

**Mieux** : Toutes les **15 minutes** :
```yaml
cron: '*/15 * * * *'
```
Ça fait **1440 minutes/mois** ✅

### Je peux garder mon PC éteint maintenant ?

**OUI !** 🎉 GitHub s'occupe de tout automatiquement.

---

## 🚀 Prochaine étape

Une fois que tu as fait les 4 étapes ci-dessus :

1. Vérifie que le workflow tourne (onglet Actions)
2. Ouvre tes widgets (ending.html, stats_viewers_mini.html)
3. Les créateurs live devraient apparaître automatiquement !

**Besoin d'aide ? Je suis là ! 😊**
