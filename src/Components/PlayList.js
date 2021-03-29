import React from 'react';
import styles from "./PlayList.module.css";

const PlayList = props => {

    return (
        <div className={styles.div}>
            <div className={styles.list}>
                {props.links.map((l, index) => (
                    <div className={styles.listItem}>
                        <div className={styles.infoSection}>
                            <div>{l.title}</div>
                            <div>{l.link}</div>
                            <div className={styles.buttonRow}>
                                <button className={styles.button} onClick={() => props.play(index)}>PLAY THE SONG</button>
                            </div>

                        </div>
                        <img className={styles.img} src={l.image}></img>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default PlayList;