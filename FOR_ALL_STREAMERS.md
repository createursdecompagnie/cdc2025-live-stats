# 🎁 CDC2025 - CAGNOTTE GRATUITE POUR TOUS LES STREAMERS

## 🎯 C'est quoi?

Un système de cagnotte qui:
- ✅ Se met à jour en DIRECT (5 secondes)
- ✅ Permet d'ajouter des montants manuels (t-shirts, etc)
- ✅ Pousse automatiquement vers GitHub
- ✅ Coûte 0€ (utilise git, pas l'API GitHub)
- ✅ Marche sur Mac, Windows, Linux
- ✅ Fonctionne sur Mac Mini, NAS, ou Cloud gratuit

---

## 🚀 DÉMARRER EN 5 MINUTES

### Étape 1: Récupérer le code

**Option A: Sur GitHub** (facile)
```bash
git clone https://github.com/createursdecompagnie/cdc2025-live-stats.git
cd cdc2025-live-stats
```

**Option B: Télécharger le ZIP** (plus facile)
1. Va sur: https://github.com/createursdecompagnie/cdc2025-live-stats
2. Clique "Code" → "Download ZIP"
3. Dézipe partout
4. Ouvre Terminal dans le dossier

### Étape 2: Installer les dépendances

```bash
npm install
```

(Ça prend 30 secondes)

### Étape 3: Configurer Streamlabel

Tu utilises **Streamlabs Charity**?

1. Dans les paramètres Streamlabs, configure Streamlabel pour écrire dans:
   ```
   Streamlabels/total_charity_donation_amount.txt
   ```

2. Fais un test don pour voir si ça marche

### Étape 4: Lancer le serveur

**Terminal 1:**
```bash
npm start
```

Tu verras:
```
🚀 CDC2025 SERVEUR LOCAL
📍 http://localhost:3000
🔄 Actualisation: 5000ms
```

**Terminal 2 (optionnel - auto-push vers GitHub):**
```bash
npm run push:auto
```

### Étape 5: Configurer OBS

1. Ajoute une "Source navigateur"
2. URL: `http://localhost:3000/cdc_goal_widget.html`
3. C'est tout! 🎉

---

## 📱 AJOUTER DES MONTANTS MANUELLEMENT

### Méthode 1: Interface web (FACILE)

1. Va sur: `http://localhost:3000/manager.html`
2. Tape le montant (ex: 150€)
3. Ajoute une description (ex: "T-shirts")
4. Clique "Enregistrer"
5. OBS le montre EN DIRECT! ✨

### Méthode 2: Éditer le fichier (Pour experts)

Ouvre `ajouts_perso.json`:
```json
{
  "montant": 150,
  "description": "T-shirts vendus + dons perso"
}
```

Sauvegarde, et c'est automatiquement appliqué!

---

## 💾 POUSSER VERS GITHUB

### Pourquoi?

Pour que:
- Les autres créateurs voient ta cagnotte
- Les données persistent même si ton serveur s'arrête
- N'importe qui puisse utiliser ton lien GitHub Pages

### Comment?

**Option 1: Auto-push (Recommandé)**

```bash
npm run push:auto
```

Cela va:
- Surveiller les changements
- Pousser toutes les 5 minutes
- Zéro configuration! ✅

**Option 2: Push manual**

```bash
git add .
git commit -m "Mise à jour cagnotte"
git push origin main
```

### Voir ton lien GitHub Pages

Après le push, ta cagnotte est sur:
```
https://TON_USERNAME.github.io/cdc2025-live-stats/cdc_goal_widget.html
```

(Remplace TON_USERNAME par ton nom GitHub)

---

## 💰 VÉRIFIER QUE C'EST GRATUIT

### Coût réel = 0€

```
✅ Node.js: 0€ (open source)
✅ Git/GitHub: 0€ (on utilise GIT, pas l'API)
✅ Serveur: 0€ (sur ton Mac/NAS)
✅ Mise à jour: 0€ (aucune limite)

TOTAL: 0€ 🎉
```

### Pourquoi pas d'API GitHub?

Parce qu'on utilise `git push` à la place:
- ❌ GitHub API = 10,000 requêtes/mois limité
- ✅ Git push = ILLIMITÉ et gratuit

Simple et efficace! 🚀

---

## 📊 VÉRIFIER QUE TOUT MARCHE

### Test 1: Streamlabel se met à jour?

```bash
node simple-sync.js
```

Résultat:
```
📊 Streamlabel: 51€
💰 TOTAL: 51€
```

✅ Si tu vois ça, c'est bon!

### Test 2: OBS affiche les données?

1. Lance le serveur: `npm start`
2. Ajoute la source OBS: `http://localhost:3000/cdc_goal_widget.html`
3. Tu dois voir le montant de ta cagnotte

### Test 3: Manager.html fonctionne?

1. Va sur: `http://localhost:3000/manager.html`
2. Ajoute un montant (ex: 50€)
3. Clique "Enregistrer"
4. OBS devrait l'afficher EN DIRECT

---

## 🌍 POUR PARTAGER AVEC D'AUTRES STREAMERS

### Option 1: GitHub Pages (RECOMMANDÉ)

Dis-leur:
```
1. Clone le repo: https://github.com/createursdecompagnie/cdc2025-live-stats
2. Fais un Fork (bouton "Fork" en haut)
3. Configure Streamlabel → Streamlabels/total_charity_donation_amount.txt
4. Pousse vers ton GitHub
5. Active GitHub Pages
6. Utilise ton lien: https://TON_USERNAME.github.io/cdc2025-live-stats/cdc_goal_widget.html

Coût: 0€
Latence: 5 minutes
Setup: 10 minutes
```

### Option 2: Serveur local (ULTRA-RAPIDE)

Dis-leur:
```
1. Clone le repo
2. npm install
3. npm start
4. OBS: http://localhost:3000/cdc_goal_widget.html

Coût: 0€
Latence: 5 secondes
Setup: 5 minutes
```

### Option 3: Cloud gratuit (PORTABLE)

Sur Railway, Render, ou Replit:
```
1. Connect le repo
2. Configure le build
3. Deploy (c'est automatique)
4. Tu as une URL publique

Coût: 0€
Latence: 1 secondes
Setup: 20 minutes
```

---

## ❓ FAQ

**Q: Ça demande des compétences en programmation?**
> Non! C'est juste copier-coller des commandes. Les instructions sont simples.

**Q: Ça marche sur Mac ET Windows?**
> Oui! Les commandes `npm` marchent partout.

**Q: Le serveur doit toujours tourner?**
> Non, tu peux aussi utiliser GitHub Pages (5 min de délai au lieu de 5 sec).

**Q: Combien de streamers peuvent l'utiliser?**
> TOUS! C'est open source et gratuit. Partage le lien!

**Q: Les données sont gardées où?**
> Localement sur ton ordi + sur GitHub si tu pushes.

**Q: Si je dors, la cagnotte continue?**
> Oui! Elle tourne 24/7 si tu laisses le serveur allumé. Sinon, GitHub Pages la garde sauvegardée.

**Q: Je peux vendre cette solution?**
> Non, c'est MIT license (open source). Mais tu peux l'adapter pour toi!

---

## 📞 BESOIN D'AIDE?

### Le serveur ne démarre pas?

```bash
# Vérifier Node.js
node --version

# Si pas installé: télécharge de https://nodejs.org

# Réinstaller
npm install --force

# Relancer
npm start
```

### Streamlabel ne se met pas à jour?

```bash
# Vérifier le fichier
cat Streamlabels/total_charity_donation_amount.txt

# Si vide, configure Streamlabs:
# Settings → Streamlabel → Outputfile → 
# Streamlabels/total_charity_donation_amount.txt
```

### Les montants ne s'ajoutent pas?

```bash
# Éditer directement
nano ajouts_perso.json

# Ou via API
curl -X POST http://localhost:3000/api/update-ajouts \
  -H "Content-Type: application/json" \
  -d '{"montant": 100, "description": "Ma description"}'
```

### Plus d'aide?

Crée une issue sur GitHub:
https://github.com/createursdecompagnie/cdc2025-live-stats/issues

---

## 🎊 C'EST TOUT!

Tu as maintenant:
✅ Une cagnotte qui se met à jour en direct  
✅ La possibilité d'ajouter des montants manuels  
✅ Un push automatique vers GitHub  
✅ Zéro coût  
✅ Une solution qu'on peut partager avec tous les streamers  

**Bon stream! 🐾**

---

**Version: 1.0 - 2025-11-06**
**Licence: MIT (Libre d'utilisation)**
**Partageable avec tous les streamers: OUI! ✅**
