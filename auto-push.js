#!/usr/bin/env node

/**
 * =============================================================================
 * AUTO-PUSH GITHUB - Synchronise cagnotte_config.json vers GitHub Pages
 * =============================================================================
 * 
 * Ce script:
 * 1. Détecte les changements dans cagnotte_config.json
 * 2. Les pousse sur GitHub (toutes les X minutes)
 * 3. N'utilise pas de "crédits" car c'est du push automatique (git)
 * 4. Permet aux widgets GitHub Pages d'avoir les données fraîches
 * 
 * LANCEMENT:
 * npm run push:auto     # Pousse toutes les 5 minutes
 * npm run push:watch    # Pousse à chaque changement
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');
const PUSH_INTERVAL = 5 * 60 * 1000; // 5 minutes (configurable via --interval)

let lastConfig = {};
let lastPushTime = 0;

// ============================================================================
// DÉTECTE LES CHANGEMENTS
// ============================================================================

function hasChanged() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return false;

    const newConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    
    // Comparer total et timestamp
    if (lastConfig.total !== newConfig.total) {
      console.log(`✨ Changement détecté: ${lastConfig.total || 0}€ → ${newConfig.total}€`);
      lastConfig = newConfig;
      return true;
    }

    lastConfig = newConfig;
    return false;
  } catch (error) {
    console.error('⚠️  Erreur vérif changement:', error.message);
    return false;
  }
}

// ============================================================================
// POUSSE VERS GITHUB
// ============================================================================

function pushToGitHub() {
  try {
    const now = Date.now();
    
    // Limiter les push (pas plus d'un toutes les 30 secondes)
    if (now - lastPushTime < 30000) {
      console.log('⏳ Push trop rapide, on attendra...');
      return false;
    }

    console.log('\n🚀 Tentative de push GitHub...');

    // Vérifier s'il y a des changements à pusher
    const status = execSync('git status --porcelain', { cwd: __dirname }).toString();
    
    if (!status.includes('cagnotte_config.json')) {
      console.log('ℹ️  Aucun changement à pusher');
      return false;
    }

    // Stage + Commit
    console.log('📝 Commit en cours...');
    execSync(`git add cagnotte_config.json`, { cwd: __dirname, stdio: 'ignore' });
    
    const timestamp = new Date().toLocaleString('fr-FR');
    execSync(`git commit -m "🔄 Auto-sync cagnotte: ${timestamp}"`, { 
      cwd: __dirname, 
      stdio: 'ignore' 
    });

    // Push
    console.log('📤 Push en cours...');
    execSync('git push origin main', { 
      cwd: __dirname, 
      stdio: 'ignore' 
    });

    lastPushTime = now;
    console.log('✅ Push GitHub réussi! 🎉\n');
    return true;

  } catch (error) {
    console.error('⚠️  Erreur push:', error.message);
    return false;
  }
}

// ============================================================================
// MODE AUTO-PUSH (TOUTES LES 5 MIN)
// ============================================================================

function autoPush() {
  console.log('🔄 Mode AUTO-PUSH (toutes les 5 minutes)');
  console.log('Appuie Ctrl+C pour arrêter\n');

  // Premier check
  checkAndPush();

  // Ensuite toutes les X secondes
  setInterval(checkAndPush, PUSH_INTERVAL);
}

function checkAndPush() {
  if (hasChanged()) {
    pushToGitHub();
  } else {
    const date = new Date().toLocaleTimeString('fr-FR');
    console.log(`[${date}] Aucun changement`);
  }
}

// ============================================================================
// MODE WATCH (À CHAQUE CHANGEMENT)
// ============================================================================

function watchMode() {
  console.log('👁️  Mode WATCH (push à chaque changement)');
  console.log('Appuie Ctrl+C pour arrêter\n');

  // Watch le fichier
  fs.watchFile(CONFIG_FILE, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      setTimeout(() => {
        if (hasChanged()) {
          pushToGitHub();
        }
      }, 500); // Attendre 500ms avant de vérifier
    }
  });
}

// ============================================================================
// POINT D'ENTRÉE
// ============================================================================

const args = process.argv.slice(2);

console.log('═'.repeat(60));
console.log('🚀 AUTO-PUSH GITHUB - Synchronise cagnotte sur GitHub Pages');
console.log('═'.repeat(60));
console.log('');

if (args.includes('--watch')) {
  watchMode();
} else {
  // Mode auto par défaut
  autoPush();
}

// Gestion arrêt gracieux
process.on('SIGINT', () => {
  console.log('\n\n👋 Auto-push arrêté');
  process.exit(0);
});
