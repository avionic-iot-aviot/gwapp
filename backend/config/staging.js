// config.js
module.exports = {
  env: {
    envFilename: `.env.staging`
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
    path_temp_out: "/etc/resolv.conf"
  }
};
