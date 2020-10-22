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
      {name: "acl", description: "ACL"},
    ]
  },
  {
    platform: "topsec",
    description: "天融信",
    features: [
      {name: "address", description: "地址"},
      {name: "address-group", description: "地址组"},
      {name: "service", description: "服务"},
      {name: "time-range", description: "时间"},
      {name: "service-group", description: "服务组"},
      {name: "policy", description: "安全策略"},
    ]
  },
]