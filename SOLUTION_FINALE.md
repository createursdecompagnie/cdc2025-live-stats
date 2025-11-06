# 🎯 SOLUTION FINALE - CDC2025 CAGNOTTE EN DIRECT

## ✨ CE QUI A CHANGÉ

Tu avais un besoin simple, et c'est bon que tu l'ai clarifiés! Voici la **VRAIE solution**:

### 🎁 Tu as Streamlabel qui écrit dans:
```
Streamlabels/total_charity_donation_amount.txt
```

### 🎊 On va:
1. ✅ Lire ce fichier **en temps réel** (5 secondes)
2. ✅ Ajouter **tes montants perso** (t-shirts, etc) si tu veux
3. ✅ Mettre à jour `cagnotte_config.json` 
4. ✅ Pousser sur GitHub **régulièrement** (sans limite crédit)
5. ✅ Les widgets GitHub restent **exactement les mêmes URLs**!

---

## 🚀 UTILISATION

### 1️⃣ Sur le Mac Mini - Lancer le serveur

```bash
npm start
```

**C'est tout!** Le serveur:
- ✅ Lit Streamlabel toutes les 5 secondes
- ✅ Sert les données aux widgets
- ✅ Met à jour `cagnotte_config.json`

### 2️⃣ Gérer tes ajouts perso (optionnel)

Ouvre: `http://localhost:3000/manager.html`

Là tu peux:
- 📝 Ajouter un montant (t-shirts, dons directs, etc)
- 💬 Décrire ce montant
- 💾 Enregistrer

**Le total affiché = Streamlabel + tes ajouts**

### 3️⃣ Auto-push vers GitHub (dans autre Terminal)

```bash
npm run push:auto
```

Cela:
- ✅ Pousse vers GitHub **toutes les 5 minutes** (ou à chaque changement)
- ✅ Actualise GitHub Pages **sans limites crédit**
- ✅ Les widgets GitHub ont les données fraîches!

---

## 📊 ARCHITECTURE SIMPLE

```
Streamlabel
   (données en direct)
      ↓
streamlabel-server.js (node)
   (lit + combine)
      ↓
cagnotte_config.json
   (fichier mis à jour)
      ↓
     ↙       ↖
  Local        GitHub Pages
 OBS stream   (tous les créateurs)
```

---

## 🎯 EXEMPLESUTILISATION

### Exemple 1: Sur ton stream (Mac Mini)

```bash
Terminal 1:
npm start

Terminal 2:
npm run push:auto
```

**Puis dans OBS:**
```
http://localhost:3000/cdc_goal_widget.html
```

✅ Affiche la cagnotte en direct, zéro latence ⚡

### Exemple 2: Pour les autres créateurs

Ils utilisent le lien GitHub (qui est maintenant à jour!):
```
https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html
```

Mise à jour **toutes les 5 minutes** 🚀

### Exemple 3: T-shirts +100€

1. Ouvre `http://localhost:3000/manager.html`
2. Entre 100 dans "Montant ajouté"
3. Écris "T-shirts" dans description
4. Clique Enregistrer ✅

**L'écran affiche automatiquement:** Streamlabel + 100€ = Total

---

## 📁 FICHIERS CLÉS

| Fichier | Rôle |
|---------|------|
| `streamlabel-server.js` | ✨ NOUVEAU - Serveur simple Streamlabel |
| `auto-push.js` | ✨ NOUVEAU - Push auto vers GitHub |
| `simple-sync.js` | ✨ NOUVEAU - Sync Streamlabel + ajouts |
| `manager.html` | Interface pour modifier les ajouts |
| `ajouts_perso.json` | Tes montants perso (autogéré) |
| `cagnotte_config.json` | Données finales (mis à jour auto) |
| `Streamlabels/total_charity_donation_amount.txt` | Données Streamlabel brutes |

---

## 🔄 FLUX DE DONNÉES

### Avec Streamlabel seul:

```
Streamlabel file (1000€)
        ↓
streamlabel-server.js
        ↓
cagnotte_config.json {brut: 1000, ajouts: 0, total: 1000}
        ↓
GitHub cdc_goal_widget.html affiche 1000€
```

### Avec ajouts perso:

```
Streamlabel file (1000€) + Manager (100€)
        ↓
streamlabel-server.js
        ↓
cagnotte_config.json {brut: 1000, ajouts: 100, total: 1100}
        ↓
GitHub cdc_goal_widget.html affiche 1100€
        ↓
Manager affiche détails:
  📡 Streamlabel: 1000€
  🎁 Ajouts: +100€
  💰 TOTAL: 1100€
```

---

## ⚙️ COMMANDES

### Démarrer le serveur
```bash
npm start
```

### Lire Streamlabel une fois
```bash
node simple-sync.js
```

### Mode watch continu (test)
```bash
npm run sync:watch
```

### Push auto vers GitHub (toutes les 5 min)
```bash
npm run push:auto
```

### Push à chaque changement (watch)
```bash
npm run push:watch
```

---

## 🧪 TESTER

### Test 1: Vérifier le serveur fonctionne

```bash
curl http://localhost:3000/cagnotte_config.json
```

Doit retourner:
```json
{
  "brut": 1000,
  "ajouts": 0,
  "total": 1000,
  "lastModified": "2025-11-06T14:30:00.000Z",
  "sources": {
    "streamlabel": 1000,
    "perso": 0
  }
}
```

### Test 2: Modifier les ajouts

1. Ouvre `http://localhost:3000/manager.html`
2. Entre un montant
3. Clique Enregistrer
4. Redynamique la page → Les données changent! ✨

### Test 3: Vérifier GitHub est à jour

Attends 5 minutes, puis:
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json
```

Les données doivent avoir changé! ✅

---

## 🐛 PROBLÈMES?

### "Streamlabel file not found"
- Vérifie que `Streamlabels/total_charity_donation_amount.txt` existe
- Streamlabel est bien configuré sur ce dossier?

### "Cagnotte affiche zéro"
- Redémarre `npm start`
- Attends 5 secondes
- Redémarre OBS

### "GitHub n'est pas à jour"
- Lance `npm run push:auto` dans un autre terminal
- Attends 5 minutes
- GitHub Pages met en cache, donne du temps

### "Je veux changer l'intervalle de push"
Édite `auto-push.js` ligne 16:
```javascript
const PUSH_INTERVAL = 5 * 60 * 1000; // Change 5 en autre nombre
```

---

## ✨ AVANTAGES

| Point | Ancien | Nouveau |
|------|--------|---------|
| **Vitesse local** | N/A | Temps réel ⚡ |
| **Vitesse GitHub** | Cache 5min | Auto-push 5min |
| **Limite crédit** | Oui 😢 | Non! Git gratuit ✅ |
| **Ajouts perso** | Manager compliqué | Simple interface ✅ |
| **URL widgets** | Pas changé | Pas changé ✅ |

---

## 🎉 RÉSUMÉ

**Tu dois faire:**

Terminal 1:
```bash
npm start
```

Terminal 2:
```bash
npm run push:auto
```

**C'est tout!** 

- ✅ Streamlabel est lu en direct
- ✅ OBS affiche la cagnotte
- ✅ GitHub Pages est aussi à jour
- ✅ Tu peux ajouter des montants via le manager
- ✅ Zéro limite crédit

**BON STREAM!** 🚀🎊
