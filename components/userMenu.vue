<template>
    <v-menu
        v-model="$store.state.menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
    >
        <template v-slot:activator="{ on }" class="userCount" v-if="$store.state.application_user_count!=0">
          <v-badge
            color="green"
            overlap
          >
            <template v-slot:badge>
              <span>{{ $store.state.application_user_count }}</span>
            </template>

            <v-avatar class="avater" v-if="$store.state.user.photoURL" v-on="on">
              <v-img
                :src="$store.state.user.photoURL"
              >
              </v-img>
            </v-avatar>
            <v-avatar class="avater" v-else color="indigo" v-on="on">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-badge>
        </template>

        <template v-slot:activator="{ on }" class="userCount" v-else>
          <v-badge
            color="blue"
          >

            <v-avatar class="avater" v-if="$store.state.user.photoURL" v-on="on">
              <v-img
                :src="$store.state.user.photoURL"
              >
              </v-img>
            </v-avatar>
            <v-avatar class="avater" v-else color="indigo" v-on="on">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-badge>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
            <v-list-item-content>
                <v-list-item-title>User: {{ $store.state.user.displayName }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
            <v-list-item-content>
                <v-list-item-title>
                <v-btn class="ma-2" tile outlined color="success" @click="dialog_friend = true">
                    <v-icon left>mdi-account-multiple</v-icon> Friend List
                </v-btn>
                </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
        
          <v-list>
            <v-list-item>
            <v-list-item-content>
                <v-list-item-title>
                <logout />
                </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-dialog v-model="dialog_friend" scrollable max-width="500px">
          <v-card>
            <v-card-title>Friend List</v-card-title>
      
            <v-divider></v-divider>
      
            <v-list dense>
              <v-list-item-group color="indigo">
                <v-list-item
                  v-for="(user_friends, index) in $store.state.user_friend_list" :key="user_friends.user_name"
                >

                  <v-list-item-content>
                    <v-list-item-title v-text="user_friends.user_name" @click="friendDetail(user_friends)"></v-list-item-title>
                  </v-list-item-content>

                  <v-spacer></v-spacer>

                  <v-list-item-action>
                    <div class="friendAction" v-if="user_friends.friend_flg==1">
                      <v-btn icon >
                        <v-icon>mdi-chat</v-icon>
                      </v-btn>
                    </div>
                    <div class="friendAction" v-else-if="user_friends.apply_flg==1">
                      <v-btn class="ma-2" x-small tile outlined color="success" @click="ApplicationFrinedAdd(user_friends.user_id)">
                        <v-icon x-small>mdi-account-plus</v-icon>
                      </v-btn>
                      <v-btn class="ma-2" x-small tile outlined color="error" @click="ApplicationFrinedDelete(user_friends.user_id)">
                        <v-icon x-small>mdi-account-remove</v-icon>
                      </v-btn>
                    </div>
                    <div class="friendAction" v-else>
                      <v-btn class="ma-2" x-small tile outlined color="success" disabled>
                        <v-icon x-small>mdi-account-plus</v-icon>applying
                      </v-btn>
                    </div>
                  </v-list-item-action>

                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-divider></v-divider>
      
            <v-container>
              <v-btn block color="primary" dark @click="friendAdd">Add new friend</v-btn>
            </v-container>

          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_friend_detail" scrollable max-width="500px">
          <v-card>
            <v-card-title>Friend</v-card-title>
      
            <v-divider></v-divider>
      
            <v-list flat>
              <v-list-item-group color="indigo">

                  <v-list-item-content>
                    <v-list-item-title>Email Address</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content>
                    <v-list-item-title>Sharing Project</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content>
                    <v-list-item-title>Shared Project</v-list-item-title>
                  </v-list-item-content>
    
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_friend_add" scrollable max-width="500px">
          <v-card
             color="blue lighten-2"
             dark
          >
            <v-card-title class="headline blue lighten-3">
              Search Friends
            </v-card-title>
            <v-card-text>
              Explore this application users.
            </v-card-text>
            <v-card-text>
              <v-text-field
                  v-model="model"
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search Email Address"
                  @keypress.enter="friendSearch"
              />
            </v-card-text>
      
            <v-divider></v-divider>
      
            <v-expand-transition>
              <v-list-item-group v-if="userList_username" class="blue lighten-3">
                <v-list-item>
                    <v-list-item-action>
                      <v-avatar>
                        <v-img
                          :src="userList_avatersrc"
                        >
                        </v-img>
                      </v-avatar>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title v-text="userList_username"></v-list-item-title>
                    </v-list-item-content>  
                    
                    <v-spacer></v-spacer>

                    <div v-if="userList_username!='not exist'&&userList_username!='it is you!'">
                      <v-btn class="friend ma-2" tile outlined x-small color="success" disabled v-if="userList_friend === 1">
                        <v-icon left>mdi-account</v-icon> Friend
                      </v-btn>
                      <v-btn class="friend ma-2" tile outlined x-small color="success" disabled v-else-if="userList_friend === 0">
                        <v-icon left>mdi-account-voice</v-icon> Applying
                      </v-btn>
                      <v-btn class="friend ma-2" tile outlined x-small color="success" :disabled="request_disable" @click="requestFriend" v-else>
                        <v-icon left>mdi-account-plus</v-icon> Request
                      </v-btn>
                    </div>
                  
                </v-list-item>
              </v-list-item-group>
            </v-expand-transition>
            
          </v-card>
        </v-dialog>

        
    </v-menu>
</template>

<script>
import logout from '~/components/logout.vue'

export default {
  data() {
    return {
      dialog_friend: false,
      dialog_friend_detail: false,
      dialog_friend_add: false,
      isLoading: false,
      model: null,
      request_disable: false,
    }
  },
  computed: {
    userList_username  () {
      return this.$store.state.user_list.user_name
    },
    userList_avatersrc  () {
      return this.$store.state.user_list.avater_src
    },
    userList_friend () {
      return this.$store.state.user_friend.friend_flg
    },
  },
  methods: {
    friendAdd(){
      this.$store.commit('clearUserList');
      this.model = '';
      this.dialog_friend_add = true;
    },
    friendSearch(){
        this.request_disable = false;
        this.$store.commit('getUserList', this.model);
    },
    requestFriend(){
        this.request_disable = true;
        this.$store.commit('requestFriend');
    },
    friendDetail(user_friends){
        this.dialog_friend_detail=true;
    },
    ApplicationFrinedAdd(user_id){
        this.$store.commit('addApplicationFriend', user_id);
    },
    ApplicationFrinedDelete(user_id){
        this.$store.commit('deleteApplicationFriend', user_id);
    },
  },
  components: {
    logout,
  },
}
</script>