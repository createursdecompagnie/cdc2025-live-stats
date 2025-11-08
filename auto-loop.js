#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const dir = __dirname;
let iteration = 0;

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║     🔄 BOUCLE AUTO-SYNC CAGNOTTE CDC2025             ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

function sync() {
  iteration++;
  const time = new Date().toLocaleTimeString('fr-FR');
  console.log(`\n[${time}] ⏱️  Itération ${iteration}`);
  
  try {
    console.log('  📡 Sync Streamlabel...');
    execSync(`node ${path.join(dir, 'simple-sync.js')}`, { stdio: 'inherit', cwd: dir });
  } catch (e) {
    console.error('  ❌ Erreur sync');
  }
  
  try {
    console.log('  📤 Push GitHub...');
    execSync(`node ${path.join(dir, 'auto-push-simple.js')}`, { stdio: 'inherit', cwd: dir });
  } catch (e) {
    console.error('  ❌ Erreur push');
  }
}

// Lancer toutes les 30 secondes
sync();
setInterval(sync, 30 * 1000);

process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt des services');
  process.exit(0);
});
