import React, { useState } from 'react';
import styles from "./AddNew.module.css";
import API from "./../utils/API";
import axios from "axios";
import socket from '../socket/socket';

const AddNew = props => {

    const [link, setLink] = useState('');

    const handleChange = (e) => {
        e.preventDefault();
        setLink(e.target.value);
    }

    const addLink = (e) => {
        axios.post('/api/bot/addlink', { link }).then(result => {
            socket.emit("updateAllLinks", {
                msg: "Updating All Links"
            })
        })

        setLink('');
    }

    return (
        <div className={styles.div}>
            <div className={styles.inputHolder}>
                <input name='link' value={link} onChange={(e) => handleChange(e)}></input>
                <button onClick={(e) => addLink(e)}>Submit</button>
            </div>

        </div>
    )
}

export default AddNew;