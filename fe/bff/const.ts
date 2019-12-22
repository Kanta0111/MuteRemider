const BffConst = {
  API_BASE_URL: process.env.NODE_ENV === 'production'
   ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV,
  BASE_URL: process.env.NODE_ENV === 'production'
  ? process.env.BASE_URL : process.env.BASE_URL_DEV,
  API_LOGIN_SLUG: '/login_api',
  API_MUTER_TOP_SLUG: '/muter_top',
  API_MUTED_LIST_SLUG: '/muted_list_api',
  API_CALLBACK_SLUG: '/callback',
} as const;

export default  BffConst;
