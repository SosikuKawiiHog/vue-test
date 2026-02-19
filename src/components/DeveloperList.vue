<template>
  <h2>Список разработчиков</h2>
  <div v-if="developers && developers.length > 0">
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Название</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="developer in developers" :key="developer.id">
        <td>{{ developer.id }}</td>
        <td>
          <router-link :to="'/developers/' + developer.id">{{developer.name}}</router-link>
        </td>
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
  data() {
    return {
      developers: [],
    }
  },
  async mounted(){
    try{
      const res = await fetch("http://127.0.0.1:8000/api/developer");
      this.developers = await res.json();
    } catch(err){
      console.log(err);
    }
  }
}
</script>

<style scoped>

</style>
