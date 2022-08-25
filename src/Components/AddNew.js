import React, { useState, useEffect } from 'react';
import styles from "./AddNew.module.css";
import API from "./../utils/API";
import axios from "axios";
import socket from '../socket/socket';

const AddNew = props => {

    const [link, setLink] = useState('');

    useEffect(() => {
        document.querySelectorAll(".inputAndButton").forEach(el => {
            el.addEventListener("keydown", addLinkListener);
        })
        return () => {
            document.querySelectorAll(".inputAndButton").forEach(el => {
                el.removeEventListener("keydown", addLinkListener);
            })
        }
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        setLink(e.target.value);
    }

    const addLink = () => {
        if (!link.trim()) {
            return;
        }
        axios.post('/api/bot/addlink', { link: link.trim() }).then(result => {
            socket.emit("updateAllLinks", {
                msg: "Updating All Links"
            })
        })

        setLink('');
    }

    const addLinkListener = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("linkButton").click();
        }
    }

    return (
        <div className={styles.div}>
            <div className={styles.inputHolder}>
                <input className="inputAndButton" name='link' value={link} onChange={(e) => handleChange(e)}></input>
                <button id="linkButton" className="inputAndButton" onClick={(e) => addLink(e)}>Add</button>
            </div>

        </div>
    )
}

export default AddNew;