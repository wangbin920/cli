// 各个环境跳转至center系统的地址
export const toCenterSysSuffix = '/login?toFrom=RISKCONTROL'
export const toCenterSysUrlMap = {
    development: 'https://center-d.oceanpayment.com',
    test: 'https://center-t.oceanpayment.com',
    mirr: 'https://center-m.oceanpayment.com',
    sandbox: 'https://test-center.oceanpayment.com',
    production: 'https://center.oceanpayment.com'
}
//当前项目的请求服务名
export const urlModule = '/risk-ctrl'
// 各个环境的请求地址前缀
export const baseURLMap = {
    development: 'https://odp-d.oceanpayment.com', // 开发环境
    // test: 'https://checkout-t.oceanpayment.com', // 测试环境

    test: 'https://192.168.11.84:9091', // 测试环境
    mirr: 'https://odp-m.oceanpayment.com', // 镜像
    sandbox: 'https://test-checkout.oceanpayment.com', // 沙盒
    production: 'https://checkout.oceanpayment.com' // 线上环境
}
