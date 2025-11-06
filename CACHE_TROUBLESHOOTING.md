# 🔧 CDC2025 - GUIDE DE DÉPANNAGE CACHE/AFFICHAGE

## 🎯 Le problème: "J'ai ajouté 20€ mais OBS n'affiche pas"

### Cause la plus commune: **OBS cache l'ancienne version** 📦

Quand OBS charge une page web, il **la met en cache** pour économiser les ressources. Donc quand vous chargez `http://localhost:3000/cdc_goal_widget.html`, OBS affiche la **première version** et ne regarde pas les changements.

---

## ✅ SOLUTIONS (du plus facile au plus technique)

### **SOLUTION 1: Forcer OBS à rafraîchir (30 secondes)** ⭐ RECOMMANDÉ

**Dans OBS:**

1. Clic droit sur la source `cdc_goal_widget.html`
2. Sélectionnez **"Actualiser"** ou **"Refresh"**
3. Attendez 2 secondes

**Résultat:** OBS recharge la page et devrait afficher **71€**

**Si ça ne marche pas:**
1. Double-clic sur la source pour ouvrir les propriétés
2. Vérifiez que l'URL est: `http://localhost:3000/cdc_goal_widget.html`
3. Cliquez **OK**
4. Attendez 3 secondes

---

### **SOLUTION 2: Ajouter un paramètre de cache-busting (1 minute)** ⭐⭐

Les navigateurs et OBS mettent en cache les requêtes. Pour forcer un rechargeage, on ajoute un paramètre qui change à chaque fois:

**AVANT (OBS cache cette URL):**
```
http://localhost:3000/cdc_goal_widget.html
```

**APRÈS (OBS voit chaque fois une URL différente):**
```
http://localhost:3000/cdc_goal_widget.html?t=1
```

Ou mieux, avec un vrai timestamp:
```
http://localhost:3000/cdc_goal_widget.html?t=1730849000000
```

**Résultat:** OBS ne mettra pas en cache et affichera les dernières données! ✨

---

### **SOLUTION 3: Utiliser le manager.html pour vérifier** (2 minutes)

Vérifiez que vos données sont bien sauvegardées:

1. Ouvrez dans votre navigateur: `http://localhost:3000/manager.html`
2. Vérifiez que vous voyez:
   ```
   Streamlabel: 51€
   Personnel: 20€
   TOTAL: 71€
   ```

**Si vous voyez 71€ ici, c'est bon!** Le problème est juste le cache OBS.

---

### **SOLUTION 4: Tester le widget directement** (3 minutes)

Ouvrez le widget dans votre navigateur pour vérifier qu'il lit les bonnes données:

1. Ouvrez: `http://localhost:3000/cdc_goal_widget.html`
2. Vérifiez que vous voyez **71€** dans le navigateur
3. Ouvrez la console (F12 ou Cmd+Option+I)
4. Regardez les logs:
   ```
   📍 Données du serveur LOCAL
   ```

**Si vous voyez 71€ dans le navigateur, le problème est 100% un cache OBS.**

---

## 🔍 VÉRIFIER QUE TOUT FONCTIONNE

**Terminal: Vérifier les données côté serveur**

```bash
node simple-sync.js
```

Vous devez voir:
```
📊 Streamlabel: 51€
🎁 Ajouts perso: 20€
💰 TOTAL: 71€
```

**Si c'est bon:** Les données sont bien à jour côté serveur.

---

## 🛡️ PRÉVENTION: Empêcher le cache à l'avenir

### Option 1: URL avec timestamp (meilleur)

Modifiez l'URL OBS pour inclure un timestamp:

```
http://localhost:3000/cdc_goal_widget.html?v=latest
```

Le serveur ignora le paramètre `v`, mais OBS ne mettra pas en cache.

### Option 2: Désactiver le cache navigateur

Dans OBS, il y a peut-être une option pour désactiver le cache de la source navigateur (selon votre version).

### Option 3: Hard-refresh dans OBS

Si OBS a une option "Actualiser toutes les 10 secondes" ou similaire, activez-la.

---

## 🎬 À partir de maintenant

**Vous pouvez:**

1. ✅ Ajouter des montants via `http://localhost:3000/manager.html`
2. ✅ OBS affichera les données en **5 secondes** (temps de refresh du serveur)
3. ✅ Les données se pousseront vers GitHub automatiquement

**Le workflow optimal:**

```
1. Allez sur manager.html
2. Ajoutez un montant (ex: 50€ pour des t-shirts)
3. Cliquez "Enregistrer"
4. OBS actualise automatiquement EN DIRECT ⚡
5. Toutes les 5 minutes, ça se pousse sur GitHub 📡
```

---

## 📋 CHECKLIST FINALE

- [ ] J'ai ajouté 20€ via manager.html
- [ ] Je vois 71€ (51€ + 20€) dans la console du navigateur
- [ ] Je vois 71€ quand j'ouvre `http://localhost:3000/cdc_goal_widget.html`
- [ ] J'ai rafraîchi la source OBS
- [ ] OBS affiche maintenant 71€ ✨

Si tous les points sont ✅, c'est parfait! Le système fonctionne normalement! 🎉

---

## 🆘 SI NOTHING WORKS

Essayez cela:

```bash
# 1. Arrêtez le serveur (Ctrl+C)

# 2. Supprimez le cache des fichiers
rm -f cagnotte_config.json
rm -f ajouts_perso.json

# 3. Relancez le serveur
npm start

# 4. Vérifiez que tout fonctionne
node simple-sync.js

# 5. Ajoutez un montant test
curl -X POST http://localhost:3000/api/update-ajouts \
  -H "Content-Type: application/json" \
  -d '{"montant": 50, "description": "test"}'

# 6. Rafraîchissez OBS
```

---

**Besoin d'aide? Créez une issue sur GitHub!**
