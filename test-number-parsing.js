#!/usr/bin/env node

/**
 * TEST PARSING NOMBRES - Vérifier que les montants sont correctement parsés
 */

console.log('═'.repeat(70));
console.log('🧪 TEST PARSING NOMBRES - CAGNOTTE CONFIG');
console.log('═'.repeat(70));
console.log('');

// Fonction de parsing (même que dans cdc_goal_widget.html)
function cleanNumber(str) {
  if (!str) return 0;
  str = String(str).trim();
  
  const lastDot = str.lastIndexOf('.');
  const lastComma = str.lastIndexOf(',');
  
  let integerPart = str;
  let decimalPart = '';
  
  if (lastDot > lastComma) {
    // Point est la décimale
    integerPart = str.substring(0, lastDot).replace(/[.,]/g, '');
    decimalPart = str.substring(lastDot + 1);
  } else if (lastComma > lastDot) {
    // Virgule est la décimale
    integerPart = str.substring(0, lastComma).replace(/[.,]/g, '');
    decimalPart = str.substring(lastComma + 1);
  } else {
    // Pas de décimale
    integerPart = str.replace(/[.,]/g, '');
  }
  
  const cleaned = integerPart + (decimalPart ? '.' + decimalPart : '');
  return parseFloat(cleaned) || 0;
}

// Tests
const testCases = [
  { input: '3.264', expected: 3.264, desc: 'Format bug (3.264)' },
  { input: '3264', expected: 3264, desc: 'Format correct (3264)' },
  { input: '3,264', expected: 3264, desc: 'Format anglais (3,264)' },
  { input: '3.264,50', expected: 3264.50, desc: 'Format européen (3.264,50)' },
  { input: '$5,159.55', expected: 5159.55, desc: 'Format Streamlabs ($5,159.55)' },
  { input: '5.159,55', expected: 5159.55, desc: 'Format EUR (5.159,55)' },
  { input: '5159.55', expected: 5159.55, desc: 'Format simple (5159.55)' },
  { input: '150', expected: 150, desc: 'Petit montant (150)' },
];

console.log('Test des formats de nombre:\n');

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = cleanNumber(test.input);
  const success = Math.abs(result - test.expected) < 0.01;
  
  if (success) {
    console.log(`✅ ${test.desc}`);
    console.log(`   Input: "${test.input}" → Output: ${result}€`);
    passed++;
  } else {
    console.log(`❌ ${test.desc}`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Expected: ${test.expected}€`);
    console.log(`   Got: ${result}€`);
    failed++;
  }
  console.log('');
});

console.log('═'.repeat(70));
console.log(`📊 RÉSULTAT: ${passed} PASSED, ${failed} FAILED`);
console.log('═'.repeat(70));

if (failed === 0) {
  console.log('✅ Tous les tests réussis!');
  process.exit(0);
} else {
  console.log('❌ Certains tests ont échoué');
  process.exit(1);
}
