# ⚡ START RAPIDE - 5 MINUTES

## C'est quoi ton setup?

✅ **Tu as Streamlabel qui écrit** `Streamlabels/total_charity_donation_amount.txt`  
✅ **Tu veux** la cagnotte en direct sur OBS  
✅ **Tu veux** aussi que GitHub Pages soit à jour  
✅ **Tu peux ajouter** des montants perso (t-shirts)

---

## 🚀 À FAIRE (Maintenant!)

### Terminal 1: Lancer le serveur

```bash
npm start
```

Tu dois voir:
```
✅ Serveur prêt sur http://localhost:3000
```

### Terminal 2: Auto-push vers GitHub

```bash
npm run push:auto
```

Tu dois voir:
```
🔄 Mode AUTO-PUSH (toutes les 5 minutes)
```

### OBS: Ajouter la source

1. Ajouter source → Navigateur
2. URL: `http://localhost:3000/cdc_goal_widget.html`
3. Clique OK

**✨ C'EST BON!** L'écran affiche la cagnotte Streamlabel en direct!

---

## 🎁 Ajouter un montant perso (optionnel)

Si tu veux ajouter t-shirts, dons directs, etc:

1. Ouvre: `http://localhost:3000/manager.html`
2. Entre le montant (ex: 100)
3. Écris la description (ex: "T-shirts")
4. Clique "Enregistrer"

**Le total s'actualise automatiquement!** 🎊

---

## 📊 Les autres créateurs?

Ils utilisent le lien GitHub qui est maintenant à jour:

```
https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html
```

Mis à jour **toutes les 5 minutes** 🚀

---

## 🎊 Voilà!

C'est vraiment tout ce qu'il faut faire:

```bash
npm start           # Terminal 1
npm run push:auto   # Terminal 2
```

Et l'URL OBS: `http://localhost:3000/cdc_goal_widget.html`

**Bon stream!** 🎬
