const ping = require('ping');
// const hosts = ['192.168.55.120', '192.168.55.140'];
const arp1 = require('arp-a');
let tbl: any = { ipaddrs: {}, ifnames: {} };
const cfg = require('config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
export default class PingService {


    async execute(hosts: string[]) {
        try {
            await this.pingIP(hosts);
            const arpData: any = await this.getElementsFromArpTable();
            if (arpData) {
                if (arpData && arpData.mac_addresses && Object.keys(arpData.mac_addresses).length > 0) {
                    await Object.keys(arpData.mac_addresses).forEach(async (key: string) => {
                        const ipaddrs: string[] = arpData.mac_addresses[key];
                        await ipaddrs.forEach(async (ip: string) => {
                            await this.addRuleEbTables(ip, key);
                        });
                    });
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }


    async pingIP(hosts: string[]) {

        try {
            await hosts.forEach(async (host: string) => {
                const res = await ping.promise.probe(host);
                console.log("RESS => is Alive????", res)
            });

            //     await arp1.table(function (err: any, entry: any) {
            //         if (!!err) return console.log('arp: ' + err.message);
            //         if (!entry) return;
            //         if (entry.iface == cfg.arp.interface) {
            //             tbl.ipaddrs[entry.ip] = entry.mac;
            //             if (entry.mac != '00:00:00:00:00:00') {
            //                 this.addRuleEbTables(entry.ip, entry.mac);
            //             }
            //         }

            //         // if (!tbl.ifnames[entry.ifname]) tbl.ifnames[entry.ifname] = {};
            //         // tbl.ifnames[entry.ifname][entry.mac] = entry.ip;
            //     });
            //     console.log("tbl", tbl);
        } catch (error) {
            console.log("ERRR", error);
        }

    }

    async getElementsFromArpTable() {
        try {
            const promise = new Promise((resolve, reject) => {
                let tbl: any = { mac_addresses: {} };

                arp1.table(function (err: any, entry: any) {
                    if (!!err) return console.log('arp: ' + err.message);
                    if (!entry) return;
                    if (entry && entry[cfg.arp.entry_interface] && entry[cfg.arp.entry_interface] == cfg.arp.interface) {
                        if (tbl.mac_addresses[entry.mac]) {
                            if (!tbl.mac_addresses[entry.mac].includes(entry.ip)) {
                                tbl.mac_addresses[entry.mac].push(entry.ip);
                            }
                        } else {
                            tbl.mac_addresses[entry.mac] = [entry.ip];
                        }
                    }
                    resolve(tbl);

                });
            });

            return promise;
        } catch (error) {
            console.log("ERRR", error);
        }
    }

    async addRuleEbTables(ip: string, mac_address: string) {
        try {
            const { stdout, stderr } = await exec(`sudo ebtables -t nat -A PREROUTING -p ARP -i edge0 --arp-ip-dst ${ip} -j dnat --to-dst ${mac_address} --dnat-target ACCEPT`);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (error) {
            console.log('error:', error);
        }
    }
}