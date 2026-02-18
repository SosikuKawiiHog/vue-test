import {createRouter , createWebHistory} from 'vue-router';
import GameList from './components/GameList.vue';
import GameDetail from './components/GameDetail.vue';
import MyReviews from './components/MyReviews.vue';

const routes = [
  {
    path: '/games',
    component: GameList,
  },
  {
    path: '/games/:id',
    component: GameDetail,
  },
  {
    path: '/my-reviews',
    component: MyReviews,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
