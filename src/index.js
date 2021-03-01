const express = require("express");
const fs = require("fs");
const {resolve, join} = require("path");

const app = express();
app.use(express.static(join(__dirname, "public")));

app.get('/', (request, response) => {
    return response.sendFile(__dirname + "/public/index.html");
});

app.get("/stream", (request, response) => {
    const range = request.headers.range;
    const songPath = resolve(__dirname,  "musics", "music.mp3");
    console.log(__dirname);
    const songSize = fs.statSync(songPath).size;

    const start = Number(range.replace(/\D/g, ""));

    const CHUNK_SIZE = 1000;
    const end = Math.min(start + CHUNK_SIZE , songSize -1);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${songSize}`,
        "Accept-Ranges": "bytes",
        "Content-type": "audio/mpeg"
    }

    response.writeHead(206, headers);

    const songStream = fs.createReadStream(songPath, {start: start, end: end });

    songStream.pipe(response);
});

app.listen(3333);