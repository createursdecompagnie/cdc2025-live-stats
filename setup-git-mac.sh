#!/bin/bash

###############################################################################
# SETUP GIT GITHUB POUR MAC MINI
###############################################################################
# 
# Ce script configure Git et SSH pour que le push automatique fonctionne
# sur le Mac mini
#
# Utilisation: bash setup-git-mac.sh
#
###############################################################################

echo "═════════════════════════════════════════════════════════════════"
echo "🔧 CONFIGURATION GIT POUR MAC MINI"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# 1. Vérifier l'installation de Git
echo "1️⃣  Vérification de Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git non installé!"
    echo "   Installation: brew install git"
    exit 1
else
    echo "✅ Git installé: $(git --version)"
fi
echo ""

# 2. Vérifier/Créer clé SSH
echo "2️⃣  Vérification de la clé SSH..."
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ -f "$SSH_KEY" ]; then
    echo "✅ Clé SSH trouvée: $SSH_KEY"
else
    echo "⚠️  Clé SSH non trouvée"
    echo "   Génération d'une nouvelle clé..."
    
    read -p "   Email GitHub: " EMAIL
    ssh-keygen -t ed25519 -C "$EMAIL" -f "$SSH_KEY" -N ""
    
    echo "✅ Clé SSH créée!"
    echo "   Public key: $SSH_KEY.pub"
    echo ""
    echo "📋 Ajouter cette clé à GitHub:"
    echo "   https://github.com/settings/ssh/new"
    echo ""
    cat "$SSH_KEY.pub"
    echo ""
fi

echo ""

# 3. Configurer Git
echo "3️⃣  Configuration Git utilisateur..."
read -p "   Nom complet [Keep current]: " NAME
if [ ! -z "$NAME" ]; then
    git config --global user.name "$NAME"
fi

read -p "   Email GitHub [Keep current]: " EMAIL
if [ ! -z "$EMAIL" ]; then
    git config --global user.email "$EMAIL"
fi

echo "✅ Configuration Git:"
echo "   Nom: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
echo ""

# 4. Tester connexion SSH
echo "4️⃣  Test connexion SSH GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ Connexion SSH réussie!"
else
    echo "⚠️  Test connexion SSH:"
    ssh -T git@github.com || true
fi
echo ""

# 5. Vérifier repo local
echo "5️⃣  Vérification du repo local..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

if [ -d ".git" ]; then
    echo "✅ Répertoire Git trouvé"
    echo "   URL distante: $(git remote get-url origin)"
    echo ""
    
    # Vérifier si URL est SSH
    REMOTE_URL=$(git remote get-url origin)
    if [[ $REMOTE_URL == git@github.com:* ]]; then
        echo "✅ URL distant en SSH (bon!)"
    elif [[ $REMOTE_URL == https://github.com/* ]]; then
        echo "⚠️  URL distant en HTTPS (lent sur Mac)"
        echo "   Convertir en SSH? (y/n)"
        read -r CONVERT
        if [ "$CONVERT" = "y" ]; then
            REPO_NAME=$(echo $REMOTE_URL | sed 's/.*\///' | sed 's/\.git$//')
            OWNER=$(echo $REMOTE_URL | sed 's/.*github.com\///' | sed 's/\/.*//')
            git remote set-url origin "git@github.com:$OWNER/$REPO_NAME.git"
            echo "✅ URL convertie en SSH!"
            echo "   Nouvelle URL: $(git remote get-url origin)"
        fi
    fi
else
    echo "❌ Répertoire Git non trouvé!"
fi

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo "✅ SETUP TERMINÉ!"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "Pour tester le push automatique:"
echo "   node auto-push-simple.js"
echo ""
echo "Pour diagnostic complet:"
echo "   node test-git-push.js"
echo ""
