<template>
  <v-card
    color="#385F73"
    dark
  >
    <v-card-title class="headline">Task List</v-card-title>

      <draggable tag="ul" id="taskListBox"
        v-bind:options="{
                animation: 200,  //アニメーション
                delay: 20,       //スクロール防止（長押しでソート）
                group: 'ITEMS'
        }"
        @start="dragItem($event)"
        @end="dragResult($event)"
      >
        <div  
          v-for="(item, index) in $store.state.items_list" :key="item.item"
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
    </div>
    
    <v-btn
      absolute
      dark
      fab
      bottom
      right
      color="teal"
      @click="dialog =true"
    >
      <v-icon>mdi-plus</v-icon>
              
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Task</span>
          </v-card-title>
            <v-container>
               <v-text-field v-model="input" label="Task Name*" require @keypress.enter="addItem"></v-text-field>
            </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addCancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="addItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-btn>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      dialog: false,
      input: '',
    }
  },
  methods: {
    addItem: function () {
      this.$store.commit('addItem', this.input);
      this.input='';
      this.dialog=false;
    },
    addCancel: function () {
      this.input='';
      this.dialog=false;
    },
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