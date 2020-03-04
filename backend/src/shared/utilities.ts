const fs = require('fs');
const path = require('path');
const cfg = require('config');

export class Utilities {

    // metodo che permette di scrivere un file
    // filename = path del file
    // content = contenuto da scrivere nel file
    static writeFile(filename: string, content: string) {
        fs.writeFile(filename, content, function (err: any) {
            if (err) console.log(err);
            else console.log("file saved");
        });
    }
}