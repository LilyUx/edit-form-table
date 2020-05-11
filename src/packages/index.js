import EditFormTable from './EditFormTable/index.js'

const components = [
  EditFormTable
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// 如果vue是全局变量,使用自动全局安装。
if (typeof window !== 'undefined' && window.Vue) {
  // eslint-disable-next-line
  install(window.Vue);
}

export default {
  install,
  EditFormTable
}