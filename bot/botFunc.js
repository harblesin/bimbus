require('dotenv').config();
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require("path");
const jsmediatags = require("jsmediatags");



getRandomPic = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(process.env.PIC_DIR, (err, files) => {
            let choice = Math.floor((Math.random() * files.length) + 1);
            if (err) {
                reject(err);
            }
            resolve(files[choice]);
        });
    }).catch(err => { return err });
}

playRandomSong = (msg) => {
    return new Promise(async (resolve, reject) => {
        let song = await getRandomSong();
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

        msg.reply(nowPlaying);

        dispatcher = connectedChannel.play('http://localhost:8080/' + song.song, { volume: .08 });
        song.dispatcher.on('finish', async () => {
            await playRandomSong(msg);
        });
        resolve(dispatcher);
    }).catch(err => { return err });
}

createMessageEmbed = (songInfo) => {
    return new Promise((resolve, reject) => {
        let attachment = new MessageAttachment(songInfo.albumCover, `albumCover.png`)
        let nowPlaying = new MessageEmbed()
            .setColor('#ff5e86')
            .setTitle('Now Playing: ')
            .addFields(
                { name: songInfo.title, value: songInfo.artist }
            )
            .attachFiles([attachment])
            .setImage(`attachment://albumCover.png`)
            .setFooter(songInfo.album);
        resolve(nowPlaying);
    })
}

getRandomSong = () => {

    return new Promise((resolve, reject) => {

        fs.readdir(path.join(__dirname + process.env.ROOT_DIR), (err, files) => {

            let choice = Math.floor((Math.random() * files.length) + 1);

            if (err) {
                throw err;
            }

            let song = files[choice]

            // dispatcher = connectedChannel.play('http://localhost:8080/' + song, { volume: .08 });

            jsmediatags.read('http://localhost:8080/' + song, {
                onSuccess: async tag => {

                    let songInfo = {
                        song,
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        albumCover: '',
                        albumCoverImageType: '',
                        album: tag.tags.album
                    }

                    if (tag.tags.picture) {
                        songInfo.albumCover = await new Buffer.from(tag.tags.picture.data)
                        songInfo.albumCoverImageType = 'png'
                    } else if (tag.tags.APIC) {
                        songInfo.albumCover = await new Buffer.from(tag.tags.albumCover.data);
                        songInfo.albumCoverImageType = 'png'
                    } else {
                        songInfo.albumCover = 'http://localhost:8080/placeholder.png';
                        songInfo.albumCoverImageType = 'png'
                    }
                    return resolve(songInfo)
                },
                onError: (error) => {
                    return reject(error.type, error.info)
                }
            });
        })

    });
}

validatePlayType = (secondWord, dispatcher) => {
    return new Promise(async (resolve, reject) => {
        if (secondWord === 'music') {
            let songInfo = await getRandomSong();
            let embed = await createMessageEmbed(songInfo);
            resolve({ songInfo, embed })
        }
    })

}

module.exports = {
    getRandomPic,
    getRandomSong,
    validatePlayType
}

