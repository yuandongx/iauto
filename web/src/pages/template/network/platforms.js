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
      {name: "policy", description: "ACL"},
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
      {name: "policy", description: "安全策略"},
    ]
  },
]


export const protocols =[
  {
    "value": "1",
    "label": "icmp"
  },
  {
    "value": "2",
    "label": "igmp"
  },
  {
    "value": "3",
    "label": "ggp"
  },
  {
    "value": "4",
    "label": "ip"
  },
  {
    "value": "5",
    "label": "st"
  },
  {
    "value": "6",
    "label": "tcp"
  },
  {
    "value": "7",
    "label": "cbt"
  },
  {
    "value": "8",
    "label": "egp"
  },
  {
    "value": "9",
    "label": "igp"
  },
  {
    "value": "10",
    "label": "bbn-rcc-mon"
  },
  {
    "value": "11",
    "label": "nvp-ii"
  },
  {
    "value": "12",
    "label": "pup"
  },
  {
    "value": "13",
    "label": "argus"
  },
  {
    "value": "14",
    "label": "emcon"
  },
  {
    "value": "15",
    "label": "xnet"
  },
  {
    "value": "16",
    "label": "chaos"
  },
  {
    "value": "17",
    "label": "udp"
  },
  {
    "value": "18",
    "label": "mux"
  },
  {
    "value": "19",
    "label": "dcn-meas"
  },
  {
    "value": "20",
    "label": "hmp"
  },
  {
    "value": "21",
    "label": "prm"
  },
  {
    "value": "22",
    "label": "xns-idp"
  },
  {
    "value": "23",
    "label": "trunk-1"
  },
  {
    "value": "24",
    "label": "trunk-2"
  },
  {
    "value": "25",
    "label": "leaf-1"
  },
  {
    "value": "26",
    "label": "leaf-2"
  },
  {
    "value": "27",
    "label": "rdp"
  },
  {
    "value": "28",
    "label": "irtp"
  },
  {
    "value": "29",
    "label": "iso-tp4"
  },
  {
    "value": "30",
    "label": "netblt"
  },
  {
    "value": "31",
    "label": "mfe-nsp"
  },
  {
    "value": "32",
    "label": "merit-inp"
  },
  {
    "value": "33",
    "label": "sep"
  },
  {
    "value": "34",
    "label": "3pc"
  },
  {
    "value": "35",
    "label": "idpr"
  },
  {
    "value": "36",
    "label": "xtp"
  },
  {
    "value": "37",
    "label": "ddp"
  },
  {
    "value": "38",
    "label": "idpr-cmtp"
  },
  {
    "value": "39",
    "label": "tp++"
  },
  {
    "value": "40",
    "label": "il"
  },
  {
    "value": "41",
    "label": "ipv6"
  },
  {
    "value": "42",
    "label": "sdrp"
  },
  {
    "value": "43",
    "label": "ipv6-route"
  },
  {
    "value": "44",
    "label": "ipv6-frag"
  },
  {
    "value": "45",
    "label": "idrp"
  },
  {
    "value": "46",
    "label": "rsvp"
  },
  {
    "value": "47",
    "label": "gre"
  },
  {
    "value": "48",
    "label": "mhrp"
  },
  {
    "value": "49",
    "label": "bna"
  },
  {
    "value": "50",
    "label": "esp"
  },
  {
    "value": "51",
    "label": "ah"
  },
  {
    "value": "52",
    "label": "i-nlsp"
  },
  {
    "value": "53",
    "label": "swipe"
  },
  {
    "value": "54",
    "label": "narp"
  },
  {
    "value": "55",
    "label": "mobile"
  },
  {
    "value": "56",
    "label": "tlsp"
  },
  {
    "value": "57",
    "label": "skip"
  },
  {
    "value": "58",
    "label": "ipv6-icmp"
  },
  {
    "value": "59",
    "label": "ipv6-nonxt"
  },
  {
    "value": "60",
    "label": "ipv6-opts"
  },
  {
    "value": "62",
    "label": "cftp"
  },
  {
    "value": "64",
    "label": "sat-expak"
  },
  {
    "value": "65",
    "label": "kryptolan"
  },
  {
    "value": "66",
    "label": "rvd"
  },
  {
    "value": "67",
    "label": "ippc"
  },
  {
    "value": "69",
    "label": "sat-mon"
  },
  {
    "value": "70",
    "label": "visa"
  },
  {
    "value": "71",
    "label": "ipcv"
  },
  {
    "value": "72",
    "label": "cpnx"
  },
  {
    "value": "73",
    "label": "cphb"
  },
  {
    "value": "74",
    "label": "wsn"
  },
  {
    "value": "75",
    "label": "pvp"
  },
  {
    "value": "76",
    "label": "br-sat-mon"
  },
  {
    "value": "77",
    "label": "sun-nd"
  },
  {
    "value": "78",
    "label": "wb-mon"
  },
  {
    "value": "79",
    "label": "wb-expak"
  },
  {
    "value": "80",
    "label": "iso-ip"
  },
  {
    "value": "81",
    "label": "vmtp"
  },
  {
    "value": "82",
    "label": "secure-vmtp"
  },
  {
    "value": "83",
    "label": "vines"
  },
  {
    "value": "84",
    "label": "ttp"
  },
  {
    "value": "85",
    "label": "nsfnet-igp"
  },
  {
    "value": "86",
    "label": "dgp"
  },
  {
    "value": "87",
    "label": "tcf"
  },
  {
    "value": "88",
    "label": "eigrp"
  },
  {
    "value": "89",
    "label": "ospfigp"
  },
  {
    "value": "90",
    "label": "sprite-rpc"
  },
  {
    "value": "91",
    "label": "larp"
  },
  {
    "value": "92",
    "label": "mtp"
  },
  {
    "value": "93",
    "label": "ax.25"
  },
  {
    "value": "94",
    "label": "ipip"
  },
  {
    "value": "95",
    "label": "micp"
  },
  {
    "value": "96",
    "label": "scc-sp"
  },
  {
    "value": "97",
    "label": "etherip"
  },
  {
    "value": "98",
    "label": "encap"
  },
  {
    "value": "100",
    "label": "gmtp"
  },
  {
    "value": "101",
    "label": "ifmp"
  },
  {
    "value": "102",
    "label": "pnni"
  },
  {
    "value": "103",
    "label": "pim"
  },
  {
    "value": "104",
    "label": "aris"
  },
  {
    "value": "105",
    "label": "scps"
  },
  {
    "value": "106",
    "label": "qnx"
  },
  {
    "value": "107",
    "label": "a/n"
  },
  {
    "value": "108",
    "label": "ipcomp"
  },
  {
    "value": "109",
    "label": "snp"
  },
  {
    "value": "110",
    "label": "compaq-peer"
  },
  {
    "value": "111",
    "label": "ipx-in-ip"
  },
  {
    "value": "112",
    "label": "vrrp"
  },
  {
    "value": "113",
    "label": "pgm"
  },
  {
    "value": "115",
    "label": "l2tp"
  },
  {
    "value": "116",
    "label": "ddx"
  },
  {
    "value": "117",
    "label": "iatp"
  },
  {
    "value": "118",
    "label": "stp"
  },
  {
    "value": "119",
    "label": "srp"
  },
  {
    "value": "120",
    "label": "uti"
  },
  {
    "value": "121",
    "label": "smp"
  },
  {
    "value": "122",
    "label": "sm"
  },
  {
    "value": "123",
    "label": "ptp"
  },
  {
    "value": "124",
    "label": "isis"
  },
  {
    "value": "125",
    "label": "fire"
  },
  {
    "value": "126",
    "label": "crtp"
  },
  {
    "value": "127",
    "label": "crudp"
  },
  {
    "value": "128",
    "label": "sscopmce"
  },
  {
    "value": "129",
    "label": "iplt"
  },
  {
    "value": "130",
    "label": "sps"
  },
  {
    "value": "131",
    "label": "pipe"
  },
  {
    "value": "132",
    "label": "sctp"
  },
  {
    "value": "133",
    "label": "fc"
  }
];
