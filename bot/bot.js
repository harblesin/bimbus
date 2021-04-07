require("dotenv").config();
const path = require('path');
const https = require('https');
const Discord = require('discord.js');
const { MessageAttachment, MessageEmbed, PlayInterface } = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const ffmetadata = require('ffmetadata');
const jsmediatags = require("jsmediatags");
const FileType = require('file-type');
const youtubeLinks = require('../public/links.json');
const fetch = require('node-fetch');
const webp = require('webp-converter');
webp.grant_permission();
if (process.env.NODE_ENV !== 'production') {
    ffmetadata.setFfmpegPath(path.join(__dirname + `../../../../../Music/ffmpeg.exe`))
}


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

        await playRandomSong(msg);

    }

    if (msg.content.startsWith('volume')) {
        dispatcher.setVolume(msg.content.split(" ")[1]);
    }

    if (msg.content.indexOf("giphy.com") !== -1) {
        msg.reply("You have posted cringe, borther. Deleted.");
        setTimeout(() => {
            msg.delete()
        }, 3000)
    }

    if (msg.content === 'play') {

        if (!dispatcher) {
            msg.reply("Nothing was fucking playing that could be resumed you fucking dumbass")
            return;
        }

        dispatcher.resume();

    } else if (msg.content.split(' ').length === 2 && msg.content.split(" ")[0] === 'play' && msg.content.split(" ")[1].substring(0, 23) === 'https://www.youtube.com') {

        dispatcher = connectedChannel.play(ytdl(msg.content.split(' ')[1], { filter: 'audioonly' }));
        dispatcher.setVolume(.2)

    }

    if (msg.content === 'pause') {
        dispatcher.pause();
    }

    if (msg.content === 'funny cat') {
        const image = new MessageAttachment('http://localhost:8080/tumblr_6e6c1e4b54d27fcd445f5ceff12b0c0b_47bdf23f_500.png');
        msg.reply(image)
    }

    if (msg.content === "clown god") {
        const imageOne = new MessageAttachment('http://localhost:8080/tumblr_69449ee3f4608eb25866ea5390bd2853_047d4e80_1280.jpg');
        msg.reply(imageOne)
        const imageTwo = new MessageAttachment('http://localhost:8080/tumblr_f60bf51d288cc3f78d7561fcb110ff72_fc5e7a0f_1280.jpg');
        msg.reply(imageTwo);
        const imageThree = new MessageAttachment('http://localhost:8080/tumblr_1effe81844992dbb96263241b76b1e49_b7d45104_1280.jpg');
        msg.reply(imageThree);
    }


    if (msg.content.split(" ")[0] === '!download') {
        let url = msg.content.split(' ')[1];
        msg.delete();
        let res = await downloadSong(url).catch(err => console.log(err));
        msg.reply(res)
    }


    if (msg.content.startsWith('!playlists')) {
        let dir;
        if (process.env.NODE_ENV === "production") {
            dir = path.join(__dirname + "../../../../../../srv/Music/youtube")
        } else {
            dir = path.join(__dirname + "../../../../../Music/youtube");
        }
        let list = listPlaylists(dir);
        let newList = [];

        list.forEach((l, index) => {
            newList.push({ name: index, value: l.name });
        })

        let res = {
            title: "PLAYLISTS :)",
            fields: newList
        };

        msg.reply({ embed: res })

    }

    if (msg.content.startsWith('!playlist')) {
        let playlistIndex = msg.content.split(" ")[0];

        let playlist = listPlaylist(playlistIndex);
        let newList = [];

        playlist.filter(p => p.name !== 'desktop.ini').forEach((l, index) => {
            newList.push({ name: index, value: l.name });
        })

        let res = {
            title: "PLAYLISTS :)",
            fields: newList
        };

        msg.reply({ embed: res })

    }

    if (msg.content.startsWith('!play')) {
        let index = msg.content.split(" ")[1];
        if (!index) {
            msg.reply("you have to pick a song dumbass")
        }
        let song = await playSong(index);

        let attachment = new MessageAttachment(song.albumCover, `albumCover.jpg`)

        let nowPlaying = new MessageEmbed()
            .setColor('#ff5e86')
            .setTitle('Now Playing: ')
            .addFields(
                { name: song.title, value: song.artist }
            )
            .attachFiles([attachment])
            .setImage(`attachment://albumCover.jpg`);

        msg.send(nowPlaying)

        song.dispatcher.on('finish', async () => {
            let song = await playSong(0);

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

            msg.send(nowPlaying)

        })


    }

});

listPlaylist = (index) => {
    if (process.env.NODE_ENV === 'production') {
        return fs.readdirSync(path.join(__dirname + "../../../../../../srv/Music/youtube"), { withFileTypes: true }).filter(dirent => !dirent.isDirectory());
    } else {
        return fs.readdirSync(path.join(__dirname + "../../../../../Music/youtube"), { withFileTypes: true }).filter(dirent => !dirent.isDirectory());
    }
}

listPlaylists = (dir) => {
    return fs.readdirSync(dir, { withFileTypes: true }).filter(dirent => dirent.isDirectory())
}

playRandomSong = async (msg) => {

    let song = await new Promise((resolve, reject) => {

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

    song.dispatcher.on('finish', async () => {
        await playRandomSong(msg);
    })

};


playSong = async (index) => {

    return new Promise((resolve, reject) => {

        fs.readdir(path.join(__dirname + `../../../../../Music/youtube`), (err, files) => {

            files = files.filter(f => f !== 'desktop.ini');

            if (err) {
                reject(err);
            }

            let song = files[index]

            dispatcher = connectedChannel.play('http://localhost:8080/youtube/' + song, { volume: .5 });
            dispatcher.setVolume(.2)

            jsmediatags.read('http://localhost:8080/youtube/' + song, {
                onSuccess: async tag => {

                    let songInfo = {
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        albumCover: `http://localhost:8080/artwork/${tag.tags.title}.jpg`,
                        dispatcher
                    }
                    return resolve(songInfo)
                },
                onError: (error) => {
                    return reject(error.type, error.info)
                }
            });
        })

    }).catch(err => console.log(err))
}


downloadSong = async (url) => {

    return new Promise(async (resolve, reject) => {
        if (!ytdl.validateURL(url)) {
            return resolve(`'${url}' is not a valid Youtube Link!`);
        }

        let info = await ytdl.getInfo(url);

        let artist = info.videoDetails.artist ? info.videoDetails.artist : ' - ';
        let title = info.videoDetails.title ? info.videoDetails.title : ' - ';
        let albumArt;

        let data = {
            artist: artist,
            title: title
        }


        if (process.env.NODE_ENV === 'production') {
            ytdl(url, { filter: 'audioonly' }).pipe(fs.createWriteStream(path.join(__dirname + `../../../../../../srv/Music/youtube/${info.videoDetails.title}.mp4`)));
            ffmetadata.write('http://localhost:8080/youtube/', metadata, albumArt)


        } else {
            getStreamToFile = () => {
                return new Promise((resolve, reject) => {
                    let stream = ytdl(url, { filter: 'audioonly' });
                    stream.pipe(fs.createWriteStream(path.join(__dirname + `../../../../../Music/youtube/${info.videoDetails.title}.mp4`)));
                    resolve();
                })
            }

            saveArt = async (name) => {

                return new Promise(async (resolve, reject) => {

                    const res = await fetch(info.videoDetails.thumbnails[0].url);
                    const arrBuffer = await res.arrayBuffer();
                    const buffer = Buffer.from(arrBuffer);
                    const fileType = await FileType.fromBuffer(buffer);

                    fs.writeFileSync(path.join(__dirname + `../../../../../Music/artwork/${name}.${fileType.ext}`), buffer);
                    webp.dwebp(path.join(__dirname + `../../../../../Music/artwork/${name}.${fileType.ext}`), path.join(__dirname + `../../../../../Music/artwork/${name}.jpg`), "-o", logging = "-v");
                    resolve();
                })

            }

            setMetaData = () => {
                return new Promise((resolve, reject) => {

                    let options = {
                        attachments: [path.join(__dirname + `../../../../../Music/artwork/${info.videoDetails.title}.jpg`)]
                    }
                    ffmetadata.write(path.join(__dirname + `../../../../../Music/youtube/${info.videoDetails.title}.mp4`), data, options, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            return resolve(`${info.videoDetails.title} was downloaded!`);
                        }
                    })
                })
            }

            await getStreamToFile().catch(err => reject(err));
            await saveArt(info.videoDetails.title).catch(err => reject(err))

            setTimeout(async () => {
                return resolve(await setMetaData().catch(err => { reject(err) }))
            }, 1000)


        }
    }).catch(err => { return err })

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


playYoutubeSong = async (index) => {
    let link = youtubeLinks[index].link;
    let newIndex;

    if (index === youtubeLinks.length - 1) {
        newIndex = 0;
    } else {
        newIndex = index + 1;
    }



    //USE INDEX OF usiing the json file and make it play the next song in the list when finished


    dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
    dispatcher.setVolume(0.5)
    dispatcher.on('finish', async () => {
        playYoutubeSong(newIndex);
    });
    dispatcher.setVolume(0.05)
}


webPauseSong = () => {
    dispatcher.pause();
}

webResumeSong = (index) => {
    if (!dispatcher) {
        dispatcher = connectedChannel.play(ytdl(youtubeLinks[0].link, { filter: 'audioonly' }));
        dispatcher.setVolume(0.03);
        dispatcher.on('finish', async () => {
            this.playYoutubeSong(youtubeLinks[Math.floor(Math.Random() * 10) + 1]);
        });
    } else {
        dispatcher.resume();
    }
}

webPlayPrevious = (index) => {
    nowPlayingIndex = index;
    playYoutubeSong(index);
}

webPlayNext = (index) => {
    nowPlayingIndex = index;
    playYoutubeSong(index);
}


addYoutubeLink = async (link) => {

    let weGood = ytdl.validateURL(link)

    if (!weGood) {
        return 'no';
    }
    let linkInfo = await ytdl.getInfo(link);

    youtubeLinks.push({
        title: linkInfo.player_response.videoDetails.title,
        link: link,
        image: linkInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
    });


    return fs.writeFile(path.join(__dirname + `/../public/links.json`), JSON.stringify(youtubeLinks), err => {
        if (err) {
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

youtubeStop = () => {
    dispatcher.destroy();
    dispatcher = '';
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
    volumeUp,
    youtubeStop
}
