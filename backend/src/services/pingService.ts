const ping = require('ping');
// const hosts = ['192.168.55.120', '192.168.55.140'];
const arp1 = require('arp-a');
let tbl: any = { ipaddrs: {}, ifnames: {} };
const cfg = require('config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
export default class PingService {

    async pingIP(hosts: string[]) {

        try {
            await hosts.forEach(async (host: string) => {
                const res = await ping.promise.probe(host);
                console.log("RESS => is Alive????", res)
            });

            await arp1.table(function (err: any, entry: any) {
                if (!!err) return console.log('arp: ' + err.message);
                if (!entry) return;
                if (entry.iface == cfg.arp.interface) {
                    tbl.ipaddrs[entry.ip] = entry.mac;
                    this.addRuleEbTables(entry.ip, entry.mac)
                }

                // if (!tbl.ifnames[entry.ifname]) tbl.ifnames[entry.ifname] = {};
                // tbl.ifnames[entry.ifname][entry.mac] = entry.ip;
            });
            console.log("tbl", tbl);
        } catch (error) {
            console.log("ERRR", error);
        }

    }

    async addRuleEbTables(ip: string, mac_address: string) {
        try {
            const { stdout, stderr } = await exec(`ebtables -t nat -A PREROUTING -p ARP -i edge0 --arp-ip-dst ${ip} -j dnat --to-dst ${mac_address} --dnat-target ACCEPT`);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (error) {
            console.log('error:', error);
        }
    }

    // async test() {
    //     try {
    //         const { stdout, stderr } = await exec('ebtables -t nat -A PREROUTING -p ARP -i edge0 --arp-ip-dst 10.10.0.121 -j dnat --to-dst dc:a6:32:78:c8:d1 --dnat-target ACCEPT');
    //         console.log('stdout:', stdout);
    //         console.log('stderr:', stderr);
    //     } catch (error) {
    //         console.log('error:', error);
    //     }
    // }

}