const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Affiche la latence du bot !"),
  async execute(interaction) {
    await interaction.reply(
      `Pong! Avec une latence de: ${
        Date.now() - interaction.createdTimestamp
      }ms.`
    );
  },
};
