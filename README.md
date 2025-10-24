# CDC2025 Live Stats

📊 Statistiques en temps réel de la team Créateurs de Compagnie 2025

## 🔗 URL publique

Les données sont disponibles ici :
- **JSON complet** : `https://TON-USERNAME.github.io/cdc2025-live-stats/out/live_stats.json`

## 📦 Structure des données

```json
{
  "members": [
    {
      "id": "158696820",
      "user_data": {
        "login": "misternooton",
        "display_name": "MisterNooton",
        "profile_image_url": "https://..."
      },
      "is_live": true,
      "viewer_count": 42
    }
  ],
  "stats": {
    "live_count": 2,
    "total_viewers": 18,
    "total_members": 33
  }
}
```

## 🔄 Mise à jour

Les stats sont mises à jour automatiquement toutes les 30 secondes via un script Python local.

## 📅 CDC2025

Événement caritatif de la communauté Créateurs de Compagnie.
