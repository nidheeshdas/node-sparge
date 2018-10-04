#!/usr/bin/env node

const express = require("express");
const serveStatic = require("serve-static");
const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const app = express();

const serve_path = process.env.SERVE_PATH || "dist";
const port = process.env.PORT || 8080;
const scss_path = process.env.SCSS_PATH || "src/styles/common.scss";

const staticServer = serveStatic(serve_path);

app.get('/css', (req, res) => {
    const start = req.query.start || "";
    const end = req.query.end || "";
    fs.readFile(scss_path, (err, data) => {
        const scss_file = data;
        const scss_base_path = path.resolve(path.dirname(scss_path));

        const scss = start + scss_file + end;

        sass.render({
            data: scss,
            includePaths: [scss_base_path],
            outputStyle: "compressed"
        }, (err, out) => {
            res.append('Content-Type', 'text/css');
            res.send(out.css);
            res.end();
        })
    });


});


app.use(staticServer);
app.use((req, res, next) => {
    req.url = "/index.html";
    staticServer(req, res, next);
});

app.listen(port);

