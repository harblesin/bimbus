import React, { useEffect, useState } from 'react';
import styles from './NowPlaying.module.css';
import API from '../utils/API';
import socket from '../socket/socket';


const NowPlaying = props => {

    const [song, setSong] = useState({});
    const [index, setIndex] = useState();


    useEffect(() => {
        socket.on("changeNowPlaying", async (event) => {
            setSong(event.song);
            setIndex(event.index);
        });

        socket.on("prevSong", async (event) => {
            setSong(event.song);
            setIndex(event.index);
        });

        socket.on("nextSong", async (event) => {
            setSong(event.song);
            setIndex(event.index);
        });

        setOnMount();

    }, []);

    const setOnMount = async () => {
        setSong(await API.playYoutubeLink({ index: 0 }));
        setIndex(0);
    }

    const next = async () => {
        let song = await API.playNextYoutube(index + 1);
        if (!song) {
            return;
        } else {
            setSong(song);
            setIndex(index + 1);
            socket.emit("nextSong", {
                msg: "nextSong", index, song
            })
        }
    }

    const prev = async () => {
        let song = await API.playPrevYoutube(index - 1);
        if (!song) {
            return;
        } else {
            setSong(song);
            setIndex(index - 1);
            socket.emit("prevSong", {
                msg: "prevSong", index, song
            })
        }
    }

    return (
        <div className={styles.div}>
            <div className={styles.playerBox}>
                <div className={styles.leftHalf}>
                    <span className={styles.title}>{song.title}</span>
                    <span className={styles.link}>{song.link}</span>
                    <div className={styles.buttonRow}>
                        <button onClick={prev}>Prev</button>
                        <button onClick={next}>Next</button>
                        <button onClick={() => API.resumeYoutube()}>Play</button>
                        <button onClick={() => API.pauseYoutube()}>Pause</button>
                        <button onClick={() => API.stopYoutube()}>Stop</button>
                        <button onClick={() => API.volumeDown()}>Volume Down</button>
                        <button onClick={() => API.volumeUp()}>Volume Up</button>
                    </div>
                </div>
                <img className={styles.img} src={song.image} alt="Pic" ></img>

            </div>
        </div>
    );
}

export default NowPlaying;