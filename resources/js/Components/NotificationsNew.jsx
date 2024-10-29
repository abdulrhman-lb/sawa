// import { useEffect, useState } from 'react';
// import Pusher from 'pusher-js';

// function NotificationsNew(user) {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // تهيئة Pusher
//     const pusher = new Pusher('604a3b142b7ff006769b', {
//       cluster: 'ap2',
//       encrypted: true,
//     });
//     // const managerId = user.created_by;  
//     // الاشتراك في القناة الخاصة بالمدير
//     // console.log(user.user);
//     const channel = pusher.subscribe(`manager.${user.user}`);  // ضع userId الخاص بالمدير هنا

//     channel.bind('App\\Events\\OrderCreated', function (data) {
//       setNotifications(prevNotifications => [...prevNotifications, data.message]);
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//     };
//   }, []);
// console.log(notifications)
//   return (
//     <div>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>{notification}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default NotificationsNew;
