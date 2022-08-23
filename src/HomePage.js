import React, { Component } from 'react';
import styles from "./HomePage.module.css";
import NowPlaying from "./Components/NowPlaying";
import PlayList from "./Components/PlayList";
import AddNew from "./Components/AddNew";
import API from './utils/API';
import q from "./images/q-double.gif";
import socket from "./socket/socket";


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

    stop = () => {
        this.setState({ nowPlayingIndex: 0 }, () => {
            API.stopYoutube();
        })
    }


    refreshLinks = async () => {
        let files = await API.getLinks();
        this.setState({ links: files.data });
        this.emitRefreshMessage();
    }

    emitRefreshMessage = () => {
        socket.emit("refresh", {
            msg: "we need you to update"
        })
    }

    shouldComponentUpdate = (prevState, prevProps) => {
        if (prevState !== this.state) {
            return true;
        }
    }

    componentDidMount = async () => {
        let files = await API.getLinks();
        this.setState({ links: files.data });

        socket.on("refresh", () => {
            this.refreshLinks();
        });
    }

    render = () => {
        return (
            <div className={styles.background}>
                <div className={styles.header}>
                    <div className={styles.imageHeader}>
                        <div className={styles.headerText}>
                            <span className={styles.funnyText}>Web</span>
                        </div>
                        <img className={styles.img} src={q} alt="Pic" />
                        <div className={styles.headerText}>
                            <span className={styles.funnyText}>Page</span>
                        </div>
                    </div>
                </div>
                <div className={`${styles.div} ${styles.nowPlayingHeader}`}>
                    <NowPlaying song={{}} prev={this.prev} next={this.next} index={this.state.nowPlayingIndex} />
                    <AddNew refreshLinks={this.refreshLinks} />
                    <PlayList />
                </div>
            </div>
        )
    }

}

export default HomePage;