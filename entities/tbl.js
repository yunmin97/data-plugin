// The MIT License(MIT)
// 
// Copyright(c) 2013 palmtoy
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files(the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions :
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// modified from https://github.com/NetEase/pomelo-data-plugin

const util = require('util');

/**
 * Tbl model `new Tbl()`
 * @param {Array} tmpL
 * @param idx
 * @constructor
 */
let Tbl = function (tmpL, idx) {
    let self = this;
    let fList = tmpL.splice(0, 1)[0];
    let fields = {};
    fList.forEach(function (k, v) {
        fields[k] = v;
    });

    self.data = {};
    tmpL.forEach(function (item) {
        let obj = {};
        for (let k in fields) {
            obj[k] = item[fields[k]];
        }
        if (obj[idx]) {
            self.data[obj[idx]] = obj;
        } else {
            console.error('No `%s` exists in tbl=%s', idx, util.inspect(fList, {
                showHidden: true,
                depth: 1
            }));
        }
    });
};

/**
 * get item by id
 * @param id id key
 * @returns {*}
 * @api public
 */
Tbl.prototype.get = function (id) {
    return this.data[id];
};

/**
 * delete item by id
 * @param id id key
 * @returns {*}
 * @api public
 */
Tbl.prototype.has = function (id) {
    return this.data[id] !== undefined;
};

/**
 * get all item
 *
 * @return {array}
 * @api public
 */
Tbl.prototype.all = function () {
    return this.data;
};

/**
 * Expose 'Tbl' constructor.
 */
module.exports = Tbl;

