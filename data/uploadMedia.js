const gm = require('gm').subClass({ imageMagick: true });;
const Promise = require('bluebird');
Promise.promisifyAll(gm.prototype);

const fs = require('fs');
// const ExifImage = require('exif').ExifImage;
//const MyImages = require('../models/myImages');

// path is the path to your image
module.exports = function(buffer, path, filename) {

     return gm(buffer, filename)
        .autoOrient()
        .writeAsync(path)
        .then(() => {
        })
        .catch(err => {
            //(new MyImages()).rewind();
            throw err;
        });


};