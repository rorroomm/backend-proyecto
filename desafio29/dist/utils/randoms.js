"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randoms = void 0;
const randoms = (cantidad) => {
    let lista = {};
    for (let i = 0; i < cantidad; i++) {
        let myKey = Math.round(Math.random() * (cantidad - 1) + 1);
        if (myKey in lista) {
            lista[myKey]++;
        }
        else
            lista[myKey] = 1;
    }
    return lista;
};
exports.randoms = randoms;
process.on('message', (msg) => {
    msg = JSON.parse(msg);
    if (msg.command == 'start') {
        console.log('Start Process');
        const result = exports.randoms(msg.cantidad);
        if (process && process.send) {
            process.send(result);
        }
    }
});
