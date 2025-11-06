#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 - SERVEUR SIMPLE POUR STREAMLABEL
 * =============================================================================
 * 
 * Ce serveur:
 * 1. Lit Streamlabels/total_charity_donation_amount.txt (données Streamlabel)
 * 2. Lit ajouts_perso.json (tes ajouts personnalisés)
 * 3. Met à jour cagnotte_config.json en temps réel
 * 4. Sert les données aux widgets
 * 5. GitHub Pages est mis à jour régulièrement (push git)
 * 
 * LANCEMENT:
 * npm start
 * 
 * =============================================================================
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const UPDATE_INTERVAL = 5000; // Mise à jour toutes les 5 secondes

// Cache
let cagnotteCache = { brut: 0, ajouts: 0, total: 0, lastModified: new Date().toISOString() };

// Chemins fichiers
const STREAMLABEL_FILE = path.join(__dirname, 'Streamlabels', 'total_charity_donation_amount.txt');
const AJOUTS_FILE = path.join(__dirname, 'ajouts_perso.json');
const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');

console.log('🚀 CDC2025 SERVEUR LOCAL');
console.log('═'.repeat(60));
console.log(`📍 http://localhost:${PORT}`);
console.log(`🔄 Actualisation: ${UPDATE_INTERVAL}ms`);
console.log(`📡 Streamlabel: ${STREAMLABEL_FILE}`);
console.log(`🎁 Ajouts perso: ${AJOUTS_FILE}`);
console.log('═'.repeat(60));

// Middleware CORS
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// ============================================================================
// FONCTIONS DE LECTURE/MISE À JOUR
// ============================================================================

function readStreamlabelAmount() {
  try {
    if (!fs.existsSync(STREAMLABEL_FILE)) {
      return 0;
    }
    let content = fs.readFileSync(STREAMLABEL_FILE, 'utf8').trim();
    
    // Nettoyer le format: enlever $, EUR, espaces, virgules
    content = content
      .replace(/[$€EUR]/g, '')  // Enlever symboles monétaires
      .replace(/,/g, '.')        // Remplacer virgules par points
      .trim();
    
    return parseFloat(content) || 0;
  } catch (error) {
    console.error('❌ Erreur lecture Streamlabel:', error.message);
    return 0;
  }
}

function readAjoutsPerso() {
  try {
    if (!fs.existsSync(AJOUTS_FILE)) {
      return { montant: 0, description: '' };
    }
    const data = JSON.parse(fs.readFileSync(AJOUTS_FILE, 'utf8'));
    return { montant: data.montant || 0, description: data.description || '' };
  } catch (error) {
    console.error('⚠️  Erreur lecture ajouts:', error.message);
    return { montant: 0, description: '' };
  }
}

function updateCagnotteData() {
  try {
    const streamlabAmount = readStreamlabelAmount();
    const ajoutsData = readAjoutsPerso();
    
    const oldTotal = cagnotteCache.total;
    
    cagnotteCache = {
      brut: streamlabAmount,
      ajouts: ajoutsData.montant,
      total: streamlabAmount + ajoutsData.montant,
      lastModified: new Date().toISOString(),
      sources: {
        streamlabel: streamlabAmount,
        perso: ajoutsData.montant
      }
    };

    // Sauvegarder aussi dans le fichier
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cagnotteCache, null, 2), 'utf8');

    // Log si changement
    if (cagnotteCache.total !== oldTotal) {
      console.log(`\n✨ CHANGEMENT: ${oldTotal}€ → ${cagnotteCache.total}€`);
      console.log(`   Streamlabel: ${streamlabAmount}€ | Ajouts: ${ajoutsData.montant}€\n`);
    }

  } catch (err) {
    console.error('❌ Erreur mise à jour:', err.message);
  }
}

// ============================================================================
// ROUTES
// ============================================================================

// Données cagnotte (lecture directe Streamlabel)
app.get('/cagnotte_config.json', (req, res) => {
  updateCagnotteData();
  res.json(cagnotteCache);
});

// Met à jour les ajouts perso (via API)
app.post('/api/update-ajouts', (req, res) => {
  try {
    const { montant, description } = req.body;

    if (typeof montant !== 'number' || montant < 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    const ajoutsData = {
      montant,
      description: description || '',
      lastUpdate: new Date().toISOString()
    };

    fs.writeFileSync(AJOUTS_FILE, JSON.stringify(ajoutsData, null, 2), 'utf8');
    
    // Actualiser cache
    updateCagnotteData();

    console.log(`✅ Ajouts perso mis à jour: ${montant}€`);
    res.json({ success: true, data: cagnotteCache });
  } catch (error) {
    console.error('❌ Erreur API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Manager HTML (interface pour modifier les ajouts)
app.get('/manager.html', (req, res) => {
  const managerFile = path.join(__dirname, 'manager.html');
  if (fs.existsSync(managerFile)) {
    res.sendFile(managerFile);
  } else {
    res.status(404).send('Manager non trouvé');
  }
});

// Servir les fichiers statiques (widgets, etc)
app.use(express.static(__dirname));

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>CDC2025 Serveur Local</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #0b0f14;
          color: #f2f5f8;
          margin: 0;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 { color: #FCA000; }
        .endpoint {
          background: rgba(0,0,0,0.3);
          padding: 15px;
          margin: 10px 0;
          border-left: 3px solid #FCA000;
          border-radius: 4px;
          font-family: monospace;
        }
        a {
          color: #FCA000;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>🚀 CDC2025 Serveur Local</h1>
      
      <h2>📡 Endpoints</h2>
      
      <div class="endpoint">
        <strong>Données cagnotte:</strong><br>
        <a href="/cagnotte_config.json" target="_blank">GET /cagnotte_config.json</a>
      </div>

      <div class="endpoint">
        <strong>Manager ajouts perso:</strong><br>
        <a href="/manager.html" target="_blank">Manager - Modifier les ajouts</a>
      </div>

      <div class="endpoint">
        <strong>Widgets OBS:</strong><br>
        <a href="/cdc_goal_widget.html" target="_blank">Widget cagnotte complet</a><br>
        <a href="/cdc_goal_widget_simple.html" target="_blank">Widget cagnotte simple</a>
      </div>

      <h2>🔄 Synchronisation</h2>
      <p>✅ Streamlabel est lu en temps réel depuis: <code>Streamlabels/total_charity_donation_amount.txt</code></p>
      <p>✅ Ajouts perso sont gérés via le <a href="/manager.html">Manager</a></p>
      <p>✅ Les données sont mises à jour toutes les 5 secondes</p>
      <p>✅ GitHub Pages reçoit les mises à jour régulièrement</p>

      <h2>🎯 Utilisation OBS</h2>
      <p>Ajoute une source navigateur avec cette URL:</p>
      <pre>http://localhost:3000/cdc_goal_widget.html</pre>

      <h2>📊 Exemple de données</h2>
      <pre id="data"></pre>

      <script>
        fetch('/cagnotte_config.json')
          .then(r => r.json())
          .then(data => {
            document.getElementById('data').textContent = JSON.stringify(data, null, 2);
          });
      </script>
    </body>
    </html>
  `);
});

// Erreur 404
app.use((req, res) => {
  res.status(404).send('❌ Not Found');
});

// ============================================================================
// DÉMARRAGE
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n✅ Serveur prêt sur http://localhost:${PORT}\n`);
  
  // Actualisation initiale
  updateCagnotteData();
  
  // Actualisation périodique
  setInterval(updateCagnotteData, UPDATE_INTERVAL);
});

// Gestion arrêt gracieux
process.on('SIGINT', () => {
  console.log('\n\n👋 Serveur arrêté');
  process.exit(0);
});
