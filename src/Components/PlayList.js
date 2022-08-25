import React, { useState, useEffect } from 'react';
import styles from "./PlayList.module.css";
import API from "../utils/API";
import socket from '../socket/socket';

const PlayList = props => {

    const [links, setLinks] = useState([]);

    useEffect(() => {
        socket.on("updateAllLinks", async () => {
            setLinks(await API.getLinks());
        })
        socket.on("refreshLinks", async () => {
            setLinks(await API.getLinks());
        });
        socket.on("changeNowPlaying", () => {
            console.log("Changed Song")
        });

        async function fetchLinks() {
            let links = await API.getLinks();
            setLinks(links);
        }
        fetchLinks();

    }, [])



    const playSong = async (index) => {
        let song = await API.playYoutubeLink({ index });
        emitNowPlayingMessage(index, song);
    }

    const deleteSong = async (index) => {
        await API.deleteYoutubeLink({ index }).then(async result => {
            setLinks(await API.getLinks());
            emitRefreshMessage();
        }).catch(err => {
            alert("Couldn't delete song: ", err)
        });
    }

    const emitRefreshMessage = () => {
        socket.emit("refreshLinks", {
            msg: "Updating Links"
        })
    }

    const emitNowPlayingMessage = (index, song) => {
        socket.emit("changeNowPlaying", {
            msg: "Changing Now Playing", index, song
        })
    }


    return (
        <div className={styles.div}>
            <div className={styles.list}>
                {links.map((l, index) => (
                    <div className={styles.listItem} key={index}>
                        <div className={styles.infoSection}>
                            <span className={styles.songNumberSpan}>{index + 1}.</span>
                            <div className={styles.title}>{l.title}</div>
                            <a className={styles.link} href={l.link}>URL</a>
                        </div>
                        <div className={styles.buttonSection}>
                            <button className={styles.button} onClick={() => playSong(index)}><i className='fa fa-play'></i></button>
                            <button className={styles.deleteButton} onClick={() => deleteSong(index)}><i className='fa fa-close'></i></button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default PlayList;