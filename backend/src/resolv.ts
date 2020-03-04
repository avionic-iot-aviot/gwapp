
const fs = require('fs');
const path = require('path');
const cfg = require('config');
import ResolvService from './services/resolvService';
const resolvService = new ResolvService();

let tmpDirectory = path.join(__dirname, '../src/test.txt');
//console.log("dirr", tmpDirectory);

if (cfg.gateway && cfg.gateway.path_resolv) {
    tmpDirectory = cfg.gateway.path_resolv;
}
fs.watchFile(tmpDirectory, async(curr : any, prev: any) => {
    //console.log("Sto ascoltando il file");
    console.log( `[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`  );
    console.log("ciao1");
    let datafile = await resolvService.execute();
    console.log("ciao2");
    let ip = await resolvService.getmyip();
    console.log("ciao3");
    await resolvService.changefile(ip,datafile);


})