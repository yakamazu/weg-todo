import Vue from 'vue'
import firebase from "~/plugins/firebase.js"

const db = firebase.firestore();
const toDoBox_id = 'toDoBox';
const taskListBox_id = 'taskListBox';
const trashBox_id = 'trashBox';

Vue.mixin({
  methods: {
   async dragUpdate(event){
      window.confirm( event.to.id);
      window.confirm( this.$store.state.drag_item.item.innerText);
      
      if (event.to.id == toDoBox_id) {
          
          let docRef = db.collection('item').doc(this.$store.state.drag_item.item.innerText);
          await docRef.update({ todo_flg: 1}); //dbに並び順保存
          
      } else if (event.to.id == taskListBox_id) {

          let docRef = db.collection('item').doc(this.$store.state.drag_item.item.innerText);
          await docRef.update({ todo_flg: 0}); //dbに並び順保存

      } else if (event.to.id == trashBox_id) {

          this.$store.commit('deleteItem'); // web画面から削除
            
          let docRef = db.collection('item').doc(this.$store.state.drag_item.item.innerText);
          await docRef.delete(); // dbから削除
      }
    }
  },
})
