<template>
  <h2 class="text-3xl mb-2">Список игр</h2>

  <div class="flex gap-2 mb-4">
    <InputText v-model="search" placeholder="Название игры..."/>
    <Button label="Найти" icon="pi pi-search" @click="onSearch"/>
    <Button label="Сбросить" icon="pi pi-times" severity="secondary" @click="onReset"/>
  </div>

  <div v-if="dataStore.games && dataStore.games.length > 0">
    <DataTable
        :value="dataStore.games"
        :lazy="true"
        :loading="dataStore.loading"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[2,5,10]"
        :totalRecords="dataStore.totalGames"
        @page="onPageChange"
        responsive-layout="scroll"
        :first="offset"
        class="mb-4"
    >
        <Column field="id" header="ID"></Column>
        <Column header="Название">
            <template #body="slotProps">
                <router-link :to="`/games/${slotProps.data.id}`">
                    {{slotProps.data.title}}
                </router-link>
            </template>
        </Column>
        <Column field="description" header="Описание"></Column>
        <Column header="Дата выхода">
            <template #body="slotProps">
                {{formatDate(slotProps.data.release_date)}}
            </template>
        </Column>
        <Column field="developer.name" header="Разработчик"></Column>
        <Column header="Средняя оценка пользователей">
            <template #body="slotProps">
                {{formatRating(slotProps.data.user_score)}}
            </template>
        </Column>
    </DataTable>
    <h3>Всего игр: {{dataStore.totalGames}}</h3>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {useDataStore} from '@/stores/dataStore.js';
export default {
    name: "GameList",
    components: {DataTable, Column, InputText, Button },
  data(){
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
      search: '',
    }
  },
  mounted(){
    console.log('GameList component mounted.');
    this.dataStore.get_games();
    this.dataStore.get_games_total();
  },
  methods:{
    formatDate(date){
      if(!date) return '';
      const [datePart] = date.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}-${month}-${year}`;
    },
    formatRating(value){
      return value ? Number(value).toFixed(1) : '-';
    },
    onSearch(){
      this.offset = 0;
      this.dataStore.get_games(0, this.perpage, this.search);
      this.dataStore.get_games_total(this.search);
    },
    onReset(){
      this.search = '';
      this.offset = 0;
      this.dataStore.get_games(0, this.perpage, '');
      this.dataStore.get_games_total('')
    },
    onPageChange(event){
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_games(this.offset / this.perpage, this.perpage);
    }
  },
}
</script>

<style scoped>

</style>
