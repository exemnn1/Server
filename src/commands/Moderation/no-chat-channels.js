import {
    ChannelType,
    PermissionsBitField
} from 'discord.js';

const VERIFIED_ROLE_ID = '1404325379409444937';

// CONFIGURE DEFAULT VERIFIED PERMISSIONS HERE
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
    name: 'ready',
    once: true,

    async execute(client) {

        console.log('Setting verified permissions...');

        for (const guild of client.guilds.cache.values()) {

            try {

                // LOOP THROUGH ALL CHANNELS
                for (const channel of guild.channels.cache.values()) {

                    // SKIP DMS / INVALID CHANNELS
                    if (!channel.permissionOverwrites) continue;

                    // APPLY ROLE PERMISSIONS
                    await channel.permissionOverwrites.edit(
                        VERIFIED_ROLE_ID,
                        VERIFIED_PERMISSIONS
                    ).catch(console.error);

                    console.log(
                        `Updated: ${guild.name} -> ${channel.name}`
                    );
                }

                console.log(
                    `Finished configuring ${guild.name}`
                );

            } catch (err) {
                console.error(
                    `Failed in guild ${guild.name}:`,
                    err
                );
            }
        }

        console.log('All verified permissions configured.');
    }
};
