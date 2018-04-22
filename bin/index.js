#!/usr/bin/env node

const colors = require('ansi-256-colors');
const jimp = require('jimp');
const path = require('path');
const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('<imgPath> [options]')
    .arguments('<imgPath>')
    .option('-i, --interval [interval]', 'Time interval between printing each line', parseFloat, 0)
    .option('-w, --width [width]', 'The width of the output', parseFloat, 100)
    .action(handler)
    .parse(process.argv);

function handler(imgPath, options) {
    jimp.read(path.resolve('.', imgPath)).then(lenna => {
        const MAX_WIDTH = options.width;
        const width = lenna.bitmap.width;
        const height = lenna.bitmap.height;
        let scaledWidth = width;
        let scaledHeight = height;

        // scale the size
        if (width > MAX_WIDTH) {
            scaledWidth = Math.round(MAX_WIDTH);
            scaledHeight = Math.round(height / (width / MAX_WIDTH));
        }
        scaledHeight = Math.round(scaledHeight / 2);    // to avoid the image been stretched in terminal
        lenna = lenna.greyscale().resize(scaledWidth, scaledHeight);

        const delta = 255 / 23; // mapping gray value from [0, 255] to [0, 23]
        const grayScaleMap = [];
        for (let i = 0; i < scaledHeight; i++) {
            let line = '';
            for (let j = 0; j < scaledWidth; j++) {
                const grayValue = jimp.intToRGBA(lenna.getPixelColor(j, i)).r;
                const grayColor = Math.round(grayValue / delta);
                const love = ['l', 'o', 'v', 'e'];
                const text = love[j % love.length];
                line += colors.fg.grayscale[grayColor] + colors.bg.grayscale[grayColor] + text + colors.reset;
            }
            grayScaleMap.push(line);
        }

        let printPromise = Promise.resolve();
        grayScaleMap.forEach(text => {
            if (options.interval === 0) {
                console.log(text);
            }
            else {
                printPromise = printPromise.then(() => printAsync(text, options.interval));
            }
        });
    }, err => {
        console.log(err);
    });
}

function printAsync(text, interval) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(text);
            resolve();
        }, interval);
    });
}
