const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  // 这里应该用type去判断身份的 不走心了
  isPf: state => state.user.token === '超级管理员账号',
  isOrg: state => state.user.token === '福颐助老机构',
  isGover: state => state.user.token === '政府管理员',
  post: state => state.app.post,
  provinces: state => state.user.list,
  roleObj: state => state.user.roleObj
}
export default getters
