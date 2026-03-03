import {createRouter , createWebHistory} from 'vue-router';
import GameList from './components/GameList.vue';
import GameDetail from './components/GameDetail.vue';
import MyReviews from './components/MyReviews.vue';
import DeveloperList from './components/DeveloperList.vue';
import DeveloperDetail from './components/DeveloperDetail.vue';
import ReviewCreate from "@/components/ReviewCreate.vue";

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
    path: '/developers',
    component: DeveloperList,
  },
  {
    path: '/developers/:id',
    component: DeveloperDetail,
  },
  {
    path: '/my-reviews',
    component: MyReviews,
  },
  {
    path: '/my-reviews/create',
    component: ReviewCreate,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
