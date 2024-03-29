require('dotenv').config();
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require("path");
const jsmediatags = require("jsmediatags");



getRandomPic = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(process.env.PIC_DIR, (err, files) => {
            if (err) {
                reject(err);
            }
            let choice = Math.floor((Math.random() * files.length) + 1);
            resolve(files[choice]);
        });
    }).catch(err => { return err });
}

getRandomNeuralPic = () => {
    return new Promise((resolve, reject) => {
        console.log(process.env.NEURAL_PIC_DIR)
        fs.readdir(process.env.NEURAL_PIC_DIR, (err, files) => {
            console.log(files)
            if (err) {
                reject(err);
            }
            let choice = Math.floor((Math.random() * files.length) + 1);
            resolve(files[choice]);
        });
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

            let fileName = files[choice]

            jsmediatags.read(`http://localhost:${process.env.NODE_SERVER_PORT}/` + fileName, {
                onSuccess: async tag => {

                    let songInfo = {
                        fileName,
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

getSongFromPlaylist = async (index) => {
    return new Promise((resolve, reject) => {

        fs.readdir(path.join(__dirname + process.env.ROOT_DIR + 'youtube'), (err, files) => {

            files = files.filter(f => f !== 'desktop.ini');

            if (err) {
                reject(err);
            }

            let fileName = files[index];
            let albumFile = fileName.split('.mp4').join('');
            let songInfo = {
                fileName,
                title: fileName,
                artist: ' - ',
                album: ' - ',
                albumCover: `http://localhost:${process.env.NODE_SERVER_PORT}/artwork/${albumFile}.jpg`,
            }
            return resolve(songInfo)

        });

    }).catch(err => console.log(err))
}


module.exports = {
    getRandomPic,
    getRandomNeuralPic,
    getRandomSong,
    getSongFromPlaylist,
    createMessageEmbed
}

