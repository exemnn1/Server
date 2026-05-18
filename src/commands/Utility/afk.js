import { SlashCommandBuilder } from 'discord.js';
import { errorEmbed, successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const AFK_CHANNEL_ID = '1404330939408187422';

export default {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Move a user to the AFK voice channel.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to move to AFK (leave blank for yourself)')
                .setRequired(false),
        ),

    category: 'Utility',

    async execute(interaction, config, client) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(targetUser.id);

            if (!member.voice.channel) {
                return InteractionHelper.safeReply(interaction, {
                    embeds: [
                        errorEmbed(
                            'Error',
                            `${targetUser.username} is not connected to a voice channel.`,
                        ),
                    ],
                    ephemeral: true,
                });
            }

            const afkChannel = interaction.guild.channels.cache.get(AFK_CHANNEL_ID);

            if (!afkChannel) {
                return InteractionHelper.safeReply(interaction, {
                    embeds: [
                        errorEmbed(
                            'Error',
                            'AFK channel not found.',
                        ),
                    ],
                    ephemeral: true,
                });
            }

            await member.voice.setChannel(afkChannel);

            return InteractionHelper.safeReply(interaction, {
                embeds: [
                    successEmbed(
                        'Moved to AFK',
                        `${targetUser.username} has been moved to the AFK channel.`,
                    ),
                ],
            });

        } catch (error) {
            logger.error('afk command error:', error);
            await handleInteractionError(interaction, error, {
                commandName: 'afk',
                source: 'afk_command',
            });
        }
    },
};
