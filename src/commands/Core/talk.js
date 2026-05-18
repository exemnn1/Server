import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from 'discord.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';

const ALLOWED_ROLE_IDS = [
    "1404325379409444937",
    "1404325459164135446"
];

// Random fake users
const RANDOM_USERS = [
    {
        name: "Pixel",
        avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
        name: "Nova",
        avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
        name: "Shadow",
        avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
        name: "Echo",
        avatar: "https://i.pravatar.cc/150?img=4"
    }
];

export default {
    data: new SlashCommandBuilder()
        .setName("talk")
        .setDescription("Send a fake user message")

        .addUserOption(option =>
            option.setName("impersonate")
                .setDescription("User to impersonate")
                .setRequired(false)
        )

        .addStringOption(option =>
            option.setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // Role check
        const memberRoles = interaction.member.roles.cache;
        const hasPermission = ALLOWED_ROLE_IDS.some(roleId =>
            memberRoles.has(roleId)
        );

        if (!hasPermission) {
            return InteractionHelper.safeReply(interaction, {
                content: "❌ You don't have permission.",
                ephemeral: true
            });
        }

        const impersonate = interaction.options.getUser("impersonate");
        const message = interaction.options.getString("message");

        let username;
        let avatarURL;

        if (impersonate) {
            // Use selected user's info
            username = impersonate.username;
            avatarURL = impersonate.displayAvatarURL({ dynamic: true });
        } else {
            // Random fake user
            const randomUser = RANDOM_USERS[
                Math.floor(Math.random() * RANDOM_USERS.length)
            ];

            username = randomUser.name;
            avatarURL = randomUser.avatar;
        }

        try {
            const webhook = await interaction.channel.createWebhook({
                name: username,
                avatar: avatarURL
            });

            await webhook.send({
                content: message
            });

            await webhook.delete();

            await InteractionHelper.safeReply(interaction, {
                content: "✅ Message sent.",
                ephemeral: true
            });

        } catch (err) {
            console.error(err);

            await InteractionHelper.safeReply(interaction, {
                content: "❌ Failed to send message.",
                ephemeral: true
            });
        }
    }
};
