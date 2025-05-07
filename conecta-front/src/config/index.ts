export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  },
  auth: {
    tokenKey: 'conecta_moda_token',
    userKey: 'conecta_moda_user',
  },
  routes: {
    home: '/',
    login: '/login',
    register: '/cadastro',
    dashboard: '/dashboard',
    profile: '/profile',
  },
}; 