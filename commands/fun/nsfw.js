const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("Reçois une image random"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Fais un appel à ton API d'images random
    try {
      function getRandomUrl(urls) {
        // Vérifie que le tableau n'est pas vide
        if (urls.length === 0) {
          return null;
        }
        const randomIndex = Math.floor(Math.random() * urls.length);
        return urls[randomIndex];
      }

      const tabUrl = [
        "https://v2.yiff.rest/furry/yiff/gay",
        "https://v2.yiff.rest/furry/yiff/andromorph",
        "https://v2.yiff.rest/furry/yiff/gynomorph",
        "https://v2.yiff.rest/furry/yiff/lesbian",
        "https://v2.yiff.rest/furry/yiff/straight",
        "https://v2.yiff.rest/furry/bulge",
        "https://v2.yiff.rest/furry/butts",
      ];

      const randomImageUrl = getRandomUrl(tabUrl);

      const response = await axios.get(randomImageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0", // Change le User-Agent ici
        },
      });

      const imageUrl = response.data.images[0].url;

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
