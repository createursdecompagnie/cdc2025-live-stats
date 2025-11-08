#!/usr/bin/env node

/**
 * =============================================================================
 * LANCER TOUS LES SERVICES CDC2025
 * =============================================================================
 * Lance en parallèle:
 * 1. simple-sync.js (toutes les 30 secondes)
 * 2. auto-push-simple.js (toutes les 60 secondes)
 * =============================================================================
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║      🚀 SERVICES CDC2025 - DÉMARRAGE                 ║');
console.log('╚═══════════════════════════════════════════════════════╝');

const baseDir = __dirname;

// ============================================================================
// SIMPLE-SYNC: Toutes les 30 secondes
// ============================================================================
let syncRunning = false;

function runSync() {
  if (syncRunning) {
    console.log('⏳ Sync déjà en cours...');
    return;
  }

  syncRunning = true;
  console.log('\n📡 [SIMPLE-SYNC] Démarrage sync Streamlabel...');
  
  const child = spawn('node', [path.join(baseDir, 'simple-sync.js')]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    syncRunning = false;
    if (code === 0) {
      // Affiche seulement les lignes importantes
      const lines = output.split('\n');
      lines.forEach(line => {
        if (line.includes('📊') || line.includes('💰') || line.includes('✅')) {
          console.log('   ' + line);
        }
      });
    } else {
      console.error('   ❌ Erreur sync:', code);
    }
  });
}

// ============================================================================
// AUTO-PUSH: Toutes les 60 secondes
// ============================================================================
let pushRunning = false;

function runPush() {
  if (pushRunning) {
    console.log('⏳ Push déjà en cours...');
    return;
  }

  pushRunning = true;
  console.log('\n📤 [AUTO-PUSH] Vérification push GitHub...');
  
  const child = spawn('node', [path.join(baseDir, 'auto-push-simple.js')]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    pushRunning = false;
    if (code === 0) {
      // Affiche seulement les lignes importantes
      const lines = output.split('\n');
      lines.forEach(line => {
        if (line.includes('Rien à pousser') || line.includes('✅') || line.includes('PUSHED')) {
          console.log('   ' + line);
        }
      });
    } else {
      console.error('   ❌ Erreur push:', code);
    }
  });
}

// ============================================================================
// INITIALISATION
// ============================================================================
console.log('\n🔄 Boucle de services en cours...\n');
console.log('   • Simple-Sync: Toutes les 30 secondes');
console.log('   • Auto-Push:   Toutes les 60 secondes');
console.log('   • Serveur HTTP: http://localhost:3000\n');

// Lancer immédiatement
runSync();
setTimeout(() => runPush(), 10000);

// Puis en boucle
setInterval(runSync, 30 * 1000);
setInterval(runPush, 60 * 1000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt des services...');
  process.exit(0);
});
