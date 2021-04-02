import React, { useState } from 'react';
import styles from "./AddNew.module.css";
import API from "./../utils/API";

const AddNew = props => {

    const [link, setLink] = useState();

    const handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        setLink({ [name]: value });
    }

    const addLink = async (e) => {
        e.preventDefault();
        await API.addYoutubeLink(link);
        setLink({ link: '' });
        await props.refreshLinks()
    }

    return (
        <div className={styles.div}>
            <div className={styles.inputHolder}>
                <input name='link' value={link.link} onChange={(e) => handleChange(e)}></input>
                <button onClick={(e) => addLink(e)}>Submit</button>
            </div>

        </div>
    )
}

export default AddNew;