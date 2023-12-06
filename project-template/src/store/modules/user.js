import { getUserInfo, logOut } from '@/api/common'
import { getStore, setStore } from '@/utils'
import { toCenterSysSuffix, toCenterSysUrlMap } from '@/utils/dict'
import { setBtnPermission } from '@/utils/common'
import router from '@/router'
import { Modal } from 'ant-design-vue';
import i18n from '@/i18n'

const state = {
    userInfo: {}, // 用户信息
    token: getStore('token'),
    menuTree: getStore('menuTree') || [], //菜单权限
    btnPermission: getStore('btnPermission') || [], //按钮权限
}

const getters = {}

const mutations = {
    setUserInfo (state, payload) {
        state.userInfo = payload;
        state.menuTree = payload.menuTree;
        state.btnPermission = payload.btnList;
    },

    setToken (state, payload) {
        state.token = payload
    }
}

const actions = {
    async updatePermissions ({ dispatch, commit, state }) {
        if (window.onceModalStatus) {
            return
        }
        window.onceModalStatus = true

        Modal.info({
            title: i18n.global.t('common.authTips'),
            content: i18n.global.t('common.authTipsContent'),
            keyboard: false,
            onOk: async () => {
                window.onceModalStatus = false
                await dispatch('dispatchUserInfo', { systemId: getStore('systemId') })
                try {
                    if (state.menuTree.treeNodeList.length > 0) {
                        if (state.menuTree.treeNodeList[0].treeNodeList && state.menuTree.treeNodeList[0].treeNodeList.length > 0 && state.menuTree.treeNodeList[0].treeNodeList[0].moduleType === 1) {
                            router.push(state.menuTree.treeNodeList[0].treeNodeList[0].moduleUrl)
                            return
                        }
                        router.push(state.menuTree.treeNodeList[0].moduleUrl)

                    } else {
                        dispatch('dispatchLogOut', false)
                    }
                } catch (error) {
                    dispatch('dispatchLogOut', false)
                }
            },
        });
    },
    // 获取用户信息
    async dispatchUserInfo ({ commit, state, dispatch }, params) {
        try {
            let data = await getUserInfo(params)
            if (data) {
                setStore('menuTree', data.menuTree.treeNodeList || [])
                let btnList = []
                btnList = setBtnPermission(data.menuTree.treeNodeList, btnList)
                setStore('btnPermission', btnList)
                commit('setUserInfo', { ...data, btnList })
            } else {
                dispatch('dispatchLogOut', false)
            }
        } catch (error) {
            dispatch('dispatchLogOut', false)
        }
    },

    // 存储token
    dispatchToken ({ commit, state }, params) {
        commit('setToken', params)
    },

    // 退出登录
    async dispatchLogOut ({ commit, state, dispatch }, bool) {
        console.log('----------退出登录----------')
        return
        if (bool) {
            try {
                await logOut()
            } catch (error) { }
        }
        setStore('token', '')
        setStore('systemId', '')
        setStore('menuTree', [])
        setStore('btnPermission', [])
        commit('setToken', '')
        commit('setUserInfo', {})
        // 跳转至ODPM登录页
        setTimeout(() => {
            window.location.href = `${toCenterSysUrlMap[process.env.VUE_APP_MODE]}${bool ? toCenterSysSuffix : ''
                }`
        }, 500)
    }
}
export default { state, getters, mutations, actions }
