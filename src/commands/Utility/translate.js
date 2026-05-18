import { SlashCommandBuilder } from 'discord.js';
import franc from 'franc';
import translate from 'translate-google';

import { errorEmbed, successEmbed, infoEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const languageMap = {
    eng: 'English',
    spa: 'Spanish',
    fra: 'French',
    deu: 'German',
    jpn: 'Japanese',
    kor: 'Korean',
    chi: 'Chinese',
    rus: 'Russian',
    ara: 'Arabic',
};

export default {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate messages or user text.')
        .addSubcommand(sub =>
            sub
                .setName('message')
                .setDescription('Translate a message to English')
                .addStringOption(opt =>
                    opt.setName('text')
                        .setDescription('Text to translate')
                        .setRequired(true),
                ),
        )
        .addSubcommand(sub =>
            sub
                .setName('user')
                .setDescription('Translate a user message to English')
                .addUserOption(opt =>
                    opt.setName('target')
                        .setDescription('User to translate')
                        .setRequired(true),
                ),
        )
        .addSubcommand(sub =>
            sub
                .setName('back')
                .setDescription('Translate text back to another language')
                .addStringOption(opt =>
                    opt.setName('text')
                        .setDescription('Text to translate back')
                        .setRequired(true),
                )
                .addStringOption(opt =>
                    opt.setName('language')
                        .setDescription('Language code (e.g. fr, es, de)')
                        .setRequired(true),
                ),
        ),

    category: 'Utility',

    async execute(interaction, config, client) {
        try {
            const sub = interaction.options.getSubcommand();

            // ---------------- MESSAGE TRANSLATE ----------------
            if (sub === 'message') {
                const text = interaction.options.getString('text');

                const langCode = franc(text);
                const langName = languageMap[langCode] || langCode;

                const result = await translate(text, { to: 'en' });

                return InteractionHelper.safeReply(interaction, {
                    embeds: [
                        infoEmbed(
                            'Translation',
                            `**Detected:** ${langName}\n\n**English:** ${result}`,
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // ---------------- USER TRANSLATE ----------------
            if (sub === 'user') {
                const user = interaction.options.getUser('target');

                const member = await interaction.guild.members.fetch(user.id);

                const channel = interaction.channel;
                const messages = await channel.messages.fetch({ limit: 20 });

                const lastMessage = messages.find(m => m.author.id === user.id);

                if (!lastMessage) {
                    return InteractionHelper.safeReply(interaction, {
                        embeds: [errorEmbed('Error', 'No recent message found from this user.')],
                        ephemeral: true,
                    });
                }

                const text = lastMessage.content;
                const langCode = franc(text);
                const langName = languageMap[langCode] || langCode;

                const result = await translate(text, { to: 'en' });

                return InteractionHelper.safeReply(interaction, {
                    embeds: [
                        infoEmbed(
                            'User Translation',
                            `**User:** ${user.username}\n**Detected:** ${langName}\n\n**English:** ${result}`,
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // ---------------- TRANSLATE BACK ----------------
            if (sub === 'back') {
                const text = interaction.options.getString('text');
                const language = interaction.options.getString('language');

                const result = await translate(text, { to: language });

                return InteractionHelper.safeReply(interaction, {
                    embeds: [
                        successEmbed(
                            'Translated Back',
                            `${result}\n\n⚠️ *Translated using bot*`,
                        ),
                    ],
                    ephemeral: true,
                });
            }

        } catch (error) {
            logger.error('translate command error:', error);
            await handleInteractionError(interaction, error, {
                commandName: 'translate',
                source: 'translate_command',
            });
        }
    },
};
