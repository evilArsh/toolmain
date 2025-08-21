import { createApp } from "vue"
import "element-plus/theme-chalk/src/message-box.scss"
import "element-plus/theme-chalk/src/message.scss"
import "element-plus/theme-chalk/src/notification.scss"
import "virtual:uno.css"
import App from "./index.vue"
import router from "./routes"
import { useHtmlFontSize } from "@toolmain/shared"
const app = createApp(App)
useHtmlFontSize(app)
app.use(router)
app.mount("#app")
export default app
