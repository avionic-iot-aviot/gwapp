// config.js
const path = require("path");
module.exports = {
  env: {
    envFilename: `.env.staging`
  },
  general: {
    appName: "GWAPP",
    environment: process.env.NODE_ENV || "development",
    port: process.env.APP_PORT || 3800,
    restClientTimeout: 10000
  },
  arp: {
    interface: "dhcpbr",
    entry_interface: "iface"
  },
  gateway: {
    interface: "dhcpbr",
    path_mac: "/sys/class/net/dhcpbr/address",
    path_resolv: "/etc/resolv.conf",
    interface_for_resolv: "edge0",
    path_temp_out: path.join(__dirname, "../file_temp/test_out.txt")
  }
};
