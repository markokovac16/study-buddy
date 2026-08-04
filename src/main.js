import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from 'chart.js'

import App from './App.vue'
import router from './router'

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
