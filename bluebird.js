var Botkit = require('botkit')

// load bot secret file
const bot_secret = require('./lib/bot-secret')

// load common bot functions
var app_name = "bluebird"
var bot = require('./lib/bot')
var bluebird = new bot()

// setup connection to discord
var discord = require('discord.js')
var discord_bot = new discord.Client()
discord_bot.login(bot_secret.bluebird_secret_token)

// welcome messages
var welcome_file = require('./conf/welcome.json')
welcome = welcome_file.welcome

var welcome_message = welcome.greeting
var disclaimer = welcome.disclaimer
var unsubscribe = welcome.unusbscribe

var keywords = ["start","stop","delete","code"]

// setup connection to the database
var chan_bluebird
discord_bot.on('ready', () => {
    chan_bluebird = getDiscordChannelID(app_name)
    console.log("Bluebird channel: " + chan_bluebird.id)
})

discord_bot.on('message', (receivedMessage) => {
  // copy all messages to the bluebird channel
  // except messages in the bluebird channel
  var msg_chan = receivedMessage.channel.name
  if (msg_chan == app_name) {
      // copy to numbered channels
      discord_bot.guilds.forEach((guild) => {
        guild.channels.forEach((channel) => {
          if ((channel.name.match(/^\d+/)) && (guild.name == receivedMessage.guild.name)) {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
            channel.send("R10T: " + receivedMessage.content)
          }
        })
      })
  } else {
    if (receivedMessage.author != discord_bot.user) {
      // limit to numbered channels
      if (msg_chan.match(/^\d+/)) {
        // is not welcome message
        if ((receivedMessage.content != welcome_message) && (receivedMessage.content != disclaimer) && (receivedMessage.content != unsubscribe)) { 
          // process stop request
          var isKeyword = false
          for (var i in keywords) {
            if (receivedMessage.content.toLowerCase() == keywords[i]) {
              isKeyword = true
            }
          }

          if (receivedMessage.content.toLowerCase() == "delete") {
            var delchan = receivedMessage.channel
            receivedMessage.channel.send(unsubscribe)
            delchan.delete()
          }

          if (!(isKeyword)) {
            // post to all channels called "[app_name]"
            discord_bot.guilds.forEach((guild) => {
              guild.channels.forEach((channel) => {
                if (channel.name.toLowerCase() == app_name) {
                  channel.send(receivedMessage.content)
                }
              })
            })
          }
        }
      }
    }
  }
})

// general functions
// get a discord channel by name 
function getDiscordChannelID(name) {
    var retVal = 0
    discord_bot.guilds.forEach((guild) => {
		guild.channels.forEach((channel) => {
			if (channel.name.includes(name)) {
				retVal  = channel
			}
		})
    })
    return retVal
}

// create a new discord channel
function createDiscordChannel(guild,channel_name) {
    return new Promise(function(resolve, reject) {

        guild.createChannel(channel_name,"text",function(err) {
            if (err) {
                reject(err)
            } else {
                resolve("CHANNEL CREATED")
            }
        })
    })
}

// Post the first message from a user to the welcome channel
// since they can't post to their own channel yet as it's
// currently being created.
function firstMessageToWelcomeChannel(phone_number,message) {
    // Use user details from here
    var chan_welcome = getDiscordChannelID("welcome")
    var formatted = "<" + phone_number + "> " + message
    if (chan_welcome) {
        chan_welcome.send(formatted)
    }
}
