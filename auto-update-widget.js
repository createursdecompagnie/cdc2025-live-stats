#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 - AUTO-UPDATE WIDGET (Solution Simple & Automatique)
 * =============================================================================
 * 
 * ✨ CONCEPT SIMPLE:
 * Au lieu d'avoir OBS qui demande les données (et cache), on écrit DIRECTEMENT
 * dans un fichier HTML que OBS observe. Quand le fichier change, OBS 
 * rafraîchit AUTOMATIQUEMENT!
 * 
 * 📊 FLUX:
 * Streamlabel file → Serveur lit toutes les 2 sec → Écrit dans HTML →
 * OBS détecte le changement → Rafraîchit automatiquement! ⚡
 * 
 * 🎯 UTILISATION:
 * Terminal 1: npm start               (lance streamlabel-server.js)
 * Terminal 2: npm run widget:auto     (lance ce script)
 * OBS: Ajoute source navigateur: file:///chemin/vers/cdc_widget_auto.html
 * 
 * ✅ AVANTAGES:
 * - Pas de cache (changement de fichier = rafraîchissement OBS)
 * - Entièrement automatique
 * - Les 20€ s'ajoutent et affichent sans clic
 * - Aucun refresh manuel nécessaire
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

// Fichiers
const STREAMLABEL_FILE = path.join(__dirname, 'Streamlabels', 'total_charity_donation_amount.txt');
const AJOUTS_FILE = path.join(__dirname, 'ajouts_perso.json');
const OUTPUT_HTML = path.join(__dirname, 'cdc_widget_auto.html');
const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');

console.log('\n🎁 CDC2025 AUTO-UPDATE WIDGET');
console.log('═'.repeat(60));
console.log('📝 Écrit dans:', OUTPUT_HTML);
console.log('🔄 Mise à jour: Toutes les 2 secondes');
console.log('═'.repeat(60) + '\n');

// Template HTML avec les données injectées directement
function generateHTML(brut, ajouts, total) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CDC2025 Cagnotte Auto</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0b0f14;
  --text: #f2f5f8;
  --accent: #FCA000;
  --radius: 20px;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  color: var(--text);
  font-family: "Outfit", -apple-system, system-ui;
  overflow: hidden;
}

.widget-container {
  width: 100%;
  height: 100%;
  padding: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  padding: 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5vh;
  width: 100%;
  height: 100%;
}

.event-title {
  font-size: 5vw;
  font-weight: 900;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #f0e6d2, var(--accent));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 0.5vw rgba(252, 160, 0, 0.3));
  line-height: 1;
}

.goal-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
}

.goal-badge {
  background: var(--accent);
  color: #0b0f14;
  padding: 0.5vh 1.5vw;
  border-radius: 999px;
  font-size: 1.8vw;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.goal-amount {
  font-size: 6vw;
  font-weight: 900;
  color: var(--text);
  text-shadow: 0 0.2vh 1vh rgba(252, 160, 0, 0.2);
  min-width: 300px;
  text-align: center;
}

.debug-info {
  position: absolute;
  bottom: 1vh;
  left: 1vh;
  font-size: 0.8vw;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
  display: none;
}

.debug-info.show {
  display: block;
}
</style>
</head>
<body>
  <div class="widget-container">
    <div class="card">
      <div class="event-title">🐾 CDC2025</div>
      <div class="goal-section">
        <span class="goal-badge">Global</span>
        <span class="goal-amount">${new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(total)} €</span>
      </div>
    </div>
  </div>
  
  <div class="debug-info" id="debug">
    <div>🎁 Streamlabel: ${brut}€ | Perso: ${ajouts}€ | Total: ${total}€</div>
    <div>⏰ Mis à jour: ${new Date().toLocaleTimeString('fr-FR')}</div>
  </div>

<script>
// Show debug on Ctrl+Shift+D
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    document.getElementById('debug').classList.toggle('show');
  }
});

// Log pour vérification
console.log('✅ Widget auto chargé');
console.log('📊 Données: Streamlabel ${brut}€ + Perso ${ajouts}€ = Total ${total}€');
console.log('💾 Fichier généré: \`cdc_widget_auto.html\`');
console.log('🔄 Appuyez sur Ctrl+Shift+D pour voir les infos de debug');
</script>
</body>
</html>`;
}

// Lire les données
function readStreamlabelAmount() {
  try {
    if (!fs.existsSync(STREAMLABEL_FILE)) {
      return 0;
    }
    let content = fs.readFileSync(STREAMLABEL_FILE, 'utf8').trim();
    content = content.replace(/[$€EUR]/g, '').replace(/,/g, '.').trim();
    return parseFloat(content) || 0;
  } catch (error) {
    console.error('❌ Erreur lecture Streamlabel:', error.message);
    return 0;
  }
}

function readAjoutsPerso() {
  try {
    if (!fs.existsSync(AJOUTS_FILE)) {
      return 0;
    }
    const data = JSON.parse(fs.readFileSync(AJOUTS_FILE, 'utf8'));
    return parseFloat(data.montant) || 0;
  } catch (error) {
    console.error('⚠️  Erreur lecture ajouts:', error.message);
    return 0;
  }
}

// Mettre à jour le fichier HTML
function updateWidget() {
  try {
    const brut = readStreamlabelAmount();
    const ajouts = readAjoutsPerso();
    const total = brut + ajouts;

    const html = generateHTML(brut, ajouts, total);
    fs.writeFileSync(OUTPUT_HTML, html, 'utf8');

    console.log(`✅ [${new Date().toLocaleTimeString('fr-FR')}] Widget mis à jour: ${brut}€ + ${ajouts}€ = ${total}€`);
  } catch (error) {
    console.error('❌ Erreur écriture widget:', error.message);
  }
}

// Première mise à jour
updateWidget();

// Mise à jour toutes les 2 secondes
setInterval(updateWidget, 2000);

console.log('🚀 Widget auto-update lancé!');
console.log('\n📋 Pour OBS:');
console.log('   1. Source navigateur: FILE');
console.log('   2. Chemin: file://' + OUTPUT_HTML);
console.log('   3. C\'est tout! Ça se met à jour tout seul! ✨\n');
