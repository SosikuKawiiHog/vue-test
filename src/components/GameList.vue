<template>
  <h2>Список игр</h2>
  <div v-if="games && games.length > 0">
    <table class="w-full table-auto">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Дата выхода</th>
          <th>Разработчик</th>
          <th>Рейтинг пользователей</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.id }}</td>
          <td>
            <router-link :to="`/games/${game.id}`">{{game.title}}</router-link>
          </td>
          <td>{{game.description}}</td>
          <td>{{formatDate(game.release_date)}}</td>
          <td>{{game.developer.name}}</td>
          <td>{{formatRating(game.user_score)}}</td>
          <td></td>
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
      games:[],
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
      const res = await fetch("http://127.0.0.1:8000/api/game");
      this.games = await res.json();
    } catch(err){
      console.log(err);
    }
  }
}
</script>

<style scoped>

</style>
