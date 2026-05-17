import fs from 'fs';
import fetch from 'node-fetch'; // only needed if you're not on Node 18+
import { banMember } from './ban.js'; // adjust path to your ban handler

let swearWords = [];

// Load swear list once on startup
async function loadSwearWords() {
    try {
        const res = await fetch(
            'https://raw.githubusercontent.com/zautumnz/profane-words/master/words.json'
        );
        swearWords = await res.json();
        console.log(`[SwearFilter] Loaded ${swearWords.length} words`);
    } catch (err) {
        console.error('[SwearFilter] Failed to load swear words:', err);
    }
}

function containsSwear(text) {
    const msg = text.toLowerCase();
    return swearWords.some(word => msg.includes(word.toLowerCase()));
}

export default {
    name: 'messageCreate',

    async execute(message) {
        if (!message.guild || message.author.bot) return;

        const content = message.content;

        if (containsSwear(content)) {
            try {
                const member = await message.guild.members.fetch(message.author.id);

                // call your ban system
                await banMember(member, {
                    reason: 'Automated profanity detection'
                });

                console.log(`[SwearFilter] Banned ${message.author.tag}`);
            } catch (err) {
                console.error('[SwearFilter] Ban failed:', err);
            }
        }
    }
};

// run loader once when file imports
loadSwearWords();
