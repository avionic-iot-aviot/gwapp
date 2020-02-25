import PingService from '../services/pingService';
const pingService = new PingService();
// pingService.pingIP(['192.168.55.120', '192.168.55.140']);
// pingService.getMacAddress().then((res) => {
//     console.log("RES", res);
// })
pingService.execute(["10.10.0.121"]);
console.log("PIPPO", process.env);