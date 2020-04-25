import Vuex from 'vuex'
import firebase from "~/plugins/firebase.js"

const db = firebase.firestore();
const toDoBox_id = 'toDoBox';
const taskListBox_id = 'taskListBox';
const trashBox_id = 'trashBox';

const store = () => {
    return new Vuex.Store({
        state: function() {
            return {
                user: {},  // ユーザー情報
                items_todo: [], 
                items_list: [],
                drag_item:[],
                select_project: '',
                project_name: [],
                project_doc: '',
                avater_src:'',
                menu: false,
                user_list:[],
                user_friend:[],
                user_friend_list:[],
                application_user_count:0,
                displayProjectData:[],
            }
        },
        mutations: {
            getLoginUser: async function(state) {
                firebase.auth().onAuthStateChanged(user => {
                  // ログイン状態ならuserが取得できる
                  state.user = user ? user : {}
                })
            },
            getUser: async function(state) {
                let docRefUser = db.collection('user').doc(this.state.user.uid);
                let user_id = this.state.user.uid;
                let user_name = this.state.user.displayName;
                let mail_address = this.state.user.email;
                let avater_src = this.state.user.photoURL;

                //ユーザーが初回ログインか確認
                await docRefUser.get().then(function(doc) {
                    if (doc.exists) {
                        //console.log(doc.dm.proto.fields.avater_src.stringValue); //*あとでユーザー情報表示するファンクションにとばすように修正
                        //this.state.avater_src = doc.dm.proto.fields.avater_src.stringValue;
                    } else {
                        docRefUser.set({
                          user_id: user_id,
                          user_name: user_name,
                          mail_address: mail_address,
                          avater_src: avater_src
                        });
                        this.state.avater_src = avater_src;
                    }
                });       

                //友達申請あるか確認
                await docRefUser.collection('user_friends').where("apply_flg", "==", 1).get()
                  .then((snapshot) => {
                        if (snapshot.size != 0) {
                            this.state.application_user_count = 0;
                            snapshot.docs.forEach((doc) => {
                                 this.state.application_user_count += 1;
                             })
                        }
                  })         
            },
            getUserFriends: async function(state) {
                this.state.user_friend_list = [];

                let docRefUser = db.collection('user').doc(this.state.user.uid);
                await docRefUser.collection('user_friends').get()
                  .then((snapshot) => {
                        if (snapshot.size != 0) {
                            snapshot.docs.forEach((doc) => {
                                 db.collection('user').doc(doc.id).get()
                                   .then((doc2) => {
                                      let user_friend_list_tmp = doc.data();
                                      user_friend_list_tmp['user_name'] = doc2.data().user_name;
                                      user_friend_list_tmp['user_id'] = doc2.data().user_id;
                                      this.state.user_friend_list.push(user_friend_list_tmp);
                                   })
                                 //this.state.user_friend_list.push(doc.data());
                             })
                        }
                  })
            },
            getUserList: async function(state, email) {
                this.state.user_list = [];
                this.state.user_friend = [];

                await db.collection('user').where("mail_address", "==", email).get()
                  .then((snapshot) => {
                        if (snapshot.size == 0) {
                            this.state.user_list = {user_name:'not exist'};
                        } else {
                            snapshot.docs.forEach((doc) => {
                                if (doc.data().mail_address == this.state.user.email){
                                    this.state.user_list = {user_name:'it is you!'};
                                } else {
                                    this.state.user_list = doc.data();
                                }
                            })
                        }
                    }
                );

                await db.collection('user').doc(this.state.user.uid).collection('user_friends').doc(this.state.user_list.user_id).get()
                  .then((doc) => {
                        if (doc.exists == false) {
                            this.state.user_friend = {friend_flg: null};
                        } else {
                            this.state.user_friend = doc.data();
                        }
                    }
                );

            },
            getDragItemName: function(state, drag_item) {
                this.state.drag_item = [];
                this.state.drag_item = drag_item;
            },
            selectProject: async function(state, project_name) {
                this.state.select_project = project_name.project_name;
                this.state.project_doc = project_name.project_id.trim();
            },
            displayProject: async function(state, addProject) {
                this.state.project_name.push(addProject);
            },
            displayItemTodo: async function(state, itemData) {
                this.state.items_todo.push(itemData);
            },
            displayItemList: async function(state, itemData) {
                this.state.items_list.push(itemData);
            },
            addProject: async function(state, newProject) {
                let newProjectDocName = this.state.user.uid + '_' + Date.now();      

                await db.collection('project').doc(newProjectDocName).set({
                    project_name: newProject,
                    project_id: newProjectDocName,
                    create_userid: this.state.user.uid,
                });

                await db.collection('user').doc(this.state.user.uid).collection('user_project').doc(newProjectDocName).set({
                    project_id: newProjectDocName,
                    create_flg: 1,
                    default_flg: 0,
                });
            },
            addItem: async function(state, input) {
                await db.collection('project').doc(this.state.project_doc).collection('items').doc(input).set({
                    item: input,
                    todo_flg: 0
                });
            },
            addApplicationFriend: async function(state, input) {
                await db.collection('user').doc(this.state.user.uid).collection('user_friends').doc(input).set({
                    apply_flg: 0,
                    friend_flg: 1
                });

                await db.collection('user').doc(input).collection('user_friends').doc(this.state.user.uid).set({
                    apply_flg: 0,
                    friend_flg: 1
                });

                this.state.user_friend_list.find(user_friend => {
                  if ( user_friend.user_id == input){
                      user_friend.friend_flg = 1
                  };
                });

                this.state.application_user_count -= 1;
            },
            clearItem: function(state) {
                this.state.items_todo = [];
                this.state.items_list = [];
            },
            clearProject: function(state) {
                this.state.project_name = [];
                this.state.select_project = '';
            },
            clearMenu: function(state) {
                this.state.menu = false;
            },
            clearUserList: function(state) {
                this.state.user_list = [];
            },
            clearUser: function(state) {
                this.state.application_user_count = 0;
                this.state.user_friend = [];
                this.state.user_friend_list = [];
            },
            deleteItem: async function(state, drag_item) {
                let index_todo = this.state.items_todo.findIndex((v) => v.item === drag_item);
                let index_list = this.state.items_list.findIndex((v) => v.item === drag_item);

                if (index_todo !== -1) {
                  this.state.items_todo.splice(index_todo, 1);
                } else if (index_list !== -1) {
                  this.state.items_list.splice(index_list, 1);
                }
            },
            deleteProject: async function(state) {
                let index_project = this.state.project_name.findIndex((v) => v.project_name === this.state.select_project);
                //console.log(this.state.project_name);
                //console.log(this.state.select_project);
                //console.log(this.state.project_doc);

                if (index_project !== -1) {
                  this.state.project_name.splice(index_project, 1);
                  this.state.select_project = '';

                  //delete project subcollection
                  let query_sub_collection = await db.collection('project').doc(this.state.project_doc).collection('items').get()
                     .then((snapshot) => {
                         if (snapshot.size != 0) {
                             snapshot.docs.forEach((doc) => {
                                 db.collection('project').doc(this.state.project_doc).collection('items').doc(doc.id).delete();
                             })
                         }
                     });

                  //delete project doc
                  await db.collection('project').doc(this.state.project_doc).delete();
                  
                  //delete user-project
                  await db.collection('user').doc(this.state.user.uid).collection('user_project').doc(this.state.project_doc).delete();
                }
            },
            deleteApplicationFriend: async function(state, input) {
                //delete user-project
                await db.collection('user').doc(this.state.user.uid).collection('user_friends').doc(input).delete();
                await db.collection('user').doc(input).collection('user_friends').doc(this.state.user.uid).delete();

                let index_user_friend_list = this.state.user_friend_list.findIndex((v) => v.user_id === input);

                if (index_user_friend_list !== -1) {
                  this.state.user_friend_list.splice(index_user_friend_list, 1);
                }

                this.state.application_user_count -= 1;
            },
            dragUpdate: async function(state, event){
                let drag_item = this.state.drag_item.item.innerText.replace(/\r?\n/g,""); //改行削除
      
                if (event.to.id == toDoBox_id) {
          
                   let docRef = db.collection('project').doc(this.state.project_doc).collection('items').doc(drag_item);
                   await docRef.update({ todo_flg: 1}); //dbに並び順保存
          
                } else if (event.to.id == taskListBox_id) {

                   let docRef = db.collection('project').doc(this.state.project_doc).collection('items').doc(drag_item);
                   await docRef.update({ todo_flg: 0}); //dbに並び順保存

                } else if (event.to.id == trashBox_id) {

                   this.commit('deleteItem', drag_item); // web画面から削除
            
                   let docRef = db.collection('project').doc(this.state.project_doc).collection('items').doc(drag_item);
                   await docRef.delete(); // dbから削除
                }
            },
            updateProject: async function(state, project){ 
                for(let i = 0; i < this.state.project_name.length; i++){
                  if (project.project_name == this.state.project_name[i].project_name) {
                      this.state.project_name[i].project_name = project.new_project_name
                    break;
                  } 
                }

                let docRef = db.collection('project').doc(project.project_id);
                await docRef.update({ project_name: project.new_project_name});

            },
            requestFriend: async function(state){
                await db.collection('user').doc(this.state.user.uid).collection('user_friends').doc(this.state.user_list.user_id).set({
                    apply_flg: 0,
                    friend_flg: 0,
                });

                await db.collection('user').doc(this.state.user_list.user_id).collection('user_friends').doc(this.state.user.uid).set({
                    apply_flg: 1,
                    friend_flg: 0,
                });

                let req_data = {user_id:this.state.user_list.user_id, user_name:this.state.user_list.user_name, friend_flg:0, apply_flg:0};

                this.state.user_friend_list.push(req_data);
            },
        },
        actions: {
            getItems: async function(context) {
                let query = await db.collection('project').doc(this.state.project_doc).collection('items').orderBy("item", "asc");
                await query.onSnapshot(querySnapshot => {
                                 querySnapshot.docChanges().forEach(function(change){
                                    if (change.type === "added"){
                                        if (change.doc.data().todo_flg == 0){
                                            context.commit('displayItemList', change.doc.data());
                                        } else if (change.doc.data().todo_flg == 1){
                                            context.commit('displayItemTodo', change.doc.data());
                                        }
                                    }
                                 })
                });
            },
            getProjects: async function(context) {
                let query = await db.collection('user').doc(this.state.user.uid).collection('user_project').orderBy("project_id", "asc");
                await query.onSnapshot(async querySnapshot => {
                                 querySnapshot.docChanges().forEach(function(change){
                                    if (change.type === "added" ){

                                        db.collection('project').doc(change.doc.data().project_id.trim()).get()
                                          .then((doc) => {
                                            context.state.displayProjectData = doc.data();
                                            context.state.displayProjectData['create_flg'] = change.doc.data().create_flg;
                                            context.state.displayProjectData['default_flg'] = change.doc.data().default_flg;
                                            context.commit('displayProject', context.state.displayProjectData);
                                        })

                                    }
                                 })
                });
            },
        },
    })
}

export default store
