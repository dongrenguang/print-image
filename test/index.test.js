const expect = require('chai').expect;
const path = require('path');

const handler = require('../bin/index').handler;
const convertToPixelLines = require('../bin/index').convertToPixelLines;

describe('Test convert image to pixel lines', function () {
    this.timeout(0);

    it('Test invalid image path ', async function () {
        const pixelLines = await convertToPixelLines('', 100);
        expect(pixelLines).to.be.a('undefined');
    });

    it('Test valid image path', async function () {
        const pixelLines = await convertToPixelLines(path.resolve(__dirname, './imgs/girl.jpg'), 100);
        expect(pixelLines).to.be.a('array');
    });

    it('Test small image which width is less than the max-width', async function () {
        const pixelLines = await convertToPixelLines(path.resolve(__dirname, './imgs/cat.png'), 100);
        expect(pixelLines).to.be.a('array');
    });
});

describe('Test the handler', function () {
    this.timeout(0);

    it('Test invalid image path ', async function () {
        const result = await handler('', 0, 100);
        expect(result).to.be.a('undefined');
    });

    it('Test valid image path', async function () {
        this.timeout(2000);
        const result = await handler(path.resolve(__dirname, './imgs/girl.jpg'), 0, 100);
        expect(result).to.be.a('undefined');
    });

    it('Test small image which width is less than the max-width', async function () {
        const result = await handler(path.resolve(__dirname, './imgs/cat.png'), 0, 100);
        expect(result).to.be.a('undefined');
    });

    it('Test valid interval', async function () {
        const result = await handler(path.resolve(__dirname, './imgs/cat.png'), 10, 100);
        expect(result).to.be.a('undefined');
    });
});
