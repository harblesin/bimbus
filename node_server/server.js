require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const router = require("./Routes");

app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../public")));
app.use(express.static(path.join(__dirname + "../../../../../Desktop/")));
app.use(express.static(path.join(__dirname + "../../../../../Videos")))

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname + "../../../../../../srv/Pictures")));
    app.use(express.static(path.join(__dirname + "../../../../../../srv/Music")));

} else {
    app.use(express.static(path.join(__dirname + "../../../../../Pictures")));
    app.use(express.static(path.join(__dirname + "../../../../../Music")))

}

app.use(router);

app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})