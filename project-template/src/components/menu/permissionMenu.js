export default [
    // {
    //     title: 'dashboard',
    //     name: 'Dashboard',
    //     icon: 'icon-jiaoyichachaxun',
    //     children: [],
    // }, 
    {
        title: 'tokenManage',
        name: 'TokenManage',
        icon: 'icon-yewu',
        children: [
            {
                title: 'supplierManage',
                name: 'SupplierManage',
            }
        ],
    },
    {
        title: 'transactionManage',
        name: 'TransactionManage',
        icon: 'icon-jiaoyichachaxun',
        children: [
            {
                title: 'transactionQuery',
                name: 'TransactionQuery',
            }
        ],
    },
]