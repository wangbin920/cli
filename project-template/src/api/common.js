import request from '@/utils/http'

/**
 *   获取用户信息
 * @param {*} params
 * @returns
 */
export function getUserInfo(params) {
    return request.post(`/system/auth`, params, '/auth')
}

/**
 *  退出登录
 * @param {*} params
 * @returns
 */
export function logOut(params) {
    return request.post(`/system/logout`, params, '/auth')
}

//  查询用户菜单列表字段
export function menuFieldsList(params) {
    return request.post(`/user/menu/fields/list`, params)
}

// 保存用户菜单列表字段
export function menuFieldsSave(params) {
    return request.post(`/user/menu/fields/save`, params)
}
