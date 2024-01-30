const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("e621-random")
    .setDescription(
      "Reçois une image random de chez https://e621.net ! (Attention possible nsfw)"
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const response = await axios.get("https://e621.net/posts/random.json", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
        },
      });

      const imageUrl = response.data.post.file.url;

      const embed = new EmbedBuilder()
        .setColor("LuminousVividPink")
        .setDescription("Voici ton image !")
        .setImage(imageUrl);

      await interaction.editReply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image :", error);
      await interaction.followUp(
        "Une erreur s'est produite lors de la récupération de l'image."
      );
    }
  },
};
