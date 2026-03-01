<template>
  <div v-if="dataStore.game && dataStore.game.id">
    <h2>{{dataStore.game.title}} от {{dataStore.game.developer.name}}</h2>
    <p>{{dataStore.game.description}}<br>{{formatDate(dataStore.game.release_date)}}</p>
    <p>Средняя оценка: <strong>{{formatRating(dataStore.game.user_score)}}</strong></p>

    <h3>Отзывы</h3>
    <DataTable
      :value="dataStore.gameReviews"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[2,5,10]"
      :totalRecords="reviews_total"
      @page="onPageChange"
      responsive-layout="scroll"
      :first="offset"
    >
      <Column header="Пользователь">
        <template #body="slotProps">
          {{slotProps.data.user.name}}
        </template>
      </Column>

      <Column field="rating" header="Оценка">
        <template #body="slotProps">
          {{formatRating(slotProps.data.rating)}}
        </template>
      </Column>

      <Column field="text" header="Текст отзыва">
        <template #body="slotProps">
          <div v-if="slotProps.data.text">{{slotProps.data.text}}</div>
          <div v-else class="text-gray-600">---</div>
        </template>
      </Column>

      <Column header="Скриншоты">
        <template #body="slotProps">
          <div>ПОТОМ ДОБАВЛЮ</div>
        </template>
      </Column>

      <Column field="created_at" header="Дата">
        <template #body="slotProps">
          {{formatDate(slotProps.data.created_at)}}
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else-if="dataStore.errorMessage">
    {{dataStore.errorMessage}}
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
  name: "GameDetail",
  components: {DataTable, Column },
  data(){
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0
    }
  },
  computed:{
    game(){
      return this.dataStore.game;
    },
    reviews_total(){
      return this.dataStore.totalReviews;
    }
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
      this.dataStore.get_game(this.offset / this.perpage, this.perpage);
    }
  },
  async mounted(){
    console.log('GameDetail component mounted.');
    await this.dataStore.get_game(this.$route.params.id);
    await this.dataStore.get_game_reviews_total(this.$route.params.id);
    console.log('GameDetail=', this.dataStore.game);
  }
}
</script>

<style scoped>

</style>
