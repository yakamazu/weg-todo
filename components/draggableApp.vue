<template>
<v-app>  
  <v-container>
  <div v-if="$store.state.select_project != ''"> 
  
    <v-row dense>
      <v-col cols="12">
        <toDoBox />
      </v-col>
      <v-col cols="12">
        <taskListBox />
      </v-col>

      <v-col>
        <br>
      </v-col>

      <v-col cols="12">
        <trashBox />
      </v-col>
    </v-row>

  </div>
  </v-container>
</v-app>
</template>

<script>
import toDoBox from '~/components/toDoBox.vue'
import taskListBox from '~/components/taskListBox.vue'
import trashBox from '~/components/trashBox.vue'


export default {
  created() {
    this.$store.commit('clearProject');
    this.$store.dispatch('getProjects');
    this.$store.commit('getUser');
    this.$store.commit('getUserFriends');
  },
  destroyed() {
    this.$store.commit('clearItem');
    this.$store.commit('clearProject');
    this.$store.commit('clearUser');
  },
  components: {
    toDoBox,
    taskListBox,
    trashBox
  },
}
</script>
