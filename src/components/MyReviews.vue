<template>
  <h2>Мои отзывы</h2>
  <div v-if="reviews && reviews.length > 0">
    <ul>
      <li v-for="review in reviews" :key="review.id">
        {{review.game.title}} - {{review.rating}}
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
</template>

<script>
export default {
  data(){
    return {
      reviews: [],
      error: null
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
