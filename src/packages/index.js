  
import EditFormTable from './EditFormTable'

// 如果vue是全局变量,使用自动全局安装。
if (typeof window !== 'undefined' && window.Vue) {
  // eslint-disable-next-line
  Vue.component('edit-form-table', EditFormTable)
}

export default {
  install (Vue) {
    Vue.component('edit-form-table', EditFormTable)
  }
}

export {
  EditFormTable,
}