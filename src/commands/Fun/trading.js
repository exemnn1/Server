import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

import { successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('tradingcalculator')
        .setDescription('Open the BlueHelm Studios Trading Calculator.'),

    category: 'Tools',

    async execute(interaction, config, client) {
        try {
            const embed = successEmbed(
                '📈 Trading Calculator',
                [
                    'Use the button below to open the trading calculator.',
                    '',
                    'Discord will ask you to confirm before opening the website.'
                ].join('\n')
            );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Open Trading Calculator')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://bluehelmstudios.com/trading-calculator')
            );

            await InteractionHelper.safeReply(interaction, {
                embeds: [embed],
                components: [row]
            });

            logger.debug(
                `Trading Calculator command executed by user ${interaction.user.id} in guild ${interaction.guildId}`
            );
        } catch (error) {
            logger.error('Trading Calculator command error:', error);

            await handleInteractionError(interaction, error, {
                commandName: 'tradingcalculator',
                source: 'trading_calculator_command'
            });
        }
    }
};
