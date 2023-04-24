import { createApp } from 'vue';
import App from "./App.vue";
import router from './router.ts';
import './assets/main.css';
/*const app = createApp(App);
app.use(VueGoogleMaps, {
    load: {
        key: '',
        // language: 'de',
    },
}).mount('#app')*/



/*createApp(App).use(GMap, {
    apiKey: '',
    libraries: ['places', 'geometry'],
  }).mount("#app");*/

createApp(App)
  .use(router)
  .mount("#app");

