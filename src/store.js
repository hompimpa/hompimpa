import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerCount: 0
  },
  mutations: {
    addPlayerCount (state) {
      state.playerCount++
    }
  },
  actions: {

  }
})
