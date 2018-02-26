export const ERR_OK = 0
// 是否是生产版本
let product = true
let dict = product ? {
  UMS: 'http://ums.17link.cc',
  MP: 'http://mp.17link.cc'
} : {
  UMS: '/apis',
  MP: '/jay'
}
export const UMS = dict.UMS
export const MP = dict.MP