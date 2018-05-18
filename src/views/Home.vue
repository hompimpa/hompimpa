<template>
  <div class="home">
    <div class="container bg-light rounded shadow p-3 mb-5 bg-white rounded">
        <form class="form-horizontal" role="form" method="POST" action="/login">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <img src="../assets/hand.png" class="rounded-circle" style="height: 200px; width: 200px">
                    <h1>hompimpa!</h1>
                    <hr>
                </div>
            </div>
            <div class="row" id="playerForm">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="yourName"><b>Your Name</b></label>
                        <div class="input-group mb-2 mr-sm-2 mb-sm-0">
                            <input type="text" name="yourName" class="form-control" id="yourName"
                                   placeholder="input your name..." required autofocus v-model="name">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="padding-top: 1rem">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <button class="btn btn-success" @click="register">Sign Up</button>
                </div>
            </div>
        </form>
    </div>
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
            option: '',
            isReady: false
          }).then(response => console.log('---ini yang di push',response))

          self.$store.commit('addPlayerCount')

          localStorage.setItem('key', self.firebaseRoom[self.firebaseRoom.length - 1]['.key'])

          self.$router.push('/room')
        }
      })
    }
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Electrolize|Passion+One|Questrial');

body {
  background-color: crimson;
}

input {
  outline: none;
  outline-style: none;
  outline-color: initial;
  outline-width: initial;
  border: none;
}

h1 {
  /* font-family: 'Questrial', sans-serif; */
  font-family: 'Passion One', cursive;
  color: black;
}

#playerForm,
button {
  font-family: 'Questrial', sans-serif;
}

</style>
