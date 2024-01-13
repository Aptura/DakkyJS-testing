const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprime un nombre spécifique de messages.")
    .addIntegerOption((option) =>
      option
        .setName("nombre")
        .setDescription("Nombre de messages à supprimer du channel.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("cible")
        .setDescription("Suppression des messages de l'utilisateur spécifié.")
    ),
  userPermission: [PermissionFlagsBits.ManageMessages],
  botPermission: [PermissionFlagsBits.ManageMessages],

  async execute(interaction, client) {
    const { options, channel } = interaction;
    let amount = options.getInteger("nombre");
    const target = options.getUser("Cible");
    const multiMsg = amount === 1 ? "message" : "messages";

    if (!amount || amount > 100 || amount < 1) {
      return await interaction.reply({
        content: "Veuillez entrer un nombre entre 1 et 100.",
        ephemeral: true,
      });
    }
    try {
      const channelMessages = await channel.messages.fetch();

      if (channelMessages.size === 0) {
        return await interaction.reply({
          content: "Aucun messages à supprimer ici.",
          ephemeral: true,
        });
      }

      if (amount > channelMessages.size) amount = channelMessages.size;

      const clearEmbed = new EmbedBuilder().setColor(mConfig.embedColorSuccess);

      await interaction.deferReply({ ephemeral: true });

      let messagesToDelete = [];

      if (target) {
        let i = 0;
        channelMessages.forEach((m) => {
          if (m.author.id === target.id && messagesToDelete.length < amount) {
            messagesToDelete.push(m);
            i++;
          }
        });

        clearEmbed.setDescription(`
            \`✅\` Suppresion réussie de \`${messagesToDelete.length}\` ${multiMsg} de ${target} dans ${channel}.
        `);
      } else {
        messagesToDelete = channelMessages.first(amount);
        clearEmbed.setDescription(`
            \`✅\` Suppresion réussie de \`${messagesToDelete.length}\` ${multiMsg} dans ${channel}.
        `);
      }

      if (messagesToDelete.length > 0) {
        await channel.bulkDelete(messagesToDelete, true);
      }

      await interaction.editReply({ embeds: [clearEmbed] });
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: "Une erreur est survenue pendant la suppression des messages.",
        ephemeral: true,
      });
    }
  },
};
