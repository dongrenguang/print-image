# print-image
> To my girlfriend :-)

[![Build Status](https://travis-ci.org/dongrenguang/print-image.svg?branch=master)](https://travis-ci.org/dongrenguang/print-image)
[![node version](https://img.shields.io/badge/node.js-%3E=_7.6-green.svg?style=flat-square)](http://nodejs.org/download/)

Print image to terminal output

## Demo
![image](./demo/girl.jpg)

## Installation
```
$ npm install print-image -g
```

## Usage
```
$ print-image <imgPath> [options]
```

## Options
- `-i` or `--interval`: Time interval between printing each line (default: 0)
- `-w` or `--width`: The max width(pixel) of the output (default: 100)

## Example
```
$ print-image girl.jpg
```
or
```
$ print-image girl.jpg -i 50 -w 120
```
