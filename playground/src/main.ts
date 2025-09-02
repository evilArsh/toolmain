import { createApp } from "vue"
import { createPinia } from "pinia"
import "virtual:uno.css"
import "element-plus/dist/index.css"
import App from "./app.vue"
import router from "./routes/index"
import { useHtmlFontSize } from "@toolmain/shared"
const app = createApp(App)
useHtmlFontSize(app)
app.use(router)
app.use(createPinia())
app.mount("#app")
export default app
