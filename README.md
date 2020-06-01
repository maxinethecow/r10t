# R10T for Discord

## What is R10T

R10T is a "[dead drop](https://en.wikipedia.org/wiki/Dead_drop)" for text messages. It allows you to send anonymized text messages to an anonymized group -- meaning that you don't know who you are sending to and they don't know who is sending the message. 

## Why do I need it?

During periods of unrest civil liberties are usually suspended or even outright removed. R10T allows you to communicate with a group of people without identifying the group and without keeping identifying records. This way you can't give away the participants of your group because you don't know who they are. For added protection all text messages should be sent through apps or burner phones. 

### What happens to messages when they are sent to R10T

A message sent to R10T is anonymously copied to all members of the R10T server (people who have sent a text to a specific phone number). The R10T message is then syndicated to the R10T network where others may see it. R10T messages may be subscribed to over Discord, Twitter or other platforms. 

### A note on security

R10T is not "secure" in the traditional sense. Messages are sent unencrypted and in plain text. The only security feature R10T explicitly provides is anonymization, however it provides an additional advantage: pop-up servers and disposable phone numbers. With R10T and Discord, you can create and switch between new phone numbers easily deleting whole servers and putting new ones up with only a change to the phone number. Message history can be turned off to provide additional layers of security. 

### SIMPLE INSTALLATION: Install the R10T Client for Discord

To intall the R10T client, create a discord server and invite the Bluebird bot to it. Create a channel called #bluebird and the Bluebird bot will place incoming R10T messages into it. Discord users may reply to R10T messages but they will NOT be seen by R10T users unless the R10T administrator has configured the "feedback" option (not enabled by default)

To install the Bluebird bot on your discord server, use this link:

https://discord.com/oauth2/authorize?client_id=716585130554163230&scope=bot

### FULL INSTALLATION: Install the R10T Server

* Linux VM
* NodeJS
* PM2 (npm install PM2 --global)

The R10T server uses three bots all written in NodeJS. The bots can be deployed on any platform you choose but right now I have them deployed on a single Ubuntu 18.04 VM so the instructions will be written for that case. I'll create a Kubernetes version on gCloud for scalability but for right now this was the easiest way to do it. 

#### Copy the example credential files

cp ./lib/bot-secret.example.js ./lib/bot-secret.js

#### Create a set of bots for your server

Go to [Discord Applications](https://discord.com/developers/applications/) and create a new application called "BlueBird" (or whatever you'd like). Then go to "Bot" and click "Create Bot". From the "General Information" page copy the [CLIENT ID] and paste it into this link: 

https://discord.com/oauth2/authorize?client_id=[CLIENT ID]&scope=bot

#### Authorize your bot 

From the "Bot" page of Discord Applications, copy the secret token into /lib/bot-secret.js

#### Repeat the steps and create a new Discord application called Blackbird

### Note: Skip this step for standard configuration 

I have included a third bot called Freebird which deletes non-anonymized log files as they are created. automatically delete non-anonymized messages as they come in with an inverval specified in conf/settings.json. Installing Freebird will REMOVE the ability to moderate content and make your group more susceptible to infiltration. I do not recommend it unless you can tightly control membership to your R10T server. Freebird will NOT delete records kept by Discord such as archives or backups. It uses the API deleteMessage function documented here: https://discord.com/developers/docs/resources/channel#delete-message

#### Bot Permissions on Discord

* Create a new role on your discord server called "bot"
* Give the role permissions of "Manage Channels" and "Manage Messages"
* Assign Blackbird, Bluebird and Freebird to the Bot role

If you do NOT do this Freebird cannot delete messages and Blackbird cannot create channels (in short, the app won't work right). If your installation is not working and you feel like you have done everything right, check this step.

### Run the bots

> pm2 start bluebird

> pm2 start blackbird

> pm2 start freebird 
