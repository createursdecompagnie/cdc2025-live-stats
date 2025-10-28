# CDC2025 Widget Bar

Barre d'infos horizontale 1920×1080, prête pour OBS/Streamlabs (Browser Source).

## Fonctionnalités
- Montant global synchronisé avec `cdc_goal_widget.html` (source unique, logique centralisée)
- Stats compactes (👥 viewers, 🔴 lives) depuis `live_stats.json`
- Personnalisation par URL (couleurs, taille de police, textes, sources)
- Fond translucide avec blur, reste overlay-friendly (transparent hors barre)

## Paramètres URL
Vous pouvez chaîner plusieurs paramètres, ex: `?fs=1.2&accent=%23FCA000&hashtag=%23ProtectionAnimale`.

- Apparence
  - `fs` (alias: `fontScale`, `fontsize`) — multiplicateur de police global (0.25–4). Ex: `?fs=1.2`
  - `accent` — couleur accent (hex encodé `%23` ou rgba). Ex: `?accent=%23FCA000`
  - `text` — couleur du texte principal. Ex: `?text=%23f2f5f8`
  - `muted` — couleur du texte secondaire. Ex: `?muted=%23a7b1bd`
  - `barBg` — fond de la barre (any CSS color). Ex: `?barBg=rgba(11,15,20,0.85)`

- Contenu
  - `hashtag` — texte du hashtag à droite. Ex: `?hashtag=%23ProtectionAnimale`
  - `logo` — texte du logo arc-en-ciel. Ex: `?logo=%23CDC2025`

- Données
  - `goalWidgetUrl` — URL du widget montant global à parser (par défaut: `cdc_goal_widget.html`).
  - `statsUrl` — URL du JSON de stats (`live_stats.json`).
  - `interval` — fréquence de refresh en millisecondes (par défaut 30000).

## Exemples prêts à l'emploi
- Classique CDC, un peu plus grand
```
?fs=1.2&accent=%23FCA000&text=%23f2f5f8&muted=%23a7b1bd&barBg=rgba(11,15,20,0.85)&hashtag=%23ProtectionAnimale&logo=%23CDC2025&interval=15000
```

- Thème clair
```
?barBg=rgba(255,255,255,0.7)&text=%230b0f14&muted=%235b6570&accent=%23ff6600&fs=1.1
```

- Sources personnalisées
```
?goalWidgetUrl=https://exemple.org/cdc_goal_widget.html&statsUrl=https://exemple.org/live_stats.json&interval=10000
```

## Intégration OBS / Streamlabs
- Ajouter une Browser Source 1920×1080.
- URL: `https://createursdecompagnie.github.io/cdc2025-live-stats/Widget_Bar.html` + paramètres.
- Activer "Shutdown source when not visible" si besoin, sinon la barre continue d'actualiser en arrière-plan.

## Dépannage
- Le montant n'apparaît pas: vérifier que `cdc_goal_widget.html` est accessible (CORS) et contient un élément `#globalAmount`.
- Les stats n'apparaissent pas: vérifier que `live_stats.json` est servi publiquement et respecte les champs `total_viewers`, `live_count`.
- Caractères `#` dans l'URL: encoder en `%23` (ex: `#CDC2025` -> `%23CDC2025`).

## Notes techniques
- La barre s'adapte via `--fs` à la plupart des tailles.
- La logique du montant global reste dans `cdc_goal_widget.html` pour garantir une seule source de vérité.
- Si CORS bloque le parsing HTML, on peut proposer une variante JSON miroir côté GitHub Pages.
