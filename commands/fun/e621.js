const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("e621")
    .setDescription(
      "Reçois une image des 20 posts les plus récents de chez https://e621.net ! (Attention possible nsfw)"
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Fais un appel à ton API d'images random
    try {
      function getRandomLimit() {
        // Génère un nombre aléatoire entre 1 et 20
        return Math.floor(Math.random() * 20) + 1;
      }

      const randomLimit = getRandomLimit();
      const apiUrl = `https://e621.net/posts.json?limit=${randomLimit}`;

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
        },
      });

      // Vérifiez que des posts sont retournés
      if (response.data.posts.length === 0) {
        console.error("Aucune image n'a été retournée.");
        await interaction.followUp(
          "Aucune image n'a été trouvée. Réessayez plus tard."
        );
        return;
      }

      // Choisissez aléatoirement parmi les images retournées
      const randomIndex = Math.floor(
        Math.random() * response.data.posts.length
      );
      const imageUrl = response.data.posts[randomIndex].file.url;

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
