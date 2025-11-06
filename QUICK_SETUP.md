# 🚀 SETUP RAPIDE - 3 ÉTAPES

## Terminal 1: Serveur
```bash
npm start
```

## Terminal 2: Auto-Update Widget
```bash
npm run widget:auto
```

Vous verrez:
```
✅ Widget mis à jour: 51€ + 20€ = 71€
📋 Chemin: file://...cdc_widget_auto.html
```

## OBS: Remplacer la source

1. **Supprimer** l'ancienne: `http://localhost:3000/cdc_goal_widget.html`
2. **Ajouter nouvelle source FILE:**
   - Type: Source navigateur
   - Cochez: "Fichier"
   - Chemin: `file://C:\...\cdc_widget_auto.html` (copier du terminal)
3. **OK**

---

## ✅ C'est fini!

Maintenant quand vous modifiez via `http://localhost:3000/manager.html`, OBS rafraîchit AUTOMATIQUEMENT en 2 secondes! ⚡

Plus de cache, plus de manuel, c'est automatique! 🎉
