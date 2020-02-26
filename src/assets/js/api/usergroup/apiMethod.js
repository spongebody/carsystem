import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addUserGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delUserGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getUserGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getUserByGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGetByGroup
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateUserGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  authorizeUserGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupAuthorize
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  searchUser: function (req) {
    req.method = 'post'
    let queryUrl = api.userSearch
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  addUserToGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userAddToGroup
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  deleteUserFromGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userDeleteFromGroup
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  batchDeleteGroup: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupBatchDelete
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateGroupMenus: function (req) {
    req.method = 'post'
    let queryUrl = api.userGroupUpdateMenus
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getGroupMenus: function (req) {
    req.method = 'get'
    let queryUrl = api.userGroupMenusGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
