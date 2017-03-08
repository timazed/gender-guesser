"use strict";

const Fs = require("fs");
const Promise = require("bluebird");
const ReadLine = require("readline");
//--------------- end imports -----------------

class FileReader {
    constructor(file) {
        this.file = file;
    }

    process() {
        return new Promise((resolve, reject) => {
            let data = [];
            let lineReader = ReadLine.createInterface({
                input: Fs.createReadStream(this.file),
            });

            lineReader.on("line", line => {
                data.push(line.trim());
            });

            lineReader.on("close", () => {
                resolve(data);
            });

            lineReader.on("error", () => {
                reject(new Error("faild to read file"));
            });
        });
    }
}

module.exports = FileReader;
