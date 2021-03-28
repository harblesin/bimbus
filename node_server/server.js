require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const Discord = require('discord.js');
const { MessageAttachment, PlayInterface } = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
const ytdl = require('ytdl-core')
var jsmediatags = require("jsmediatags");


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../../../../../Desktop/")));
app.use(express.static(path.join(__dirname + "../../../../../Pictures")));
app.use(express.static(path.join(__dirname + "../../../../../Music")))
app.use(express.static(path.join(__dirname + "../../../../../Videos")))


let connectedChannel;
let dispatcher;

client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}`);




    client.channels.fetch('319404366518026240').then(async channel => {
        connectedChannel = await channel.join();

    })


});




client.on('message', async msg => {



    if (msg.content === 'join') {
        connectedChannel = await msg.member.voice.channel.join();
    }



    if (msg.content === 'bot') {

        msg.reply("You think youre so fucking funny don't you, suck my fat ass")
    }

    if (msg.content === 'random pic') {
        fs.readdir(path.join(__dirname + `../../../../../Pictures`), (err, files) => {

            let choice = Math.floor((Math.random() * files.length) + 1);

            if (err) {
                throw err;
            }

            const image = new MessageAttachment('http://localhost:8080/' + files[choice]);

            msg.reply(image)

        })
    }

    if (msg.content === "play movie") {
        fs.readdir(path.join(__dirname + `../../../../../Videos`), (err, files) => {

            let choice = Math.floor((Math.random() * files.length) + 1);

            if (err) {
                throw err;
            }

            console.log("hey dude yeah hahah")

            const image = new MessageAttachment('http://localhost:8080/' + 'Home\ Movies\ -\ S1E01\ -\ Get\ Away\ From\ My\ Mom.avi');

            msg.channel.send({
                files: [
                    'http://localhost:8080/' + 'Home\ Movies\ -\ S1E01\ -\ Get\ Away\ From\ My\ Mom.avi'
                ]
            })

        })
    }

    if ((msg.content).toLowerCase() === 'play music' || (msg.content).toLowerCase() === 'next') {
        

        let song  = await playRandomSong();

        let albumCover = new MessageAttachment(song.albumCover)

        msg.reply(`Now Playing ${song.title} by ${song.artist}`, albumCover);

        song.dispatcher.on('finish', async () => {
           let song = await playRandomSong();

           let albumCover = new MessageAttachment(song.albumCover)

           msg.reply(`Now Playing ${song.title} by ${song.artist}`, albumCover);

        })

    }

    if (msg.content === 'play') {


        if (!dispatcher) {
            msg.reply("Nothing was fucking playing that could be resumed you fucking dumbass")
            return;
        }

        dispatcher.resume();


    } else if (msg.content.split(' ').length === 2 && msg.content.split(" ")[0] === 'play' && msg.content.split(" ")[1].substring(0, 23) === 'https://www.youtube.com') {

        connectedChannel.play(ytdl(msg.content.split(' ')[1], { filter: 'audioonly' }));

    }


    if (msg.content === 'pause') {
        dispatcher.pause();
    }

    if (msg.content === 'funny cat') {
        const image = new MessageAttachment('http://localhost:8080/tumblr_6e6c1e4b54d27fcd445f5ceff12b0c0b_47bdf23f_500.png');
        msg.reply(image)
    }
});




const playRandomSong = () => {

    return new Promise((resolve, reject) => {

        fs.readdir(path.join(__dirname + `../../../../../Music`), (err, files) => {

            let choice = Math.floor((Math.random() * files.length) + 1);

            if (err) {
                throw err;
            }

            let song = files[choice]


            dispatcher = connectedChannel.play('http://localhost:8080/' + song, { volume: 0.25 });


            jsmediatags.read('http://localhost:8080/' + song, {
                onSuccess: tag => {

                    console.log(tag)

                    let songInfo = {
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        albumCover: tag.tags.picture ? new Buffer.from(tag.tags.picture.data) : tag.tags.APIC ? new Buffer.from(tag.tags.APIC.data) : '',
                        dispatcher
                    }

                    resolve(songInfo)

                },
                onError: (error) => {
                    reject(error.type, error.info)
                    // console.log(error.type, error.info)
                }
            });
        })

    }).catch( err => console.log(err))
}




client.login(process.env.DISCORD_TOKEN);


app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})