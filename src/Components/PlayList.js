import React from 'react';
import styles from "./PlayList.module.css";

const PlayList = props => {

    return (
        <div className={styles.div}>
            <div className={styles.list}>
                {props.links.map((l, index) => (
                    <div className={styles.listItem} key={l.title}>
                        <div className={styles.infoSection}>
                            <button className={styles.button} onClick={() => props.play(index)}>{'\u25B6'}</button>
                            <div className={styles.title}>{l.title}</div>
                            <a className={styles.link} href={l.link}>URL</a>
                        </div>
                        <button className={styles.deleteButton} onClick={() => props.delete(index)}>{'\u2716'}</button>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default PlayList;