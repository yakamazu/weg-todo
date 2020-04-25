<template>
  <v-card
    color="#FF9999"
    dark
  >
    <v-layout justify-center>
      <v-card-title class="headline">
        <v-icon large>mdi-delete</v-icon>
      </v-card-title>
    </v-layout>

    <div>
      <draggable tag="ul" id="trashBox"
        v-bind:options="{
                animation: 200,  //アニメーション
                delay: 50,       //スクロール防止（長押しでソート）
                group: 'ITEMS',
        }"
      >
      </draggable>
    </div>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  }
}
</script>
