require("dotenv").config();
const path = require('path');
const Discord = require('discord.js');
let youtubeLinks = require('../public/links.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const ffmetadata = require('ffmetadata');
const FileType = require('file-type');
const fetch = require('node-fetch');
const botFunc = require("./botFunc");
const webp = require('webp-converter');
webp.grant_permission();
if (process.env.NODE_ENV !== 'production') {
    ffmetadata.setFfmpegPath(path.join(__dirname + process.env.ROOT_DIR + '/ffmpeg/ffmpeg.exe'))
}

let connectedChannel;
let commandChannel;
let dispatcher;
let nowPlayingIndex;
let volume = .06;

client.on('ready', () => {
    client.channels.fetch('832424837707857970').then(async channel => {
        connectedChannel = await channel.join();
    })
});

client.on('message', async msg => {

    if (msg.content[0] !== '!' || msg.author.username === 'Bimbus') {
        return;
    } else {

        const msgSplit = msg.content.split(' ');
        const firstWord = msgSplit[0].toLowerCase();
        const secondWord = msgSplit[1] ? msgSplit[1].toLowerCase() : '';
        let image;

        switch (firstWord) {

            case '!cmere':
                connectedChannel = await msg.member.voice.channel.join();
                break;

            case '!bot':
                msg.reply("You think youre so fucking funny don't you, suck my fat ass");
                break;

            case '!randompic':
                let file = await botFunc.getRandomPic();
                image = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/` + file);
                msg.reply(image);
                break;

            case '!neural':
                let neuralfile = await botFunc.getRandomNeuralPic();
                image = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/` + neuralfile);
                msg.reply(image);
                break;

            case '!next':
                if (commandChannel && msg.channel.id !== commandChannel) {
                    msg.channel.send("Please enter music commands in the correct channel!");
                    return;
                }
                playRandomSong(msg);
                break;

            case '!play':
                if (commandChannel && msg.channel.id !== commandChannel) {
                    msg.channel.send("Please enter music commands in the correct channel!");
                    return;
                }
                if (secondWord) {
                    if (ytdl.validateURL(secondWord)) {
                        playYoutubeSong(secondWord);
                    } else if (typeof parseInt(secondWord, 10) === 'number') {
                        playSongFromPlaylist(secondWord, msg)
                    }
                } else if (!dispatcher) {
                    commandChannel = msg.channel.id;
                    playRandomSong(msg);
                } else {
                    dispatcher.resume();
                }
                break;

            case '!pause':
                dispatcher.pause();
                break;

            case '!funnycat':
                image = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/tumblr_6e6c1e4b54d27fcd445f5ceff12b0c0b_47bdf23f_500.png`);
                msg.reply(image);
                break;

            case "!clowngod":
                const imageOne = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/tumblr_69449ee3f4608eb25866ea5390bd2853_047d4e80_1280.jpg`);
                msg.reply(imageOne)
                const imageTwo = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/tumblr_f60bf51d288cc3f78d7561fcb110ff72_fc5e7a0f_1280.jpg`);
                msg.reply(imageTwo);
                const imageThree = new MessageAttachment(`http://localhost:${process.env.NODE_SERVER_PORT}/tumblr_1effe81844992dbb96263241b76b1e49_b7d45104_1280.jpg`);
                msg.reply(imageThree);
                break;

            case '!volume':
                if (parseFloat(secondWord) > 2) {
                    msg.reply("DON'T BE A FUCKING DICK");
                    break;
                } else if (!secondWord) {
                    msg.reply(`Current volume is: ${volume}`);
                    return;
                }
                volume = secondWord
                dispatcher.setVolume(secondWord);
                break;

            case 'giphy.com':
                msg.reply("You have posted cringe, borther. Deleted.");
                setTimeout(() => {
                    msg.delete()
                }, 3000)
                break;

            case '!download':
                let url = msg.content.split(' ')[1];
                msg.delete();
                let res = await downloadSong(url).catch(err => console.log(err));
                msg.reply(res);
                break;

            case '!playlist':
                let playlistIndex = msg.content.split(" ")[0];
                let playlist = listPlaylist(playlistIndex);
                let trackList = '';
                playlist.filter(p => p.name !== 'desktop.ini').forEach((l, index) => {
                    trackList = trackList + `\n ${index} - ${l.name}`
                });

                msg.reply({ embed: { title: 'Song List >:)', footer: { text: trackList, icon_url: '' } } });
                break;

            case '!playlists':
                let dir = path.join(__dirname + process.env.ROOT_DIR + 'youtube');
                let list = listPlaylists(dir);
                let newList = [];
                list.forEach((l, index) => {
                    newList.push({ name: index, value: l.name });
                })
                let playListsDisplay = {
                    title: "PLAYLISTS :)",
                    fields: playListsDisplay
                };
                msg.reply({ embed: res });
                break;
            default:
                break;
        }
    }
});

listPlaylist = () => {
    return fs.readdirSync(path.join(__dirname + process.env.ROOT_DIR + 'youtube'), { withFileTypes: true }).filter(dirent => !dirent.isDirectory());
}

listPlaylists = (dir) => {
    return fs.readdirSync(dir, { withFileTypes: true }).filter(dirent => dirent.isDirectory())
}

playRandomSong = async (msg) => {
    let song = await botFunc.getRandomSong();
    let embed = await botFunc.createMessageEmbed(song)
    dispatcher = connectedChannel.play(`http://localhost:${process.env.NODE_SERVER_PORT}/` + song.fileName)
    dispatcher.setVolume(volume);
    msg.reply(embed);
    dispatcher.on('finish', async () => {
        await playRandomSong(msg);
    });
};

playYoutubeSong = (link) => {
    dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
    dispatcher.setVolume(volume)
}

playSongFromPlaylist = async (index, msg) => {
    index = parseInt(index, 10);
    let playListLength = fs.readdirSync(path.join(__dirname + process.env.ROOT_DIR + 'youtube'));
    if (index > playListLength.filter(f => f !== 'desktop.ini').length) {
        return;
    }

    let song = await botFunc.getSongFromPlaylist(index);
    let embed = await botFunc.createMessageEmbed(song);

    dispatcher = connectedChannel.play(`http://localhost:${process.env.NODE_SERVER_PORT}/youtube/` + song.fileName);
    dispatcher.setVolume(volume);

    msg.reply(embed);
    dispatcher.on('finish', async () => {
        await playSongFromPlaylist((index + 1), msg)
    })
}


downloadSong = async (url) => {

    return new Promise(async (resolve, reject) => {
        if (!ytdl.validateURL(url)) {
            return resolve(`'${url}' is not a valid Youtube Link!`);
        }

        let info = await ytdl.getInfo(url);
        let artist = info.videoDetails.artist ? info.videoDetails.artist : ' - ';
        let title = info.videoDetails.title ? info.videoDetails.title : ' - ';
        let data = {
            artist: artist,
            title: title
        }

        getStreamToFile = () => {
            return new Promise((resolve, reject) => {
                let stream = ytdl(url, { filter: 'audioonly' });
                stream.pipe(fs.createWriteStream(path.join(__dirname + `${process.env.ROOT_DIR}youtube/${info.videoDetails.title}.mp4`)));
                resolve();
            })
        }

        saveArt = async (name) => {

            return new Promise(async (resolve, reject) => {

                const res = await fetch(info.videoDetails.thumbnails[0].url);
                const arrBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrBuffer);
                const fileType = await FileType.fromBuffer(buffer);

                fs.writeFileSync(path.join(__dirname + process.env.ROOT_DIR + `artwork/${name}.${fileType.ext}`), buffer);
                webp.dwebp(path.join(__dirname + process.env.ROOT_DIR + `artwork/${name}.${fileType.ext}`), path.join(__dirname + process.env.ROOT_DIR + `artwork/${name}.jpg`), "-o", logging = "-v");
                resolve();
            })

        }

        setMetaData = () => {
            return new Promise((resolve, reject) => {

                let options = {
                    attachments: [path.join(__dirname + process.env.ROOT_DIR + `artwork/${info.videoDetails.title}.jpg`)]
                }
                ffmetadata.write(path.join(__dirname + process.env.ROOT_DIR + `youtube/${info.videoDetails.title}.mp4`), data, options, (err) => {
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

    }).catch(err => { return err })
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                  ___.                                                             .___        
// __  _  __  ____ \_ |__        ____   ____    _____    _____  _____     ____    __| _/ ______ 
// \ \/ \/ /_/ __ \ | __ \     _/ ___\ /  _ \  /     \  /     \ \__  \   /    \  / __ | /  ___/ 
//  \     / \  ___/ | \_\ \    \  \___(  <_> )|  Y Y  \|  Y Y  \ / __ \_|   |  \/ /_/ | \___ \  
//   \/\_/   \___  >|___  /     \___  >\____/ |__|_|  /|__|_|  /(____  /|___|  /\____ |/____  > 
//               \/     \/          \/              \/       \/      \/      \/      \/     \/  
//                                                                                                                                    
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


webPlayYoutubeSong = async (index) => {
    return new Promise(async (resolve, reject) => {
        if (!youtubeLinks[index]) {
            return resolve(false);
        }
        nowPlayingIndex = index;
        let link = youtubeLinks[nowPlayingIndex].link;

        dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
        dispatcher.setVolume(0.5)
        dispatcher.on('finish', async () => {
            if (nowPlayingIndex + 1 >= youtubeLinks.length) {
                nowPlayingIndex = 0;
            } else {
                nowPlayingIndex = nowPlayingIndex + 1
            }
            webPlayYoutubeSong(nowPlayingIndex);
            let io = require("../node_server/server");
            await io.emit("changeNowPlaying", {
                msg: "changeNowPlaying", song: youtubeLinks[nowPlayingIndex], index: nowPlayingIndex
            });
        });
        dispatcher.setVolume(0.05);
        return resolve(youtubeLinks[nowPlayingIndex]);
    })

}

webDeleteYoutubeSong = async (index) => {
    youtubeLinks.splice(index, 1);
    return fs.writeFile(path.join(__dirname + `/../public/links.json`), JSON.stringify(youtubeLinks), err => {
        if (err) {
            return err
        } else {
            return 'File Removed.'
        }
    })
}

webPauseSong = () => {
    dispatcher.pause();
}

webResumeSong = (index) => {
    if (!dispatcher) {
        dispatcher = connectedChannel.play(ytdl(youtubeLinks[0].link, { filter: 'audioonly' }));
        dispatcher.setVolume(0.03);
        dispatcher.on('finish', async () => {
            nowPlayingIndex = nowPlayingIndex + 1;
            this.webPlayYoutubeSong(nowPlayingIndex);
        });
        return youtubeLinks[0];
    } else {
        dispatcher.resume();
        return false;
    }
}

webPlayPrevious = async (index) => {
    nowPlayingIndex = index;
    return await webPlayYoutubeSong(index);
}

webPlayNext = (index) => {
    nowPlayingIndex = index;
    return webPlayYoutubeSong(index);
}


const addYoutubeLink = async (link) => {


    return new Promise(async (resolve, reject) => {
        let weGood = ytdl.validateURL(link);

        if (!weGood) {
            return reject('no');
        }
        let linkInfo = await ytdl.getInfo(link);

        youtubeLinks.push({
            title: linkInfo.player_response.videoDetails.title,
            link: link,
            image: linkInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
        });

        let pathName = path.join(__dirname, `../public/links.json`);

        fs.writeFile(pathName, JSON.stringify(youtubeLinks), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('File appended.');
            }
        })

    })

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

webGetYoutubeLinks = () => {
    return new Promise((resolve, reject) => {
        let links = youtubeLinks;
        return resolve(links);
    })
}

shuffleYoutube = () => {
    return new Promise(async (resolve, reject) => {

        nowPlayingIndex = Math.floor(Math.random() * (youtubeLinks.length - 1))
        let link = youtubeLinks[nowPlayingIndex].link;

        let io = require("../node_server/server");
        await io.emit("changeNowPlaying", {
            msg: "changeNowPlaying", song: youtubeLinks[nowPlayingIndex], index: nowPlayingIndex
        });

        dispatcher = connectedChannel.play(ytdl(link, { filter: 'audioonly' }));
        dispatcher.setVolume(0.5)
        dispatcher.on('finish', async () => {
            await shuffleYoutube();
        });
        dispatcher.setVolume(0.05);
        return resolve({ song: youtubeLinks[nowPlayingIndex], index: nowPlayingIndex });
    });
}


module.exports = {
    webPlayYoutubeSong,
    webPlaySong,
    webDeleteYoutubeSong,
    webPauseSong,
    webResumeSong,
    webPlayPrevious,
    webPlayNext,
    addYoutubeLink,
    volumeDown,
    volumeUp,
    youtubeStop,
    webGetYoutubeLinks,
    shuffleYoutube
}


client.login(process.env.DISCORD_TOKEN);