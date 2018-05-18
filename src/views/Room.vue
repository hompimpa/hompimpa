<template>
    <div>
        <div class="container">
            <button @click="test">test</button>
            <p>{{ firebaseRoom }}</p>
            <button v-if="playerReady === 3" @click="readyGame"> Start Game </button>
            <div v-if="playOn">
                <button @click="setOption('hitam')">hitam</button>
                <button @click="setOption('putih')">putih</button>
            </div>
        </div>
        {{ winner }}
    </div>
        
</template>

<script>
import { roomRef } from '@/firebase'

export default {
    data () {
        return {
            playerReady: 0,
            playOn: false,
            winner: ''
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
                setTimeout(function () {
                    
                    self.checkAllOpt()
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
                } else if (playerPutih.length === 1) {
                    self.winner = playerPutih[0]
                } else {
                    self.playOn = false
                    let key = localStorage.getItem('key')
                    roomRef.child(`/${key}`).update({
                        isReady: false
                    })
                }
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
