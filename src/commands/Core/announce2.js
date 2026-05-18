async execute(interaction) {
    // Allowed roles
    const ALLOWED_ROLE_IDS = [
        "1404325379409444937",
        "1404325459164135446"
    ];

    // Check if user has one of the roles
    const memberRoles = interaction.member.roles.cache;
    const hasPermission = ALLOWED_ROLE_IDS.some(roleId =>
        memberRoles.has(roleId)
    );

    if (!hasPermission) {
        return InteractionHelper.safeReply(interaction, {
            content: "❌ You don't have permission to use this command.",
            ephemeral: true
        });
    }

    const channel = interaction.options.getChannel("channel");
    const title = interaction.options.getString("title");
    const message = interaction.options.getString("message");
    const color = interaction.options.getString("color") || "info";
    const role = interaction.options.getRole("role");
    const everyone = interaction.options.getBoolean("everyone") || false;

    const buttonLabel = interaction.options.getString("button_label");
    const buttonURL = interaction.options.getString("button_url");

    let pingText = "";
    if (everyone) pingText += "@everyone ";
    if (role) pingText += `${role} `;

    const embed = createEmbed({
        title,
        description: message,
        color
    }).setTimestamp();

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
}
