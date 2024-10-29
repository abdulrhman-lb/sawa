import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

// import './echo';
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js'; // قم باستبدال require بـ import

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY, // استخدام import.meta.env
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // استخدام import.meta.env
//     forceTLS: true,
//     enabledTransports: ['xhr_polling', 'jsonp_polling'] // تفعيل طرق نقل HTTP
// });
