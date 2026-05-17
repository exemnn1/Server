async execute(interaction, config, client) {
  try {
    await InteractionHelper.safeReply(interaction, {
      embeds: [
        errorEmbed(
          "Under Development",
          "This command is currently under development."
        )
      ]
    });

    return;
  } catch (error) {
    logger.error('Gamble command error:', error);
    await handleInteractionError(interaction, error, {
      commandName: 'gamble',
      source: 'gamble_command'
    });
  }
},
