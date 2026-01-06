const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const TOKEN = 'TON_TOKEN_ICI';
const statuts = [
    'Reverse engineer',
    'C++ / LUA / Py',
    'Devlopper creative'
];

// Fonction pour vérifier et installer les dépendances
function installerDependances() {
    const packagePath = path.join(__dirname, 'node_modules', 'discord.js-selfbot-v13');
    
    if (!fs.existsSync(packagePath)) {
        console.log('📦 Installation de discord.js-selfbot-v13...');
        try {
            execSync('npm install discord.js-selfbot-v13', { 
                stdio: 'inherit',
                cwd: __dirname 
            });
            console.log('✅ Installation terminée !');
        } catch (error) {
            console.error('❌ Erreur lors de l\'installation:', error.message);
            process.exit(1);
        }
    } else {
        console.log('✅ Dépendances déjà installées');
    }
}

// Installer les dépendances au démarrage
installerDependances();

// Charger discord.js-selfbot après installation
const { Client } = require('discord.js-selfbot-v13');

const client = new Client();

let indexActuel = 0;

client.on('ready', () => {
    console.log(`🚀 Connecté en tant que ${client.user.tag}`);
    console.log(`📊 ${statuts.length} statuts configurés`);
    
    changerStatut();
    
    setInterval(changerStatut, 30000);
});

function changerStatut() {
    const statut = statuts[indexActuel];
    
    client.user.setPresence({
        activities: [{
            name: statut,
            type: 'PLAYING'
        }],
        status: 'online'
    });
    
    console.log(`🔄 Statut changé: ${statut}`);
    
    indexActuel = (indexActuel + 1) % statuts.length;
}

client.on('error', (error) => {
    console.error('❌ Erreur Discord:', error.message);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

console.log('🔌 Connexion en cours...');
client.login(TOKEN).catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    console.log('⚠️  Vérifie que ton token est correct !');
    process.exit(1);
});