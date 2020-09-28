/*
MRT Adjacent Discord Security
V1.0.0
Author: DintyB
*/

//Discord Configuration
const Discord = require('discord.js');
const bot = new Discord.Client();

//fetch environment variables and log into Discord API
require('dotenv').config();
const token = process.env.TOKEN;
bot.login(token);

//create a web page, which can be pinged by an uptime robot to keep the script alive
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send("e"));
app.listen(port, () => console.log(`app listening at http://localhost:${port}`));

//execute when the script has logged into the Discord API
bot.on('ready', () => {
    console.log('App is online.');
})
//execute when a member is added to a guild
bot.on('guildMemberAdd', (auxiliaryMember) => {

    //define variables (executed within this because it involves fetching from the Discord API)
    const MRTServer = bot.guilds.cache.get('760190548563722351');
    const loggingChannel = bot.channels.cache.get('760214588850962524');


    if (auxiliaryMember.guild === MRTServer) return 0; //ignore member being added to mrt discord


    if (!MRTServer.member(auxiliaryMember.user.id)) {//if user isnt on the mrt discord
        let owner = bot.users.cache.get(auxiliaryMember.guild.ownerID);
        let tag = auxiliaryMember.user.tag;
        let guild = auxiliaryMember.guild.name;

        if(!auxiliaryMember.bannable) return owner.send('A suspicious user joined your Discord, but I was unable to ban them. Please ensure that I have the appropriate permissions and that my role is above the default role.');
        if(auxiliaryMember.user.bot) return 0; //ignore bots

        auxiliaryMember.send(`You don't seem to be a member of the MRT Discord. Ask a staff member in-game for the link and once you have joined, ask ${owner} (${owner.tag}) to be unbanned.`).then(() => {
            auxiliaryMember.ban({ reason: 'Not on the MRT Discord' }).then(() => {
                loggingChannel.send(`Banned ${tag} from ${guild}.`);
                if (auxiliaryMember.guild.systemChannel) {
                    auxiliaryMember.guild.systemChannel.send(`:white_check_mark: banned ${tag}`).catch(err =>{
                        console.log(err);
                    })
                }
            })

        })
    }
})