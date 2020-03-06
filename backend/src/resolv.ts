
const fs = require('fs');
const path = require('path');
const cfg = require('config');
import ResolvService from './services/resolvService';
const resolvService = new ResolvService();
const delay = require('delay');

(async () => {
    console.log("RESOLV: Inizio");
    const result = await delay(10000);
    console.log("RESOLV: Sono passati 10 secondi");
    const tmpDirectory = cfg.gateway.path_resolv;
    // leggo il file /etc/resolv.conf
    let datafile = await resolvService.execute(tmpDirectory);
    console.log("File_letto");
    let ip = await resolvService.getmyip();
    console.log("Trovo_il_mio_ip", ip);
    await resolvService.changefile(ip, datafile);
    //console.log("Nuovo_file_creato");
    // resolvService.replace_file(tmpDirectory);
    console.log("RESOLV: File Resolv modificato per la prima volta");
    const result2 = await delay(2000);

    console.log("RESOLV: Parte il watchfile");
    fs.watchFile(tmpDirectory, async (curr: any, prev: any) => {
        console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${tmpDirectory}`);
        console.log("RESOLV: News Changes");
        let datafile = await resolvService.execute(tmpDirectory);
        console.log("RESOLV: File_letto");

        let ip = await resolvService.getmyip();
        console.log("RESOLV: Trovo_il_mio_ip");
        const check = await resolvService.changefile(ip, datafile);
        if (check) {
            if (check === "1") {
                // console.log("RESOLV: Nuovo_file_creato");
                // await resolvService.replace_file(tmpDirectory);
                console.log("RESOLV: File_Sostituito");
            }
            if (check === "0") {
                console.log("RESOLV: File non sostituito˘");
            }
        } else {
            console.log("Problema...")
        }

        console.log("RESOLV: Dormo 10 secondi");
        const result2 = await delay(10000);
    })


})();

