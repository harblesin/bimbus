const bot = require("../../bot/bot");
const fs = require('fs');
const path = require('path');
const linksFile = require("../../public/links.json");
// const linksFile = require('../../public/links.txt');



const play = (req, res) => {

    console.log("hehehe")
    bot.webPlaySong();
    res.end()
}


const getLinks = async (req, res) => {


    console.log(linksFile)


    // let links = fs.readFileSync(path.join(__dirname + "/../../public/links.txt"), (err, data) => {
    //     if(err){
    //         res.json(err)
    //     }
    //     console.log('is this what is undefineed', data)
    //     console.log(data.toString('utf8'))
    //     return data;

    // });



    res.json(linksFile);
}

const playYoutube = (req, res) => {
    bot.playYoutubeSong(req.body.link);
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

    console.log(req.body)


    let { link } = req.body;

    let result = bot.addYoutubeLink(link);

    res.json(result);

}

const playPrevYoutube = (req, res) => {
    let index = req.query.index;


    bot.webPlayPrevious(index);
}

const playNextYoutube = (req, res) => {
    console.log('WAIT WHAT', req.query)
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


module.exports = {
    play,
    getLinks,
    playYoutube,
    pauseYoutube,
    resumeYoutube,
    playPrevYoutube,
    playNextYoutube,
    addYoutubeLink,
    volumeDown,
    volumeUp
}