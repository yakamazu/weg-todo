<template>
    <v-app-bar
      color="blue"
      class="white--text"
    >

      <v-toolbar-title>Web ToDo App  </v-toolbar-title>

      <div class="auth" v-if="$store.state.user.uid">
        <selectProject />
      </div>

      <v-spacer></v-spacer>

　　　 <div class="auth" v-if="$store.state.user.uid">
        <userMenu />
      </div>

    </v-app-bar>
</template>

<script>
import selectProject from '~/components/selectProject.vue'
import userMenu from '~/components/userMenu.vue'

export default {
  data() {
    return {
      dialog: false,
      model: 'Select Project',
    }
  },
  components: {
    selectProject,
    userMenu,
  },
}
</script>