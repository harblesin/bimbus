import React, { useEffect, useRef, useState } from 'react';
import styles from './NowPlaying.module.css';
import API from '../utils/API';
import socket from '../socket/socket';


const NowPlaying = props => {
    ""
    const [song, setSong] = useState({ song: "Nothing Playing", title: "", image: "" });
    const songRef = useRef()
    const [index, setIndex] = useState();
    const indexRef = useRef(0);


    useEffect(() => {
        socket.on("changeNowPlaying", async (event) => {
            setSong(event.song);
            setIndex(event.index);
            songRef.current = event.song;
            indexRef.current = event.index;
        });

        socket.on("prevSong", async (event) => {
            setSong(event.song);
            setIndex(event.index);
            songRef.current = event.song;
            indexRef.current = event.index;
        });

        socket.on("nextSong", async (event) => {
            setSong(event.song);
            setIndex(event.index);
            songRef.current = event.song;
            indexRef.current = event.index;
        });

        socket.on("requestingSongInfo", async (event) => {
            socket.emit("sendingSongInfo", {
                msg: "Sending Song Info", song: songRef.current, index: indexRef
            })
        });

        socket.on("sendingSongInfo", async (event) => {
            setSong(event.song);
            setIndex(event.index)
            songRef.current = event.song;
            indexRef.current = event.index;
        })

        socket.emit("requestingSongInfo", {
            msg: "Requesting Song Info"
        })

    }, []);

    const next = async () => {
        let song = await API.playNextYoutube(index + 1);
        if (!song) {
            return;
        } else {
            setSong(song);
            setIndex(index + 1);
            songRef.current = song;
            indexRef.current = index + 1;
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
            songRef.current = song;
            indexRef.current = index - 1;
            socket.emit("prevSong", {
                msg: "prevSong", index, song
            })
        }
    }

    const resume = async () => {
        let song = await API.resumeYoutube();
        console.log(song)
        if (song) {
            setSong(song);
            setIndex(0);
            songRef.current = song;
            indexRef.current = 0;
        } else {
            return;
        }
    }

    const shuffleSongs = async () => {
        let { song, index } = await API.shuffleSongs();
        console.log(song)
        setSong(song);
        setIndex(index);
        songRef.current = song;
        indexRef.current = 0;
        socket.emit("changeNowPlaying", {
            msg: "Shuffling", song, index
        })
    }

    return (
        <div className={styles.div}>
            <div className={styles.playerBox}>
                <div className={styles.leftHalf}>
                    <span className={styles.title}>{song && song.title}</span>
                    <span className={styles.link}>{song && song.link}</span>
                </div>
                <img className={styles.img} src={song && song.image} alt="Pic" ></img>

            </div>
            <div className={styles.buttonContainer}>
                <div className={styles.buttonRow}>
                    <button onClick={prev}><i className='fa fa-step-backward'></i></button>
                    <button onClick={resume}><i className='fa fa-play'></i></button>
                    <button onClick={() => API.pauseYoutube()}><i className='fa fa-pause'></i></button>
                    <button onClick={next}><i className='fa fa-step-forward'></i></button>
                    <button onClick={() => API.stopYoutube()}><i className='fa fa-stop'></i></button>
                    <button onClick={() => API.volumeDown()}><i className='fa fa-volume-down'></i></button>
                    <button onClick={() => API.volumeUp()}><i className='fa fa-volume-up'></i></button>
                    <button onClick={shuffleSongs}><i className='fa fa-random'></i></button>
                </div>
            </div>
        </div>
    );
}

export default NowPlaying;