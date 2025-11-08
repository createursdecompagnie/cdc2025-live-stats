#!/usr/bin/env node

/**
 * =============================================================================
 * FIX GIT REPO - Répare un repo Git cassé/désynchronisé
 * =============================================================================
 * 
 * Utilisation:
 * node fix-git-repo.js
 * 
 * Ce script:
 * 1. Vérifier l'état du repo
 * 2. Si désynchronisé: force un sync
 * 3. Si sur mauvaise branche: bascule vers main
 * 4. Si changements non commités: nettoie
 * 5. Test un push
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('═'.repeat(70));
console.log('🔧 FIX GIT REPO - Synchronisation forcée');
console.log('═'.repeat(70));
console.log('');

function runCmd(cmd, label, allowFail = false) {
  console.log(`📍 ${label}`);
  console.log(`   $ ${cmd}`);
  try {
    const output = execSync(cmd, { 
      cwd: __dirname, 
      encoding: 'utf-8',
      stdio: 'pipe'
    }).toString().trim();
    
    if (output) {
      console.log(`   ✅ ${output.split('\n').slice(0, 3).join('\n      ')}`);
    } else {
      console.log('   ✅ Ok');
    }
    return true;
  } catch (error) {
    if (allowFail) {
      console.log(`   ⚠️  ${error.message.split('\n')[0]}`);
      return false;
    } else {
      console.error(`   ❌ ${error.message}`);
      throw error;
    }
  }
}

try {
  // 1. Vérifier que c'est un repo Git
  console.log('1️⃣  VÉRIFICATION REPO');
  console.log('─'.repeat(70));
  
  if (!fs.existsSync(path.join(__dirname, '.git'))) {
    console.error('❌ Pas un repo Git!');
    process.exit(1);
  }
  console.log('✅ Repo Git détecté\n');

  // 2. Vérifier branche actuelle
  console.log('2️⃣  VÉRIFIER BRANCHE');
  console.log('─'.repeat(70));
  
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString().trim();
  
  console.log(`   Branche actuelle: ${branch}`);
  
  if (branch !== 'main') {
    console.log(`   ⚠️  Pas sur 'main', basculer...`);
    runCmd('git checkout main', 'Basculer vers main');
  } else {
    console.log('   ✅ Déjà sur main');
  }
  console.log('');

  // 3. Vérifier changements non commités
  console.log('3️⃣  NETTOYER LES CHANGEMENTS');
  console.log('─'.repeat(70));
  
  const status = execSync('git status --porcelain', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString().trim();
  
  if (status) {
    console.log('   ⚠️  Fichiers non commités détectés:');
    status.split('\n').forEach(line => console.log(`      ${line}`));
    console.log('\n   Réinitialisation...');
    
    runCmd('git reset --hard HEAD', 'Reset hard vers HEAD', true);
    runCmd('git clean -fd', 'Nettoyer fichiers non tracés', true);
  } else {
    console.log('   ✅ Aucun changement à nettoyer');
  }
  console.log('');

  // 4. Fetch depuis origin
  console.log('4️⃣  SYNC DEPUIS GITHUB');
  console.log('─'.repeat(70));
  
  runCmd('git fetch origin', 'Fetch depuis origin');
  console.log('');

  // 5. Comparer local vs remote
  console.log('5️⃣  VÉRIFIER DIVERGENCE');
  console.log('─'.repeat(70));
  
  const localHash = execSync('git rev-parse HEAD', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString().trim();
  
  const remoteHash = execSync('git rev-parse origin/main', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString().trim();
  
  console.log(`   Local:  ${localHash.substring(0, 12)}`);
  console.log(`   Remote: ${remoteHash.substring(0, 12)}`);
  
  if (localHash !== remoteHash) {
    console.log('   ⚠️  Branches divergentes!');
    console.log('   🔄 Pull depuis remote...');
    runCmd('git pull origin main --no-edit', 'Pull origin/main');
  } else {
    console.log('   ✅ Branches synchronisées');
  }
  console.log('');

  // 6. Vérifier les branches de suivi
  console.log('6️⃣  VÉRIFIER SUIVI BRANCHES');
  console.log('─'.repeat(70));
  
  const trackingBranch = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString().trim();
  
  console.log(`   Branch suivi: ${trackingBranch}`);
  
  if (trackingBranch === '@{u}') {
    console.log('   ⚠️  Pas de branche de suivi!');
    console.log('   🔧 Configurer...');
    runCmd('git branch -u origin/main', 'Set upstream', true);
  } else {
    console.log('   ✅ Suivi configuré');
  }
  console.log('');

  // 7. Vérifier statut final
  console.log('7️⃣  STATUT FINAL');
  console.log('─'.repeat(70));
  
  const finalStatus = execSync('git status', {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  }).toString();
  
  console.log(finalStatus);
  console.log('');

  // 8. Test push
  console.log('8️⃣  TEST PUSH');
  console.log('─'.repeat(70));
  
  const configExists = fs.existsSync(path.join(__dirname, 'cagnotte_config.json'));
  if (!configExists) {
    console.log('   ℹ️  Pas de cagnotte_config.json à pusher');
  } else {
    console.log('   📝 Exemple test push:');
    console.log('      git add cagnotte_config.json');
    console.log('      git commit -m "Test"');
    console.log('      git push origin main');
    console.log('   (Ne pas exécuter automatiquement)');
  }
  console.log('');

  console.log('═'.repeat(70));
  console.log('✅ REPO SYNCHRONISÉ ET PRÊT!');
  console.log('═'.repeat(70));
  console.log('');
  console.log('Relancer auto-push-simple.js:');
  console.log('  node auto-push-simple.js');
  console.log('');

} catch (error) {
  console.error('\n❌ ERREUR:');
  console.error(error.message);
  console.error('\nBesoin d\'aide?');
  console.error('  Consulter: TROUBLESHOOT_MAC_PUSH.md');
  console.error('  Ou: node test-git-push.js');
  process.exit(1);
}
