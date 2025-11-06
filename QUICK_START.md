# ✨ UTILISATION SIMPLIFIÉE - CAGNOTTE EN DIRECT

## 🎯 RÉSUMÉ EN 30 SECONDES

Tu peux maintenant avoir:

1. ✅ **Les dons Streamlabs** mis à jour automatiquement
2. ✅ **Les ajouts perso** (t-shirts) combinés
3. ✅ **L'écran OBS** qui affiche TOUT EN DIRECT ⚡
4. ✅ **Les autres streamers** qui voient aussi les données

**C'est gratuit, automatique, et ZÉRO latence!** 🚀

---

## 🚀 LANCER - C'EST FACILE!

### Première fois (2 minutes)

Sur le Mac Mini:

```bash
cd ~/cdc2025-live-stats
npm install
npm start
```

**C'est tout!** ✅

Tu verras:
```
✅ Serveur prêt sur http://localhost:3000
🔄 Sync Streamlabs activée (toutes les 30 secondes)
```

### OBS: Ajouter la source

1. **OBS** → Ajouter source → **Navigateur**
2. URL: `http://localhost:3000/cdc_goal_widget.html`
3. Largeur: 1920, Hauteur: 1080 (ou ce que tu veux)
4. ✅ **OK**

**L'écran affiche la cagnotte mise à jour EN DIRECT!** 🎊

---

## 📊 COMMENT ÇA MARCHE?

```
STREAMLABS CHARITY
    (tes dons)
        ↓
  SYNC-STREAMLABS.JS
(récupère + combine)
        ↓
CAGNOTTE_CONFIG.JSON
   (mise à jour)
        ↓
SERVEUR LOCAL (Mac Mini)
   http://localhost:3000
        ↓
OBS AFFICHE TOUT FRAIS! ⚡
```

**Chaque 30 secondes**, le système:
1. ✅ Récupère les dons de Streamlabs
2. ✅ Ajoute tes ajouts perso (t-shirts)
3. ✅ Met à jour le fichier cagnotte
4. ✅ Sert les données à OBS
5. ✅ Pousse sur GitHub (optionnel)

---

## ✨ CES DONNÉES SONT:

| Aspect | Avant | Maintenant |
|--------|-------|-----------|
| **Vitesse** | Cache 5min | Frais 30s ✅ |
| **Limite** | 60/heure 😢 | Illimité ✅ |
| **Ajouts perso** | Non 😞 | Oui! ✅ |
| **Streamers** | GitHub cassé | À jour ✅ |

---

## 🎮 UTILISATION QUOTIDIENNE

### Avant stream

```bash
npm start
```

Et c'est lancé! ✅

### Pendant stream

- L'écran OBS se met à jour **tout seul** ⚡
- Les dons Streamlabs arrivent **instantanément** 🚀
- Tes t-shirts (ajouts perso) **comptent aussi** 🎁
- Zéro intervention de ta part!

### Après stream

```bash
Ctrl + C
```

C'est arrêté. ✅

---

## 💾 OÙ SONT LES DONNÉES?

- **Streamlabs:** Récupérées automatiquement ✅
- **T-shirts (perso):** Dans `cagnotte_manager.html` ✅
- **Fichier de data:** `cagnotte_config.json` ✅
- **OBS:** Via `http://localhost:3000/cdc_goal_widget.html` ✅
- **GitHub:** Aussi mis à jour ✅

---

## 🔧 COMMANDES UTILES

### Lancer le serveur (CELLE À UTILISER)
```bash
npm start
```

### Voir les logs
```bash
npm start
```
(Les logs s'affichent directement)

### Tester la sync
```bash
node sync-streamlabs.js
```

### Mode test continu
```bash
node sync-streamlabs.js --watch
```

### Diagnostic complet
```bash
npm run diagnostic
```

---

## 🎯 EXEMPLES

### Exemple 1: Dons Streamlabs + T-shirts

**Streamlabs dit:** 1000€
**T-shirts:** 200€
**TOTAL AFFICHE:** 1200€ ✅

### Exemple 2: Pendant stream

```
14:30 - Démarrage: 1000€ affiché
14:30:30 - Don reçu (+50€)
14:30:35 - OBS affiche 1050€ ⚡ (5 secondes après!)
```

### Exemple 3: Autre streamer sur GitHub

```
Lien: https://raw.githubusercontent.com/...
Données mises à jour toutes les 5 minutes
Zéro latence GitHub!
```

---

## 🐛 PROBLÈMES? (Vraiment rare!)

### "Cagnotte affiche toujours le même montant"

**Solution:**
1. Redémarre `npm start`
2. Attends 30 secondes
3. Redémarre OBS
4. Essaie d'ajouter un petit don de test

### "Erreur Streamlabs"

**Solution:**
- Vérifie que le token est correct dans `.env`
- Continue quand même (le serveur fonctionne)

### "OBS n'affiche rien"

**Solution:**
1. Copie-colle l'URL dans le navigateur: `http://localhost:3000/cdc_goal_widget.html`
2. Si ça marche, c'est OBS
3. Si ça marche pas, c'est le serveur: redémarre `npm start`

---

## 💡 ASTUCES

### Tu peux aussi utiliser

**Cette URL si tu es sur le même réseau:**
```
http://192.168.1.XXX:3000/cdc_goal_widget.html
```

(Remplace XXX par l'IP du Mac Mini)

**Pour les autres streamers à la maison:**
```
http://localhost:3000/cdc_goal_widget.html  (si ordi locale)
ou
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json
```

---

## 📱 VÉRIFICATION RAPIDE

Tu veux voir si tout marche? Ouvre Terminal:

```bash
curl http://localhost:3000/cagnotte_config.json
```

Tu dois voir quelque chose comme:
```json
{"brut":1234,"ajouts":100,"total":1334,...}
```

**Si tu vois ça, tout marche!** ✅

---

## 🎉 C'EST TOUT!

Vraiment, c'est ça! 

```bash
npm start
```

Et boum! 💥 Cagnotte en direct, zéro problème, zéro limite!

**BON STREAM!** 🚀
