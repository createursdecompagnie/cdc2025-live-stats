# 🐾 CDC2025 Live Overlays - Guide Complet

## 📋 Vue d'ensemble du projet

Ce projet contient tous les overlays pour le stream CDC2025 (Créateurs de Compagnie 2025), un événement de charité avec cagnotte Streamlabs. Les widgets affichent en temps réel les informations de stream et les donations.

---

## 📂 Structure du projet

### Fichiers principaux (Dossier de travail)
```
c:\Users\coren\Downloads\cdc2025_overlays\
├── info_widget.html           # Barre horizontale complète (4 sections)
├── cdc_goal_widget.html       # Widget standalone CDC2025 + Global + montant
├── bg-motion.js               # Animation background pour overlays
├── README.md                  # Documentation technique
├── TUTO_MAJ_CAGNOTTE.md      # Tutoriel mise à jour cagnotte
├── GUIDE.md                   # Ce fichier
├── brb.html                   # Overlay "Be Right Back"
├── cam_game_big.html          # Layout cam + game (grand)
├── cam_game_small.html        # Layout cam + game (petit)
├── ending.html                # Overlay fin de stream
├── full_cam.html              # Overlay caméra plein écran
├── game_only.html             # Overlay jeu uniquement
└── starting.html              # Overlay début de stream
```

### Fichiers de production (Dossier stream)
```
P:\[STREAM_CDC]\[CDC2025]\OVERLAY\
├── (tous les fichiers ci-dessus)
├── CAGNOTTE\                  # Widgets cagnotte Streamlabs
├── STATS\                     # Stats streamers (JSON)
├── TwitchStats\               # Scripts Python + Git repo stats live
│   └── TwitchTeamLiveStats\   # Repo GitHub Pages
└── Streamlabel\               # Labels StreamElements
```

---

## 🌐 URLs importantes

### GitHub Pages (pour StreamElements)
- **Widget CDC2025 Goal**: https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html
- **Info Widget (horizontal)**: https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html
- **Info Widget (vertical)**: https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget_vertical.html
- **Carousel carré (seul)**: https://createursdecompagnie.github.io/cdc2025-live-stats/info_carousel_square.html
- **Stats vertical (seul)**: https://createursdecompagnie.github.io/cdc2025-live-stats/stats_vertical.html
- **Stats JSON (Twitch)**: https://createursdecompagnie.github.io/cdc2025-live-stats/live_stats.json

### Streamlabs
- **Charity Widget**: https://streamlabs.com/widgets/streamlabs-charity-donation-goal?token=03311CF526D2843D8B1C

### Dépôt Git
- **Repo GitHub**: https://github.com/createursdecompagnie/cdc2025-live-stats
- **Location locale**: `P:\[STREAM_CDC]\[CDC2025]\OVERLAY\TwitchStats\TwitchTeamLiveStats\`

---

## 🎯 Guide d'utilisation des widgets

### 1. Info Widget (`info_widget.html`)

**Description**: Barre horizontale avec 4 sections (CDC2025, objectif perso, infos carrousel, stats Twitch)

**Dimensions**: 1920×180px (auto-scaling)

**Sections**:
- **Branding** (280px): Contient `cdc_goal_widget.html` en iframe
- **Personal Goal** (420px): Objectif personnel (placeholder)
- **Info Carousel** (500px): Messages rotatifs (8s par slide)
- **Stats** (200px): Viewers + Total (depuis GitHub Pages JSON)

**Utilisation**:

#### Dans OBS:
1. Source → Browser
2. URL: `file:///P:/[STREAM_CDC]/[CDC2025]/OVERLAY/info_widget.html`
3. Dimensions: 1920×180
4. CSS personnalisé (si besoin): `body { transform: scale(0.8); }`

#### Dans StreamElements:
1. Custom Widget → Add new widget
2. URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html`
3. Dimensions widget: 1920×180
4. Positionner en haut de l'écran

**Paramètres URL**:
```
?w=1400           # Force largeur 1400px (auto-scale)
?bonus=150        # Ajoute 150€ à la cagnotte (dons offline)
?interval=60000   # Stats update toutes les 60s (défaut: 30s)
?stats=hide       # Cache la section stats
```

**Exemples**:
```
# Largeur 1400px avec bonus 100€
info_widget.html?w=1400&bonus=100

# Update stats toutes les minutes

---

### 1a. Carousel carré seul (`info_carousel_square.html`)

**Description**: Bloc carré autonome affichant le carrousel d'infos uniquement (images + textes). Idéal pour une colonne latérale.

**Dimensions**: 600×600 (auto-scaling)

**Utilisation OBS**:
1. Source → Browser
2. URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/info_carousel_square.html`
3. Dimensions: 600×600 (ou utilisez `?size=480`)

**Paramètres URL**:
```
?size=480       # Force taille cible (carré)
?theme=dark     # dark | light | auto
?lang=en        # fr | en
?v=3            # cache busting
```

**Exemple**:
```
info_carousel_square.html?size=480&theme=dark&lang=en
```

---

### 1b. Stats vertical seul (`stats_vertical.html`)

**Description**: Bloc vertical autonome pour les stats (En live, Viewers total, Heure).

**Dimensions**: 360×480 (auto-scaling)

**Utilisation OBS**:
1. Source → Browser
2. URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/stats_vertical.html`
3. Dimensions: 360×480 (ou utilisez `?h=1080` pour s'adapter à une colonne 1080px)

**Paramètres URL**:
```
?h=720          # Force hauteur cible (scaling vertical)
?theme=dark     # dark | light | auto
?showSeconds=1  # Horloge avec secondes
?lang=en        # fr | en
?stats=...      # URL JSON alternative
?interval=60000 # Rafraîchissement stats
?v=3            # cache busting
```

**Exemple**:
```
stats_vertical.html?h=900&theme=dark&lang=en&showSeconds=true
```
info_widget.html?interval=60000

# Cache stats, bonus 50€
info_widget.html?bonus=50&stats=hide
```

### Paramètres URL détaillés (nouveaux)

Vous pouvez maintenant contrôler le rendu du widget via des paramètres URL. Ils fonctionnent aussi bien dans OBS (Browser Source) que dans StreamElements.

- `?w=<number>` — Force la largeur logique (px) utilisée par le système d'auto-scale. Ex: `?w=1400`.
- `?interval=<ms>` — Intervalle de mise à jour des stats en millisecondes. Ex: `?interval=60000`.
- `?bonus=<number>` — Ajoute une somme fixe (en €) au total affiché. Ex: `?bonus=150`.
- `?imgTshirt=<url>` — Remplace l'image t-shirt par l'URL fournie (doit être HTTPS). Ex: `&imgTshirt=https://.../mon.png`.
- `?theme=auto|dark|light` — Choisit le thème visuel :
  - `auto` (défaut) : détecte `prefers-color-scheme` du navigateur
  - `dark` : force thème sombre
  - `light` : force thème clair
  Exemple: `?theme=dark`.
- `?hide=<csv>` — Masque des sections par nom. Valeurs possibles : `personal`, `branding`, `stats`, `info`.
  Exemple: `?hide=personal,branding`.
- `?showSeconds=true|false` — Affiche ou non les secondes sur l'horloge. Exemple: `?showSeconds=true`.
- `?lang=fr|en` — Langue pour quelques labels (par ex. "Heure" / "Time"). Exemple: `?lang=en`.
- `?v=<number|string>` — Paramètre de cache-bust pour forcer un refresh après déploiement. Ex: `?v=2`.

Exemple complet :
```
https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html?w=1400&theme=dark&hide=personal&showSeconds=true&lang=en&v=3
```

Notes de sécurité & bonnes pratiques
- Pour les URLs d'images (`imgTshirt`) et `stats` utilisez des URLs HTTPS publiques.
- Si vous utilisez StreamElements, collez l'URL complète dans le widget Custom/Website et adaptez la largeur/hauteur côté StreamElements (voir section OBS ci-dessous).

### Utiliser `info_widget.html` (horizontal) dans OBS (Browser Source)

1. Dans OBS, Sources → -> `+` → `Browser`.
2. Collez l'URL publique (GitHub Pages), par exemple :
   `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html`
   - Ajoutez les paramètres souhaités (voir ci‑dessus), par ex :
     `.../info_widget.html?theme=dark&hide=personal&showSeconds=true&lang=en`
3. Réglez Width / Height :
   - Widget natif : `Width = 1920`, `Height = 180` (design de base)
   - Si vous forcez `?w=1400`, calculez la hauteur : `H = 180 * (1400/1920) ≈ 131`.
4. Désactivez la mise en pause (untick "Shutdown source when not visible") si vous voulez continuer les mises à jour en arrière-plan, sinon cochez-le pour économiser CPU.
5. Si OBS n'affiche pas la dernière version après un déploiement GitHub, ajoutez `?v=NN` à l'URL et rechargez la source.

Exemples pratiques pour OBS
- Simple (thème auto) :
  `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html`
- En-tête réduit (width 1400, thème sombre, masque la partie perso) :
  `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html?w=1400&theme=dark&hide=personal`

### Utiliser `info_widget_vertical.html` (vertical) dans OBS (Browser Source)

**Nouveau** : Version verticale du widget info (360×1200px) pour affichage latéral.

1. Dans OBS, Sources → `+` → `Browser`.
2. Collez l'URL :
   `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget_vertical.html`
3. Réglez Width / Height :
   - Widget natif : `Width = 360`, `Height = 1200` (design de base)
   - Pour adapter à 1080p vertical : `?h=1080`, Width : `360 * (1080/1200) = 324`
4. Paramètres URL supportés (identiques à la version horizontale) :
   - `?h=1080` : Force la hauteur cible pour le scaling
   - `?theme=dark|light|auto` : Thème visuel
   - `?hide=personal,stats` : Masquer des sections
   - `?showSeconds=true` : Afficher les secondes dans l'horloge
   - `?lang=en` : Langue anglaise

Exemples pratiques
- Simple (thème auto) :
  `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget_vertical.html`
- Adapté 1080p vertical, thème sombre, anglais :
  `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget_vertical.html?h=1080&theme=dark&lang=en`
### 1b. Info Widget Vertical (`info_widget_vertical.html`)

**Description**: Version verticale du widget info avec les mêmes 4 sections empilées verticalement, idéale pour affichage latéral

**Dimensions**: 360×1200px (auto-scaling)

**Sections** (de haut en bas):
- **Branding** (280px): Contient `cdc_goal_widget.html` en iframe
- **Personal Goal** (120px): Objectif personnel (placeholder)
- **Info Carousel** (400px): Messages rotatifs (8s par slide) - centré verticalement avec images agrandies
- **Stats** (300px): Live/Viewers/Heure - layout centré vertical

**Utilisation**:

#### Dans OBS:
1. Source → Browser
2. URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget_vertical.html`
3. Dimensions: Width=360, Height=1200
4. Pour adapter à d'autres résolutions : `?h=1080` (force hauteur cible)

**Paramètres URL** (identiques à la version horizontale):
```
?h=1080           # Force hauteur cible pour scaling (au lieu de ?w)
?theme=dark       # dark, light, auto
?hide=personal    # Masquer sections : personal,branding,stats,info
?showSeconds=true # Afficher secondes horloge
?lang=en          # Langue (fr|en)
?v=3              # Cache busting
```

**Exemple complet**:
```
# Widget vertical adapté 1080p, thème sombre, anglais
info_widget_vertical.html?h=1080&theme=dark&lang=en&showSeconds=true
```


### 2. CDC Goal Widget (`cdc_goal_widget.html`)

**Description**: Widget transparent standalone affichant "CDC2025 - Global - X €"

**Dimensions**: 100% (responsive vw/vh)

**Utilisation**:

#### Dans OBS:
1. Source → Browser
2. URL: `file:///P:/[STREAM_CDC]/[CDC2025]/OVERLAY/cdc_goal_widget.html`
3. Dimensions: 400×200
4. ⚠️ Active "Shutdown source when not visible" pour économiser CPU

#### Dans StreamElements:
1. Custom Widget → Add new widget
2. URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html`
3. Dimensions widget: 400×200

**Paramètres URL**:
```
?bonus=150        # Ajoute 150€ à la cagnotte
```

**Exemple**:
```
# Cagnotte + 100€ de t-shirts vendus
cdc_goal_widget.html?bonus=100
```

---

## 🛠️ Modification des widgets

### Ajouter des donations offline (t-shirts, cash, etc.)

#### Méthode 1: URL Parameter (temporaire)
```html
<!-- Ajoute 150€ à l'affichage -->
cdc_goal_widget.html?bonus=150
```

#### Méthode 2: MANUAL_BONUS (permanent)

**Dans `cdc_goal_widget.html`** (ligne ~105):
```javascript
// AVANT
const MANUAL_BONUS = 0;

// APRÈS (exemple: 150€ de t-shirts)
const MANUAL_BONUS = 150;
```

**Dans `info_widget.html`** (ligne ~382):
```javascript
// AVANT
const MANUAL_BONUS = 0;

// APRÈS (exemple: 150€ de t-shirts)
const MANUAL_BONUS = 150;
```

⚠️ **Important**: Les deux fichiers ont des constantes séparées. Si utilisé ensemble, modifie les deux!

### Changer les messages du carrousel

**Fichier**: `info_widget.html` (ligne ~410)

**Structure**:
```javascript
const INFO_MESSAGES = [
  {
    icon: '🎮',              // Emoji ou symbole
    text: 'Titre principal', // Gros texte central
    subtext: 'Sous-titre',   // Petit texte en dessous
    image: null              // URL image (optionnel)
  },
  // ... autres messages
];
```

**Exemple d'ajout**:
```javascript
const INFO_MESSAGES = [
  {
    icon: '🎁',
    text: 'Goodies disponibles!',
    subtext: 'T-shirts CDC2025 en vente',
    image: null
  },
  // ... messages existants
];
```

**Timing**: Chaque slide reste 8 secondes (modifiable ligne ~663)
```javascript
// AVANT
setInterval(rotateCarousel, 8000); // 8 secondes

// APRÈS (exemple: 10 secondes)
setInterval(rotateCarousel, 10000); // 10 secondes
```

### Changer la fréquence de mise à jour

#### Cagnotte CDC2025 (`cdc_goal_widget.html`, ligne ~172):
```javascript
// AVANT (2 secondes - live event)
setInterval(updateGlobalGoal, 2000);

// APRÈS (5 secondes)
setInterval(updateGlobalGoal, 5000);

// APRÈS (30 secondes - économise bande passante)
setInterval(updateGlobalGoal, 30000);
```

#### Stats Twitch (`info_widget.html`, ligne ~664):
```javascript
// AVANT (30 secondes)
setInterval(updateStats, CFG.updateInterval);

// Via URL parameter
info_widget.html?interval=60000  // 60 secondes
```

### Modifier les couleurs

#### Variables CSS (:root):
```css
:root {
  --bg: #0b0f14;              /* Fond général */
  --glass: rgba(0,0,0,0.5);   /* Fond semi-transparent cartes */
  --text: #f2f5f8;            /* Couleur texte */
  --accent: #FCA000;          /* Orange CDC */
  --accent-2: #104E59;        /* Vert CDC */
  --radius: 20px;             /* Arrondi des coins */
}
```

**Exemple**: Changer l'orange en jaune
```css
:root {
  --accent: #FFD700;  /* Jaune au lieu d'orange */
}
```

---

## 🔧 Workflow de mise à jour GitHub Pages

### Pourquoi GitHub Pages?
StreamElements Custom Widget nécessite une URL publique HTTPS. GitHub Pages héberge gratuitement les widgets et les rend accessibles via URL sécurisée.

### Processus de publication

#### 1. Éditer les fichiers localement
```
C:\Users\coren\Downloads\cdc2025_overlays\
├── info_widget.html      # Modifie ici
└── cdc_goal_widget.html  # Modifie ici
```

#### 2. Copier vers le dépôt Git
```powershell
# Ouvre PowerShell dans le dossier overlays
cd C:\Users\coren\Downloads\cdc2025_overlays

# Copie vers le repo Git
Copy-Item -LiteralPath ".\info_widget.html" -Destination "P:\[STREAM_CDC]\[CDC2025]\OVERLAY\TwitchStats\TwitchTeamLiveStats\"
Copy-Item -LiteralPath ".\cdc_goal_widget.html" -Destination "P:\[STREAM_CDC]\[CDC2025]\OVERLAY\TwitchStats\TwitchTeamLiveStats\"
```

#### 3. Commit et push vers GitHub
```powershell
# Va dans le dépôt Git
cd "P:\[STREAM_CDC]\[CDC2025]\OVERLAY\TwitchStats\TwitchTeamLiveStats"

# Vérifie les modifications
git status

# Ajoute les fichiers
git add info_widget.html cdc_goal_widget.html

# Commit avec message descriptif
git commit -m "Update widgets: add bonus parameter documentation"

# Push vers GitHub
git push origin main
```

#### 4. Attendre le déploiement
- GitHub Actions déploie automatiquement (1-2 minutes)
- Vérifie sur: https://github.com/createursdecompagnie/cdc2025-live-stats/actions
- Teste les URLs une fois déployé

#### 5. Forcer le refresh dans StreamElements
```javascript
// Ajoute ?v=X à l'URL pour forcer le cache
https://createursdecompagnie.github.io/cdc2025-live-stats/info_widget.html?v=2

// Change X à chaque mise à jour
?v=3, ?v=4, etc.
```

---

## 🐛 Dépannage

### Problème: Cagnotte n'affiche pas le bon montant

**Causes possibles**:
1. **MANUAL_BONUS non mis à jour**: Vérifie lignes 105 (cdc_goal_widget) et 382 (info_widget)
2. **Streamlabs URL invalide**: Teste l'URL dans un navigateur
3. **CORS bloqué**: Vérifie la console navigateur (F12)

**Solution**:
```javascript
// Test manuel dans console navigateur (F12)
updateGlobalGoal();  // Doit afficher le montant ou une erreur
```

### Problème: Widget CDC2025 est minuscule dans info_widget

**Cause**: Les unités `vw/vh` dans `cdc_goal_widget.html` se basent sur la taille de l'iframe (280×180) au lieu de la fenêtre complète.

**Solution** (déjà implémentée ligne 63-82 `info_widget.html`):
```css
.branding-section iframe {
  width: 400px !important;      /* Force dimensions absolues */
  height: 200px !important;
  transform: scale(0.7);        /* Réduit à 70% pour tenir dans 280×180 */
  transform-origin: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -200px;          /* Centre horizontalement */
  margin-top: -100px;           /* Centre verticalement */
}
```

### Problème: Stats Twitch ne s'affichent pas

**Causes possibles**:
1. **Fichier `live_stats.json` absent**: Vérifie https://createursdecompagnie.github.io/cdc2025-live-stats/live_stats.json
2. **Format JSON incorrect**: Doit être `{"viewers": 123, "total": 456}`
3. **CORS bloqué**: GitHub Pages doit autoriser fetch cross-origin
4. **Script Python non lancé**: Le script de mise à jour stats doit tourner

**Solution**:
```javascript
// Test manuel dans console (F12)
updateStats();  // Doit afficher les stats ou une erreur
```

**Format JSON attendu**:
```json
{
  "viewers": 1234,
  "total": 5678
}
```

### Problème: Carousel ne tourne pas

**Causes possibles**:
1. **JavaScript erreur**: Vérifie console (F12)
2. **Interval non démarré**: Ligne 663 `info_widget.html`

**Solution**:
```javascript
// Test manuel rotation dans console (F12)
rotateCarousel();  // Doit passer au slide suivant
```

### Problème: Auto-scaling ne fonctionne pas

**Causes possibles**:
1. **URL parameter `?w=` absent**: Essaye `?w=1400`
2. **CSS transform écrasé**: Vérifie CSS personnalisé OBS/StreamElements

**Solution**:
```javascript
// Test manuel dans console (F12)
fitWidget();  // Doit recalculer le scale
```

---

## 📊 Intégrations externes

### Streamlabs Charity
- **Widget URL**: https://streamlabs.com/widgets/streamlabs-charity-donation-goal?token=03311CF526D2843D8B1C
- **Méthode**: HTML parsing avec DOMParser + regex
- **Pattern**: `/(?:current_amount|raised|amount)["']?\s*:\s*(\d+(?:\.\d+)?)/i`
- **Update**: Fetch HTML → Parse → Extract amount → Display

### Twitch Stats (GitHub Pages JSON)
- **JSON URL**: https://createursdecompagnie.github.io/cdc2025-live-stats/live_stats.json
- **Format**: `{"viewers": int, "total": int}`
- **Génération**: Script Python dans `TwitchStats/` (Git push auto)
- **Update**: Fetch JSON → Parse → Display

### StreamElements Custom Widget
- **Méthode**: Iframe avec URL GitHub Pages
- **Avantages**: 
  - Pas de limite de taille de code
  - Modification sans recréer widget
  - URL parameter support
- **Inconvénients**: 
  - Cache CDN (ajouter `?v=X` pour forcer refresh)
  - CORS peut bloquer certaines requêtes

---

## 📝 Checklist avant le stream

### 1 semaine avant:
- [ ] Vérifier token Streamlabs Charity valide
- [ ] Tester fetch cagnotte: `updateGlobalGoal()` dans console
- [ ] Vérifier GitHub Pages déployé: https://createursdecompagnie.github.io/cdc2025-live-stats/
- [ ] Tester iframe dans StreamElements

### 1 jour avant:
- [ ] Mettre à jour `MANUAL_BONUS` avec montant t-shirts/offline
- [ ] Push vers GitHub Pages (`git commit && git push`)
- [ ] Tester tous les overlays dans OBS
- [ ] Vérifier interval updates (2s cagnotte, 30s stats)

### 1 heure avant:
- [ ] Forcer refresh widgets StreamElements (`?v=X`)
- [ ] Vérifier affichage cagnotte correct
- [ ] Lancer script Python stats Twitch
- [ ] Test final de tous les overlays

### Pendant le stream:
- [ ] Monitorer console navigateur (F12) pour erreurs
- [ ] Mettre à jour `MANUAL_BONUS` si ventes t-shirts
- [ ] Vérifier stats Twitch refresh toutes les 30s

---

## 🎨 Personnalisation avancée

### Ajouter une nouvelle section dans info_widget

**Étape 1**: HTML (ligne ~236):
```html
<div class="new-section">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>
```

**Étape 2**: CSS (ligne ~50):
```css
.new-section {
  width: 300px;  /* Ajuste largeur */
  padding: 10px;
  background: var(--glass);
  border-radius: var(--radius);
}
```

**Étape 3**: Ajuster `.info-bar` width totale:
```css
.info-bar {
  width: 2220px;  /* AVANT: 1920px (280+420+500+200) */
                   /* APRÈS: 2220px (280+420+500+200+300) */
}
```

### Créer un nouveau widget standalone

**Template minimal**:
```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Mon Widget</title>
<style>
:root {
  --bg: transparent;
  --text: #f2f5f8;
}
body {
  margin: 0;
  padding: 20px;
  background: var(--bg);
  color: var(--text);
  font-family: "Outfit", sans-serif;
}
.widget-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
</head>
<body>
  <div class="widget-container">
    <h1>Mon Contenu</h1>
  </div>

<script>
// Configuration
const CFG = {
  updateInterval: 30000  // 30 secondes
};

// Fonction d'update
async function updateWidget() {
  // Ton code ici
  console.log('Widget updated!');
}

// Init
updateWidget();
setInterval(updateWidget, CFG.updateInterval);
</script>
</body>
</html>
```

---

## 📖 Ressources additionnelles

### Documentation technique
- **README.md**: Documentation code source
- **TUTO_MAJ_CAGNOTTE.md**: Guide mise à jour cagnotte
- **Ce fichier (GUIDE.md)**: Guide utilisateur complet

### Outils utiles
- **Browser DevTools (F12)**: Console JavaScript pour debug
- **GitHub Desktop**: Interface graphique Git (alternative à ligne de commande)
- **VS Code**: Éditeur recommandé pour HTML/CSS/JS

### Liens externes
- **Streamlabs**: https://streamlabs.com/
- **GitHub Pages**: https://pages.github.com/
- **StreamElements**: https://streamelements.com/
- **Google Fonts (Outfit)**: https://fonts.google.com/specimen/Outfit

---

## 🚀 Raccourcis clavier développeur

### Browser DevTools (F12)
```
Ctrl+Shift+I   : Ouvre DevTools
Ctrl+Shift+C   : Inspect Element
Ctrl+R         : Refresh page
Ctrl+Shift+R   : Hard refresh (ignore cache)
Ctrl+Shift+J   : Ouvre Console JavaScript
```

### VS Code (édition code)
```
Ctrl+F         : Rechercher dans fichier
Ctrl+H         : Rechercher et remplacer
Ctrl+/         : Commenter/décommenter ligne
Alt+Up/Down    : Déplacer ligne
Ctrl+D         : Sélectionner occurrence suivante
```

---

## 🎯 Cas d'usage fréquents

### Scénario 1: Ajouter 150€ de t-shirts vendus avant le stream

**Solution rapide** (URL parameter):
```html
<!-- Dans StreamElements Custom Widget URL -->
https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html?bonus=150
```

**Solution permanente** (MANUAL_BONUS):
1. Ouvre `cdc_goal_widget.html` dans VS Code
2. Ligne ~105: Change `const MANUAL_BONUS = 0;` en `const MANUAL_BONUS = 150;`
3. Sauvegarde (Ctrl+S)
4. Copie vers Git: `Copy-Item -LiteralPath ".\cdc_goal_widget.html" -Destination "P:\[STREAM_CDC]\[CDC2025]\OVERLAY\TwitchStats\TwitchTeamLiveStats\"`
5. Git commit: `git add cdc_goal_widget.html && git commit -m "Add 150€ t-shirt bonus" && git push`
6. Attends 2 minutes pour déploiement GitHub Pages
7. Force refresh StreamElements: Change URL en `...cdc_goal_widget.html?v=2`

### Scénario 2: Changer un message du carrousel

**Exemple**: Remplacer "🏆 Objectif: 10 000€" par "🎁 Goodies en vente!"

1. Ouvre `info_widget.html` dans VS Code
2. Ligne ~410: Trouve le message à modifier dans `INFO_MESSAGES`:
```javascript
// AVANT
{ icon: '🏆', text: 'Objectif: 10 000€', subtext: 'Aidez-nous!', image: null },

// APRÈS
{ icon: '🎁', text: 'Goodies en vente!', subtext: 'T-shirts CDC2025 disponibles', image: null },
```
3. Sauvegarde (Ctrl+S)
4. Copie vers Git et push (voir scénario 1, étapes 4-7)

### Scénario 3: Stats Twitch ne s'affichent plus

**Debug rapide**:
1. Ouvre widget dans navigateur: `file:///P:/[STREAM_CDC]/[CDC2025]/OVERLAY/info_widget.html`
2. Ouvre console (F12)
3. Tape: `updateStats()`
4. Vérifie les erreurs:
   - **"Failed to fetch"**: GitHub Pages down ou JSON absent
   - **"SyntaxError"**: Format JSON invalide
   - **"CORS error"**: Problème permissions GitHub

**Solution si JSON absent**:
1. Va sur: https://createursdecompagnie.github.io/cdc2025-live-stats/live_stats.json
2. Si 404: Lance le script Python de génération stats
3. Si format incorrect: Vérifie format `{"viewers": 123, "total": 456}`

---

## 📞 Support et contact

Pour toute question ou problème:
1. Vérifie cette documentation (GUIDE.md)
2. Consulte README.md pour détails techniques
3. Ouvre browser console (F12) pour voir les erreurs
4. Teste les fonctions manuellement dans console
5. Vérifie GitHub Actions pour déploiement: https://github.com/createursdecompagnie/cdc2025-live-stats/actions

---

**Version**: 1.0  
**Dernière mise à jour**: 2025  
**Auteur**: Créateurs de Compagnie  
**Événement**: CDC2025 (Charité Streamlabs)
