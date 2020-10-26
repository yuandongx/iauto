export default [
  {
    platform: "asa",
    description: "思科",
    features: [
      {name: "address", description: "地址"},
      {name: "address-group", description: "地址组"},
      {name: "service", description: "服务"},
      {name: "service-group", description: "服务组"},
      {name: "time-range", description: "时间"},
      {name: "asa-acl", description: "ACL"},
    ]
  },
  {
    platform: "topsec",
    description: "天融信",
    features: [
      {name: "address", description: "地址"},
      {name: "address-group", description: "地址组"},
      {name: "service", description: "服务"},
      {name: "service-group", description: "服务组"},
      {name: "time-range", description: "时间"},
      {name: "topsec-fw-policy", description: "安全策略"},
    ]
  },
]


export const protocols = [
  {
    "value": "icmp",
    "label": "icmp"
  },
  {
    "value": "igmp",
    "label": "igmp"
  },
  {
    "value": "ggp",
    "label": "ggp"
  },
  {
    "value": "ip",
    "label": "ip"
  },
  {
    "value": "st",
    "label": "st"
  },
  {
    "value": "tcp",
    "label": "tcp"
  },
  {
    "value": "cbt",
    "label": "cbt"
  },
  {
    "value": "egp",
    "label": "egp"
  },
  {
    "value": "igp",
    "label": "igp"
  },
  {
    "value": "bbn-rcc-mon",
    "label": "bbn-rcc-mon"
  },
  {
    "value": "nvp-ii",
    "label": "nvp-ii"
  },
  {
    "value": "pup",
    "label": "pup"
  },
  {
    "value": "argus",
    "label": "argus"
  },
  {
    "value": "emcon",
    "label": "emcon"
  },
  {
    "value": "xnet",
    "label": "xnet"
  },
  {
    "value": "chaos",
    "label": "chaos"
  },
  {
    "value": "udp",
    "label": "udp"
  },
  {
    "value": "mux",
    "label": "mux"
  },
  {
    "value": "dcn-meas",
    "label": "dcn-meas"
  },
  {
    "value": "hmp",
    "label": "hmp"
  },
  {
    "value": "prm",
    "label": "prm"
  },
  {
    "value": "xns-idp",
    "label": "xns-idp"
  },
  {
    "value": "trunk-1",
    "label": "trunk-1"
  },
  {
    "value": "trunk-2",
    "label": "trunk-2"
  },
  {
    "value": "leaf-1",
    "label": "leaf-1"
  },
  {
    "value": "leaf-2",
    "label": "leaf-2"
  },
  {
    "value": "rdp",
    "label": "rdp"
  },
  {
    "value": "irtp",
    "label": "irtp"
  },
  {
    "value": "iso-tp4",
    "label": "iso-tp4"
  },
  {
    "value": "netblt",
    "label": "netblt"
  },
  {
    "value": "mfe-nsp",
    "label": "mfe-nsp"
  },
  {
    "value": "merit-inp",
    "label": "merit-inp"
  },
  {
    "value": "sep",
    "label": "sep"
  },
  {
    "value": "3pc",
    "label": "3pc"
  },
  {
    "value": "idpr",
    "label": "idpr"
  },
  {
    "value": "xtp",
    "label": "xtp"
  },
  {
    "value": "ddp",
    "label": "ddp"
  },
  {
    "value": "idpr-cmtp",
    "label": "idpr-cmtp"
  },
  {
    "value": "tp++",
    "label": "tp++"
  },
  {
    "value": "il",
    "label": "il"
  },
  {
    "value": "ipv6",
    "label": "ipv6"
  },
  {
    "value": "sdrp",
    "label": "sdrp"
  },
  {
    "value": "ipv6-route",
    "label": "ipv6-route"
  },
  {
    "value": "ipv6-frag",
    "label": "ipv6-frag"
  },
  {
    "value": "idrp",
    "label": "idrp"
  },
  {
    "value": "rsvp",
    "label": "rsvp"
  },
  {
    "value": "gre",
    "label": "gre"
  },
  {
    "value": "mhrp",
    "label": "mhrp"
  },
  {
    "value": "bna",
    "label": "bna"
  },
  {
    "value": "esp",
    "label": "esp"
  },
  {
    "value": "ah",
    "label": "ah"
  },
  {
    "value": "i-nlsp",
    "label": "i-nlsp"
  },
  {
    "value": "swipe",
    "label": "swipe"
  },
  {
    "value": "narp",
    "label": "narp"
  },
  {
    "value": "mobile",
    "label": "mobile"
  },
  {
    "value": "tlsp",
    "label": "tlsp"
  },
  {
    "value": "skip",
    "label": "skip"
  },
  {
    "value": "ipv6-icmp",
    "label": "ipv6-icmp"
  },
  {
    "value": "ipv6-nonxt",
    "label": "ipv6-nonxt"
  },
  {
    "value": "ipv6-opts",
    "label": "ipv6-opts"
  },
  {
    "value": "cftp",
    "label": "cftp"
  },
  {
    "value": "sat-expak",
    "label": "sat-expak"
  },
  {
    "value": "kryptolan",
    "label": "kryptolan"
  },
  {
    "value": "rvd",
    "label": "rvd"
  },
  {
    "value": "ippc",
    "label": "ippc"
  },
  {
    "value": "sat-mon",
    "label": "sat-mon"
  },
  {
    "value": "visa",
    "label": "visa"
  },
  {
    "value": "ipcv",
    "label": "ipcv"
  },
  {
    "value": "cpnx",
    "label": "cpnx"
  },
  {
    "value": "cphb",
    "label": "cphb"
  },
  {
    "value": "wsn",
    "label": "wsn"
  },
  {
    "value": "pvp",
    "label": "pvp"
  },
  {
    "value": "br-sat-mon",
    "label": "br-sat-mon"
  },
  {
    "value": "sun-nd",
    "label": "sun-nd"
  },
  {
    "value": "wb-mon",
    "label": "wb-mon"
  },
  {
    "value": "wb-expak",
    "label": "wb-expak"
  },
  {
    "value": "iso-ip",
    "label": "iso-ip"
  },
  {
    "value": "vmtp",
    "label": "vmtp"
  },
  {
    "value": "secure-vmtp",
    "label": "secure-vmtp"
  },
  {
    "value": "vines",
    "label": "vines"
  },
  {
    "value": "ttp",
    "label": "ttp"
  },
  {
    "value": "nsfnet-igp",
    "label": "nsfnet-igp"
  },
  {
    "value": "dgp",
    "label": "dgp"
  },
  {
    "value": "tcf",
    "label": "tcf"
  },
  {
    "value": "eigrp",
    "label": "eigrp"
  },
  {
    "value": "ospfigp",
    "label": "ospfigp"
  },
  {
    "value": "sprite-rpc",
    "label": "sprite-rpc"
  },
  {
    "value": "larp",
    "label": "larp"
  },
  {
    "value": "mtp",
    "label": "mtp"
  },
  {
    "value": "ax.25",
    "label": "ax.25"
  },
  {
    "value": "ipip",
    "label": "ipip"
  },
  {
    "value": "micp",
    "label": "micp"
  },
  {
    "value": "scc-sp",
    "label": "scc-sp"
  },
  {
    "value": "etherip",
    "label": "etherip"
  },
  {
    "value": "encap",
    "label": "encap"
  },
  {
    "value": "gmtp",
    "label": "gmtp"
  },
  {
    "value": "ifmp",
    "label": "ifmp"
  },
  {
    "value": "pnni",
    "label": "pnni"
  },
  {
    "value": "pim",
    "label": "pim"
  },
  {
    "value": "aris",
    "label": "aris"
  },
  {
    "value": "scps",
    "label": "scps"
  },
  {
    "value": "qnx",
    "label": "qnx"
  },
  {
    "value": "a/n",
    "label": "a/n"
  },
  {
    "value": "ipcomp",
    "label": "ipcomp"
  },
  {
    "value": "snp",
    "label": "snp"
  },
  {
    "value": "compaq-peer",
    "label": "compaq-peer"
  },
  {
    "value": "ipx-in-ip",
    "label": "ipx-in-ip"
  },
  {
    "value": "vrrp",
    "label": "vrrp"
  },
  {
    "value": "pgm",
    "label": "pgm"
  },
  {
    "value": "l2tp",
    "label": "l2tp"
  },
  {
    "value": "ddx",
    "label": "ddx"
  },
  {
    "value": "iatp",
    "label": "iatp"
  },
  {
    "value": "stp",
    "label": "stp"
  },
  {
    "value": "srp",
    "label": "srp"
  },
  {
    "value": "uti",
    "label": "uti"
  },
  {
    "value": "smp",
    "label": "smp"
  },
  {
    "value": "sm",
    "label": "sm"
  },
  {
    "value": "ptp",
    "label": "ptp"
  },
  {
    "value": "isis",
    "label": "isis"
  },
  {
    "value": "fire",
    "label": "fire"
  },
  {
    "value": "crtp",
    "label": "crtp"
  },
  {
    "value": "crudp",
    "label": "crudp"
  },
  {
    "value": "sscopmce",
    "label": "sscopmce"
  },
  {
    "value": "iplt",
    "label": "iplt"
  },
  {
    "value": "sps",
    "label": "sps"
  },
  {
    "value": "pipe",
    "label": "pipe"
  },
  {
    "value": "sctp",
    "label": "sctp"
  },
  {
    "value": "fc",
    "label": "fc"
  }
];
