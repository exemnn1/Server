import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from 'discord.js';

const VERIFIED_ROLE_ID = '1404325379409444937';

// CONFIGURE VERIFIED ROLE PERMISSIONS HERE
const VERIFIED_PERMISSIONS = {
    ViewChannel: true,
    SendMessages: true,
    SendMessagesInThreads: true,
    CreatePublicThreads: true,
    CreatePrivateThreads: true,
    EmbedLinks: true,
    AttachFiles: true,
    ReadMessageHistory: true,
    AddReactions: true,
    UseExternalEmojis: true,
    Connect: true,
    Speak: true,
    Stream: true,
    UseVAD: true
};

export default {
    data: new SlashCommandBuilder()
        .setName('setup-verified')
        .setDescription('Sync verified role permissions to all channels')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    category: 'administration',

    async execute(interaction) {

        await interaction.reply({
            content: '🔄 Syncing verified permissions...',
            ephemeral: true
        });

        let updated = 0;
        let failed = 0;

        for (const channel of interaction.guild.channels.cache.values()) {

            try {

                if (!channel.permissionOverwrites) continue;

                await channel.permissionOverwrites.edit(
                    VERIFIED_ROLE_ID,
                    VERIFIED_PERMISSIONS
                );

                updated++;

            } catch (err) {

                console.error(err);
                failed++;

            }
        }

        await interaction.editReply({
            content:
                `✅ Finished syncing verified permissions.\n\n` +
                `Updated Channels: ${updated}\n` +
                `Failed: ${failed}`
        });
    }
};
