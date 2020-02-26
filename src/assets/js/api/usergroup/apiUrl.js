import config from '../../config'

let apiHost = config.apiHost

export default {
  userGroupAdd: apiHost + '/usercenter/userGroup/add',
  userGroupGet: apiHost + '/usercenter/userGroup/search',
  userGroupDel: apiHost + '/usercenter/userGroup/delete',
  userGroupBatchDelete: apiHost + '/usercenter/userGroup/delete',
  userGroupUpdate: apiHost + '/usercenter/userGroup/update',
  userGroupAuthorize: apiHost + '/usercenter/userGroup/authorize',
  userGetByGroup: apiHost + '/usercenter/userParent/usersOfGroupPage',
  userAddToGroup: apiHost + '/usercenter/userGroup/addUserToGroup',
  userDeleteFromGroup: apiHost + '/usercenter/userGroup/deleteUserFromGroup',
  userSearch: apiHost + '/usercenter/user/search',
  userGroupUpdateMenus: apiHost + '/usercenter/userGroup/updateGroupMenus',
  userGroupMenusGet: apiHost + '/usercenter/userGroup/getMenusOfGroup'
}
