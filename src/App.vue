<template>
  <Menubar :model="items">
    <template #start>
      <span>
        <img src="@/assets/sticker.svg" width="50" alt="sticker"/>
      </span>
    </template>
    <template #item="{ item, props, hasSubmenu, root}">
      <a class="flex items-center gap-2 px-4 py-2.5 rounded-md hover:dark:bg-gray-600">
        <router-link v-if="item.route" :to="item.route" class="flex items-center w-full h-full">
          <span :class="item.icon"/>
          <span class="font-medium">{{item.label}}</span>
        </router-link>
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-3">
        <div v-if="isAuthenticated && user">
          <span class="pi pi-fw pi-user mr-4"/> {{user.name}}
          <Button @click="logout" class="ml-4">Выйти</Button>
        </div>
        <div v-else>
          <form @submit.prevent="login">
            <InputText v-model="email" type="email"
                       id="email" required placeholder="Логин"
                       class="ml-2 sm:w-auto"
                       :class="{'p-invalid': authError}"/>
            <InputText v-model="password" type="password" id="password" required placeholder="Пароль"
                       class="m-2 sm:w-auto" :class="{'p-invalid': authError}"/>
            <Button type="submit">Войти</Button>
            <div class="ml-2"><small v-if="authError" class="error">{{authError}}</small></div>
          </form>
        </div>
      </div>
    </template>
  </Menubar>
  <router-view></router-view>
</template>
<script>
import {useAuthStore} from "@/stores/authStore.js";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
export default {
  components: {Button,Menubar, InputText},
  data(){
    return{
      email: '',
      password: '',
      authStore: useAuthStore(),
      items: [
        {
          label: 'Главная страница',
          icon: 'pi pi-fw pi-home',
          route: '/',
          shortcut: 'Ctrl + H',
          submenu: [
          ],
        },
        {
          label: 'Список игр',
          icon: 'pi pi-fw pi-headphones',
          route: '/games',
        },
        {
          label: 'Список разработчиков',
          icon: 'pi pi-fw pi-dollar',
          route: '/developers',
        },
        {
          label: 'Мои обзоры',
          icon: 'pi pi-fw pi-pen-to-square',
          route: '/my-reviews',
        }
      ]
    };
  },
  computed:{
    isAuthenticated(){
      return this.authStore.isAuthenticated;
    },
    user(){
      return this.authStore.user;
    },
    authError(){
      return this.authStore.errorMessage;
    },
  },
  methods:{
    logout(){
      this.authStore.logout();
    },
    login(){
      this.authStore.login({email: this.email, password: this.password});
    },
  },
  mounted(){
    const token = localStorage.getItem("token");
    if(token){
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  },
};
</script>
<style>
.error{
  color:red;
}
</style>

<style scoped></style>
