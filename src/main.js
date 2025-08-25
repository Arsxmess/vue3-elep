import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index.js'
import { createPinia } from 'pinia'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn' // 日期格式化语言包
import { useDataStore } from './stores/dataStore'

// 开发环境引入mock数据
if (import.meta.env.DEV) {
  await import('./mock/index.js')
}

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(pinia) // 添加Pinia

// 在应用启动时预加载数据
router.isReady().then(async () => {
  const store = useDataStore()
  try {
    // 确保数据加载完成
    await Promise.all([
      store.fetchGroups(),
      store.fetchUsers()
    ])
    console.log('数据加载完成:', {
      groups: store.groups,
      users: store.users
    })
  } catch (error) {
    console.error('数据加载失败:', error)
  }
  
  app.mount('#app')
})