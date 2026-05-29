import {
    Events,
    PermissionsBitField
} from 'discord.js';

import vision from '@google-cloud/vision';

const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: './google-vision-key.json'
});

const suspiciousWords = [
    'free robux',
    'mr beast giveaway',
    'free nitro',
    'claim reward',
    '100000 robux',
    'click link',
    'free money',
    'discord nitro',
    'gift card',
    'cash app',
    'bitcoin giveaway',
    'free vbucks',
    'steam gift',
    'crypto'
];

export default {
    name: Events.MessageCreate,

    async execute(message) {
        try {

            // BASIC CHECKS
            if (!message.guild) return;
            if (message.author.bot) return;

            const botMember = message.guild.members.me;

            // REQUIRED PERMISSIONS
            if (
                !botMember.permissions.has([
                    PermissionsBitField.Flags.BanMembers,
                    PermissionsBitField.Flags.ManageMessages
                ])
            ) {
                return;
            }

            // NO IMAGES
            if (!message.attachments.size) return;

            for (const attachment of message.attachments.values()) {

                // ONLY IMAGES
                if (!attachment.contentType?.startsWith('image/')) {
                    continue;
                }

                const imageUrl = attachment.url;

                // OCR TEXT DETECTION
                const [ocrResult] =
                    await visionClient.textDetection(imageUrl);

                const text =
                    (ocrResult.textAnnotations || [])
                        .map(t => t.description)
                        .join(' ')
                        .toLowerCase();

                // SAFE SEARCH DETECTION
                const [safeResult] =
                    await visionClient.safeSearchDetection(imageUrl);

                const safe = safeResult.safeSearchAnnotation;

                const nsfwDetected =
                    safe?.adult === 'LIKELY' ||
                    safe?.adult === 'VERY_LIKELY' ||
                    safe?.violence === 'LIKELY' ||
                    safe?.violence === 'VERY_LIKELY' ||
                    safe?.racy === 'VERY_LIKELY';

                // SUSPICIOUS WORD CHECK
                let suspiciousDetected = false;

                for (const word of suspiciousWords) {
                    if (text.includes(word)) {
                        suspiciousDetected = true;
                        break;
                    }
                }

                // MRBEAST SCAM DETECTION
                const mrBeastScam =
                    text.includes('mr beast') &&
                    (
                        text.includes('giveaway') ||
                        text.includes('money') ||
                        text.includes('free') ||
                        text.includes('winner')
                    );

                // FINAL DETECTION
                if (
                    suspiciousDetected ||
                    nsfwDetected ||
                    mrBeastScam
                ) {

                    // DELETE MESSAGE
                    await message.delete().catch(() => {});

                    // FETCH MEMBER
                    const member =
                        await message.guild.members.fetch(
                            message.author.id
                        );

                    // BAN USER
                    await member.ban({
                        deleteMessageSeconds: 60 * 60 * 24 * 7,
                        reason: 'Uploading suspicious/scam/unsafe images'
                    }).catch(console.error);

                    // LOG CHANNEL
                    const logChannel =
                        message.guild.channels.cache.find(
                            c => c.name === 'mod-logs'
                        );

                    if (logChannel) {

                        await logChannel.send({
                            embeds: [
                                {
                                    color: 0xff0000,
                                    title: '🚫 User Automatically Banned',
                                    description:
                                        `User: ${message.author.tag}\n` +
                                        `User ID: ${message.author.id}\n\n` +
                                        `Reason: Suspicious Image Upload\n\n` +
                                        `Detected Text:\n${text.slice(0, 1000)}`,
                                    image: {
                                        url: imageUrl
                                    },
                                    footer: {
                                        text: 'AI Auto Moderation'
                                    },
                                    timestamp: new Date().toISOString()
                                }
                            ]
                        });

                    }

                    console.log(
                        `[AUTO-BAN] ${message.author.tag} banned for suspicious image`
                    );
                }
            }

        } catch (error) {
            console.error('Image moderation error:', error);
        }
    }
};
