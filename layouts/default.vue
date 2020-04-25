<template>
<v-app>
  <header><appHeader /></header>
  
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

  <footer><appFooter /></footer>
  
</v-app>
</template>
    
<script>
import appHeader from '~/components/header.vue'
import appFooter from '~/components/footer.vue'

export default {
  components: {
    appHeader,
    appFooter
  }
}
</script>
