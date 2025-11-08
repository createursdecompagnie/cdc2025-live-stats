#!/bin/bash

###############################################################################
# LANCER AUTO-PUSH AVEC MONITORING
###############################################################################
# 
# Ce script démarre auto-push-simple.js avec logs détaillés
# pour diagnostiquer les problèmes sur Mac mini
#
# Utilisation: bash run-auto-push.sh
#
###############################################################################

echo "═════════════════════════════════════════════════════════════════"
echo "🚀 AUTO-PUSH GITHUB - MODE MONITORING"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "cagnotte_config.json" ]; then
    echo "❌ Erreur: cagnotte_config.json non trouvé"
    echo "   Exécute depuis le répertoire cdc2025-live-stats"
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé!"
    exit 1
fi

echo "📁 Répertoire: $(pwd)"
echo "📄 Config trouvée: cagnotte_config.json"
echo ""

# Créer fichier log
LOG_FILE="auto-push.log"
echo "📝 Logs dans: $LOG_FILE"
echo ""

# Afficher info système
echo "═════════════════════════════════════════════════════════════════"
echo "ℹ️  INFO SYSTÈME"
echo "═════════════════════════════════════════════════════════════════"
echo "Node version: $(node --version)"
echo "Git version: $(git --version)"
echo "System: $(uname -a | cut -d' ' -f1-3)"
echo "Utilisateur Git: $(git config --global user.name) <$(git config --global user.email)>"
echo "URL distante: $(git remote get-url origin)"
echo ""

# Afficher avertissements potentiels
echo "═════════════════════════════════════════════════════════════════"
echo "⚠️  VÉRIFICATIONS PRÉALABLES"
echo "═════════════════════════════════════════════════════════════════"

# Vérifier SSH
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH GitHub: OK"
else
    echo "❌ SSH GitHub: PROBLÈME DÉTECTÉ!"
    echo "   Exécute: bash setup-git-mac.sh"
    exit 1
fi

# Vérifier statut git
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$BRANCH" = "main" ]; then
    echo "✅ Branche: main"
else
    echo "⚠️  Branche: $BRANCH (pas main)"
    echo "   🔧 Synchronisation repo..."
    node fix-git-repo.js
fi

if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Repo Git: Propre (bon!)"
else
    echo "⚠️  Repo Git: Fichiers en attente"
    echo "   (auto-push les gèrera)"
fi

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo "🎬 DÉMARRAGE AUTO-PUSH"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "Appuie Ctrl+C pour arrêter"
echo ""

# Démarrer auto-push avec logs
node auto-push-simple.js 2>&1 | tee -a "$LOG_FILE"

