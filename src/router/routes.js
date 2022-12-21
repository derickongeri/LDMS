const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: '', component: () => import('pages/Map/Maps.vue') },
      {
        name: "Home",
        path: "/",
        component: () => import("pages/Home/Index.vue")
      },
      {
        name: "dashboard",
        path: "/dashboard",
        component: () => import("pages/Map/Maps.vue")
      },
      {
        name: "Task Results",
        path: "/dashboard/results/:id/",
        component: () => import("pages/Map/Maps.vue")
      },
      {
        name: "activate user",
        path: "/dashboard/activate/:var/:uuid",
        component: () => import("pages/Authentication/Login.vue")
      },
      {
        name: "login",
        path: "/login",
        component: () => import("pages/Authentication/Login.vue")
      },
      {
        name: "forgotpass",
        path: "/forgotpassword/:var/:uuid",
        component: () => import("pages/Authentication/Login.vue")
      },
      {
        name: "admin",
        path: "/admin",
        component: () => import("pages/Admin/Admin.vue")
      },
      {
        name: "User Profile",
        path: "/user",
        component: () => import("pages/UserProfile/Profile.vue")
      },
      {
        name: "Feedback",
        path: "/userfeedback",
        component: () => import("pages/FeedBack/FeedBackPage.vue")
      },
      {
        name: "Faq",
        path: "/FrequentlyAskQuestions/:index",
        component: () => import("pages/Faq/Faq.vue")
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
