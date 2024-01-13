const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Cette commande permet de unban un utilisateur du serveur.")
    .addUserOption((option) =>
      option
        .setName("pseudo")
        .setDescription("Pseudo de l'utilisateur qu'il faut unban")
        .setRequired(true)
    ),
  async execute(interaction) {
    const unbanUser = interaction.options.getUser("pseudo");
    const unbanMember = await interaction.guild.bans.fetch(unbanUser.id);

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return await interaction.reply({
        content: "Vous devez avoir les permissions pour unban l'utilisateur",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`:white_check_mark: ${unbanUser.tag} a été **unban**`);

    await interactionguild.members.unban(unbanMember).catch((err) => {
      interaction.reply({ content: "Il y a eu une erreur", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
