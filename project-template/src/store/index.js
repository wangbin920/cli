import { createStore } from 'vuex'
const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

Object.keys(modules).forEach(key => {
    modules[key]['namespaced'] = true
})

const store = createStore({
    modules,
});

export function setupStore (app) {
    app.use(store);
}

export { store };
