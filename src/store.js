import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerCount: 0,
    winners: []
  },
  mutations: {
    addPlayerCount (state) {
      state.playerCount++
    },
    addWinnerList (state, val) {
      state.winners.push(val)
    }
  },
  actions: {

  }
})
