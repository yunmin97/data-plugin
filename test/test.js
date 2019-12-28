// MIT License
//
// Copyright(c) 2019 yunmin
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// 	The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const url = require('url');
const express = require('express');
const plugin = require('../index')({
    dir: './test/files',
    // id for csv
    idx: 'id',
    interval: 3000,
    onLoaded: function (name) {
        console.log('loaded: %s', name);
    },
    onAllLoaded: function () {
        console.log('all loaded down')
    }
});

const hostname = '127.0.0.1';
const port = 3000;
const app = express();

let decode = function (req, res) {
    return req.query;
};

function example() {
    // check if the config exists
    console.log('-----------------item-----------------');
    if (plugin.hasJson('card')) {
        let card = plugin.getJson('card');
        console.log(card);
        console.log(card['c-1']);
    }
    console.log('-----------------item-----------------\n');

    console.log('-----------------csv-----------------');
    // check if the config exists
    if (plugin.hasCSV('item')) {
        let item = plugin.getCSV('item');
        console.log(item);
        console.log(item.has(0));
        console.log(item.get(0));
        console.log(item.has(10));
    }
    console.log('-----------------csv-----------------\n');
}

app.get('/', function (req, res) {
    let pathname = url.parse(req.url).pathname;
    if (pathname === "/favicon.ico") {
        return;
    }

    let data;
    // example();
    let msg = decode(req, res);

    if (plugin.hasJson(msg.name)) {
        data = plugin.getJson(msg.name);
    }
    if (plugin.hasCSV(msg.name)) {
        data = plugin.getCSV(msg.name);
    }
    res.json(data || {});
});

app.listen(port, hostname);

console.log(`run http://127.0.0.1:3000/?name=xx on browser for test[xx is file(csv/json) name]`);