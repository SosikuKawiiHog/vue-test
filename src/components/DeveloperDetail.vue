<template>
  <div v-if="developer && developer.id">
    <h2 class="text-2xl font-bold mb-4">Список игр от разработчиков <span class="text-gray-500">{{developer.name}}</span></h2>
    <table class="w-full">
      <thead class="dark:bg-gray-800">
      <tr>
        <th>ID</th>
        <th>Название</th>
        <th>Оценка пользователей</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-600">
      <tr v-for="game in developer.games" :key="developer.games.id">
        <td>{{game.id}}</td>
        <td><router-link :to="`/games/` + game.id">{{ game.title }}</router-link></td>
        <td>{{ formatRating(game.user_score) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<script>
export default {
  data(){
    return {
      developer: []
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
      const res = await fetch(`http://127.0.0.1:8000/api/developer/${id}`)
      this.developer = await res.json()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
