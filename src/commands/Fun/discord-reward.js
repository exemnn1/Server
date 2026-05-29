{
  name: 'join-code',
  description: 'Claim a in game reward in The Handcuff Game',

  async execute(interaction, config, client) {
    try {
      // MANUALLY ADD YOUR CODES HERE
      const rewardCodes = [
        "HANDCUFF-92KF",
        "REWARD-XP21",
        "FREECASH-77A",
        "BONUS-LOCK"
      ];

      // RANDOM CODE
      const randomCode =
        rewardCodes[Math.floor(Math.random() * rewardCodes.length)];

      await InteractionHelper.safeReply(interaction, {
        embeds: [
          successEmbed(
            "🎁 Join Reward",
            `Claim this code in **The Handcuff Game**:\n\n\`${randomCode}\``
          )
        ],
        ephemeral: true
      });

      return;
    } catch (error) {
      logger.error('Join-code command error:', error);

      await handleInteractionError(interaction, error, {
        commandName: 'join-code',
        source: 'join_code_command'
      });
    }
  },
}
