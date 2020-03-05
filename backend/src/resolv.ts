
const fs = require('fs');
const path = require('path');
const cfg = require('config');
import ResolvService from './services/resolvService';
const resolvService = new ResolvService();
const delay = require('delay');

(async () => {
    console.log("RESOLV: Inizio");
    const result = await delay(30000);
    console.log("RESOLV: Sono passati 30 secondi");

    let tmpDirectory = path.join(__dirname, '../src/test.txt');
    //console.log("dirr", tmpDirectory);

    if (cfg.gateway && cfg.gateway.path_resolv) {
        tmpDirectory = cfg.gateway.path_resolv;
    }

    let datafile = await resolvService.execute(tmpDirectory);
    //console.log("File_letto");
    let ip = await resolvService.getmyip();
    //console.log("Trovo_il_mio_ip");
    await resolvService.changefile(ip, datafile);
    //console.log("Nuovo_file_creato");
    console.log("RESOLV: File Resolv modificato per la prima volta");

    console.log("RESOLV: Parte il watchfile");
    fs.watchFile(tmpDirectory, async (curr: any, prev: any) => {
        //console.log("Sto ascoltando il file");
        console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`);
        console.log("RESOLV: News Changes");
        let datafile = await resolvService.execute(tmpDirectory);
        console.log("RESOLV: File_letto");
        let ip = await resolvService.getmyip();
        console.log("RESOLV: Trovo_il_mio_ip");
        await resolvService.changefile(ip, datafile);
        console.log("RESOLV: Nuovo_file_creato");
        const result1 = await delay(2000);
        console.log("RESOLV: Dormo 2 secondi");

    })


})();

