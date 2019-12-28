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

const http = require('http');
const plugin = require('../index')({
    dir: './files',
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

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // check if the config exists
    if (plugin.hasJson('card')) {
        let card = plugin.getJson('card');
        console.log('card(json): ');
        console.log(card);
        console.log(card['c-1']);
    }

    // check if the config exists
    if (plugin.hasCSV('item')) {
        let item = plugin.getCSV('item');
        console.log('item(csv): ');
        console.log(item);
        console.log(item.has(0));
        console.log(item.get(0));
        console.log(item.has(10));
    }

    res.end('see result at the terminal console output!');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});