
const fs = require('fs');
const path = require('path');
const cfg = require('config');
import ResolvService from './services/resolvService';
const resolvService = new ResolvService();
const delay = require('delay');
 
(async() => {
    const result = await delay(30000);

    console.log("sono passati 30000 millisecondi");



let tmpDirectory = path.join(__dirname, '../src/test.txt');
//console.log("dirr", tmpDirectory);

if (cfg.gateway && cfg.gateway.path_resolv) {
    tmpDirectory = cfg.gateway.path_resolv;
}
console.log("parte il watchfile");
fs.watchFile(tmpDirectory, async(curr : any, prev: any) => {
    //console.log("Sto ascoltando il file");
    console.log( `[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`  );
    console.log("Inizio");
    let datafile = await resolvService.execute(tmpDirectory);
    console.log("File_letto");
    let ip = await resolvService.getmyip();
    console.log("Trovo_il_mio_ip");
    await resolvService.changefile(ip,datafile);
    console.log("Nuovo_file_creato");


})


});

