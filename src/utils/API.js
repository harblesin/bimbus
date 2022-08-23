const { default: axios } = require("axios")


const getLinks = () => {
    return new Promise((resolve, reject) => {
        axios.get('/api/bot/links').then(res => {
            resolve(res.data);
        });
    })
}

const addYoutubeLink = (link) => {
    axios.post('/api/bot/addlink', { link });
}

const deleteYoutubeLink = (index) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/bot/delete', index).then((result) => {
            resolve(result);
        });
    })
}

module.exports = {
    play: () => {
        axios.post('/api/bot/play');
    },
    getLinks,
    playYoutubeLink: (index) => {
        return axios.post('/api/bot/playyoutube', index).then(result => {
            return result.data
        });
    },
    deleteYoutubeLink,
    constpauseYoutube: () => {
        axios.get('/api/bot/pause');
    },
    resumeYoutube: () => {
        axios.get('/api/bot/resume');
    },
    addYoutubeLink,
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
    }
}