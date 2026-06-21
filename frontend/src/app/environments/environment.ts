export const environment = {
  production: false,
  baseUrl: 'http://127.0.0.1:9000',

  studentAuth: {
    register: '/api/students/register/',
    login: '/api/students/login/',
    me: '/api/students/me/',
    updateProfile: '/api/students/profile/update/',
    changePassword: '/api/students/profile/change-password/',
  },

  wallet: {
    deposit: '/api/students/deposit/',
  },

  food: {
    reserve: (foodId: number | string) =>
      `/api/students/food/reserve/${foodId}/`,
    cancel: (reservationId: number | string) =>
      `/api/students/food/cancel/${reservationId}/`,
    get: '/api/students/foods/',
  },

  course: {
    reserve: (courseId: number | string) =>
      `/api/students/course/reserve/${courseId}/`,
    cancel: (reservationId: number | string) =>
      `/api/students/course/cancel/${reservationId}/`,
    get: '/api/students/courses/'
  },

  dashboard: {
    get: '/api/students/dashboard/',
  },
};

