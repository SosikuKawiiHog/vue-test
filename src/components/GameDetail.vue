<template>
  <div v-if="game && game.id">
    <h2>{{game.title}} от {{game.developer.name}}</h2>
    <p>{{game.description}}<br>{{formatDate(game.release_date)}}</p>
    <p>Средняя оценка: <strong>{{formatRating(game.user_score)}}</strong></p>

    <h3>Отзывы</h3>
    <div v-for="review in game.reviews" :key="review.id">
      {{review.user.name}}: {{review.rating}}
    </div>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<script>
export default {
  data(){
    return {
      game: []
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
    }
  },
  async mounted(){
    try{
      const id = this.$route.params.id; //CHTO
      const res = await fetch(`http://127.0.0.1:8000/api/game/${id}`)
      this.game = await res.json()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>

</style>
