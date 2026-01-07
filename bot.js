const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const TOKEN = 'TON_TOKEN_ICI';

const statuts = [
    'Reverse engineer',
    'C++ / LUA / Py',
    'Devlopper creative'
];

const RAID_MESSAGES = [
    "36K1 SERVICE TE OWN",
    "YOU SKID",
    "https://cdn.discordapp.com/attachments/1444040456215466004/1458415740875968553/image.gif?ex=695f8f00&is=695e3d80&hm=d0a0d8be508746857bcd387c5f1f64b6d832898c02e473d1b19bbb9b105c9877&"
];

const SPAM_DELAY_MS = 5000;
const SPAM_CHANNEL_LIMIT = 50;

function installerDependances() {
    const packagePath = path.join(__dirname, 'node_modules', 'discord.js-selfbot-v13');
    if (!fs.existsSync(packagePath)) {
        try {
            execSync('npm install discord.js-selfbot-v13', { 
                stdio: 'inherit',
                cwd: __dirname 
            });
        } catch (error) {
            process.exit(1);
        }
    }
}

installerDependances();

const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

let indexActuel = 0;
let raidInterval = null;
let isRaiding = false;

const PREFIX = "!";

client.on('ready', () => {
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
    indexActuel = (indexActuel + 1) % statuts.length;
}

client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command === "raidstart") {
        if (isRaiding) return;
        isRaiding = true;

        const channels = message.guild.channels.cache
            .filter(ch => ch.isText() && ch.permissionsFor(client.user).has("SEND_MESSAGES"))
            .first(SPAM_CHANNEL_LIMIT);

        raidInterval = setInterval(async () => {
            if (!isRaiding) return;
            for (const channel of channels.values()) {
                try {
                    for (const msg of RAID_MESSAGES) {
                        await channel.send(msg).catch(() => {});
                        await new Promise(r => setTimeout(r, 800));
                    }
                } catch (e) {}
            }
        }, SPAM_DELAY_MS);
    }

    if (command === "raidstop") {
        if (!isRaiding) return;
        isRaiding = false;
        if (raidInterval) {
            clearInterval(raidInterval);
            raidInterval = null;
        }
    }
});

client.on('error', (error) => {});
process.on('unhandledRejection', (error) => {});

client.login(TOKEN).catch(() => {
    process.exit(1);
});
