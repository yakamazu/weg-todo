<template>
  <v-card
    color="#385F73"
    dark
  >
    <v-card-title class="headline">ToDo</v-card-title>
          
      <draggable tag="ul" id="toDoBox"
        v-bind:options="{
                animation: 200,  //アニメーション
                delay: 20,       //スクロール防止（長押しでソート）
                group: 'ITEMS'
        }" 
        @start="dragItem($event)"
        @end="dragResult($event)"
      >
        <div 
          v-for="(item, index) in $store.state.items_todo" :key="item.item"
        >
          <v-chip
            class="ma-2"
            color="primary"
            label
          >
            <v-icon left>mdi-check-circle</v-icon>
            {{item.item}}
          </v-chip>
        </div>
      </draggable>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  methods: {
    dragResult(event){
      this.$store.commit('dragUpdate', event);
    },
    dragItem(drag_item){
      this.$store.commit('getDragItemName', drag_item);
    },
  },
  components: {
    draggable
  }
}
</script>
