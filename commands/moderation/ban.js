const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Cette commande permet de ban un utilisateur du serveur.")
    .addUserOption((option) =>
      option
        .setName("pseudo")
        .setDescription("Pseudo de l'utilisateur qu'il faut ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("raison").setDescription("La raison du ban")
    ),
  async execute(interaction, client) {
    const banUser = interaction.options.getUser("pseudo");
    const banMember = await interaction.guild.members.fetch(banUser.id);
    const channel = interaction.channel;

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return await interaction.reply({
        content: "Vous devez avoir les permissions pour ban l'utilisateur",
        ephemeral: true,
      });
    if (!banMember)
      return await interaction.reply({
        content: "L'utilisateur n'est plus dans le serveur",
        ephemeral: true,
      });
    if (!banMember.bannable)
      return await interaction.reply({
        content:
          "Je ne peux pas ban l'utilisateur car son rôle est supérieur au miens ou au tiens.",
        ephemeral: true,
      });

    let reason = interaction.options.getString("raison");
    if (!reason) reason = "Pas de raison renseignée.";

    const dmEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `:white_check_mark: Vous avez été ban de **${interaction.guild.name}** | ${reason}`
      );

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `:white_check_mark: ${banUser.tag} a été **ban** | ${reason}`
      );

    await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
      return;
    });

    await banMember.ban({ reason: reason }).catch((err) => {
      interaction.reply({ content: "Il y a eu une erreur", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
