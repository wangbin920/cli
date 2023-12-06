import Qs from 'qs'
import Axios from 'axios'
import { baseURLMap } from '@/utils/dict'

export const Request = async ({
    params = {},
    url = '',
    method = 'GET',
    cancelToken = null,
    contentType = 'application/x-www-form-urlencoded',
    headers = {},
    module = 'analytics'
} = {}) => {
    let opt = {
        baseURL: baseURLMap[process.env.VUE_APP_MODE][module],
        method,
        url,
        cancelToken,
        headers: {
            ...headers
        }
    }

    switch (method.toUpperCase()) {
        case 'GET':
            Object.assign(opt, {
                params,
                // 序列化参数
                paramsSerializer: function (params) {
                    return Qs.stringify(params, { arrayFormat: 'indices' })
                },

                headers: {
                    'Content-Type': contentType,
                    ...opt.headers
                }
            })
            break

        case 'POST':
            Object.assign(opt, {
                headers: {
                    'Content-Type': 'application/json',
                    ...opt.headers
                },
                data: params
            })
            break

        case 'PUT':
            opt.data = qs.stringify(params)
            break

        case 'DELETE':
            opt.data = params
            break
    }

    let data = await Axios(opt)
    return data
}
