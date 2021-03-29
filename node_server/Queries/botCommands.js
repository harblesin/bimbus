const bot = require("../../bot/bot");



const play = (req, res) => {
    console.log("hehehe")
    bot.playRandomSong();
    res.end()
}

module.exports = {
    play
}