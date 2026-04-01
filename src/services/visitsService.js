import api from './axios'

export default {
  getAll() {
    return api.get('/visits')
  },

  create(visitData) {
    return api.post('/visits', visitData)
  },

  update(id, visitData) {
    return api.patch(`/visits/${id}`, visitData)
  },

  remove(id) {
    return api.delete(`/visits/${id}`)
  },
}
