import React from 'react';
import styles from "./PlayList.module.css";

const PlayList = props => {

    return (
        <div className={styles.div}>
            <div className={styles.list}>
                {props.links.map((l, index) => (
                    <div className={styles.listItem} key={l.title}>
                        <div className={styles.infoSection}>
                            <div className={styles.title}>{l.title}</div>
                            <div className={styles.link}>{l.link}</div>
                            <div className={styles.buttonRow}>
                                <button className={styles.button} onClick={() => props.play(index)}>PLAY THE SONG</button>
                            </div>

                        </div>
                        <img className={styles.img} src={l.image} alt="Pic" ></img>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default PlayList;