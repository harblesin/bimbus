import React from 'react';
import styles from './NowPlaying.module.css';
import API from '../utils/API';

const NowPlaying = props => {

    return (
        <div className={styles.div}>
            <div className={styles.playerBox}>
                <div className={styles.leftHalf}>
                    <span className={styles.title}>{props.song.title}</span>
                    <span className={styles.link}>{props.song.link}</span>
                    <div className={styles.buttonRow}>
                        <button onClick={() => props.prev(props.index)}>Prev</button>
                        <button onClick={() => props.next(props.index)}>Next</button>
                        <button onClick={() => API.resumeYoutube()}>Play</button>
                        <button onClick={() => API.pauseYoutube()}>Pause</button>
                        <button>Stop</button>
                        <button onClick={() => API.volumeDown()}>Volume Down</button>
                        <button onClick={() => API.volumeUp()}>Volume Up</button>
                    </div>
                </div>
                <img className={styles.img} src={props.song.image}></img>

            </div>
        </div>
    );
}

export default NowPlaying;