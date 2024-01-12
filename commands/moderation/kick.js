const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Cette commande permet de kick un utilisateur du serveur.")
	.addUserOption((option) =>
      option
        .setName("pseudo")
        .setDescription("Pseudo de l'utilisateur qu'il faut kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("raison").setDescription("La raison du kick")
    ),
  async execute(interaction, client) {
    const kickUser = interaction.options.getUser("pseudo");
    const kickMember = await interaction.guild.members.fetch(kickUser.id);
    const channel = interaction.channel;

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    )
      return await interaction.reply({
        content: "Vous devez avoir les permissions pour kick l'utilisateur",
        ephemeral: true,
      });
    if (!kickMember)
      return await interaction.reply({
        content: "L'utilisateur n'est plus dans le serveur",
        ephemeral: true,
      });
    if (!kickMember.kickable)
      return await interaction.reply({
        content:
          "Je ne peux pas kick l'utilisateur car son rôle est supérieur au miens ou au tiens.",
        ephemeral: true,
      });

    let reason = interaction.options.getString("raison");
    if (!reason) reason = "Pas de raison renseignée.";

    const dmEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `:white_check_mark: Vous avez été kick de **${interaction.guild.name}** | ${reason}`
      );

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `:white_check_mark: ${kickUser.tag} a été **kick** | ${reason}`
      );

    await kickMember.send({ embeds: [dmEmbed] }).catch((err) => {
      return;
    });

    await kickMember.kick({ reason: reason }).catch((err) => {
      interaction.reply({ content: "Il y a eu une erreur", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
