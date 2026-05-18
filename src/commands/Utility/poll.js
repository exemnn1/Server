import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { errorEmbed, successEmbed, infoEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with emoji voting.')
        .addChannelOption(opt =>
            opt.setName('channel')
                .setDescription('Channel to post the poll in')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
        )
        .addStringOption(opt =>
            opt.setName('title')
                .setDescription('Poll title')
                .setRequired(true),
        )
        .addStringOption(opt =>
            opt.setName('description')
                .setDescription('Poll description')
                .setRequired(true),
        )
        .addStringOption(opt =>
            opt.setName('options')
                .setDescription('Options format: 👍=Yes,👎=No,🤔=Maybe')
                .setRequired(true),
        )
        .addStringOption(opt =>
            opt.setName('duration')
                .setDescription('Duration in minutes (or "infinite")')
                .setRequired(false),
        ),

    category: 'Utility',

    async execute(interaction, config, client) {
        try {
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const optionsRaw = interaction.options.getString('options');
            const duration = interaction.options.getString('duration') || 'infinite';

            // Parse options: emoji=label
            const options = optionsRaw.split(',').map(opt => {
                const [emoji, label] = opt.split('=').map(x => x?.trim());
                return { emoji, label };
            });

            if (options.length < 2) {
                return InteractionHelper.safeReply(interaction, {
                    embeds: [errorEmbed('Error', 'You must provide at least 2 options.')],
                    ephemeral: true,
                });
            }

            // Build poll text
            let pollText = `📊 **${title}**\n\n${description}\n\n`;

            for (const opt of options) {
                pollText += `${opt.emoji} → **${opt.label}**\n`;
            }

            pollText += `\n🗳️ React below to vote!`;

            if (duration !== 'infinite') {
                pollText += `\n⏱️ Ends in: **${duration} minutes**`;
            }

            const msg = await channel.send({ content: pollText });

            // Add reactions
            for (const opt of options) {
                try {
                    await msg.react(opt.emoji);
                } catch (e) {
                    logger.warn(`Failed to react with ${opt.emoji}`, e);
                }
            }

            // Optional timer (poll ending logic)
            if (duration !== 'infinite') {
                const ms = parseInt(duration) * 60 * 1000;

                setTimeout(async () => {
                    try {
                        const fetched = await channel.messages.fetch(msg.id);

                        let results = '📊 **Poll Ended**\n\nResults:\n';

                        const reactionCounts = [];

                        for (const opt of options) {
                            const reaction = fetched.reactions.cache.get(opt.emoji);
                            const count = reaction ? reaction.count - 1 : 0; // remove bot vote
                            reactionCounts.push({ emoji: opt.emoji, label: opt.label, count });
                        }

                        reactionCounts.sort((a, b) => b.count - a.count);

                        for (const r of reactionCounts) {
                            results += `${r.emoji} **${r.label}** — ${r.count} votes\n`;
                        }

                        await channel.send(results);

                    } catch (err) {
                        logger.error('Poll ending error:', err);
                    }
                }, ms);
            }

            return InteractionHelper.safeReply(interaction, {
                embeds: [
                    successEmbed(
                        'Poll Created',
                        `Your poll has been posted in ${channel}.`,
                    ),
                ],
                ephemeral: true,
            });

        } catch (error) {
            logger.error('poll command error:', error);
            await handleInteractionError(interaction, error, {
                commandName: 'poll',
                source: 'poll_command',
            });
        }
    },
};
