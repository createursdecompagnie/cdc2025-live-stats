#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 LOCAL SERVER - Synchronisation Cagnotte en Temps Réel
 * =============================================================================
 * 
 * DESCRIPTION:
 * Serveur Node.js léger pour synchroniser les données Streamlabs Charity
 * vers les widgets OBS sans dépendre de GitHub Pages (pas de limites de requêtes)
 * 
 * INSTALLATION:
 * 1. Installer Node.js (https://nodejs.org) si pas déjà fait
 * 2. Placer ce fichier dans le dossier cdc2025-live-stats
 * 3. Installer dépendances: npm install express cors
 * 4. Lancer: node local-server.js
 * 5. Dans OBS, utiliser http://localhost:3000/ ou http://IP_MACHINE:3000/
 * 
 * ENDPOINTS:
 * GET  /cagnotte_config.json    → Retourne données cagnotte mises à jour
 * GET  /live_stats.json         → Retourne stats créateurs en direct
 * GET  /cdc_goal_widget.html    → Widget cagnotte (avec auto-refresh)
 * 
 * CONFIGURATION:
 * - PORT: 3000 (modifier ligne 55 si conflit)
 * - AUTO_UPDATE_INTERVAL: 5000ms (5 secondes)
 * 
 * DOSSIERS REQUIS:
 * - ./cagnotte_config.json
 * - ./out/live_stats.json
 * 
 * USAGE DANS OBS:
 * - Source navigateur: http://localhost:3000/cdc_goal_widget.html
 * - URL: http://IP_MACHINE:3000/cdc_goal_widget.html?fontScale=1.5&textColor=%23ffffff
 * 
 * =============================================================================
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const app = express();

const PORT = process.env.PORT || 3000;
const UPDATE_INTERVAL = 5000; // Mise à jour toutes les 5 secondes
const SYNC_INTERVAL = 30000; // Sync Streamlabs toutes les 30 secondes
const PUSH_INTERVAL = 300000; // Push GitHub toutes les 5 minutes

// Cache pour les données
let cagnotteCache = { brut: 0, ajouts: 0, total: 0, lastModified: new Date().toISOString() };
let statsCache = { members: [], total_viewers: 0, live_count: 0, lastModified: new Date().toISOString() };
let lastPushTime = 0;
let lastSyncTime = 0;

// Chemins fichiers
const cagnotteFile = path.join(__dirname, 'cagnotte_config.json');
const statsFile = path.join(__dirname, 'out', 'live_stats.json');
const syncScript = path.join(__dirname, 'sync-streamlabs.js');

console.log('🚀 CDC2025 LOCAL SERVER');
console.log('=' .repeat(60));
console.log(`📍 Serveur démarré sur http://localhost:${PORT}`);
console.log(`🔄 Refresh automatique: ${UPDATE_INTERVAL}ms`);
console.log('');
console.log('📡 Endpoints disponibles:');
console.log(`   http://localhost:${PORT}/cagnotte_config.json`);
console.log(`   http://localhost:${PORT}/live_stats.json`);
console.log(`   http://localhost:${PORT}/cdc_goal_widget.html`);
console.log('');
console.log('🎬 Utilisation dans OBS:');
console.log(`   Source navigateur → http://localhost:${PORT}/cdc_goal_widget.html`);
console.log('=' .repeat(60));

// ============================================================================
// FONCTION DE MISE À JOUR
// ============================================================================

function updateCagnotteData() {
  try {
    if (fs.existsSync(cagnotteFile)) {
      const data = JSON.parse(fs.readFileSync(cagnotteFile, 'utf8'));
      cagnotteCache = {
        brut: data.brut || 0,
        ajouts: data.ajouts || 0,
        lastModified: new Date().toISOString()
      };
      console.log(`✅ Cagnotte mise à jour: ${cagnotteCache.brut}€ + ${cagnotteCache.ajouts}€ = ${cagnotteCache.brut + cagnotteCache.ajouts}€`);
    }
  } catch (err) {
    console.error('❌ Erreur lecture cagnotte:', err.message);
  }
}

function updateStatsData() {
  try {
    if (fs.existsSync(statsFile)) {
      const data = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
      
      // Calculer les stats
      const members = data.members || [];
      let totalViewers = 0;
      let liveCount = 0;
      
      members.forEach(member => {
        if (member.is_live) {
          liveCount++;
          totalViewers += member.viewer_count || 0;
        }
      });
      
      statsCache = {
        members: members,
        total_viewers: totalViewers,
        live_count: liveCount,
        lastModified: new Date().toISOString()
      };
      
      console.log(`✅ Stats mises à jour: ${liveCount} live, ${totalViewers} viewers`);
    }
  } catch (err) {
    console.error('❌ Erreur lecture stats:', err.message);
  }
}

/**
 * Synchronise les données Streamlabs Charity
 * Exécute le script sync-streamlabs.js
 */
function syncStreamlabsData() {
  try {
    const now = Date.now();
    // Vérifier qu'on n'a pas synchronisé depuis moins de 5 secondes
    if (now - lastSyncTime < 5000) {
      return;
    }
    
    // Exécuter le script de sync
    try {
      // Utiliser require pour éviter les problèmes de processus
      const syncModule = require('./sync-streamlabs.js');
      // Le script s'exécute et met à jour cagnotte_config.json
    } catch (err) {
      console.warn('⚠️  Sync Streamlabs non disponible (sync-streamlabs.js)');
    }
    
    // Recharger les données mises à jour
    updateCagnotteData();
    lastSyncTime = now;
    
  } catch (err) {
    console.error('❌ Erreur sync Streamlabs:', err.message);
  }
}

/**
 * Push les changements vers GitHub
 */
function pushToGitHub() {
  try {
    const now = Date.now();
    // Vérifier qu'on n'a pas pushed depuis moins de 1 minute
    if (now - lastPushTime < 60000) {
      return;
    }
    
    // Vérifier s'il y a des changements
    const status = execSync('git status --porcelain', { cwd: __dirname }).toString();
    
    if (!status.includes('cagnotte_config.json')) {
      return; // Pas de changement
    }
    
    console.log('📤 Préparation push GitHub...');
    
    // Stage
    execSync(`git add "${cagnotteFile}"`, { cwd: __dirname, stdio: 'ignore' });
    
    // Commit
    const message = `🔄 Auto-sync cagnotte: ${new Date().toLocaleString('fr-FR')}`;
    execSync(`git commit -m "${message}"`, { cwd: __dirname, stdio: 'ignore' });
    
    // Push
    execSync('git push origin main', { cwd: __dirname, stdio: 'ignore' });
    
    console.log('✅ Push GitHub réussi!');
    lastPushTime = now;
    
  } catch (err) {
    console.warn('⚠️  Erreur push GitHub (serveur local fonctionne quand même):', err.message);
  }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Cagnotte config (mise à jour en temps réel)
app.get('/cagnotte_config.json', (req, res) => {
  updateCagnotteData();
  res.json(cagnotteCache);
});

// Stats créateurs (mise à jour en temps réel)
app.get('/live_stats.json', (req, res) => {
  updateStatsData();
  res.json(statsCache);
});

// Widget cagnotte avec refresh automatique
app.get('/cdc_goal_widget.html', (req, res) => {
  const widgetHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CDC2025 Cagnotte - Local</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
:root {
  --text: ${req.query.textColor || '#ffffff'};
  --accent: ${req.query.accentColor || '#FCA000'};
  --shadow-intensity: ${parseFloat(req.query.shadowIntensity || 0.4)};
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%;
  height: 100%;
  background: transparent;
  font-family: 'Outfit', ui-sans-serif, system-ui;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.amount {
  font-size: clamp(2em, 8vw, 5em);
  font-weight: 900;
  color: var(--text);
  letter-spacing: -1px;
  line-height: 1;
  text-shadow: 0 0 20px rgba(252, 160, 0, calc(var(--shadow-intensity) * 0.4));
  min-width: 200px;
  text-align: center;
  transition: all 0.3s ease;
}
</style>
</head>
<body>

<div class="amount" id="globalAmount">0 €</div>

<script>
const SHOW_CENTS = ${req.query.showCents === 'true' ? 'true' : 'false'};
let currentDisplayValue = 0;

function fmt(n) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: SHOW_CENTS ? 2 : 0,
    maximumFractionDigits: SHOW_CENTS ? 2 : 0
  }).format(n) + ' €';
}

async function updateAmount() {
  try {
    const res = await fetch('/cagnotte_config.json?t=' + Date.now());
    const data = await res.json();
    const total = (data.brut || 0) + (data.ajouts || 0);
    
    if (Math.abs(total - currentDisplayValue) > 0.01) {
      currentDisplayValue = total;
      document.getElementById('globalAmount').textContent = fmt(total);
      console.log('✅ Mise à jour:', fmt(total));
    }
  } catch (e) {
    console.error('Erreur update:', e);
  }
}

// Initial load et mise à jour toutes les 1 seconde
updateAmount();
setInterval(updateAmount, 1000);
</script>

</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(widgetHtml);
});

// Route par défaut (informations)
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>CDC2025 Local Server</title>
  <style>
    body { font-family: Arial; margin: 40px; background: #0b0f14; color: #f2f5f8; }
    h1 { color: #FCA000; }
    .endpoint { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 5px; font-family: monospace; }
    code { color: #FFE259; }
  </style>
</head>
<body>
  <h1>🐾 CDC2025 Local Server</h1>
  <p>Serveur de synchronisation cagnotte - Refresh local sans limites GitHub</p>
  
  <h2>📡 Endpoints disponibles:</h2>
  <div class="endpoint">GET <code>/cagnotte_config.json</code> - Données cagnotte (brut + ajouts)</div>
  <div class="endpoint">GET <code>/live_stats.json</code> - Stats créateurs en direct</div>
  <div class="endpoint">GET <code>/cdc_goal_widget.html</code> - Widget cagnotte avec refresh auto</div>
  
  <h2>🎬 Utilisation dans OBS:</h2>
  <p>Source navigateur: <code>http://localhost:3000/cdc_goal_widget.html</code></p>
  
  <h2>🔧 Paramètres URL:</h2>
  <div class="endpoint">?textColor=%23ffffff - Couleur du texte</div>
  <div class="endpoint">?accentColor=%23ff0000 - Couleur accent</div>
  <div class="endpoint">?shadowIntensity=0.8 - Intensité ombre</div>
  <div class="endpoint">?showCents=true - Afficher centimes</div>
  
  <h2>📁 Fichiers attendus:</h2>
  <ul>
    <li><code>./cagnotte_config.json</code></li>
    <li><code>./out/live_stats.json</code></li>
  </ul>
  
  <h2>⚙️ Configuration:</h2>
  <ul>
    <li>PORT: ${PORT}</li>
    <li>Refresh interval: ${UPDATE_INTERVAL}ms</li>
  </ul>
</body>
</html>
  `);
});

// ============================================================================
// DÉMARRAGE
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n✅ Serveur prêt sur http://localhost:${PORT}\n`);
  
  // Mise à jour initiale
  updateCagnotteData();
  updateStatsData();
  
  // Mise à jour périodique des données locales (5 secondes)
  setInterval(() => {
    updateCagnotteData();
    updateStatsData();
  }, UPDATE_INTERVAL);
  
  // Synchronisation Streamlabs (30 secondes)
  console.log('🔄 Sync Streamlabs activée (toutes les 30 secondes)');
  setInterval(() => {
    syncStreamlabsData();
  }, SYNC_INTERVAL);
  
  // Push GitHub (5 minutes) - OPTIONNEL
  // Décommenter pour activer
  /*
  console.log('📤 Push GitHub activé (toutes les 5 minutes)');
  setInterval(() => {
    pushToGitHub();
  }, PUSH_INTERVAL);
  */
});

// Gestion arrêt gracieux
process.on('SIGINT', () => {
  console.log('\n\n👋 Serveur arrêté');
  process.exit(0);
});
