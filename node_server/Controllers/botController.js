const bot = require("../../bot/bot");
const fs = require('fs');

const play = (req, res) => {
    bot.webPlaySong();
    res.end()
}

const getLinks = (req, res) => {

    bot.webGetYoutubeLinks()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.end(err);
        })

}

const playYoutube = async (req, res) => {
    let song = await bot.webPlayYoutubeSong(req.body.index);
    res.json(song);
}

const deleteYoutube = (req, res) => {
    bot.webDeleteYoutubeSong(req.body.index);
    res.end();
}

const pauseYoutube = (req, res) => {
    bot.webPauseSong();
    res.end();
}

const resumeYoutube = (req, res) => {
    bot.webResumeSong();
    res.end();
}

const addYoutubeLink = (req, res) => {

    let { link } = req.body;
    bot.addYoutubeLink(link)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });
}

const playPrevYoutube = async (req, res) => {
    let index = req.query.index;
    res.json(await bot.webPlayPrevious(index));
}

const playNextYoutube = async (req, res) => {
    let index = req.query.index;
    res.json(await bot.webPlayNext(index));
}

const volumeDown = (req, res) => {
    bot.volumeDown();
    res.end();
}

const volumeUp = (req, res) => {
    bot.volumeUp();
    res.end();
}

const stopYoutube = (req, res) => {
    bot.youtubeStop();
    res.end();
}

module.exports = {
    play,
    getLinks,
    playYoutube,
    deleteYoutube,
    pauseYoutube,
    resumeYoutube,
    playPrevYoutube,
    playNextYoutube,
    addYoutubeLink,
    volumeDown,
    volumeUp,
    stopYoutube
}