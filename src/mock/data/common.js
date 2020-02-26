
export const getUserMenuInfo = req => {
  console.log('@@@Mock请求参数：', req)
  return {
    'code': 0,
    'message': '操作成功!',
    'data': {
      'menuList': [
        {
          'id': '00001',
          'seq': 1,
          'parent': '0',
          'name': '系统功能',
          'title': '系统功能',
          'type': 'MODULE',
          'active': 1,
          'readOnly': 0,
          'level': 1,
          'children': [
            {
              'name': '我要派车',
              'title': '我要派车',
              'icon': 'fros-icon-yunshuzhongwuliu-xianxing',
              'router': 'sendcar/SendCar',
              'children': []
            },
            {
              'name': '用车管理',
              'title': '用车管理',
              'icon': 'fros-icon-shezhi-xianxing',
              'router': 'usecarmanage/UseCarManage',
              'children': []
            },
            {
              'name': '行程单',
              'title': '行程单',
              'icon': 'fros-icon-danju-xianxing',
              'router': 'itinerary/Itinerary',
              'children': []
            },
            {
              'name': '账户信息',
              'title': '账户信息',
              'icon': 'fros-icon-users',
              'router': 'accountinfo/AccountInfo',
              'children': []
            }
          ]
        }
      ]
    }
  }
}

export const getAdminMenuInfo = req => {
  console.log('@@@Mock请求参数：', req)
  return {
    'code': 0,
    'message': '操作成功!',
    'data': {
      'menuList': [
        {
          'id': '00001',
          'seq': 1,
          'parent': '0',
          'name': '系统功能',
          'title': '系统功能',
          'type': 'MODULE',
          'active': 1,
          'readOnly': 0,
          'level': 1,
          /*     'children': [
            {
              'name': '我要派车',
              'title': '我要派车',
              'icon': 'fros-icon-yunshuzhongwuliu-xianxing',
              'router': 'sendcar/SendCar',
              'children': []
            },
            {
              'name': '用车管理',
              'title': '用车管理',
              'icon': 'fros-icon-shezhi-xianxing',
              'router': 'usecarmanage/UseCarManage',
              'children': []
            },
            {
              'name': '行程单',
              'title': '行程单',
              'icon': 'fros-icon-danju-xianxing',
              'router': 'itinerary/Itinerary',
              'children': []
            },
            {
              'name': '账户信息',
              'title': '账户信息',
              'icon': 'fros-icon-users',
              'router': 'accountinfo/AccountInfo',
              'children': []
            }
          ] */
          /*  // 司机端
          'children': [
            {
              'name': '当前服务',
              'title': '当前服务',
              'icon': 'fros-icon--fuwu-xianxing',
              'router': 'currentservice/CurrentService',
              'children': []
            },
            {
              'name': '抢单中心',
              'title': '抢单中心',
              'icon': 'fros-icon-jiesuan-xianxing',
              'router': 'ordercenter/OrderCenter',
              'children': []
            },
            {
              'name': '我的业绩',
              'title': '我的业绩',
              'icon': 'fros-icon-youhuijuan-xianxing',
              'router': 'myperformance/MyPerformance',
              'children': []
            },
            {
              'name': '我的信息',
              'title': '我的信息',
              'icon': 'fros-icon-yonghu-xianxing',
              'router': 'driverinfo/DriverInfo',
              'children': []
            }
          ] */

          // 后台管理
          'children': [
            {
              'name': '客户管理',
              'title': '客户管理',
              'icon': 'fros-icon-users',
              'router': 'userbasicinfo/UserBasicInfo',
              'children': []
            },
            {
              'name': '行程管理',
              'title': '行程管理',
              'icon': 'fros-icon-xianlu',
              'router': 'tripmanage/TripManage',
              'children': []
            },
            {
              'name': '车辆管理',
              'title': '车辆管理',
              'icon': 'fros-icon-yunshuzhongwuliu-xianxing',
              'router': 'carmanage/CarManage',
              'children': []
            },
            {
              'name': '业绩查询',
              'title': '业绩查询',
              'icon': 'fros-icon-jifen-xianxing',
              'router': 'inquery/Inquery',
              'children': []
            }
          ]
        }
      ]
    }
  }
}

export const getDriverMenuInfo = req => {
  console.log('@@@Mock请求参数：', req)
  return {
    'code': 0,
    'message': '操作成功!',
    'data': {
      'menuList': [
        {
          'id': '00001',
          'seq': 1,
          'parent': '0',
          'name': '系统功能',
          'title': '系统功能',
          'type': 'MODULE',
          'active': 1,
          'readOnly': 0,
          'level': 1,
          'children': [
            {
              'name': '当前服务',
              'title': '当前服务',
              'icon': 'fros-icon--fuwu-xianxing',
              'router': 'currentservice/CurrentService',
              'children': []
            },
            {
              'name': '抢单中心',
              'title': '抢单中心',
              'icon': 'fros-icon-jiesuan-xianxing',
              'router': 'ordercenter/OrderCenter',
              'children': []
            },
            {
              'name': '我的业绩',
              'title': '我的业绩',
              'icon': 'fros-icon-youhuijuan-xianxing',
              'router': 'myperformance/MyPerformance',
              'children': []
            },
            {
              'name': '我的信息',
              'title': '我的信息',
              'icon': 'fros-icon-yonghu-xianxing',
              'router': 'driverinfo/DriverInfo',
              'children': []
            }
          ]
        }
      ]
    }
  }
}

export const getUserInfo = req => {
  console.log('@@@Mock请求参数：', req)
  // 获取用户信息
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      avatar: `/${buildConfig.publicPath}/static/image/manage/default_handsome.jpg`,
      username: 'wadaxiwanear',
      root: 'admin',
      rootName: '管理员',
      sex: 1
    }
  }
}

// 客户管理
export const getUsers = req => {
  console.log('@@@Mock请求参数：', req)
  // 获取用户信息
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [{
        companyName: '长沙市人民政府',
        administrator: '米米',
        endDate: '2020.8.8',
        tel: '13507318888',
        address: '长沙市五一广场45号'
      }, {
        companyName: '湖南大学',
        administrator: '张老师',
        endDate: '2020.12.31',
        tel: '13807316666',
        address: '长沙市大学城'
      }, {
        companyName: '湖南电视台',
        administrator: '李主任',
        endDate: '2023.12.31',
        tel: '13607310000',
        address: '长沙市开福区'
      }]
    }
  }
}

// 行程管理
export const getTrips = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [{
        location: '长城万富汇',
        rider: '小芳',
        time: '2019-11-19 08:00',
        tel: '13507318888',
        driverTel: '13507319999',
        dept: '销售部',
        review: 0
      }, {
        location: '长沙南站',
        rider: '小红',
        time: '2019-11-19 08:00',
        tel: '13507318881',
        driverTel: '13507318888',
        dept: '行政部',
        review: 0
      }, {
        location: '长沙市政府',
        rider: '米米',
        time: '2019-11-19 08:00',
        tel: '13507318888',
        driverTel: '13507317777',
        dept: '技术部',
        review: 1
      }]
    }
  }
}

// 车辆管理
export const getCars = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [{
        driver: '小马',
        tel: '13507313388',
        carCode: '湘A11011',
        carType: '舒适5座',
        brand: '大众帕萨特',
        color: '黑色',
        priority: 'B'
      }, {
        driver: '小牛',
        tel: '13507313381',
        carCode: '湘A11013',
        carType: '舒适5座',
        brand: '大众帕萨特',
        color: '黑色',
        priority: 'B'
      }, {
        driver: '小羊',
        tel: '13507313382',
        carCode: '湘A11012',
        carType: '舒适7座',
        brand: '别克GL8',
        color: '棕色',
        priority: 'B'
      }]
    }
  }
}

// 业绩查询
export const getPerformance = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [{
        driver: '小马',
        tel: '13507313388',
        carCode: '湘A11011',
        brand: '大众帕萨特',
        carType: '舒适5座',
        km: '88',
        money: '420',
        paidMoneyTime: '2019.11.28 11:00 支付200',
        time: '63',
        isPay: 0
      }, {
        driver: '小牛',
        tel: '13507313381',
        carCode: '湘A11013',
        carType: '舒适5座',
        brand: '大众帕萨特',
        km: '25',
        money: '120',
        paidMoneyTime: '2019.10.28 11:00支付120',
        time: '27',
        isPay: 1
      }, {
        driver: '小羊',
        tel: '13507313382',
        carCode: '湘A11012',
        carType: '舒适7座',
        brand: '别克GL8',
        color: '棕色',
        priority: 'B',
        km: '108',
        money: '580',
        paidMoneyTime: '2019.10.28 11:00支付580',
        time: '132',
        isPay: 1
      }]
    }
  }
}

// 乘车人管理
export const getRider = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [{
        name: '小米',
        tel: '13507318888',
        dept: '销售部'
      }, {
        name: '小红',
        tel: '13507318881',
        dept: '行政部'
      }, {
        name: '小芳',
        tel: '13507318882',
        dept: '技术部'
      }]
    }
  }
}

// 行程单
export const getCards = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        },
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        },
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        },
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        },
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        },
        {
          numberCode: Date.now(),
          date: '2019年11月19日',
          rider: '小芳',
          riderTel: '13507318888',
          startLocation: '长城万富汇',
          startTime: '16:29',
          stopPoint: '长沙南站',
          endLocation: '市政府',
          carType: '舒适5座',
          carCode: '湘A98N16',
          driver: '李师傅',
          driverTel: '13507316666',
          kilometer: '11 Km'
        }
      ]
    }
  }
}

// 司机业绩
export const getDriverPerformance = req => {
  return {
    // 返回成功标识
    code: 0,
    // 查询返回列表
    data: {
      totalSize: 3,
      records: [
        {
          serviceTime: '15min',
          startTime: '2019-11-19 08:00',
          income: '58',
          mileage: '18',
          result: 1
        },
        {
          serviceTime: '45min',
          startTime: '2019-11-19 08:00',
          income: '58',
          mileage: '18',
          result: 1
        },
        {
          serviceTime: '15min',
          startTime: '2019-11-19 08:00',
          income: '58',
          mileage: '18',
          result: 0
        }
      ]
    }
  }
}
