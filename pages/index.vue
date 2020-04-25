<template>
  <div class="auth" v-if="$store.state.user.uid">
    <draggableApplication />
  </div>
  <div class="auth" v-else>
    <loginfunc />
  </div>
</template>

<script>
import draggableApplication from '~/components/draggableApp.vue'
import loginfunc from '~/components/login.vue'

export default {
  components: {
      draggableApplication,
      loginfunc,
  }
}
</script>
