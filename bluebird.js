var Botkit = require('botkit')

// load bot secret file
const bot_secret = require('./lib/bot-secret')

// load common bot functions
var bot = require('./lib/bot')
var bluebird = new bot()

// setup connection to discord
var discord = require('discord.js')
var discord_bot = new discord.Client()
discord_bot.login(bot_secret.bluebird_secret_token)

// setup connection to the database
var chan_bluebird
discord_bot.on('ready', () => {
    chan_bluebird = getDiscordChannelID("bluebird")
    console.log("Bluebird channel: " + chan_bluebird.id)
})

discord_bot.on('message', (receivedMessage) => {
    // copy all messages to the bluebird channel
    // except messages in the bluebird channel
    var msg_chan = receivedMessage.channel.name
    if (msg_chan  == "bluebird") {

    } else {
      // limit to numbered channels
      if (msg_chan.match(/^\d+/)) {
        chan_bluebird.send(receivedMessage.content)
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
