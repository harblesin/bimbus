const { default: axios } = require("axios")

module.exports = {
    play: () => {
        axios.post('/api/bot/play');
    },
    getLinks: () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/bot/links').then(res => {
                resolve(res.data);
            });
        })
    },
    playYoutubeLink: (index) => {
        return axios.post('/api/bot/playyoutube', index).then(result => {
            return result.data
        });
    },
    deleteYoutubeLink: (index) => {
        return new Promise((resolve, reject) => {
            axios.post('/api/bot/delete', index).then((result) => {
                resolve(result);
            });
        })
    },
    pauseYoutube: () => {
        axios.get('/api/bot/pause');
    },
    resumeYoutube: () => {
        return axios.get('/api/bot/resume').then(result => {
            return result.data;
        });
    },
    addYoutubeLink: (link) => {
        axios.post('/api/bot/addlink', { link });
    },
    playNextYoutube: (index) => {
        return axios.get('/api/bot/next', { params: { index } }).then(result => {
            return result.data;
        });
    },
    playPrevYoutube: (index) => {
        return axios.get('/api/bot/prev', { params: { index } }).then(result => {
            return result.data
        })
    },
    volumeDown: () => {
        axios.get('/api/bot/volumedown');
    },
    volumeUp: () => {
        axios.get('/api/bot/volumeup');
    },
    stopYoutube: () => {
        axios.get('/api/bot/stop');
    },
    shuffleSongs: () => {
        return axios.get("/api/bot/shuffle").then(result => {
            return result.data;
        })
    }
}