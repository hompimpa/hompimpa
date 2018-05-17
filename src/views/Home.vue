<template>
  <div class="home">
    <input type="text" placeholder="input your name" v-model="name">
    <button @click="register">daftar</button>
    <p>{{this.firebaseRoom}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import { roomRef } from '@/firebase'

export default {
  name: 'home',
  data () {
    return {
      name: '',
      roomIsFull: false,
      roomPlayer: []
    }
  },
  firebase: {
    firebaseRoom: roomRef
  },
  methods: {
    register: function () {
      let self = this
      roomRef.once('value', function (snapshot) {
        let players = snapshot.val()
        let count = 0
        console.log(players)
        if (players !== null) {
          count = Object.keys(players).length
        }
        console.log('----register once', count)
        if (count >= 5) {
          self.roomIsFull = true
          alert('maximum player number reached')
        } else {
          roomRef.push({
            player: self.name,
            option: ''
          })

          self.$store.commit('addPlayerCount')

          localStorage.setItem('key', self.firebaseRoom[self.firebaseRoom.length - 1]['.key'])

          self.$router.push('/room')
        }
      })
    }
  }
}
</script>
