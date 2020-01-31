const ping = require('ping');
// const arp = require("arping");
const hosts = ['192.168.55.120', '192.168.55.140'];
const arp1 = require('arp-a');
let tbl: any = { ipaddrs: {}, ifnames: {} };
const cfg = require('config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
export default class PingService {

    async pingIP() {
        
        try {
            await hosts.forEach(async (host: string) => {
                const res = await ping.promise.probe(host);
                console.log("RESS => is Alive????", res)
            });
            // await arp.ping("192.168.0.1", (err: any, info: any) => {
            //     if (err) throw err; // Timeout, ...
            //     // THA = target hardware address
            //     // TIP = target IP address
            //     console.log("info", info);
            //     console.log("%s (%s) responded in %s secs", info.tha, info.tip, info.elapsed);
            // });

            await arp1.table(function (err: any, entry: any) {
                if (!!err) return console.log('arp: ' + err.message);
                if (!entry) return;
                if (entry.ifname == cfg.arp.interface) {
                    tbl.ipaddrs[entry.ip] = entry.mac;
                }

                if (!tbl.ifnames[entry.ifname]) tbl.ifnames[entry.ifname] = {};
                tbl.ifnames[entry.ifname][entry.mac] = entry.ip;
            });
            console.log("TABLEE", tbl);
        } catch (error) {
            console.log("ERRR", error);
        }

    }

    async test() {
        try {
            const { stdout, stderr } = await exec('ebtables -t nat -A PREROUTING -p ARP -i edge0 --arp-ip-dst 10.10.0.121 -j dnat --to-dst dc:a6:32:78:c8:d1 --dnat-target ACCEPT');
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (error) {
            console.log('error:', error);

        }

    }

}