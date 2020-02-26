import Mock from 'mockjs'
import { getAdminMenuInfo, getUserMenuInfo, getDriverMenuInfo, getUserInfo, getUsers, getTrips, getCars, getPerformance, getRider, getCards, getDriverPerformance } from './data/common'
import config from '@js/config'

if (config.isMock) {
  // 是否使用Mock数据
  Mock.mock(/\/getDriverMenuInfo/, getDriverMenuInfo)
  Mock.mock(/\/getUserMenuInfo/, getUserMenuInfo)
  Mock.mock(/\/getAdminMenuInfo/, getAdminMenuInfo)
  Mock.mock(/\/getUserInfo/, getUserInfo)
  Mock.mock(/\/getUsers/, getUsers)
  Mock.mock(/\/getTrips/, getTrips)
  Mock.mock(/\/getCars/, getCars)
  Mock.mock(/\/getPerformance/, getPerformance)
  Mock.mock(/\/getRider/, getRider)
  Mock.mock(/\/getCards/, getCards)
  Mock.mock(/\/getDriverPerformance/, getDriverPerformance)
}

export default Mock
