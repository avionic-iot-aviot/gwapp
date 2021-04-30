// config.js
const path = require('path');
module.exports = {
  env: {
    envFilename: `.env.production`
  },
  arp: {
    interface: "dhcpbr",
    entry_interface: "iface"
  },
  gateway: {
    interface: "dhcpbr",
    interface_for_resolv: "dhcpbr",
    path_resolv: "/etc/resolv.conf",
  }
};
