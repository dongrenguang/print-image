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
    .option('-w, --width [width]', 'The max width of the output', parseFloat, 100)
    .action((imgPath, options) => {
        handler(imgPath, options.interval, options.width);
    })
    .parse(process.argv);

async function handler(imgPath, interval, maxWidth) {
    try {
        const pixelLines = await convertToPixelLines(imgPath, maxWidth);
        if (pixelLines) {
            await printImage(pixelLines, interval);
        }
    }
    catch (e) {
        console.error(e);
    }
}

async function convertToPixelLines(imgPath, maxWidth) {
    try {
        let lenna = await jimp.read(path.resolve('.', imgPath));
        const width = lenna.bitmap.width;
        const height = lenna.bitmap.height;
        let scaledWidth = width;
        let scaledHeight = height;

        // scale the size
        if (width > maxWidth) {
            scaledWidth = Math.round(maxWidth);
            scaledHeight = Math.round(height / (width / maxWidth));
        }
        scaledHeight = Math.round(scaledHeight / 2);    // to avoid the image been stretched in terminal
        lenna = lenna.greyscale().resize(scaledWidth, scaledHeight);

        const delta = 255 / 23; // mapping gray value from [0, 255] to [0, 23]
        const pixelLines = [];
        for (let i = 0; i < scaledHeight; i++) {
            let line = '';
            for (let j = 0; j < scaledWidth; j++) {
                const grayValue = jimp.intToRGBA(lenna.getPixelColor(j, i)).r;
                const grayColor = Math.round(grayValue / delta);
                const love = ['l', 'o', 'v', 'e'];
                const text = love[j % love.length];
                line += colors.fg.grayscale[grayColor] + colors.bg.grayscale[grayColor] + text + colors.reset;
            }
            pixelLines.push(line);
        }

        return pixelLines;
    }
    catch (e) {
        console.error(`No such image: ${path.resolve('.', imgPath)}`);
    }
}

async function printImage(pixelLines, interval) {
    try {
        for (let text of pixelLines) {
            if (interval === 0) {
                console.log(text);
            }
            else {
                await printLineAsync(text, interval);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

function printLineAsync(text, interval) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(text);
            resolve();
        }, interval);
    });
}

module.exports = {
    handler,
    convertToPixelLines
};
