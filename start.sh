#!/bin/bash

# =============================================================================
# CDC2025 - QUICK START SCRIPT
# =============================================================================
# 
# Ce script démarre automatiquement le serveur local et ouvre l'interface web
# 
# USAGE:
# chmod +x start.sh  # Rendre exécutable (une fois)
# ./start.sh         # Lancer le serveur
# 
# =============================================================================

echo "🐾 CDC2025 - Démarrage du serveur local"
echo "========================================"

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo "Télécharge Node.js: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js trouvé: $(node --version)"

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo ""
echo "🚀 Démarrage du serveur..."
echo "📍 http://localhost:3000"
echo ""
echo "💡 Appuyer sur Ctrl+C pour arrêter"
echo ""

# Lancer le serveur
node local-server.js
