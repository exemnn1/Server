import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("confess")
  .setDescription("Send an anonymous confession");

export async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("confessModal")
    .setTitle("Anonymous Confession");

  const confessionInput = new TextInputBuilder()
    .setCustomId("confessionText")
    .setLabel("What do you want to confess?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000);

  const row = new ActionRowBuilder().addComponents(confessionInput);

  modal.addComponents(row);

  await interaction.showModal(modal);
}
