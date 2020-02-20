const ping = require('ping');
// const hosts = ['192.168.55.120', '192.168.55.140'];
const arp1 = require('arp-a');
let tbl: any = { ipaddrs: {}, ifnames: {} };
const cfg = require('config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
export default class PingService {

    // dato un array di hosts, verranno eseguiti dei passi per aggiornare l'ebtables
    async execute(hosts: string[]) {
        try {
            await this.flushEbTables();
            await this.pingIP(hosts);
            const arpData: any = await this.getElementsFromArpTable();
            if (arpData) {
                if (arpData && arpData.mac_addresses && Object.keys(arpData.mac_addresses).length > 0) {
                    await Object.keys(arpData.mac_addresses).forEach(async (key: string) => {
                        const ipaddrs: string[] = arpData.mac_addresses[key];
                        await ipaddrs.forEach(async (ip: string) => {
                            if (hosts.includes(ip)) {
                                await this.addRuleEbTables(ip, key);
                            }
                        });
                    });
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    // viene fatto un ping a tutti gli hosts dell'array
    // in questo modo nella tabella ARP verranno memorizzati i MAC address relativi agli IPs
    async pingIP(hosts: string[]) {

        try {
            await hosts.forEach(async (host: string) => {
                const res = await ping.promise.probe(host);
                console.log("RESS => is Alive????", res)
            });
        } catch (error) {
            console.log("ERRR", error);
        }

    }

    // il metodo scansiona la tabella degli ARP
    // seleziona le righe relative all'interfaccia indicata nel file di configurazione
    // ritorna una mappa contenente MAC addresses e IPs
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
    //dato un IP e un MAC Address, verra inserita la regola nell'ebtables
    async addRuleEbTables(ip: string, mac_address: string) {
        try {
            const { stdout, stderr } = await exec(`sudo ebtables -t nat -A PREROUTING -p ARP -i edge0 --arp-ip-dst ${ip} -j dnat --to-dst ${mac_address} --dnat-target ACCEPT`);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (error) {
            console.log('error:', error);
        }
    }
    // L'ebtables viene svuotata al fine di evitare che ci siano regole in più
    async flushEbTables() {
        try {
            const { stdout, stderr } = await exec(`sudo ebtables -t nat -F`);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (error) {
            console.log('error:', error);
        }
    }
}