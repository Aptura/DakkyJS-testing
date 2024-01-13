const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Cette commande permet de unban un utilisateur du serveur.")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Pseudo de l'utilisateur qu'il faut unban")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { channel, options, guild } = interaction;
    const unbanUser = options.getString("idutilisateur");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return await interaction.reply({
        content: "Vous devez avoir les permissions pour unban l'utilisateur",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`\`✅\` L'ID: ${unbanUser} a été **unban**.`);

    await guild.members.unban(unbanUser).catch((err) => {
      interaction.reply({ content: "Il y a eu une erreur", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
