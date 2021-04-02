import React, { useState } from 'react';
import styles from "./AddNew.module.css";
import API from "./../utils/API";

const AddNew = props => {

    const [link, setLink] = useState({
        link: ''
    });

    const handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        setLink({ [name]: value });
    }

    const addLink = async (e) => {
        e.preventDefault();
        let result = await API.addYoutubeLink(link);
        console.log(result.data)
        if (result === 'no') {
            alert("THAT ISN'T A YOUTUBE LINK YOU JERK");
        }
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