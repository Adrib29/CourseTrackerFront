import { createApp } from 'vue';
import App from './App.vue';
import Alert from './components/Alert.vue';
import router from './router';

import './assets/main.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


createApp(App).use(router).component('Alert', Alert).mount('#app');
