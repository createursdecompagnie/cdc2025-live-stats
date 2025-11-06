# 📡 POUR LES AUTRES CRÉATEURS - UTILISER LE LIEN GITHUB

## 🎯 Si tu n'es pas sur le Mac Mini...

Tu peux **QUAND MÊME** avoir les données de la cagnotte à jour!

Via le lien GitHub qui est **maintenant synchronisé!** ✨

---

## 🚀 SETUP RAPIDE (2 MINUTES)

### Dans OBS

1. **Ajouter une source** → **Navigateur**
2. **URL:** 
   ```
   https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cdc_goal_widget.html
   ```
3. Clique OK ✅

**L'écran affiche la cagnotte!** 🎊

---

## 📊 DONNÉES DISPONIBLES

| Quoi | Où | Vitesse |
|------|-----|---------|
| **Cagnotte Streamlabs** | Sur le lien GitHub ✅ | Mise à jour toutes les 5 min |
| **Ajouts perso (t-shirts)** | Inclus ✅ | Aussi toutes les 5 min |
| **Stats créateurs** | GitHub aussi ✅ | Même vitesse |

---

## 🔗 TOUS LES LIENS DISPONIBLES

### Widget Cagnotte (CEL À UTILISER)
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cdc_goal_widget.html
```

### Fichier de données (JSON)
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json
```

### Stats créateurs (JSON)
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/out/live_stats.json
```

### Widget simple (alternative)
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cdc_goal_widget_simple.html
```

---

## ⚡ VITESSE?

**Avant:** 🐢 Cache GitHub = 5-10 minutes
**Maintenant:** 🚀 Mise à jour toutes les 5 minutes (le Mac Mini push!)

**Si tu veux ENCORE plus rapide:**
- Demande l'IP du Mac Mini
- Utilise `http://192.168.1.XXX:3000/cdc_goal_widget.html`
- ⚡ Mise à jour toutes les 30 secondes!

---

## 💡 POUR LES CRÉATEURS

### Si tu fais un overlay:

```html
<iframe 
  src="https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cdc_goal_widget.html"
  width="1920"
  height="1080"
  frameborder="0"
></iframe>
```

### Ou personnalisé:

```javascript
fetch('https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json')
  .then(r => r.json())
  .then(data => {
    console.log(`Cagnotte: ${data.total}€`);
    // Affiche dans ton UI...
  });
```

---

## 🎨 PERSONNALISATION

Tu peux ajouter des paramètres à l'URL:

```
?textColor=%23ff00ff
?backgroundColor=%23000000
?fontScale=1.5
?hideDetails=true
```

Exemple:
```
https://...cdc_goal_widget.html?textColor=%23ff00ff&fontScale=1.5
```

(Les codes couleur: `%23` = `#`)

---

## 🐛 PROBLÈMES?

### "Widget affiche zéro"

**Solution:**
1. Attends 5 minutes (synchronisation)
2. Redémarre OBS
3. Recharge la source

### "GitHub est vieux"

**Solution:**
- C'est normal, GitHub cache 2-5 minutes
- Pour zéro latence, demande le lien Mac Mini

### "Je veux les données en JSON"

**Utilise:**
```
https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json
```

Format:
```json
{
  "brut": 1234,
  "ajouts": 100,
  "total": 1334,
  "lastModified": "2025-11-06T14:30:00.000Z"
}
```

---

## 📱 RÉSUMÉ

| Option | Vitesse | Latence | Utilisation |
|--------|---------|---------|------------|
| **GitHub** | 🌙 5 min | +200ms | Tous streamers |
| **Mac Mini (local)** | ⚡ 30s | <50ms | Équipe directe |
| **Mac Mini (réseau)** | ⚡ 30s | <100ms | Même réseau |

---

## 🎉 C'EST TOUT!

Copie-colle le lien GitHub dans OBS et c'est bon! 

**Bon stream!** 🚀
