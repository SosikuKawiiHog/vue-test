<template>
  <h2 class="text-2xl font-bold">Мои отзывы</h2>
  <div v-if="reviews && reviews.length > 0" class="container mx-auto px-4 py-6">
    <ul>
      <li class="mb-7" v-for="review in reviews" :key="review.id">
        <div class="flex justify-between items-start mb-2">
          <div>
            <router-link :to="`/games/${review.game_id}`">
              {{review.game.title}}
            </router-link>
          </div>
        </div>
        <span>{{formatRating(review.rating)}}/10</span>
        <p v-if="review.text" class="text-gray-400 mb-3">
          {{review.text}}
        </p>
        <p v-else class="text-gray-400 italic mb-3">---</p>

        <div v-if="parseScreenshots(review.screenshots)?.length" class="flex gap-2 flex-wrap mb-2">
          <img
            v-for="(src, idx) in parseScreenshots(review.screenshots)"
            :key="idx"
            :src="src"
            alt="screenshot"
            class="w-16 h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-400 transition shadow-sm"
            @click="openModal(src)">
        </div>
      </li>
    </ul>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    {{error}}
  </div>
  <div v-else-if="reviews.length === 0">Нет отзывов</div>
  <div v-else>
    Загрузка...
  </div>
  <div v-if="modalVisible"
       class="fixed inset-0 bg-black/70 flex items-center justify-center"
       @click="modalVisible = false">
    <img :src="modalImage" alt=""
         class="max-w-full max-h rounded shadow-2xl"
         @click.stop>
    <button @click="modalVisible = false"
            class="absolute top-4 right-4 text-white text-3xl hover-text-gray-200 transition">
      &times;
      </button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      reviews: [],
      error: null,
      modalVisible: false,
      modalImage: '',
    }
  },
  methods: {
    formatRating(value){
      return value ? Number(value).toFixed(1) : '-';
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
    const token = localStorage.getItem('token');
    if(!token){
      this.error = 'Требуется авторизация'
      return;
    }
    try{
      const res = await fetch('http://127.0.0.1:8000/api/reviews', {
        headers: {'Authorization': `Bearer ${token}`}
      })
      if(res.ok){
        this.reviews = await res.json()
      }
      else{
        this.error = 'Ошибка загрузки отзывов'
      }
    }catch(err){
      this.error = 'Ошибка сети'
    }
  }
}
</script>

<style scoped>

</style>
