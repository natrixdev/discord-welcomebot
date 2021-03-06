const Discord = require("discord.js");
  const client = new Discord.Client();
  const config = require("./config.json");
  const package = require("./package.json");

//just passing an outside const for the restart from crash capability 
 function getClient() {
   return client;

 }
  //***THIS IS VITAL FOR THE LIFE OF THE BOT***//
  client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  });

  client.on("guildCreate", guild => {
    //This event is triggered when a new guild is added
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  });

  client.on("guildDelete", guild => {
    /* Go to the admin who banned the bot
    * and remove he from is admin position ;)
    */
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });

  client.on("error", error=>{
    const client = getClient();
    /*This event should fire after an error; destroy the client and create a new one an log in*/
    var timestamp = new Date();
    console.log(`Socket Error at ${timestamp} The bot will reconnect...`);
    console.log(`Socket error: ${error}`)
    client.destroy().catch(console.error)
    client.login(config.token).catch(console.error);
    console.log(`Socket connection reopend at ${timestamp} reconnection successfull`);
});

  client.on("message", async message => {
    //Ignore bot
    if(message.author.bot) return;

    // Ignore oder commands
    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "debug") {
      /* Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      *The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      */
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    if(command === "delete") {
      /* This command removes all messages from all users in the channel, up to 100.
       *get the delete count, as an actual number.
       */
      const deleteCount = parseInt(args[0], 10)
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
    if(command === "server" ){
      const m = await message.channel.send(`Fetching data...`);
      m.edit({embed:{
          color: 3447003,
          title: "**Server [name]** Statistiche",
          thumbnail:
              {
                url: client.user.avatarURL
            },
        timestamp: new Date(),
         fields:[
           {
             name:"**Membri**",
             value:`Membri Totali: **${message.guild.memberCount}**`
           }
         ],
        footer: {
          icon_url: client.user.avatarURL,
          text: "?? Server [name]  2019"
        }
      }
    });

    }
    if (command === "restart") {
        timestamp = new Date();
        const m = await message.channel.send(`Restarting bot...`);
        console.log(`Restarting bot....  Bot restart request : ${timestamp}`);
        message.client.destroy().catch(console.error);
        console.log(`Restarting bot....  Client destroied at : ${timestamp}`);
        client.login(config.token).then(console.log(`Restarting bot....  Bot joined at : ${timestamp}`)).catch(console.error);
        m.edit(`Bot restarted successfully at ${timestamp} await ready event`);
        console.log(`Bot restart procedure complete at ${timestamp} waiting ready event to fire...`);
  }

  //When a member join
  client.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    /*
    adding to the role the person that have joined to server without check
    */
    member.addRole(roleID).catch(console.error)

    console.log("Member added to role");

        member.send({embed:{
            color: 3447003,
            title: "**Server [name]** Welcome Bot!",
            description: config.message,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "?? Server [name] 2019"
          }
        }
      }).catch(console.error)
        timestamp = new Date();
        console.log(`"Welcome message sent at "${timestamp}`);
  });



  client.login(config.token);
