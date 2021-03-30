require("dotenv").config();
const path = require('path');
const Discord = require('discord.js');
const { MessageAttachment, MessageEmbed, PlayInterface } = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
const ytdl = require('ytdl-core')
const jsmediatags = require("jsmediatags");
const FileType = require('file-type');
const youtubeLinks = require('../public/links.json');
const e = require("express");



let connectedChannel;
let dispatcher;
let nowPlayingIndex;

client.on('ready', () => {
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

            const image = new MessageAttachment('http://localhost:8080/' + 'Home\ Movies\ -\ S1E01\ -\ Get\ Away\ From\ My\ Mom.avi');

            msg.channel.send({
                files: [
                    'http://localhost:8080/' + 'Home\ Movies\ -\ S1E01\ -\ Get\ Away\ From\ My\ Mom.avi'
                ]
            })

        })
    }

    if ((msg.content).toLowerCase() === 'play music' || (msg.content).toLowerCase() === 'next') {

        let song = await playRandomSong();

        let attachment = new MessageAttachment(song.albumCover, `albumCover.png`)

        let nowPlaying = new MessageEmbed()
            .setColor('#ff5e86')
            .setTitle('Now Playing: ')
            .addFields(
                { name: song.title, value: song.artist }
            )
            .attachFiles([attachment])
            .setImage(`attachment://albumCover.png`)
            .setFooter(song.album);

        msg.reply(nowPlaying)


        song.dispatcher.on('finish', async () => {
            let song = await playRandomSong();

            let attachment = new MessageAttachment(song.albumCover, `albumCover.png`);

            let nowPlaying = new MessageEmbed()
                .setColor('#ff5e86')
                .setTitle('Now Playing: ')
                .addFields(
                    { name: song.title, value: song.artist }
                )
                .attachFiles([attachment])
                .setImage(`attachment://albumCover.png`)
                .setFooter(song.album);

            msg.reply(nowPlaying)

        })

    }

    if (msg.content.startsWith('volume')) {
        dispatcher.setVolume(msg.content.split(" ")[1])
    }

    if (msg.content === 'play') {


        if (!dispatcher) {
            msg.reply("Nothing was fucking playing that could be resumed you fucking dumbass")
            return;
        }

        dispatcher.resume();


    } else if (msg.content.split(' ').length === 2 && msg.content.split(" ")[0] === 'play' && msg.content.split(" ")[1].substring(0, 23) === 'https://www.youtube.com') {

        dispatcher = connectedChannel.play(ytdl(msg.content.split(' ')[1], { filter: 'audioonly' }));

    }


    if (msg.content === 'pause') {
        dispatcher.pause();
    }

    if (msg.content === 'funny cat') {
        const image = new MessageAttachment('http://localhost:8080/tumblr_6e6c1e4b54d27fcd445f5ceff12b0c0b_47bdf23f_500.png');
        msg.reply(image)
    }
});

playRandomSong = () => {

    return new Promise((resolve, reject) => {

        fs.readdir(path.join(__dirname + `../../../../../Music`), (err, files) => {

            let choice = Math.floor((Math.random() * files.length) + 1);

            if (err) {
                throw err;
            }

            let song = files[choice]


            dispatcher = connectedChannel.play('http://localhost:8080/' + song, { volume: .08 });


            jsmediatags.read('http://localhost:8080/' + song, {
                onSuccess: async tag => {

                    let songInfo = {
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        albumCover: '',
                        albumCoverImageType: '',
                        album: tag.tags.album,
                        dispatcher
                    }

                    if (tag.tags.picture) {
                        songInfo.albumCover = await new Buffer.from(tag.tags.picture.data)
                        // songInfo.albumCoverImageType = await FileType.fromBuffer(songInfo.albumCover)
                        songInfo.albumCoverImageType = 'png'
                        console.log(await FileType.fromBuffer(songInfo.albumCover).ext)
                    } else if (tag.tags.APIC) {
                        songInfo.albumCover = await new Buffer.from(tag.tags.albumCover.data);
                        songInfo.albumCoverImageType = 'png'
                        // songInfo.albumCoverImageType = await FileType.fromBuffer(songInfo.albumCover)
                        console.log(await FileType.fromBuffer(songInfo.albumCover).ext)
                    } else {
                        songInfo.albumCover = 'http://localhost:8080/placeholder.png';
                        songInfo.albumCoverImageType = 'png'
                    }
                    resolve(songInfo)
                },
                onError: (error) => {
                    reject(error.type, error.info)
                }
            });
        })

    }).catch(err => console.log(err))
}





webPlaySong = async () => {
    let song = await playRandomSong();

    client.channels.fetch('707049872326525008').then(channel => {

        let attachment = new MessageAttachment(song.albumCover, `albumCover.png`)

        let nowPlaying = new MessageEmbed()
            .setColor('#ff5e86')
            .setTitle('Now Playing: ')
            .addFields(
                { name: song.title, value: song.artist }
            )
            .attachFiles([attachment])
            .setImage(`attachment://albumCover.png`)
            .setFooter(song.album);

        channel.send(nowPlaying)


        song.dispatcher.on('finish', async () => {
            let song = await playRandomSong();

            let attachment = new MessageAttachment(song.albumCover, `albumCover.png`);

            let nowPlaying = new MessageEmbed()
                .setColor('#ff5e86')
                .setTitle('Now Playing: ')
                .addFields(
                    { name: song.title, value: song.artist }
                )
                .attachFiles([attachment])
                .setImage(`attachment://albumCover.png`)
                .setFooter(song.album);

            channel.send(nowPlaying)

        })
    })
}


playYoutubeSong = async (link) => {
    let thing = await ytdl.getInfo(link)
    console.log(thing)



    //USE INDEX OF usiing the json file and make it play the next song in the list when finished


    dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
    dispatcher.setVolume(0.05)
}


webPauseSong = () => {
    dispatcher.pause();
}

webResumeSong = (index) => {
    if (!dispatcher) {
        // index = 0
        dispatcher = connectedChannel.play(ytdl(youtubeLinks[0], { filter: 'audioonly' }));
        dispatcher.setVolume(0.03);
        dispatcher.on('finish', async () => {
            this.playYoutubeSong(youtubeLinks[Math.floor(Math.Random() * 10) + 10]);
        });
    } else {
        dispatcher.resume();
    }
}

webPlayPrevious = (index) => {
    console.log(index);
    let link = youtubeLinks[index].link
    dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
    dispatcher.setVolume(0.03);
}

webPlayNext = (index) => {
    console.log(index)
    let link = youtubeLinks[index].link;
    dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
    dispatcher.setVolume(0.03);
}


addYoutubeLink = async (link) => {

    let weGood = ytdl.validateURL(link)

    if (!weGood) {
        console.log("NO WE AREN'T GOOD")
        return;
    }
    let linkInfo = await ytdl.getInfo(link);

    youtubeLinks.push({
        title: linkInfo.player_response.videoDetails.title,
        link: link,
        image: linkInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    });


    return fs.writeFile(path.join(__dirname + `/../public/links.json`), JSON.stringify(youtubeLinks), err => {
        if (err) {
            console.log(err)
            return err
        } else {
            return 'File appended.'
        }
    })
    // })
}

volumeDown = () => {
    let volume = dispatcher.volume;
    volume = volume - 0.01;
    dispatcher.setVolume(volume);
    return
}

volumeUp = () => {
    let volume = dispatcher.volume;
    volume = volume + 0.01;
    dispatcher.setVolume(volume);
    return
}

client.login(process.env.DISCORD_TOKEN);

module.exports = {
    playYoutubeSong,
    webPlaySong,
    webPauseSong,
    webResumeSong,
    webPlayPrevious,
    webPlayNext,
    addYoutubeLink,
    volumeDown,
    volumeUp
}
