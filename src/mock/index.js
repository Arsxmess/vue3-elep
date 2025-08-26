import Mock from 'mockjs'

// 模拟分组数据
const groups = [
  {
    id: 1,
    name: '开发组',
    description: '负责软件开发工作',
    memberCount: 0,
    createdTime: '2025年08月05日 12:00:00'
  },
  {
    id: 2,
    name: '设计组',
    description: '负责UI/UX设计工作',
    memberCount: 0,
    createdTime: '2025年08月05日 12:00:00'
  },
  {
    id: 3,
    name: '测试组',
    description: '负责软件测试工作',
    memberCount: 0,
    createdTime: '2025年08月05日 12:00:00'
  },
  {
    id: 4,
    name: '运维组',
    description: '负责系统运维工作',
    memberCount: 0,
    createdTime: '2025年08月05日 12:00:00'
  },
  {
    id: 5,
    name: '产品组',
    description: '负责产品规划和管理',
    memberCount: 0,
    createdTime: '2025年08月05日 12:00:00'
  }
]

// 模拟用户数据
const users = [
  {
    id: 1,
    name: 'liubei',
    displayName: '刘备',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年12月31日 23:59:59'
  },
  {
    id: 2,
    name: 'guanyu',
    displayName: '关羽',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年12月31日 23:59:59'
  },
  {
    id: 3,
    name: 'zhangfei',
    displayName: '张飞',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年06月30日 23:59:59'
  },
  {
    id: 4,
    name: 'zhugeliang',
    displayName: '诸葛亮',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2027年01月15日 10:30:00'
  },
  {
    id: 5,
    name: 'caocao',
    displayName: '曹操',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年11月20日 14:45:30'
  },
  {
    id: 6,
    name: 'sunquan',
    displayName: '孙权',
    facePictures: [],
    group: '运维组',
    memberType: '正式员工',
    date: '2027年03月10日 09:15:45'
  },
  {
    id: 7,
    name: 'zhouyu',
    displayName: '周瑜',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '设计组',
    memberType: '正式员工',
    date: '2026年08月25日 16:20:10'
  },
  {
    id: 8,
    name: 'zhaoyun',
    displayName: '赵云',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年09月12日 11:05:20'
  },
  {
    id: 9,
    name: 'machao',
    displayName: '马超',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2027年02月28日 13:40:50'
  },
  {
    id: 10,
    name: 'huangzhong',
    displayName: '黄忠',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年07月14日 08:55:15'
  },
  {
    id: 11,
    name: 'simayi',
    displayName: '司马懿',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2027年04月05日 15:30:25'
  },
  {
    id: 12,
    name: 'lvbu',
    displayName: '吕布',
    facePictures: [],
    group: '设计组',
    memberType: '实习生',
    date: '2026年10月30日 17:10:35'
  },
  {
    id: 13,
    name: 'diaochan',
    displayName: '貂蝉',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '设计组',
    memberType: '正式员工',
    date: '2026年12月25日 12:00:00'
  },
  {
    id: 14,
    name: 'daqiao',
    displayName: '大乔',
    facePictures: [],
    group: '设计组',
    memberType: '实习生',
    date: '2027年01月20日 09:30:00'
  },
  {
    id: 15,
    name: 'xiaoqiao',
    displayName: '小乔',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '设计组',
    memberType: '正式员工',
    date: '2026年11月11日 11:11:11'
  },
  {
    id: 16,
    name: 'caoren',
    displayName: '曹仁',
    facePictures: [],
    group: '运维组',
    memberType: '正式员工',
    date: '2026年09月09日 09:09:09'
  },
  {
    id: 17,
    name: 'xiahoudun',
    displayName: '夏侯惇',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2027年02月14日 14:00:00'
  },
  {
    id: 18,
    name: 'xuchu',
    displayName: '许褚',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年08月01日 08:00:00'
  },
  {
    id: 19,
    name: 'zhangliao',
    displayName: '张辽',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年10月01日 10:00:00'
  },
  {
    id: 20,
    name: 'huanggai',
    displayName: '黄盖',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年07月07日 07:07:07'
  },
  {
    id: 21,
    name: 'gan ning',
    displayName: '甘宁',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2027年03月03日 15:30:00'
  },
  {
    id: 22,
    name: 'taishici',
    displayName: '太史慈',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年12月12日 12:12:12'
  },
  {
    id: 23,
    name: 'weiyan',
    displayName: '魏延',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年11月19日 19:00:00'
  },
  {
    id: 24,
    name: 'jiangwei',
    displayName: '姜维',
    facePictures: [],
    group: '开发组',
    memberType: '实习生',
    date: '2027年01月01日 00:00:00'
  },
  {
    id: 25,
    name: 'pangtong',
    displayName: '庞统',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年09月15日 09:30:00'
  },
  {
    id: 26,
    name: 'xunyu',
    displayName: '荀彧',
    facePictures: [],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年08月20日 16:45:00'
  },
  {
    id: 27,
    name: 'guojia',
    displayName: '郭嘉',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年10月10日 10:10:10'
  },
  {
    id: 28,
    name: 'lusu',
    displayName: '鲁肃',
    facePictures: [],
    group: '运维组',
    memberType: '正式员工',
    date: '2026年11月26日 11:26:00'
  },
  {
    id: 29,
    name: 'luxun',
    displayName: '陆逊',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2027年02月02日 14:00:00'
  },
  {
    id: 30,
    name: 'yuji',
    displayName: '于吉',
    facePictures: [],
    group: '设计组',
    memberType: '实习生',
    date: '2026年12月24日 00:00:00'
  },
  {
    id: 31,
    name: 'zhangjiao',
    displayName: '张角',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '测试组',
    memberType: '实习生',
    date: '2026年07月15日 19:30:00'
  },
  {
    id: 32,
    name: 'dongzhuo',
    displayName: '董卓',
    facePictures: [],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年06月20日 18:00:00'
  },
  {
    id: 33,
    name: 'yuan shao',
    displayName: '袁绍',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2026年09月05日 09:00:00'
  },
  {
    id: 34,
    name: 'liu biao',
    displayName: '刘表',
    facePictures: [],
    group: '运维组',
    memberType: '正式员工',
    date: '2026年10月25日 10:30:00'
  },
  {
    id: 35,
    name: 'liu zhang',
    displayName: '刘璋',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '运维组',
    memberType: '实习生',
    date: '2027年01月10日 11:00:00'
  },
  {
    id: 36,
    name: 'sun ce',
    displayName: '孙策',
    facePictures: [],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年08月18日 18:18:18'
  },
  {
    id: 37,
    name: 'sun quan',
    displayName: '孙权',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '运维组',
    memberType: '正式员工',
    date: '2026年12月05日 12:00:00'
  },
  {
    id: 38,
    name: 'sun jian',
    displayName: '孙坚',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年07月22日 07:22:00'
  },
  {
    id: 39,
    name: 'caopi',
    displayName: '曹丕',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '产品组',
    memberType: '正式员工',
    date: '2027年03月15日 15:00:00'
  },
  {
    id: 40,
    name: 'caozhi',
    displayName: '曹植',
    facePictures: [],
    group: '设计组',
    memberType: '实习生',
    date: '2026年11月12日 11:12:00'
  },
  {
    id: 41,
    name: 'caochong',
    displayName: '曹冲',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '设计组',
    memberType: '实习生',
    date: '2027年01月25日 13:00:00'
  },
  {
    id: 42,
    name: 'liushan',
    displayName: '刘禅',
    facePictures: [],
    group: '运维组',
    memberType: '实习生',
    date: '2026年09月30日 09:30:00'
  },
  {
    id: 43,
    name: 'jiangqin',
    displayName: '蒋钦',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年10月15日 10:15:00'
  },
  {
    id: 44,
    name: 'lingcao',
    displayName: '凌操',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年08月08日 08:08:08'
  },
  {
    id: 45,
    name: 'lingtong',
    displayName: '凌统',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年12月18日 12:18:00'
  },
  {
    id: 46,
    name: 'chengpu',
    displayName: '程普',
    facePictures: [],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年07月05日 17:30:00'
  },
  {
    id: 47,
    name: 'hanchao',
    displayName: '韩当',
    facePictures: [
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    ],
    group: '测试组',
    memberType: '正式员工',
    date: '2026年11月05日 11:05:00'
  },
  {
    id: 48,
    name: 'zhuran',
    displayName: '朱然',
    facePictures: [],
    group: '运维组',
    memberType: '正式员工',
    date: '2027年02月20日 14:30:00'
  },
  {
    id: 49,
    name: 'panzhang',
    displayName: '潘璋',
    facePictures: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ],
    group: '开发组',
    memberType: '正式员工',
    date: '2026年09月25日 09:25:00'
  },
  {
    id: 50,
    name: 'hejin',
    displayName: '何进',
    facePictures: [],
    group: '设计组',
    memberType: '实习生',
    date: '2026年10月31日 10:31:00'
  }
]
// 1.1 获取所有分组
Mock.mock('/api/groups', 'get', () => {
  console.log('Mock: 获取所有分组')
  return {
    success: true,
    data: groups
  }
})

// 1.2 添加分组
Mock.mock('/api/groups', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newGroup = {
    id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
    name: body.name,
    description: body.description,
    memberCount: 0,
    createdTime: body.createdTime
  }
  groups.push(newGroup)
  return {
    success: true,
    data: newGroup
  }
})

// 1.3 更新分组
Mock.mock(/\/api\/groups\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/groups\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = groups.findIndex(group => group.id === id)
  
  if (index !== -1) {
    groups[index] = {
      ...groups[index],
      name: body.name,
      description: body.description,
      createdTime: body.createdTime
    }
    return {
      success: true,
      data: groups[index]
    }
  }
  return {
    success: false,
    message: '分组不存在'
  }
})

// 1.4 删除分组
Mock.mock(/\/api\/groups\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/groups\/(\d+)/)[1])
  const index = groups.findIndex(group => group.id === id)
  
  if (index !== -1) {
    groups.splice(index, 1)
    return {
      success: true,
      message: '删除成功'
    }
  }
  return {
    success: false,
    message: '分组不存在'
  }
})

// 2.1 获取所有用户
Mock.mock('/api/users', 'get', () => {
  console.log('Mock: 获取所有用户')
  return {
    success: true,
    data: users
  }
})

// 2.2 添加用户
Mock.mock('/api/users', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: body.name,
    displayName: body.displayName,
    facePictures: body.facePictures || [],
    group: body.group,
    memberType: body.memberType,
    date: body.date
  }
  users.push(newUser)
  return {
    success: true,
    data: newUser
  }
})

// 2.3 更新用户
Mock.mock(/\/api\/users\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/users\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = users.findIndex(user => user.id === id)
  
  if (index !== -1) {
    users[index] = {
      ...users[index],
      name: body.name,
      displayName: body.displayName,
      facePictures: body.facePictures || [],
      group: body.group,
      memberType: body.memberType,
      date: body.date
    }
    return {
      success: true,
      data: users[index]
    }
  }
  return {
    success: false,
    message: '用户不存在'
  }
})

// 2.4 删除用户
Mock.mock(/\/api\/users\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/users\/(\d+)/)[1])
  const index = users.findIndex(user => user.id === id)
  
  if (index !== -1) {
    users.splice(index, 1)
    return {
      success: true,
      message: '删除成功'
    }
  }
  return {
    success: false,
    message: '用户不存在'
  }
})

export default Mock