import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} from 'discord.js';

import { createEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send a customizable announcement")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Channel to send the announcement in")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName("title")
                .setDescription("Announcement title")
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName("message")
                .setDescription("Announcement message content")
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName("color")
                .setDescription("Embed color (e.g. red, blue, green, #ff0000)")
                .setRequired(false)
        )

        .addRoleOption(option =>
            option.setName("role")
                .setDescription("Role to ping in the announcement")
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option.setName("everyone")
                .setDescription("Ping @everyone?")
                .setRequired(false)
        )

        .addStringOption(option =>
            option.setName("button_label")
                .setDescription("Button text (optional)")
                .setRequired(false)
        )

        .addStringOption(option =>
            option.setName("button_url")
                .setDescription("Button URL (required if button is used)")
                .setRequired(false)
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const title = interaction.options.getString("title");
        const message = interaction.options.getString("message");
        const color = interaction.options.getString("color") || "info";
        const role = interaction.options.getRole("role");
        const everyone = interaction.options.getBoolean("everyone") || false;

        const buttonLabel = interaction.options.getString("button_label");
        const buttonURL = interaction.options.getString("button_url");

        // Ping setup
        let pingText = "";
        if (everyone) pingText += "@everyone ";
        if (role) pingText += `${role} `;

        // Build embed
        const embed = createEmbed({
            title,
            description: message,
            color
        }).setTimestamp();

        // Button setup (optional)
        let components = [];
        if (buttonLabel && buttonURL) {
            const button = new ButtonBuilder()
                .setLabel(buttonLabel)
                .setURL(buttonURL)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder().addComponents(button);
            components.push(row);
        }

        try {
            await channel.send({
                content: pingText || null,
                embeds: [embed],
                components: components.length ? components : undefined
            });

            await InteractionHelper.safeReply(interaction, {
                content: `✅ Announcement sent in ${channel}`,
                ephemeral: true
            });

        } catch (err) {
            console.error(err);

            await InteractionHelper.safeReply(interaction, {
                content: "❌ Failed to send announcement.",
                ephemeral: true
            });
        }
    },
};
