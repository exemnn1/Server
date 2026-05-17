import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// 👇 Manually set your bot version here
const BOT_VERSION = '1.0.0';

export default {
    data: new SlashCommandBuilder()
        .setName("version")
        .setDescription("Shows the current bot version"),

    async execute(interaction) {

        const versionEmbed = createEmbed({
            title: 'Bot Version',
            description:
                `Current bot version is:\n\n` +
                `**v${BOT_VERSION}**\n\n` +
                `This version is manually updated by the developer.`,
            color: 'info'
        }).setTimestamp();

        await InteractionHelper.safeReply(interaction, {
            embeds: [versionEmbed],
        });
    },
};
