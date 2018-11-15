import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api().get('posts')
  },
  addPost (params) {
    return Api().post('savepost', params)
  },
  updatePost (params) {
    return Api().put('updatepost/' + params.id, params)
  },
  getPost (params) {
    return Api().get('getpost/' + params.id)
  },
  deletePost (id) {
    return Api().post('deletepost/' + id)
  }
}
