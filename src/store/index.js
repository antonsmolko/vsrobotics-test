import Vue from 'vue'
import Vuex from 'vuex'

import books from './books'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    books
  }
})

export default store
