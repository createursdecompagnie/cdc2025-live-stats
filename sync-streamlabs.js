#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 STREAMLABS SYNC - Synchronisation Cagnotte Temps Réel
 * =============================================================================
 * 
 * DESCRIPTION:
 * Script qui récupère les données Streamlabs Charity et les fusionne
 * avec les ajouts perso (t-shirts) pour une cagnotte complète et à jour.
 * 
 * UTILISATION:
 * 1. npm install axios dotenv
 * 2. Configurer les variables d'environnement ou créer .env
 * 3. node sync-streamlabs.js
 * 
 * OU UTILISATION CONTINUE (recommandée):
 * npm run sync:watch    # Synchronise toutes les 30 secondes
 * npm run sync:push     # Sync + push sur GitHub toutes les 5 minutes
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration Streamlabs
const STREAMLABS_TOKEN = process.env.STREAMLABS_TOKEN || '03311CF526D2843D8B1C';
const STREAMLABS_CLIENT_ID = process.env.STREAMLABS_CLIENT_ID || 'a049e2d6-3f9e-4c83-afd4-f2c81f0cb140';
const STREAMLABS_SECRET = process.env.STREAMLABS_SECRET || 'k6QImjdo1S39MR0lC9VUq87fn8bZZ5cKOmDd5QEO';

// Chemins fichiers
const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');
const MANAGER_FILE = path.join(__dirname, 'cagnotte_manager.html');
const LOG_FILE = path.join(__dirname, 'sync.log');

// Colors pour logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

/**
 * Log avec timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  
  if (type === 'error') color = colors.red;
  else if (type === 'success') color = colors.green;
  else if (type === 'warn') color = colors.yellow;
  else if (type === 'info') color = colors.blue;
  
  const formattedMessage = `${color}[${timestamp}] ${message}${colors.reset}`;
  console.log(formattedMessage);
  
  // Log aussi dans fichier
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
}

/**
 * Récupère les données Streamlabs Charity
 * https://streamlabs.com/api-docs
 */
async function fetchStreamlabsData() {
  try {
    log('📡 Récupération données Streamlabs Charity...', 'info');
    
    // NOTE: L'API Streamlabs Charity n'expose pas directement le montant via l'API publique
    // On doit utiliser une autre approche: scraper le widget ou utiliser l'API interne
    
    // Pour maintenant, on va faire un fetch simple du token
    // À terme, cela dépend de l'API Streamlabs disponible
    
    const url = `https://streamlabs.com/api/v1.0/charity?token=${STREAMLABS_TOKEN}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Streamlabs API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    log(`✅ Données Streamlabs récupérées: ${data.brut || 0}€`, 'success');
    
    return {
      brut: data.brut || 0,
      source: 'streamlabs',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    log(`❌ Erreur Streamlabs: ${error.message}`, 'error');
    // Retourner zéro en cas d'erreur
    return {
      brut: 0,
      source: 'streamlabs',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Extrait les données du cagnotte_manager.html
 * (Les ajouts perso: t-shirts, etc)
 */
function extractAjoutsFromManager() {
  try {
    if (!fs.existsSync(MANAGER_FILE)) {
      log('⚠️  Fichier cagnotte_manager.html non trouvé', 'warn');
      return { ajouts: 0, details: [] };
    }
    
    const content = fs.readFileSync(MANAGER_FILE, 'utf8');
    
    // Chercher les données stockées en localStorage dans le HTML
    // Pattern: localStorage setItem avec 'cdc_ajouts_'
    const ajoutsMatch = content.match(/"cdc_ajouts_total"\s*:\s*(\d+(?:\.\d+)?)/);
    const ajouts = ajoutsMatch ? parseFloat(ajoutsMatch[1]) : 0;
    
    if (ajouts > 0) {
      log(`📊 Ajouts personnalisés trouvés: ${ajouts}€`, 'info');
    }
    
    return {
      ajouts: ajouts,
      source: 'manager',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    log(`❌ Erreur lecture manager: ${error.message}`, 'error');
    return { ajouts: 0, error: error.message };
  }
}

/**
 * Lit le fichier cagnotte_config.json actuel
 */
function readCurrentConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { brut: 0, ajouts: 0, lastModified: new Date().toISOString() };
    }
    
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    log(`⚠️  Erreur lecture config actuelle: ${error.message}`, 'warn');
    return { brut: 0, ajouts: 0, lastModified: new Date().toISOString() };
  }
}

/**
 * Fusionne les données Streamlabs + ajouts perso
 */
async function mergeCagnotteData() {
  try {
    log('🔄 Fusion des données...', 'info');
    
    // Récupérer les données
    const streamlabsData = await fetchStreamlabsData();
    const ajoutsData = extractAjoutsFromManager();
    const currentConfig = readCurrentConfig();
    
    // Créer nouvelle config
    const newConfig = {
      brut: streamlabsData.brut || currentConfig.brut,
      ajouts: ajoutsData.ajouts || currentConfig.ajouts,
      total: (streamlabsData.brut || 0) + (ajoutsData.ajouts || 0),
      lastModified: new Date().toISOString(),
      sources: {
        streamlabs: {
          value: streamlabsData.brut || 0,
          timestamp: streamlabsData.timestamp,
          status: streamlabsData.error ? 'error' : 'ok'
        },
        manager: {
          value: ajoutsData.ajouts || 0,
          timestamp: ajoutsData.timestamp,
          status: ajoutsData.error ? 'error' : 'ok'
        }
      }
    };
    
    // Vérifier si changement
    const hasChanged = 
      newConfig.brut !== currentConfig.brut ||
      newConfig.ajouts !== currentConfig.ajouts;
    
    if (hasChanged) {
      log(`✨ Changement détecté!`, 'info');
      log(`   Avant: ${currentConfig.brut}€ + ${currentConfig.ajouts}€ = ${(currentConfig.brut + currentConfig.ajouts)}€`, 'info');
      log(`   Après: ${newConfig.brut}€ + ${newConfig.ajouts}€ = ${newConfig.total}€`, 'success');
    } else {
      log(`✅ Pas de changement (${newConfig.total}€)`, 'info');
    }
    
    return { newConfig, hasChanged };
  } catch (error) {
    log(`❌ Erreur fusion: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Sauvegarde le fichier cagnotte_config.json
 */
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    log(`💾 Config sauvegardée: ${CONFIG_FILE}`, 'success');
    return true;
  } catch (error) {
    log(`❌ Erreur sauvegarde: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Push les changements sur GitHub
 */
async function pushToGitHub() {
  try {
    const { execSync } = require('child_process');
    
    log('🚀 Push vers GitHub...', 'info');
    
    // Vérifier si git existe
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch {
      log('❌ Git non installé, impossible de pusher', 'error');
      return false;
    }
    
    // Stage le fichier
    execSync(`git add "${CONFIG_FILE}"`, { cwd: __dirname });
    
    // Vérifier s'il y a des changements
    const status = execSync('git status --porcelain', { cwd: __dirname }).toString();
    if (!status.includes('cagnotte_config.json')) {
      log('ℹ️  Aucun changement à pusher', 'info');
      return true;
    }
    
    // Commit
    const message = `🔄 Auto-sync cagnotte: ${new Date().toLocaleString('fr-FR')}`;
    execSync(`git commit -m "${message}"`, { cwd: __dirname });
    
    // Push
    execSync('git push origin main', { cwd: __dirname });
    
    log('✅ Push GitHub réussi!', 'success');
    return true;
  } catch (error) {
    log(`⚠️  Erreur push GitHub: ${error.message}`, 'warn');
    // Continuer même si le push échoue (le serveur local fonctionne quand même)
    return false;
  }
}

/**
 * Main: Synchroniser une fois
 */
async function syncOnce() {
  try {
    log('═══════════════════════════════════════════════════════════', 'info');
    log('🎬 SYNCHRONISATION CDC2025 CAGNOTTE', 'info');
    log('═══════════════════════════════════════════════════════════', 'info');
    
    const { newConfig, hasChanged } = await mergeCagnotteData();
    
    if (saveConfig(newConfig)) {
      if (hasChanged && process.argv.includes('--push')) {
        await pushToGitHub();
      }
    }
    
    log('═══════════════════════════════════════════════════════════', 'info');
    return newConfig;
  } catch (error) {
    log(`💥 Erreur: ${error.message}`, 'error');
    process.exit(1);
  }
}

/**
 * Mode watch: Synchroniser toutes les 30 secondes
 */
async function syncWatch() {
  log('👁️  Mode WATCH: Synchronisation toutes les 30 secondes', 'info');
  log('Appuie Ctrl+C pour arrêter', 'info');
  
  // Première sync tout de suite
  await syncOnce();
  
  // Puis répéter
  setInterval(syncOnce, 30000);
}

/**
 * Mode watch + push: Sync toutes les 30s, push toutes les 5min
 */
async function syncWatchWithPush() {
  log('👁️  Mode WATCH+PUSH: Sync 30s, push toutes les 5 min', 'info');
  log('Appuie Ctrl+C pour arrêter', 'info');
  
  let pushCounter = 0;
  
  // Première sync tout de suite
  await syncOnce();
  
  // Puis répéter
  setInterval(async () => {
    pushCounter++;
    
    const { newConfig, hasChanged } = await mergeCagnotteData();
    if (saveConfig(newConfig)) {
      // Push tous les 10 cycles (30s * 10 = 5 min)
      if (pushCounter % 10 === 0 && hasChanged) {
        await pushToGitHub();
      }
    }
  }, 30000);
}

/**
 * Point d'entrée
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--watch')) {
    await syncWatch();
  } else if (args.includes('--push')) {
    await syncWatchWithPush();
  } else {
    // Sync une fois
    await syncOnce();
  }
}

// Lancer si c'est le fichier principal
if (require.main === module) {
  main().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { mergeCagnotteData, saveConfig, pushToGitHub };
