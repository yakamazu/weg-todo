<template>
      <div class="auth" v-if="$store.state.user.uid">
        <v-btn class="ma-2" color="indigo" dark @click="dialog = true">
          ログアウト
        </v-btn>

        <v-dialog
          v-model="dialog"
          max-width="290"
        >
        <v-card>
          <v-card-title class="headline">ログアウトしますか？</v-card-title>
  
          <v-card-actions>
            <div class="flex-grow-1"></div>
  
            <v-btn
              color="green darken-1"
              text
              @click="logout"
            >
              はい
            </v-btn>
  
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              いいえ
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
      </div>

</template>

<script>
import firebase from "~/plugins/firebase.js"

export default {
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    logout: function () {
      this.dialog=false
      firebase.auth().signOut()
      this.$store.commit('clearMenu');
      this.$store.commit('clearProject');
    },
  },
}
</script>