<template>
<div>
  <div class="text-center selectProject" v-if="$store.state.select_project != ''">
    <v-btn class="ma-2" outlined color="white" @click="dialog = true">{{ $store.state.select_project }}</v-btn>
  </div>
  <div class="text-center selectProject" v-else>
    <v-btn class="ma-2" outlined color="white" @click="dialog = true">Select Project</v-btn>
  </div>

  <v-dialog v-model="dialog" scrollable max-width="500px">
    <v-card>
      <v-card-title>Select Project</v-card-title>
      
      <v-divider></v-divider>
      
      <v-list dense>
        <v-list-item-group color="indigo">
          <v-list-item
            v-for="(project_name, index) in $store.state.project_name" :key="project_name.project_id"
          >
            <v-list-item-action>
              <v-icon x-small>mdi-rhombus-split</v-icon>
            </v-list-item-action>

            <v-list-item-content @click="selectProject(project_name)">
              <v-list-item-title v-text="project_name.project_name"></v-list-item-title>
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-action>
              <v-btn icon @click="editProjectDialog(project_name)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action >
              <v-btn icon @click="deleteProjectDialog(project_name)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
            

          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider></v-divider>
      
      <v-container>
        <v-btn block color="primary" dark @click="dialog2 = true">Create new project</v-btn>
      </v-container>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog2" scrollable max-width="500px">
    <v-card>
      <v-card-title>Create new project</v-card-title>
      
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-text-field label="Enter Project name *" required v-model="newProject"></v-text-field>
          <p class="dup_project font-color-red" v-if="this.dup_flg==1">duplicate project name</p>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelNewProject">Close</v-btn>
        <v-btn class="newProjectSave" color="blue darken-1" text @click="createNewProject" v-if="this.newProject != ''" >Save</v-btn>
        <v-btn class="newProjectSave" color="blue darken-1" text disabled v-else >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_editproject" scrollable max-width="500px">
    <v-card>
      <v-card-title>Edit project [ {{ editProject.project_name }} ]</v-card-title>
      
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-text-field label="Edit Project name *" required v-model="editNewProjectName" ></v-text-field>
          <p class="dup_project font-color-red" v-if="this.dup_flg==1">duplicate project name</p>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelEditProject">Close</v-btn>
        <v-btn class="editProjectSave" color="blue darken-1" text @click="editProjectInfo" v-if="editNewProjectName != ''" >Save</v-btn>
        <v-btn class="editProjectSave" color="blue darken-1" text disabled v-else >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_deleteproject" scrollable max-width="300px">
    <v-card>
      <v-card-title class="headline">Delete [{{ project.project_name }}]?</v-card-title>
  
          <v-card-actions>
            <div class="flex-grow-1"></div>
  
            <v-btn
              color="green darken-1"
              text
              @click="deleteProject"
            >
              Yes
            </v-btn>
  
            <v-btn
              color="green darken-1"
              text
              @click="dialog_deleteproject = false"
            >
              No
            </v-btn>
          </v-card-actions>
        </v-card>
  </v-dialog>
</div>
</template>

<script>
import firebase from "~/plugins/firebase.js"

export default {
  data() {
    return {
      dialog: false,
      dialog2: false,
      dialog_deleteproject: false,
      dialog_editproject: false,
      newProject: '',
      editProject: '',
      editNewProjectName:'',
      project:'',
      dup_flg:0,
    }
  },
  methods: {
    selectProject(project_name){
      this.dialog = false;
      this.$store.commit('clearItem');
      this.$store.commit('selectProject', project_name);
      this.$store.dispatch('getItems');
    },
    createNewProject(){
      this.dup_flg = 0;

      for(let i = 0; i < this.$store.state.project_name.length; i++){
          if (this.newProject == this.$store.state.project_name[i].project_name) {
              this.dup_flg = 1;
              break;
          } 
      }

      if (this.dup_flg != 1) {
          this.dialog2 = false;
          this.$store.commit('addProject', this.newProject);
          this.newProject='';
          this.dup_flg = 0;
      }
    },
    cancelNewProject(){
      this.dialog2 = false;
      this.newProject='';
      this.dup_flg = 0;
    },
    cancelEditProject(){
      this.dialog_editproject = false;
      this.editProject='';
      this.editNewProjectName='';
      this.dup_flg = 0;
    },
    deleteProjectDialog(selectProject){
      this.project = selectProject;
      this.dialog_deleteproject = true;
    },
    deleteProject(){
      this.dialog_deleteproject = false;
      this.$store.commit('selectProject', this.project);
      this.$store.commit('deleteProject');
      this.$store.commit('clearItem');
    },
    editProjectDialog(project_name){
      this.editProject = project_name;
      this.dialog_editproject = true;
    },
    editProjectInfo(){
      this.dup_flg = 0;

      for(let i = 0; i < this.$store.state.project_name.length; i++){
          if (this.editNewProjectName == this.$store.state.project_name[i].project_name) {
              //console.log(this.editProject.project_name);
              this.dup_flg = 1;
              break;
          } 
      }

      if (this.dup_flg != 1) {
        this.dialog_editproject = false;
        this.editProject['new_project_name'] = this.editNewProjectName
        this.$store.commit('updateProject', this.editProject);
        this.editProject='';
        this.editNewProjectName='';
      }
    },
  },
}
</script>