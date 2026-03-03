<template>
  <div v-if="dataStore.game && dataStore.game.id">
    <div v-if="dataStore.game.cover_image" class="mb-6">
      <img :src="'data:image/jpeg;base64,' + dataStore.game.cover_image" alt=""
      class="max-w-2xl h-auto rounded-lg shadow-lg m-2">
    </div>

    <h2 class="text-2xl font-bold mb-2">{{dataStore.game.title}}
      <span class="text-gray-500 font-normal">от {{dataStore.game.developer.name}}</span>
    </h2>
    <p class="text-gray-600 mb-2">{{dataStore.game.description}}<br>{{formatDate(dataStore.game.release_date)}}</p>
    <p>Средняя оценка: <strong>{{formatRating(dataStore.game.user_score)}}</strong></p>

    <h3>Отзывы ({{dataStore.totalReviews}}):</h3>
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
          <div class="flex gap-1 flex-wrap">
            <img v-for="(src,inx) in parseScreenshots(slotProps.data.screenshots)"
            :key="idx" :src="src" alt="" class="w-12 h-12 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-400 transition duration-150" @click="openModal(src)">
            <span v-if="!parseScreenshots(slotProps.data.screenshots).length" class="text-gray-400 text-sm">---</span>
          </div>
        </template>
      </Column>

      <Column field="created_at" header="Дата">
        <template #body="slotProps">
          {{formatDate(slotProps.data.created_at)}}
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="modalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :resizable="false"
      :showHeader="false"
      class="p-0">
      <img :src="modalImage" alt="full" class="max-w-full mah-h-hl rounded"/>
    </Dialog>

  </div>
  <div v-else-if="dataStore.errorMessage">
    {{dataStore.errorMessage}}
  </div>
  <div v-else>
    <span class="text-gray-500">Загрузка...</span>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog"
import {useDataStore} from '@/stores/dataStore.js';
export default {
  name: "GameDetail",
  components: {DataTable, Column, Dialog },
  data(){
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
      modalVisible: false,
      modalImage: '',
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
      this.dataStore.get_game(this.$route.params.id,this.offset / this.perpage, this.perpage);
    },
    parseScreenshots(screenshots){
      if(!screenshots) return [];
      if(Array.isArray(screenshots)) return screenshots;
      try{
        const parsed = JSON.parse(screenshots);
        return Array.isArray(parsed) ? parsed : []
      } catch{
        return [];
      }
    },
    openModal(src){
      this.modalImage = src;
      this.modalVisible = true;
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
