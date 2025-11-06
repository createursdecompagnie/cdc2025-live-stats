#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 - DIAGNOSTIC TOOL
 * =============================================================================
 * 
 * Vérifier la synchronisation des données et des endpoints
 * 
 * USAGE:
 * node diagnostic.js [local|github|all]
 * 
 * EXEMPLES:
 * node diagnostic.js              # Vérifier tout (local + GitHub)
 * node diagnostic.js local        # Vérifier seulement le serveur local
 * node diagnostic.js github       # Vérifier seulement GitHub Pages
 * 
 * =============================================================================
 */

const http = require('http');
const https = require('https');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, text) {
  console.log(`${COLORS[color]}${text}${COLORS.reset}`);
}

function header(text) {
  log('bright', '\n' + '='.repeat(70));
  log('cyan', text);
  log('bright', '='.repeat(70));
}

function success(text) {
  log('green', `✅ ${text}`);
}

function error(text) {
  log('red', `❌ ${text}`);
}

function warning(text) {
  log('yellow', `⚠️  ${text}`);
}

function info(text) {
  log('blue', `ℹ️  ${text}`);
}

// ============================================================================
// FETCH HELPER
// ============================================================================

function fetchUrl(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          time: Date.now()
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// ============================================================================
// CHECK FUNCTIONS
// ============================================================================

async function checkLocalServer() {
  header('🖥️  SERVEUR LOCAL (http://localhost:3000)');
  
  const endpoints = [
    { name: 'Cagnotte', url: 'http://localhost:3000/cagnotte_config.json' },
    { name: 'Stats', url: 'http://localhost:3000/live_stats.json' },
    { name: 'Widget', url: 'http://localhost:3000/cdc_goal_widget.html' }
  ];
  
  for (const endpoint of endpoints) {
    process.stdout.write(`  Vérification ${endpoint.name}... `);
    try {
      const startTime = Date.now();
      const response = await fetchUrl(endpoint.url, 3000);
      const latency = Date.now() - startTime;
      
      if (response.status === 200) {
        success(`OK (${latency}ms)`);
        
        try {
          const json = JSON.parse(response.data);
          if (endpoint.name === 'Cagnotte') {
            info(`  → Cagnotte: ${json.brut}€ + ${json.ajouts}€ = ${json.brut + json.ajouts}€`);
            info(`  → Dernier update: ${json.lastModified}`);
          } else if (endpoint.name === 'Stats') {
            const liveCount = json.live_count || 0;
            const viewers = json.total_viewers || 0;
            info(`  → En direct: ${liveCount}, Viewers: ${viewers}`);
          }
        } catch (e) {
          // HTML response
        }
      } else {
        error(`Status ${response.status}`);
      }
    } catch (e) {
      error(`${e.message} - Le serveur local n'est pas accessible`);
      warning(`Assurez-vous qu'il est lancé: node local-server.js`);
    }
  }
}

async function checkGitHub() {
  header('🌐 GITHUB PAGES (GitHub CDN)');
  
  const endpoints = [
    { 
      name: 'Cagnotte Config',
      url: 'https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json'
    },
    {
      name: 'Live Stats',
      url: 'https://createursdecompagnie.github.io/cdc2025-live-stats/live_stats.json'
    },
    {
      name: 'Widget CDN',
      url: 'https://createursdecompagnie.github.io/cdc2025-live-stats/cdc_goal_widget.html'
    }
  ];
  
  for (const endpoint of endpoints) {
    process.stdout.write(`  Vérification ${endpoint.name}... `);
    try {
      const startTime = Date.now();
      const response = await fetchUrl(endpoint.url, 10000);
      const latency = Date.now() - startTime;
      
      if (response.status === 200) {
        success(`OK (${latency}ms)`);
        
        try {
          const json = JSON.parse(response.data);
          if (endpoint.name === 'Cagnotte Config') {
            info(`  → Cagnotte: ${json.brut}€ + ${json.ajouts}€ = ${json.brut + json.ajouts}€`);
            info(`  → Dernier update: ${json.lastModified}`);
          } else if (endpoint.name === 'Live Stats') {
            const members = json.members ? json.members.length : 0;
            info(`  → Créateurs: ${members}`);
          }
        } catch (e) {
          // HTML response
        }
      } else {
        error(`Status ${response.status}`);
      }
    } catch (e) {
      error(`${e.message}`);
      warning(`GitHub Pages n'est pas accessible (vérifier la connexion Internet)`);
    }
  }
  
  info('\n⚠️  LIMITES GITHUB:');
  info('  • API limit: 60 requêtes/heure (non-authentifiées)');
  info('  • Latence: +200-500ms (CDN global)');
  info('  • Cache: Peut être vieux de 1-5 min');
}

async function compareData() {
  header('🔍 COMPARAISON DONNÉES');
  
  try {
    const localRes = await fetchUrl('http://localhost:3000/cagnotte_config.json', 3000);
    const local = JSON.parse(localRes.data);
    
    const githubRes = await fetchUrl(
      'https://raw.githubusercontent.com/createursdecompagnie/cdc2025-live-stats/main/cagnotte_config.json',
      10000
    );
    const github = JSON.parse(githubRes.data);
    
    const localTotal = local.brut + local.ajouts;
    const githubTotal = github.brut + github.ajouts;
    const diff = localTotal - githubTotal;
    
    log('bright', '\n  SERVEUR LOCAL:');
    info(`  Brut: ${local.brut}€`);
    info(`  Ajouts: ${local.ajouts}€`);
    info(`  Total: ${localTotal}€`);
    
    log('bright', '\n  GITHUB PAGES:');
    info(`  Brut: ${github.brut}€`);
    info(`  Ajouts: ${github.ajouts}€`);
    info(`  Total: ${githubTotal}€`);
    
    log('bright', '\n  DIFFÉRENCE:');
    if (Math.abs(diff) > 0.01) {
      warning(`  Écart: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}€`);
      warning(`  ⚠️  Les données ne sont pas synchronisées!`);
      info(`  → Le serveur local est plus à jour`);
    } else {
      success(`  Données identiques ✓`);
    }
  } catch (e) {
    error(`Erreur comparaison: ${e.message}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const mode = process.argv[2] || 'all';
  
  log('bright', '\n🐾 CDC2025 - OUTIL DIAGNOSTIC\n');
  
  try {
    if (mode === 'local' || mode === 'all') {
      await checkLocalServer();
    }
    
    if (mode === 'github' || mode === 'all') {
      await checkGitHub();
    }
    
    if (mode === 'all') {
      await compareData();
    }
  } catch (e) {
    error(`Erreur globale: ${e.message}`);
  }
  
  header('✅ DIAGNOSTIC TERMINÉ');
  log('blue', '💡 Recommandation: Utiliser le serveur local pour un refresh optimal!\n');
}

main().catch(e => {
  error(`Erreur: ${e.message}`);
  process.exit(1);
});
