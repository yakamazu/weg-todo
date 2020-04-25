<template>
  <v-app>
    <v-container>
      <v-layout row class="text-xs-center" justify-center>
        <v-flex sm4> 
          <v-card class="mx-auto">
            <v-card-title primary-title>
              <h4>test user Login</h4>
            </v-card-title>
            <v-form>
              <v-text-field v-model="login_mail" prepend-icon="mdi-account" name="Username" label="Username" @keypress.enter="mailLogin"></v-text-field>
              <v-text-field v-model="login_pass" prepend-icon="mdi-lock" name="Password" label="Password" type="password" @keypress.enter="mailLogin"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="mailLogin"
                 :loading="loading"
                 :disabled="loading"                 
                >Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <br>
          <v-card-actions class="mx-auto">
              <v-btn primary large block color="primary" @click="googleLogin"
                :loading="loading_google"
                :disabled="loading_google"     
              >
                <v-icon left>mdi-google</v-icon>GoogleでLogin
              </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "~/plugins/firebase.js"

export default {
  data() {
    return {
      login_mail: 'yakamazu@example.com',
      login_pass: 'yakamazu',
      loading: false,
      loading_google: false,
    }
  },
  methods: {
    googleLogin: function () {
      this.loading_google = true;
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    mailLogin: function() {
      this.loading = true;
      firebase.auth().signInWithEmailAndPassword(this.login_mail, this.login_pass)
    },
  },
  created() {
    this.$store.commit('getLoginUser');
  },
}
</script>
