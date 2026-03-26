import api from './axios'

export default {
  register(userData) {
    return api.post('/register', userData)
  },

  login(credentials) {
    return api.post('/login', credentials)
  },
}
