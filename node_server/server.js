require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const Discord = require('discord.js');
const { MessageAttachment, PlayInterface } = require('discord.js');
const fs = require('fs')
const client = new Discord.Client(); 


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname+"../../../../../Desktop/")));
app.use(express.static(path.join(__dirname+"../../../../../Pictures")));
app.use(express.static(path.join(__dirname+"../../../../../Music")))

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    if(msg.content === 'bot') {
        
        msg.reply("You think youre so fucking funny don't you, suck my fat ass")
    }

    if(msg.content === 'random pic'){
        fs.readdir(path.join(__dirname + `../../../../../Pictures`), (err, files) => {


            let choice = Math.floor((Math.random() * files.length) + 1);


            if(err){
                throw err;
            }

                const image = new MessageAttachment('http://localhost:8080/'+files[choice]);

                msg.reply(image)

            // files.forEach(file => {



            //     console.log(file)
            // })


        })
    }

    if(msg.content === 'play') {
        let thing = client.voice.createBroadcast();
        thing.play('http://localhost:8080/A7\ -\ Bald-Headed\ Woman\ Blues', { volume: 0.5 });
    }

    // setInterval( () => {
    //     fs.readdir(path.join(__dirname + `../../../../../Pictures`), (err, files) => {


    //         let choice = Math.floor((Math.random() * files.length) + 1);


    //         if(err){
    //             throw err;
    //         }

    //             const image = new MessageAttachment('http://localhost:8080/'+files[choice]);

    //             msg.reply(image)

    //         // files.forEach(file => {



    //         //     console.log(file)
    //         // })


    //     }, 10000)
    // })

    if(msg.content === 'funny cat') {

        const image = new MessageAttachment('http://localhost:8080/tumblr_6e6c1e4b54d27fcd445f5ceff12b0c0b_47bdf23f_500.png');
        console.log(image)
        msg.reply(image)
    }

});

client.login(process.env.DISCORD_TOKEN);


app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})