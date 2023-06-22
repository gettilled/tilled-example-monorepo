/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { readFile } from 'fs/promises';
import { resolve } from 'path';

function toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) view[i] = buffer[i];

    return arrayBuffer;
}
class ResponseFake {
    constructor(public buffer: Buffer) { }

    async json() {
        return JSON.parse(this.buffer.toString());
    }
    async text() {
        return this.buffer.toString();
    }
    async arrayBuffer() {
        return toArrayBuffer(this.buffer);
    }
}

const { fetch } = self;
Object.assign(self, {
    fetch(url: string) {
        if (url.includes('://')) return fetch(url);

        if (url.slice(0, 4) === '/api') {
            const file = url.slice(0, url.indexOf('?')) + '.json';
            return readFile(__dirname.slice(0, __dirname.indexOf('/utils')) + '/test' + file).then(
                (buffer) => new ResponseFake(buffer)
            );
        }

        return readFile(resolve(__dirname, url)).then(
            (buffer) => new ResponseFake(buffer)
        );
    }
})