async execute(interaction, config, client) {
  try {
    // MANUALLY ADDED REWARD CODES
    const rewardCodes = [
      "DISCORD-7H2K9",
      "REWARD-X91PL",
      "TOKEN-ABCD1",
      "BONUS-88ZZQ"
    ];

    // PICK RANDOM CODE
    const randomCode =
      rewardCodes[Math.floor(Math.random() * rewardCodes.length)];

    await InteractionHelper.safeReply(interaction, {
      embeds: [
        successEmbed(
          "Discord Reward",
          `🎉 Your reward code is:\n\`${randomCode}\``
        )
      ],
      ephemeral: true
    });

    return;
  } catch (error) {
    logger.error('Discord reward command error:', error);

    await handleInteractionError(interaction, error, {
      commandName: 'discord_reward',
      source: 'discord_reward_command'
    });
  }
},
