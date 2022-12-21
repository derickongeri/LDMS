// import { Store } from "src/store";
// import {negative} from 'src/Services/Notifications'
//import { Log } from "src/Services/Logger";
// export default async ({ router }) => {
//   await router.beforeEach((to, from, next) => {
//     if (to.path === "/admin") {
//       let loggedin = Store.getters["auth/loggedin"];
//       Log("Logged in guard ",loggedin);
//       if (loggedin) {

//         return next();

//       }
//       negative("You need to be logged in to access the Admin")
//       return next("/login");
//     }
//     next()
//   });
// };
