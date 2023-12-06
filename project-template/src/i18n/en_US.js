import { importFilesForI18n } from '@/utils/common.js'


const asyncLangs = importFilesForI18n(require.context('./modules', true, /\en.js$/))
export default asyncLangs
