// config.js
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
    interface_for_resolv: "en1"
  }
  //    / sys / class/ net / eth0 / address
};
