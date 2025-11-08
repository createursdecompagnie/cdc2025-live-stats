#!/usr/bin/env node

/**
 * =============================================================================
 * TEST GIT PUSH - Diagnostic du problème de push sur Mac mini
 * =============================================================================
 * 
 * Utilisation:
 * node test-git-push.js
 * 
 * Ce script teste:
 * 1. La configuration Git
 * 2. La connexion SSH/HTTPS
 * 3. Les permissions
 * 4. Le push effectif
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');

console.log('═'.repeat(70));
console.log('🔍 TEST DIAGNOSTIC GIT PUSH');
console.log('═'.repeat(70));
console.log('');

function runCommand(cmd, label) {
  console.log(`📍 ${label}`);
  console.log(`   Commande: ${cmd}`);
  try {
    const output = execSync(cmd, { 
      cwd: __dirname, 
      encoding: 'utf-8',
      stdio: 'pipe'
    }).toString().trim();
    console.log(`   ✅ Résultat:\n${output.split('\n').map(l => '      ' + l).join('\n')}`);
    return { success: true, output };
  } catch (error) {
    console.log(`   ❌ Erreur:\n${error.message.split('\n').map(l => '      ' + l).join('\n')}`);
    return { success: false, error: error.message };
  }
}

console.log('1️⃣  VÉRIFICATION BASIQUE');
console.log('─'.repeat(70));

// Vérifier répertoire courant
console.log(`📁 Répertoire courant: ${__dirname}`);
console.log(`   Fichiers:`, fs.readdirSync(__dirname).slice(0, 10).join(', '));
console.log('');

// Vérifier que c'est un repo Git
runCommand('git rev-parse --git-dir', 'Répertoire Git');
console.log('');

console.log('2️⃣  CONFIGURATION GIT');
console.log('─'.repeat(70));

runCommand('git config --get user.name', 'Utilisateur Git');
runCommand('git config --get user.email', 'Email Git');
runCommand('git config --get remote.origin.url', 'URL distante');
console.log('');

console.log('3️⃣  STATUT DU REPO');
console.log('─'.repeat(70));

runCommand('git status', 'Statut Git');
console.log('');

console.log('4️⃣  VÉRIFIER LES CERTIFICATS SSH (Mac)');
console.log('─'.repeat(70));

const sshKey = path.join(process.env.HOME || '/Users/user', '.ssh/id_rsa');
console.log(`📁 Clé SSH attendue: ${sshKey}`);
if (fs.existsSync(sshKey)) {
  console.log('   ✅ Clé SSH trouvée');
} else {
  console.log('   ❌ Clé SSH NON trouvée (peut causer l\'erreur)');
}

runCommand('ssh -T git@github.com 2>&1 || true', 'Connexion SSH GitHub');
console.log('');

console.log('5️⃣  TEST SIMPLE-SYNC.JS');
console.log('─'.repeat(70));

const CONFIG_EXISTS = fs.existsSync(CONFIG_FILE);
console.log(`📄 Config fichier existe: ${CONFIG_EXISTS ? '✅ OUI' : '❌ NON'}`);

if (CONFIG_EXISTS) {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    console.log(`   Total actuel: ${config.total}€`);
    console.log(`   Dernière mise à jour: ${config.lastModified}`);
  } catch (e) {
    console.log(`   ❌ Erreur lecture JSON: ${e.message}`);
  }
}
console.log('');

console.log('6️⃣  TEST PUSH DE TEST');
console.log('─'.repeat(70));

try {
  // Créer un fichier test
  const testFile = path.join(__dirname, '.test-push');
  fs.writeFileSync(testFile, `Test push - ${new Date().toISOString()}`);
  
  console.log('📝 Fichier test créé');
  
  // Ajouter et commit
  execSync('git add .test-push', { cwd: __dirname, stdio: 'pipe' });
  execSync('git commit -m "🧪 Test push auto-push-simple"', { cwd: __dirname, stdio: 'pipe' });
  console.log('📬 Commit test créé');
  
  // Push
  const pushResult = execSync('git push origin main 2>&1', { 
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log('✅ PUSH RÉUSSI!');
  console.log('   Output:', pushResult.trim());
  
  // Nettoyer
  execSync('git reset --soft HEAD~1', { cwd: __dirname, stdio: 'pipe' });
  fs.unlinkSync(testFile);
  console.log('🧹 Nettoyage effectué');
  
} catch (error) {
  console.log('❌ ERREUR PUSH:');
  console.log('   Message:', error.message);
  if (error.stderr) {
    console.log('   Stderr:', error.stderr.toString());
  }
  if (error.stdout) {
    console.log('   Stdout:', error.stdout.toString());
  }
}

console.log('');
console.log('═'.repeat(70));
console.log('📋 RÉSUMÉ DES PROBLÈMES POSSIBLES:');
console.log('═'.repeat(70));
console.log('');
console.log('1. ❌ SSH non configuré -> Générer clé SSH');
console.log('   ssh-keygen -t ed25519 -C "your_email@example.com"');
console.log('');
console.log('2. ❌ Credentials expirés -> Reconfigurer GitHub');
console.log('   git config --global user.email "your_email@example.com"');
console.log('   git config --global user.name "Your Name"');
console.log('');
console.log('3. ❌ Pas de permission de push -> Vérifier droits GitHub');
console.log('   Ajouter clé SSH publique sur GitHub');
console.log('');
console.log('4. ❌ Repo non bon -> Reconfigurer');
console.log('   git remote -v');
console.log('');
console.log('═'.repeat(70));
