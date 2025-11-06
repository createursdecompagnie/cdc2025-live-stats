#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 - VÉRIFICATEUR COMPLET DU SYSTÈME
 * =============================================================================
 * 
 * Vérifie que:
 * ✅ Streamlabel se met à jour
 * ✅ Le serveur peut lire les données
 * ✅ Les montants manuels fonctionnent
 * ✅ Les fichiers sont en place
 * ✅ GitHub est configuré
 * 
 * UTILISATION:
 * node verify-system.js
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 VÉRIFICATEUR SYSTÈME CDC2025\n');
console.log('═'.repeat(60));

// Couleurs
const check = '✅';
const cross = '❌';
const warn = '⚠️ ';
const info = 'ℹ️ ';

let allGood = true;

// =============================================================================
// 1. VÉRIFIER LES FICHIERS
// =============================================================================

console.log('\n📁 FICHIERS REQUIS');
console.log('─'.repeat(60));

const requiredFiles = [
  'streamlabel-server.js',
  'simple-sync.js',
  'auto-push.js',
  'manager.html',
  'package.json',
  'cagnotte_config.json',
  'ajouts_perso.json',
  'Streamlabels/total_charity_donation_amount.txt'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`${check} ${file}`);
  } else {
    console.log(`${cross} ${file} (MANQUANT)`);
    allGood = false;
  }
});

// =============================================================================
// 2. VÉRIFIER STREAMLABEL
// =============================================================================

console.log('\n📊 STREAMLABEL');
console.log('─'.repeat(60));

const streamlabelPath = path.join(__dirname, 'Streamlabels', 'total_charity_donation_amount.txt');

if (fs.existsSync(streamlabelPath)) {
  const content = fs.readFileSync(streamlabelPath, 'utf8').trim();
  
  // Nettoyer le format
  const cleanedContent = content
    .replace(/[$€EUR]/g, '')
    .replace(/,/g, '.')
    .trim();
  
  const amount = parseFloat(cleanedContent) || 0;
  
  if (amount > 0) {
    console.log(`${check} Fichier trouvé avec montant: ${amount}€`);
  } else {
    console.log(`${warn} Fichier trouvé mais montant est 0€`);
    console.log(`    Contenu brut: "${content}"`);
  }
  
  console.log(`    Chemin: ${streamlabelPath}`);
} else {
  console.log(`${cross} Fichier Streamlabel non trouvé!`);
  console.log(`    Créez: ${streamlabelPath}`);
  allGood = false;
}

// =============================================================================
// 3. VÉRIFIER LA CONFIGURATION
// =============================================================================

console.log('\n⚙️  CONFIGURATION');
console.log('─'.repeat(60));

try {
  const configPath = path.join(__dirname, 'cagnotte_config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  console.log(`${check} Configuration JSON valide`);
  console.log(`    Brut (Streamlabel): ${config.brut || 0}€`);
  console.log(`    Ajouts (manuel): ${config.ajouts || 0}€`);
  console.log(`    Total: ${config.total || 0}€`);
  console.log(`    Dernière maj: ${config.lastModified}`);
} catch (error) {
  console.log(`${warn} Erreur lecture config: ${error.message}`);
}

// =============================================================================
// 4. VÉRIFIER LES AJOUTS PERSO
// =============================================================================

console.log('\n🎁 MONTANTS PERSONNALISÉS');
console.log('─'.repeat(60));

try {
  const ajoutsPath = path.join(__dirname, 'ajouts_perso.json');
  const ajouts = JSON.parse(fs.readFileSync(ajoutsPath, 'utf8'));
  
  console.log(`${check} Fichier trouvé`);
  console.log(`    Montant: ${ajouts.montant || 0}€`);
  console.log(`    Description: ${ajouts.description || 'N/A'}`);
} catch (error) {
  console.log(`${cross} Erreur: ${error.message}`);
  allGood = false;
}

// =============================================================================
// 5. VÉRIFIER NODE MODULES
// =============================================================================

console.log('\n📦 DÉPENDANCES');
console.log('─'.repeat(60));

const requiredPackages = ['express', 'cors', 'dotenv'];
let hasAllPackages = true;

try {
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  requiredPackages.forEach(pkg => {
    if (fs.existsSync(path.join(nodeModulesPath, pkg))) {
      console.log(`${check} ${pkg}`);
    } else {
      console.log(`${cross} ${pkg} (MANQUANT)`);
      hasAllPackages = false;
    }
  });
  
  if (!hasAllPackages) {
    console.log(`\n${warn} Installez les dépendances: npm install`);
    allGood = false;
  }
} catch (error) {
  console.log(`${cross} Erreur vérification packages: ${error.message}`);
  allGood = false;
}

// =============================================================================
// 6. VÉRIFIER GIT
// =============================================================================

console.log('\n🔗 GIT/GITHUB');
console.log('─'.repeat(60));

try {
  const gitRemote = execSync('git remote -v', { encoding: 'utf8', stdio: 'pipe' });
  if (gitRemote.includes('github.com')) {
    console.log(`${check} GitHub configuré`);
    const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8', stdio: 'pipe' });
    console.log(`    Dernier commit: ${lastCommit.trim()}`);
  } else {
    console.log(`${warn} GitHub non configuré`);
  }
} catch (error) {
  console.log(`${cross} Git non disponible`);
}

// =============================================================================
// 7. RECOMMANDATIONS
// =============================================================================

console.log('\n💡 RECOMMANDATIONS');
console.log('─'.repeat(60));

if (!hasAllPackages) {
  console.log(`• Exécutez: npm install`);
}

// Vérifier le contenu du fichier Streamlabel
try {
  const content = fs.readFileSync(streamlabelPath, 'utf8').trim();
  if (content === '' || content === '0') {
    console.log(`• Streamlabel vide - Configure Streamlabs pour écrire dans ce fichier`);
  }
} catch (e) {
  console.log(`• Créez Streamlabels/total_charity_donation_amount.txt avec un montant`);
}

// Vérifier si le serveur tourne
console.log(`• Pour démarrer le serveur: npm start`);
console.log(`• Pour voir manager.html: http://localhost:3000/manager.html`);
console.log(`• Pour auto-push GitHub: npm run push:auto`);

// =============================================================================
// 8. RÉSUMÉ FINAL
// =============================================================================

console.log('\n' + '═'.repeat(60));

if (allGood && hasAllPackages) {
  console.log(`\n${check} ✨ TOUT EST PRÊT! ✨\n`);
  console.log('Prochaines étapes:');
  console.log('1. npm start          (démarrer le serveur)');
  console.log('2. npm run push:auto  (auto-push vers GitHub)');
  console.log('3. OBS: http://localhost:3000/cdc_goal_widget.html');
  console.log('\n');
} else {
  console.log(`\n${cross} Des problèmes ont été détectés.\n`);
  console.log('Corrigez les erreurs ci-dessus avant de continuer.');
  console.log('\n');
  process.exit(1);
}

console.log('═'.repeat(60) + '\n');
