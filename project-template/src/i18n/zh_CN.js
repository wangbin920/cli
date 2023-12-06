import { importFilesForI18n } from '@/utils/common.js'


const asyncLangs = importFilesForI18n(require.context('./modules', true, /\zh.js$/))
export default asyncLangs
