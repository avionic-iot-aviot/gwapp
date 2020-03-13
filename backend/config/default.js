// config.js
const path = require('path');
module.exports = {
  env: {
    envFilename: `.env.development`
  },
  general: {
    appName: "GWAPP",
    environment: process.env.NODE_ENV || "development",
    port: process.env.APP_PORT || 3800,
    restClientTimeout: 10000
  },
  arp: {
    interface: "en0",
    entry_interface: "ifname"
  },
  gateway: {
    interface: "dhcpbr",
    path_mac: "/sys/class/net/dhcpbr/address",
    interface_for_resolv: "en1",
    path_mac: "/sys/class/net/dhcpbr/address",
    path_resolv: path.join(__dirname, '../src/test.txt'),
    path_temp_out: path.join(__dirname, '../src/test_out.txt'),
    pre_resolv: path.join(__dirname, "../resolv")

  }
  //    / sys / class/ net / eth0 / address
};
