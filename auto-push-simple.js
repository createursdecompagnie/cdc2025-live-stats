#!/usr/bin/env node

/**
 * =============================================================================
 * AUTO-PUSH GITHUB - Pousse cagnotte_config.json automatiquement
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to run shell commands and capture stdout/stderr
function runCmd(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', ...opts });
    return { success: true, output: out.toString() };
  } catch (err) {
    return {
      success: false,
      error: err,
      output: (err.stdout || err.stdout === '' ? err.stdout : '') + (err.stderr || err.stderr === '' ? err.stderr : ''),
    };
  }
}

const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');
const PUSH_INTERVAL = 60 * 1000; // 1 minutes

let lastPushedTotal = null;

console.log('═'.repeat(70));
console.log('🚀 AUTO-PUSH GITHUB - Synchronise cagnotte_config.json toutes les 30 sec');
console.log('═'.repeat(70));
console.log(`📍 Dossier: ${__dirname}`);
console.log(`⏱️  Intervalle: 4 minutes (moins fréquent pour éviter les pushes trop rapprochés)`);
console.log('═'.repeat(70));
console.log('');

function readCurrentTotal() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return null;
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return config.total;
  } catch (e) {
    return null;
  }
}

function pushToGithub() {
  try {
    const currentTotal = readCurrentTotal();
    
    if (currentTotal === null) {
      console.log('⚠️  Impossible de lire cagnotte_config.json');
      return false;
    }

    if (currentTotal === lastPushedTotal) {
      console.log(`ℹ️  Montant inchangé (${currentTotal}€), pas de push`);
      return false;
    }

    console.log(`\n🔄 Montant changé: ${lastPushedTotal}€ → ${currentTotal}€`);

    // ========================================================================
    // 1. VÉRIFIER LA BRANCHE ACTUELLE
    // ========================================================================
    console.log('� Vérification branche...');
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
        cwd: __dirname, 
        encoding: 'utf-8',
        stdio: 'pipe'
      }).toString().trim();
      
      console.log(`   Branche actuelle: ${branch}`);
      
      if (branch !== 'main') {
        console.error(`❌ ERREUR: Sur la branche '${branch}', pas 'main'!`);
        console.error('   Basculer vers main: git checkout main');
        return false;
      }
    } catch (e) {
      console.error('❌ Erreur vérification branche:', e.message);
      return false;
    }

    // ========================================================================
    // 2. FETCH LES DERNIÈRES INFOS DE GITHUB (diagnostic plus verbeux)
    // ========================================================================
    console.log('📥 Fetch depuis GitHub...');
    const fetchRes = runCmd('git fetch origin main', { cwd: __dirname });
    if (fetchRes.success) {
      console.log('   ✅ Fetch réussi');
    } else {
      console.error('⚠️  Erreur fetch:', fetchRes.error?.message || fetchRes.output || 'unknown');
      // Pas bloquant, on continue (les prochaines étapes donneront plus d'infos)
    }

    // ========================================================================
    // 3. VÉRIFIER SI ON EST À JOUR
    // ========================================================================
    console.log('📊 Vérification si synchronisé...');
    try {
      const localHashRes = runCmd('git rev-parse HEAD', { cwd: __dirname });
      const remoteHashRes = runCmd('git rev-parse origin/main', { cwd: __dirname });

      const localHash = localHashRes.success ? localHashRes.output.trim() : null;
      const remoteHash = remoteHashRes.success ? remoteHashRes.output.trim() : null;

      if (!localHash || !remoteHash) {
        console.log('   ⚠️  Impossible de déterminer les hashes (local/remote).');
      } else if (localHash !== remoteHash) {
        console.log(`   ⚠️  Local et Remote différents!`);
        console.log(`      Local:  ${localHash.substring(0, 8)}`);
        console.log(`      Remote: ${remoteHash.substring(0, 8)}`);
        console.log('   🔄 Pull --rebase depuis GitHub (tentative de rebase, plus propre)...');

        const pullRes = runCmd('git pull --rebase --autostash origin main', { cwd: __dirname });
        if (pullRes.success) {
          console.log('   ✅ Pull --rebase réussi (données à jour)');
        } else {
          console.error('⚠️  Erreur pull --rebase:', pullRes.error?.message || pullRes.output || 'unknown');
          console.error('   Si conflit, résoudre manuellement. Tentative de pousser annulée pour éviter pertes.');
          // Abort rebase if partial
          runCmd('git rebase --abort', { cwd: __dirname });
          return false;
        }
      } else {
        console.log('   ✅ Branche à jour');
      }
    } catch (e) {
      console.error('⚠️  Erreur vérification sync:', e.message);
    }

    // ========================================================================
    // 4. PRÉPARER LE COMMIT
    // ========================================================================
    console.log('📝 Préparation commit...');
    
    // Préparer commit
    runCmd('git reset HEAD .', { cwd: __dirname });
    runCmd('git add cagnotte_config.json', { cwd: __dirname });

    const diffRes = runCmd('git diff --cached --name-only', { cwd: __dirname });
    const diff = diffRes.success ? diffRes.output.trim() : '';

    if (!diff.includes('cagnotte_config.json')) {
      console.log('   ℹ️  Aucune modification à pusher');
      return false;
    }

    const timestamp = new Date().toLocaleString('fr-FR');
    const commitMsg = `🔄 Auto-sync: ${currentTotal}€ - ${timestamp}`;

    const commitRes = runCmd(`git commit -m "${commitMsg}"`, { cwd: __dirname });
    if (!commitRes.success) {
      console.error('⚠️  Erreur commit:', commitRes.error?.message || commitRes.output || 'unknown');
      return false;
    }
    console.log(`   ✅ Commit: ${commitMsg}`);

    // ========================================================================
    // 5. PUSH VERS GITHUB
    // ========================================================================
    console.log('🚀 Push vers GitHub...');
    // Try push, and on non-fast-forward attempt pull --rebase and retry once
    console.log('🚀 Push vers GitHub... (tentative)');
    const pushRes = runCmd('git push origin main', { cwd: __dirname });
    if (pushRes.success) {
      console.log('   📤 Output:', pushRes.output.trim());
      lastPushedTotal = currentTotal;
      console.log(`✅ PUSH RÉUSSI! GitHub mis à jour à ${currentTotal}€\n`);
      return true;
    }

    const pushOutput = pushRes.output || '';
    console.error('❌ Erreur push GitHub:', pushRes.error?.message || pushOutput.trim() || 'unknown');

    // Detect common non-fast-forward / rejected messages and try automatic recovery
    const retryKeywords = ['non-fast-forward', 'rejected', 'fetch first', 'remote contains work that you do not have locally'];
    if (retryKeywords.some(k => (pushOutput + (pushRes.error?.message || '')).toLowerCase().includes(k))) {
      console.log('   ⚠️  Push rejeté - tentative de pull --rebase puis re-push...');
      const pullRes2 = runCmd('git pull --rebase --autostash origin main', { cwd: __dirname });
      if (!pullRes2.success) {
        console.error('   ❌ Echec du pull --rebase automatique:', pullRes2.error?.message || pullRes2.output || 'unknown');
        runCmd('git rebase --abort', { cwd: __dirname });
        return false;
      }

      // retry push
      const pushRes2 = runCmd('git push origin main', { cwd: __dirname });
      if (pushRes2.success) {
        console.log('   ✅ Push réussi après rebase/pull');
        lastPushedTotal = currentTotal;
        return true;
      }

      console.error('   ❌ Toujours impossible de pusher après rebase:', pushRes2.error?.message || pushRes2.output || 'unknown');
      console.error('   Suggestion: se connecter sur la machine et faire un `git status`, résoudre les conflits puis `git push` manuellement.');
      return false;
    }

    // Other push errors (auth, protected branch, etc.)
    console.error('   ❌ Push failed (non recoverable automatically). Détails:', pushOutput.trim());
    return false;

  } catch (error) {
    console.error(`❌ Erreur générale: ${error.message}`);
    console.error('');
    return false;
  }
}

console.log('🔍 Vérification initiale...\n');
pushToGithub();

setInterval(() => {
  console.log(`\n⏰ Vérification à ${new Date().toLocaleTimeString('fr-FR')}`);
  pushToGithub();
}, PUSH_INTERVAL);

process.on('SIGINT', () => {
  console.log('\n\n👋 Auto-push arrêté');
  process.exit(0);
});
