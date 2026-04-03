import api from './axios'

export default {
  register(userData) {
    return api.post('/register', userData)
  },

  login(credentials) {
    return api.post('/login', credentials)
  },

  updateUsername(data) {
    return api.put('/profile/username', data)
  },

  updateEmail(data) {
    return api.put('/profile/email', data)
  },

  updatePassword(data) {
    return api.put('/profile/password', data)
  },
}
