export const environment = {
  production: true,
  baseUrl: 'http://127.0.0.1:8000/',
  
  authentication: {
    register: '/api/accounts/register/',
    login: '/api/accounts/login/'
  },
  tasks: {
    getTasks: '/api/tasks/'
  }
};