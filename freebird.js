var Botkit = require('botkit')

// load bot secret file
const bot_secret = require('./lib/bot-secret')
const app_settings = require('./conf/settings.json')

// load common bot functions
var app_name = bot_secret.discord_server_name
var bot = require('./lib/bot')
var freebird = new bot()

var delete_after = app_settings.settings.delete_after
console.log(delete_after)

//setup connection to discord
var discord = require('discord.js')
var discord_bot = new discord.Client()
discord_bot.login(bot_secret.freebird_secret_token)

// setup connection to the database
var chan_bluebird
discord_bot.on('ready', () => {})

discord_bot.on('message', (receivedMessage) => {
  // copy all messages to the bluebird channel
  // except messages in the bluebird channel
  var msg_chan = receivedMessage.channel.name
  if (msg_chan == app_name) {
  } else {
    if (receivedMessage.author != discord_bot.user) {
      // limit to numbered channels
      if (msg_chan.match(/^\d+/)) {
        var msg = receivedMessage.id
        receivedMessage.delete(delete_after)
      }
    }
  }
})
