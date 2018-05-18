<template>
    <div>
        <div class="container">
            {{ winner }}
            <div class="row">
                <div class="col col-sm-6 col-md-3" v-for="(player, i) in firebaseRoom" :key="{i}">
                    <p class="bg-white p-1">{{ player.player }}</p>
                    <img src="../assets/fist.jpg" style="height: 100px; width: 100px" alt="fist" v-if="done === false">
                    <img src="../assets/hitam.jpg" style="height: 100px; width: 100px" alt="hitam" v-if="player.option === 'hitam' && done === true">
                    <img src="../assets/putih.jpg" style="height: 100px; width: 100px" alt="puih" v-if="player.option === 'putih' && done === true">
                </div>
            </div>
            <button class="button-light" v-if="playerReady === 3" @click="readyGame"> Start Game </button>
            <p v-if="playerReady < 3">Menunggu Player lain</p>
            <p v-if="berlangsung"> HOM PIM PA ALAIUM GAMBRENG!! </p>
            <div v-if="playOn">
                <button @click="setOption('hitam')">hitam</button>
                <button @click="setOption('putih')">putih</button>
            </div>
            <button v-if="done === true" @click="removePlayer">Done</button>
        </div>
        
    </div>
        
</template>

<script>
import { roomRef } from '@/firebase'
import swal from 'sweetalert'

export default {
    data () {
        return {
            playerReady: 0,
            playOn: false,
            winner: '',
            done: false,
            berlangsung: false
        }
    },
    firebase: {
        firebaseRoom: roomRef
    },

    watch: {
        playOn (val) {
            console.log('----masuk watch')
            if (val) {
                let self = this

                self.berlangsung = true
                setTimeout(function () {
                    
                    self.checkAllOpt()
                    self.berlangsung = false
                }, 5000)
            }
        }
    },
    methods: {
        test: function () {
            roomRef.push({
                player: "yasir"
            })
        },
        readyGame: function () {
            let key = localStorage.getItem('key')
            console.log(key)
            roomRef.child(`/${key}`).update({
                isReady: true
            })
            
        },

        setOption: function (option) {
            let key = localStorage.getItem('key')
            console.log(key)
            roomRef.child(`/${key}`).update({
                option: option
            })
        },
        // method mencari yang belum memilih
        checkAllOpt () {
            let key = localStorage.getItem('key')
            roomRef.child(`/${key}`).once('value', function (snap) {
                console.log('-----lihat once child',snap.val())
                let ownOpt = snap.val().option
                if (ownOpt === '') {
                    let acak = Math.floor(Math.random() * 2)
                    if (acak === 0){
                        // players[i].option = "hitam"
                        roomRef.child(`/${key}`).update({
                            option: "hitam"
                        })
                    } else {
                        // players[i].option = "putih"
                        roomRef.child(`/${key}`).update({
                            option: "putih"
                        })
                    }
                }
            })
            this.findWinner()
        },

        findWinner () {
            console.log('------carimenang')
            let self = this
            roomRef.once('value', function (snap) {
                let players = snap.val()
                console.log('------players', players)
                let playerHitam = []
                let playerPutih = []
                for (const i in players) {
                    if (players[i].option === "hitam") {
                        playerHitam.push(players[i].player)
                    } else if (players[i].option === "putih") {
                        playerPutih.push(players[i].player)
                    } 
                }
                console.log('----', playerHitam, playerPutih)
                if (playerHitam.length === 1) {
                    self.winner = playerHitam[0]
                    swal('The Winner is...', self.winner)
                    self.$store.commit('addWinnerList', playerHitam[0])
                    self.done = true
                } else if (playerPutih.length === 1) {
                    self.winner = playerPutih[0]
                    swal('The Winner is...', self.winner)
                    self.$store.commit('addWinnerList', playerPutih[0])
                    self.done = true
                } else {
                    self.playOn = false
                    self.done = true
                    let key = localStorage.getItem('key')
                    roomRef.child(`/${key}`).update({
                        isReady: false
                    })
                }
                // swal('The Winner is', self.winner, {
                //         button: {
                //             text: "Done!"
                //         }
                //     })
                //     .then((winner) => {
                //         self.removePlayer()
                //     })
            })
        },
        removePlayer () {
            let key = localStorage.getItem('key')
            roomRef.child(`/${key}`).remove()
            this.$router.push('/')
        }
    },
    mounted () {
        
    // console.log('-----room',count)
    // console.log(this.playerReady)
    let self = this
    roomRef.on('value', function (snap) {
        console.log(snap.val())
        let players = snap.val()
        let count = Object.keys(players).length
        self.playerReady = count

        let isReadyNum = 0
        for (const i in players) {
            if (players[i].isReady) {
                isReadyNum++
            }
        }

        if (isReadyNum === 3) {
            self.playOn = true
            // setTimeout(function() {
            //     this.playOn = false
            //     alert('times up')
            //     let counterHitam = 0
            //     let counterPutih = 0
            //     console.log('------all ready')
            //     for (const i in players) {
            //         if(players[i].option === '') {
            //             let acak = Math.floor(Math.random() * 2)
            //             if (acak === 0){
            //                 // players[i].option = "hitam"
            //                 roomRef.child(`/${key}`).update({
            //                     option: "hitam"
            //                 })
            //             } else {
            //                 // players[i].option = "putih"
            //                 roomRef.child(`/${key}`).update({
            //                     option: "putih"
            //                 })
            //             }
            //         }
            //         if(players[i].option === 'hitam'){
            //             counterHitam++
            //         } else {
            //             counterPutih++
            //         }
            //     }
            //     console.log('-----selesai random\n', counterHitam, counterPutih)
            //     if(counterHitam == 1) {
            //         for (const i in players) {
            //             if (players[i].option === "hitam") {
            //                 self.winner = players[i].name
            //             }
            //         }
            //     } else if (counterPutih == 1) {
            //         for (const i in players) {
            //             if (players[i].option === "putih") {
            //                 self.winner = players[i].name
            //             }
            //         }
            //     }

            // }, 5000)
      }
    })
  }
}
</script>
