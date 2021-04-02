import React, { Component } from 'react';
import styles from "./HomePage.module.css";
import NowPlaying from "./Components/NowPlaying";
import PlayList from "./Components/PlayList";
import AddNew from "./Components/AddNew";
import API from './utils/API';


class HomePage extends Component {
    state = {
        links: [
            {
                title: "",
                image: ""
            }
        ],
        nowPlayingIndex: 0
    }

    play = async (index) => {
        // let link = this.state.links[index];

        console.log(index)

        await API.playYoutubeLink({ index });

        this.setState({ nowPlayingIndex: index });

    }

    next = async (index) => {
        if (index === this.state.links.length - 1) {
            index = 0
        } else {
            index = index + 1
        }
        this.setState({ nowPlayingIndex: index }, () => {
            API.playNextYoutube(this.state.nowPlayingIndex)
        })
    }

    prev = async (index) => {
        if (index === 0) {
            index = this.state.links.length - 1;
        } else {
            index = index - 1
        }
        this.setState({ nowPlayingIndex: index }, () => {
            API.playPrevYoutube(this.state.nowPlayingIndex)
        })
    }

    stop = () => {
        this.setState({ nowPlayingIndex: 0 }, () => {
            API.stopYoutube();
        })
    }


    refreshLinks = async () => {
        let files = await API.getLinks();
        this.setState({ links: files.data })
    }

    componentDidMount = async () => {
        let files = await API.getLinks();
        this.setState({ links: files.data })
    }

    render = () => {
        return (
            <div className={styles.background}>
                <div className={styles.header}>
                    <div className={styles.imageHeader}>
                        <div className={styles.headerText}>
                            <span className={styles.funnyText}>Corn</span>
                        </div>
                        <img className={styles.img} src="../../public/q-double.gif" alt="Pic" />
                        <div className={styles.headerText}>
                            <span className={styles.funnyText}>Corner</span>
                        </div>
                    </div>
                </div>
                <div className={styles.div}>

                    <NowPlaying song={this.state.links[this.state.nowPlayingIndex]} prev={this.prev} next={this.next} index={this.state.nowPlayingIndex} />
                    <AddNew refreshLinks={this.refreshLinks} />
                    <PlayList links={this.state.links} play={this.play} />
                </div>
            </div>
        )
    }

}

export default HomePage;