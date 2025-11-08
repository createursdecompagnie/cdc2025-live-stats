#!/usr/bin/env node

/**
 * =============================================================================
 * CDC2025 - SOLUTION SIMPLE STREAMLABEL SYNC
 * =============================================================================
 * 
 * Ce script:
 * 1. Lit le montant réel de Streamlabel (total_charity_donation_amount.txt)
 * 2. Ajoute un montant personnalisé si tu veux
 * 3. Met à jour cagnotte_config.json (avec la différence visible)
 * 4. Le serveur local sert cet endpoint
 * 5. Les widgets GitHub restent les mêmes (juste on met à jour le JSON)
 * 
 * UTILISATION:
 * node simple-sync.js
 * 
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

// Chemins
const STREAMLABEL_FILE = path.join(__dirname, 'Streamlabels', 'total_charity_donation_amount.txt');
const CONFIG_FILE = path.join(__dirname, 'cagnotte_config.json');
const AJOUTS_FILE = path.join(__dirname, 'ajouts_perso.json'); // Nouveau fichier pour tes ajouts

// ============================================================================
// LIRE LE MONTANT STREAMLABEL
// ============================================================================

function readStreamlabelAmount() {
  try {
    if (!fs.existsSync(STREAMLABEL_FILE)) {
      console.log('⚠️  Fichier Streamlabel non trouvé:', STREAMLABEL_FILE);
      return 0;
    }

    let content = fs.readFileSync(STREAMLABEL_FILE, 'utf8').trim();
    console.log(`📄 Contenu brut Streamlabel: "${content}"`);
    
    // Nettoyer: enlever $, EUR, espaces
    content = content
      .replace(/[$€EUR]/g, '')  // Enlever symboles monétaires
      .trim();
    
    // ⚠️ PARSING INTELLIGENT DES NOMBRES
    // Gérer: "5,159.55" (virgule=milliers, point=décimale)
    //         "5.159,55" (point=milliers, virgule=décimale)
    //         "5159.55" ou "5159,55"
    
    const lastDot = content.lastIndexOf('.');
    const lastComma = content.lastIndexOf(',');
    
    let parsed = 0;
    
    if (lastDot > lastComma) {
      // Point est la décimale: "5,159.55" → enlever virgules
      parsed = parseFloat(content.replace(/,/g, ''));
      console.log(`   Format: 5,159.55 style (virgule=milliers) → ${parsed}`);
    } else if (lastComma > lastDot) {
      // Virgule est la décimale: "5.159,55" → remplacer
      parsed = parseFloat(content.replace(/\./g, '').replace(',', '.'));
      console.log(`   Format: 5.159,55 style (point=milliers) → ${parsed}`);
    } else if (lastDot >= 0) {
      // Seulement point
      parsed = parseFloat(content);
      console.log(`   Format: 5159.55 style → ${parsed}`);
    } else if (lastComma >= 0) {
      // Seulement virgule
      parsed = parseFloat(content.replace(',', '.'));
      console.log(`   Format: 5159,55 style → ${parsed}`);
    } else {
      // Seulement des chiffres
      parsed = parseFloat(content);
      console.log(`   Format: 5159 style → ${parsed}`);
    }
    
    const amount = parsed || 0;
    console.log(`📊 Streamlabel PARSED: ${amount}€`);
    return amount;
  } catch (error) {
    console.error('❌ Erreur lecture Streamlabel:', error.message);
    return 0;
  }
}

// ============================================================================
// LIRE LES AJOUTS PERSONNALISÉS
// ============================================================================

function readAjoutsPerso() {
  try {
    if (!fs.existsSync(AJOUTS_FILE)) {
      // Créer le fichier par défaut si absent
      const defaultAjouts = { montant: 0, description: 'T-shirts, dons directs, etc.' };
      fs.writeFileSync(AJOUTS_FILE, JSON.stringify(defaultAjouts, null, 2));
      console.log('✅ Fichier ajouts_perso.json créé (montant par défaut: 0€)');
      return 0;
    }

    const data = JSON.parse(fs.readFileSync(AJOUTS_FILE, 'utf8'));
    console.log(`🎁 Ajouts perso: ${data.montant}€${data.description ? ' (' + data.description + ')' : ''}`);
    return data.montant || 0;
  } catch (error) {
    console.error('⚠️  Erreur lecture ajouts perso:', error.message);
    return 0;
  }
}

// ============================================================================
// METTRE À JOUR CAGNOTTE_CONFIG.JSON
// ============================================================================

function updateCagnotteConfig(streamlabAmount, ajoutsPerso) {
  const newConfig = {
    brut: streamlabAmount,           // Montant Streamlabel brut
    ajouts: ajoutsPerso,               // Montant personnalisé
    total: streamlabAmount + ajoutsPerso, // Total combiné
    lastModified: new Date().toISOString(),
    sources: {
      streamlabel: {
        value: streamlabAmount,
        file: STREAMLABEL_FILE,
        description: 'Montant réel Streamlabel Charity'
      },
      perso: {
        value: ajoutsPerso,
        file: AJOUTS_FILE,
        description: 'Montant personnalisé ajouté'
      }
    }
  };

  try {
    // Lire l'ancienne config
    let oldConfig = { brut: 0, ajouts: 0, total: 0 };
    if (fs.existsSync(CONFIG_FILE)) {
      oldConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }

    // Vérifier s'il y a changement
    const hasChanged = 
      newConfig.brut !== oldConfig.brut ||
      newConfig.ajouts !== oldConfig.ajouts;

    // Sauvegarder - Utiliser fichier temporaire puis renommer pour éviter les locks NAS
    const tempFile = CONFIG_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(newConfig, null, 2), 'utf8');
    
    // Renommer (atomique sur NAS)
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
    fs.renameSync(tempFile, CONFIG_FILE);

    if (hasChanged) {
      console.log(`\n✨ CHANGEMENT DÉTECTÉ!`);
      console.log(`   Avant: ${oldConfig.brut}€ + ${oldConfig.ajouts}€ = ${oldConfig.total}€`);
      console.log(`   Après: ${newConfig.brut}€ + ${newConfig.ajouts}€ = ${newConfig.total}€`);
      console.log(`✅ Fichier cagnotte_config.json mis à jour\n`);
    } else {
      console.log(`✅ Aucun changement (${newConfig.total}€)\n`);
    }

    return newConfig;
  } catch (error) {
    console.error('❌ Erreur mise à jour config:', error.message);
    return newConfig;
  }
}

// ============================================================================
// MAIN
// ============================================================================

function sync() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🔄 SYNCHRONISATION CAGNOTTE CDC2025');
  console.log('═══════════════════════════════════════════════════════════\n');

  const streamlabAmount = readStreamlabelAmount();
  const ajoutsPerso = readAjoutsPerso();
  const config = updateCagnotteConfig(streamlabAmount, ajoutsPerso);

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`💰 TOTAL: ${config.total}€`);
  console.log('═══════════════════════════════════════════════════════════\n');

  return config;
}

// ============================================================================
// MODE WATCH (CONTINU)
// ============================================================================

function watchMode() {
  console.log('👁️  MODE WATCH: Synchronisation continue (appuie Ctrl+C pour arrêter)\n');
  
  // Première sync
  sync();
  
  // Ensuite toutes les 10 secondes
  setInterval(() => {
    sync();
  }, 10000);
}

// ============================================================================
// POINT D'ENTRÉE
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--watch')) {
  watchMode();
} else {
  sync();
}

module.exports = { readStreamlabelAmount, readAjoutsPerso, updateCagnotteConfig };
