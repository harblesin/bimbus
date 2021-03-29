const { default: axios } = require("axios")

module.exports = {
    play: () => {
        return axios.post('/api/bot/play');
    },
    getLinks: () => {
        return axios.get('/api/bot/links')
    },
    playYoutubeLink: (link) => {
        return axios.post('/api/bot/playyoutube', link);
    },
    pauseYoutube: () => {
        return axios.get('/api/bot/pause');
    },
    resumeYoutube: () => {
        return axios.get('/api/bot/resume');
    },
    addYoutubeLink: (link) => {
        return axios.post('/api/bot/addlink', link);
    },
    playNextYoutube: (index) => {
        return axios.get('/api/bot/next', { params: { index } });
    },
    playPrevYoutube: (index) => {
        return axios.get('/api/bot/prev', { params: { index } })
    },
    volumeDown: () => {
        return axios.get('/api/bot/volumedown');
    },
    volumeUp: () => {
        return axios.get('/api/bot/volumeup');
    }
}