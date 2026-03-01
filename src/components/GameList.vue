<template>
  <h2>Список игр</h2>
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
import {useDataStore} from '@/stores/dataStore.js';
export default {
    name: "GameList",
    components: {DataTable, Column },
  data(){
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed:{
    games(){
      return this.dataStore.games;
    },
    games_total(){
      return this.dataStore.totalGames;
    }
  },
  mounted(){
    console.log('GameList component mounted.');
    this.dataStore.get_games();
    this.dataStore.get_games_total();
    console.log('GameList=', this.games);
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
