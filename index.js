const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: 3276799 });

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`La commande : ${interaction.commandName} n'existe pas.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Une erreur est survenue lors de l'exécution de la commande !",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Une erreur est survenue lors de l'exécution de la commande !",
        ephemeral: true,
      });
    }
  }
});

client.on('guildMemberAdd', (member) => {
  const hello = client.emojis.cache.find(emoji => emoji.name === "hello");
  const welcomeChannel = member.guild.channels.cache.get('1070083254515929161');
  const welcomeMessage = `Bienvenue <@${member.id}>, mets-toi à l'aise ! ${hello}`;

  welcomeChannel.send({ content: welcomeMessage }).then(() => {
    // Fais d'autres choses après l'envoi du message si nécessaire
  }).catch((error) => {
    console.error("Erreur lors de l'envoi du message de bienvenue :", error);
  });
});

client.login(token);
