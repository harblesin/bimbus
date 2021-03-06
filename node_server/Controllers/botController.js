const bot = require("../../bot/bot");
const fs = require('fs');
const path = require('path');
const linksFile = require("../../public/links.json");

const play = (req, res) => {
    bot.webPlaySong();
    res.end()
}

const getLinks = async (req, res) => {
    res.json(bot.webGetYoutubeLinks());
}

const playYoutube = (req, res) => {
    bot.webPlayYoutubeSong(req.body.index);
    res.end();
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

const addYoutubeLink = async (req, res) => {

    let { link } = req.body;
    let result = await bot.addYoutubeLink(link);

    res.json(result);
}

const playPrevYoutube = (req, res) => {
    let index = req.query.index;

    bot.webPlayPrevious(index);
}

const playNextYoutube = (req, res) => {
    let index = req.query.index;
    bot.webPlayNext(index);
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