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

const fs = require('fs');
const csv = require('csv');
const path = require('path');
const util = require('util');
const utils = require('../utils/utils');
const Tbl = require('../entities/tbl');
const EventEmitter = require('events').EventEmitter;

// singleton instance
let instance = null;

module.exports = function (opts) {
    if (instance) {
        return instance;
    }
    instance = new Component(opts);
    return instance;
};

function fixPath(dir) {
    if (dir &&
        dir.charAt(dir.length - 1) !== '/') {
        dir += '/';
    }
    return dir;
}

function loadCSV(cmp, filepath, tmpTbl, parsers, down) {
    let name = path.basename(filepath, '.csv');
    // create a csv instance
    parsers[name] = csv();
    let parser = parsers[name];
    tmpTbl[name] = [];
    parser.from.path(filepath, {comment: '#'});
    // read csv data
    parser.on('record', function (row, index) {
        tmpTbl[name].push(row);
    });
    // end of read
    parser.on('end', function () {
        cmp.csvDataTbl[name] = new Tbl(tmpTbl[name], cmp.idx);
        if (down !== undefined) {
            utils.invokeCallback(cmp.onLoaded, name);
            if (down) {
                utils.invokeCallback(cmp.onAllLoaded);
            }
        } else {
            console.log("reloaded(%s)", filepath);
        }
    });
    // error reading
    parser.on('error', function (err) {
        if (down !== undefined) {
            console.error('load(%s) error', filepath);
        } else {
            console.error('fail to reload(%s)', filepath);
        }
        console.error(err.message);
    });
}

function loadJson(cmp, filepath, name) {
    utils.loadFile(filepath, function (err, data) {
        if (err) {
            console.error("fail to reload(%s)", filepath);
            console.error(err);
            return;
        }
        cmp.jsonDataTbl[name] = data;
        console.log("reloaded(%s)", filepath);
    });
}

function watching(cmp, filepath, name) {
    return function (curr, prev) {
        if (curr.mtime.getTime() > prev.mtime.getTime()) {
            if (name === undefined) {
                let tmpTbl = {}, parsers = {};
                loadCSV(cmp, filepath, tmpTbl, parsers);
            } else {
                loadJson(cmp, filepath, name);
            }
        }
    };
}

function loadAll(cmp) {
    let files = [];
    utils.readFiles(cmp.dir, files, true);
    let csv_files = [], json_files = [];
    files.forEach(function (file) {
        switch (path.extname(file.name)) {
            case '.json':
                json_files.push(file);
                break;
            case '.csv':
                csv_files.push(file);
                break;
            default:
                console.warn('unsupported file: ' + file.name);
                break;
        }
    });
    json_files.forEach(function (file) {
        let k_name = path.basename(file.name, '.json');
        if (cmp.jsonDataTbl[k_name] !== undefined) {
            console.warn('duplicate file: ' + file.name);
            return;
        }
        let fullpath = path.join(file.path, file.name);
        let data = utils.loadFileSync(fullpath);
        if (data) {
            cmp.jsonDataTbl[k_name] = data;
            fs.watchFile(fullpath, {
                persistent: true,
                interval: cmp.interval
            }, watching(cmp, fullpath, k_name));
            utils.invokeCallback(cmp.onLoaded, k_name);
        }
    });
    if (csv_files.length <= 0) {
        utils.invokeCallback(cmp.onAllLoaded);
        return;
    }
    if (cmp.idx === undefined) {
        console.error('must set csv id with idx in the config!');
        utils.invokeCallback(cmp.onAllLoaded);
        return;
    }
    let max = csv_files.length - 1;
    let tmpTbl = {}, parsers = {};
    csv_files.forEach(function (file, index) {
        let fullpath = path.join(file.path, file.name);
        loadCSV(cmp, fullpath, tmpTbl, parsers, index >= max);
        fs.watchFile(fullpath, {
            persistent: true,
            interval: cmp.interval
        }, watching(cmp, fullpath));
    });
}

let Component = function (opts) {
    this.dir = fixPath(opts.dir);
    this.interval = opts.interval || 5000;

    // id name of csv
    this.idx = opts.idx;
    this.csvDataTbl = {};

    // json data table
    this.jsonDataTbl = {};

    // the file is loaded
    this.onLoaded = opts.onLoaded;
    // all loaded up
    this.onAllLoaded = opts.onAllLoaded;

    // check if the dir exist
    if (!fs.existsSync(this.dir)) {
        console.error('dir(%s) not exist!', this.dir);
        return;
    }
    loadAll(this);
};

util.inherits(Component, EventEmitter);

Component.prototype.getCSV = function (name) {
    return this.csvDataTbl[name];
};

Component.prototype.hasCSV = function (name) {
    return this.csvDataTbl[name] !== undefined;
};

Component.prototype.getJson = function (name) {
    return this.jsonDataTbl[name];
};

Component.prototype.hasJson = function (name) {
    return this.jsonDataTbl[name] !== undefined;
};
