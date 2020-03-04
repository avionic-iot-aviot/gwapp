// config.js
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
    interface_for_resolv: "edge0",
    path_resolv: "/etc/resolv.conf",
  }
};
