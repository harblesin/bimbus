import React, { Component } from 'react';
import HomePage from "./HomePage";
import phil from "./images/phil.jpg";
import tru from "./sound/tru.mp3";
import cheer from "./sound/cheer.wav"
import approved from "./images/approved.jpg";
import './login.css';

class Login extends Component {

    state = {
        userName: "",
        password: "",
        time: 5
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    component = () => {
        return <h1 style={{ fontSize: "24px" }}>{this.state.time}</h1>
    }

    authCheck = (e) => {
        e.preventDefault();

        if (this.state.userName === process.env.REACT_APP_USER && this.state.password === process.env.REACT_APP_PASS) {
            let soundBite = new Audio(cheer);
            soundBite.volume = .2;
            soundBite.play();
            document.getElementById("headerImg1").src = approved;
            let el = `<h1 id="count" style="font-size: 78px" >5 </h1>`
            document.getElementById("input").outerHTML = el

            let header = document.getElementById("header");
            header.innerHTML = 'Nice job!'


            let headerImg1 = document.getElementById("headerImg1");
            headerImg1.classList.add('disappear')
            headerImg1.style["display"] = "none";
            let headerImg2 = document.getElementById('headerImg2');
            headerImg2.classList.add("appear");
            headerImg2.style['display'] = 'block'
            headerImg2.style['margin'] = 'auto'

            setInterval(() => {
                if (this.state.time === 0) {
                    return;
                } else {
                    this.setState({ time: this.state.time - 1 }, () => {
                        let time = document.getElementById('count');
                        time.innerHTML = this.state.time;
                    })
                }

            }, 1000)

            setTimeout(() => {
                document.getElementById("loginForm").style['display'] = 'none'
                document.getElementById("page").style["display"] = "block"
            }, 5000)

        } else {
            let soundBite2 = new Audio(tru);
            soundBite2.volume = .2;
            soundBite2.play();
            this.setState({ userName: "", password: "" });
        }
    }

    componentDidMount = () => {
        document.getElementById('userName').focus();
    }

    render = () => {
        return (
            <div>
                <div id="loginForm" style={{ display: "block" }}>
                    <h1 id="header" >Who are you?</h1>
                    <img id="headerImg1" style={{ boxShadow: "3px 0px 63px 10px rgba(0,0,255,0.3)", marginBottom: "100px" }} src={phil} alt="Phil" />
                    <img id="headerImg2" style={{ boxShadow: "3px 0px 63px 10px rgba(0,0,255,0.3)", marginBottom: "100px", display: 'none' }} src={approved} alt="Phil" />
                    <div id="input" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <form onSubmit={(e) => this.authCheck(e)}>
                            <div id="flexContainer" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "600px" }}>
                                <label htmlFor="userName">Username</label>
                                <input style={{ marginBottom: "20px" }} type="text" name="userName" id="userName" value={this.state.userName} onChange={(e) => this.onChange(e)}></input>
                                <label htmlFor="userName">Password</label>
                                <input style={{ marginBottom: "20px" }} type="password" name="password" id="password" value={this.state.password} onChange={(e) => this.onChange(e)}></input>
                                <button onClick={this.authCheck} style={{ cursor: "pointer" }}>login</button>
                                <span style={{ fontSize: "11px" }}>( This isn't supposed to be secure )</span>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="page" style={{ display: "none" }}>
                    <HomePage />
                </div>
            </div >
        )
    }

}

export default Login