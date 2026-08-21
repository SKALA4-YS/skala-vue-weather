import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import ko from 'element-plus/es/locale/lang/ko'
import App from './App.vue'
import router from './router'
import { useConfigStore } from './stores/configStore'
import 'element-plus/dist/index.css'
// 다크 모드용 CSS 변수. html에 dark 클래스가 있을 때만 적용된다.
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia()).use(router).use(ElementPlus, { locale: ko })

// 저장된 테마를 마운트 전에 적용한다. 마운트 후에 하면 화면이 한 번 깜빡인다.
useConfigStore().applyTheme()

app.mount('#app')
