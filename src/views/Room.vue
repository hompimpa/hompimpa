<template>
    <div>
        <button @click="test">test</button>
        <p>{{ firebaseRoom }}</p>
        <button v-if="playerReady === 5" @click="startGame"> Start Game </button>
        <div v-if="playOn">
            <button @click="setOption('hitam')">hitam</button>
            <button @click="setOption('putih')">putih</button>
        </div>
        
    </div>
        
</template>

<script>
import { roomRef } from '@/firebase'

export default {
    data () {
        return {
            playerReady: 0,
            playOn: false,
        }
    },
    firebase: {
        firebaseRoom: roomRef
    },
    methods: {
        test: function () {
            roomRef.push({
                player: "yasir"
            })
        },
        startGame: function () {
            this.playOn = true
            setTimeout(function() {
                this.playOn = false
                alert('times up')
            }, 5000)
        },
        setOption: function (option) {
            let key = localStorage.getItem('key')
            console.log(key)
            roomRef.child(`/${key}`).update({
                option: option
            })
        }
    },
    mounted () {
        let players = this.firebaseRoom
        let count = Object.keys(players).length
        this.playerReady = count
        console.log('-----room',count)
        console.log(this.playerReady)
        roomRef.on('value', function (snap) {
            console.log(snap.val())
        })
    }
}
</script>
