//卡种列表
export const cardTypeOptions = [
    { label: 'Visa', value: 1 },
    { label: 'MC', value: 2 },
    { label: 'JCB', value: 3 },
    { label: 'Maestro', value: 4 },
    { label: 'AE', value: 5 },
    { label: 'Elo', value: 6 },
    { label: 'Diners', value: 7 },
    { label: 'Discover', value: 8 },
    { label: 'Hipercard', value: 9 },
    { label: 'Aura', value: 10 },
    { label: 'Carte Bancaire', value: 11 },
    { label: 'RuPay', value: 12 },
    { label: 'Carnet', value: 13 },
    { label: 'CUP', value: 14 }
]

// 退出登录code
export const logOutCode = [401, 301001, 301002, 301017]

//过滤后端code code第一个字母可能为 C：客户端错误/S：服务端错误/E：第三方服务错误 
export function getErrorCode (code) {
    if (['', undefined, null].includes(code)) return false
    if (code.length === 8 && /^[A-Z]/.test(code) && /\d{7}/.test(code.slice(1))) {
        return code.slice(1);
    } else {
        return code;
    }
}