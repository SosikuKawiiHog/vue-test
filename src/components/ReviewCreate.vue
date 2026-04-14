<template>
  <div class="p4- max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold">
      {{isEditMode ? 'Редактировать отзыв' : 'Оставить отзыв'}}</h2>

    <div class="mb-4" v-if="!isEditMode">
      <label for="game" class="block mb-2">Выберите игру</label>
      <Select v-model="selectedGameId" :options="gameOptions" option-label="title"
              option-value="id" placeholder="Выберите игру"/>
    </div>
    <div class="mb-4" v-else>
      <p class="text-gray-500">Игра: <strong>{{editGameTitle}}</strong></p>
    </div>

    <div class="mb-4">
      <label class="block mb-2">Ваша оценка (0-10)</label>
      <InputNumber v-model="rating" :min="0" :max="10" :step="0.1" mode="decimal"
                   :min-fraction-digits="1" :max-fraction-digits="1" class="w-full"/>
    </div>

    <div class="mb-4">
      <label for="text" class="block mb-2">Текст отзыва (необязательно0</label>
      <Textarea v-model="text" rows="4" placeholder="Поделитесь своим ОЧЕНЬ ВАЖНЫМ мнением"/>
    </div>

    <div class="mb-6">
      <label class="block mb-2">Скриншоты (до 3 файлов)</label>
      <div v-if="screenshots.length > 0 && isEditMode" class="flex flex-wrap gap-3 mb-3">
        <div v-for="(shot, index) in screenshots" :key="index" class="relative w-24 h-24 rounded-lg overflow-hidden">
          <img :src="shot.url" class="w-full h-full object-cover"/>
          <button type="button" @click="removeScreenshot(index)" class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition">
            X
          </button>
        </div>
      </div>
      <FileUpload name="screenshots[]" :multiple="true" :max-file-size="2000000"
                  accept="image/*" :custom-upload="true"
                  @select="onSelectFiles"/>
    </div>

    <div class="flex gap-2">
      <Button :label="isEditMode ? 'Сохранить' : 'Оставить отзыв'"
              icon="pi pi-send" @click="submitReview"
              :disabled="(!selectedGameId && !isEditMode) || rating === null || isLoading"
              :loading="isLoading"/>
      <Button v-if="isEditMode" label="Отмена" icon="pi pi-times"
              severity="secondary" @click="$router.back()"/>
    </div>
  </div>

  <Toast position="bottom-right"/>
</template>

<script>
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";
import Toast from "primevue/toast";
import Button from "primevue/button";
import {useDataStore} from "@/stores/dataStore.js";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export default {
  name: "CreateReview",
  components: { Select, InputNumber, Textarea, FileUpload, Toast, Button },
  data() {
    return {
      dataStore: useDataStore(),
      selectedGameId: null,
      text: "",
      rating: null,
      screenshots: [],
      gameOptions: [],
      isLoading: false,
      review: null,
    }
  },
  async mounted() {
    await this.dataStore.get_games(0,100);
    this.gameOptions = this.dataStore.games;
    if(this.isEditMode && this.editReviewId) {
      await this.loadReview(this.editReviewId);
    }
  },
  watch: {
    review: { handler: 'initForm', immediate: true }
  },
  methods: {
    async loadReview(reviewId) {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/reviews/${reviewId}`, {
        headers: {'Authorization': `Bearer ${token}`}
      })
      this.review = res.data;
    },
    initForm() {
      if(this.isEditMode && this.review) {
        this.selectedGameId = this.review.game_id;
        this.rating = this.review.rating;
        this.text = this.review.text || "";
        this.screenshots = (this.review.screenshots || []).map(url => ({
          url, file: null, isNew: false,
        }))
      }
    },
    onSelectFiles(event) {
      const existingOld = this.screenshots.filter(s => !s.isNew);

      const newShots = Array.from(event.files).map(file => ({
        url: URL.createObjectURL(file),
        file,
        isNew: true,
      }));
      const allowed = 3 - existingOld.length;
      this.screenshots =  [...existingOld, ...newShots.slice(0, allowed)];
    },
    removeScreenshot(index){
      const shot = this.screenshots[index];
      if(shot.isNew && shot.url.startsWith('blob')) URL.revokeObjectURL(shot.url);
      this.screenshots.splice(index, 1);
    },
    onUpload(event) {
      this.screenshots = Array.from(event.files);
    },
    async submitReview() {
      if((!this.selectedGameId && !this.isEditMode) || this.rating === null) {
        this.$toast.add({
          severity: 'warning',
          summary: 'Ошибка',
          detail: 'Заполните все поля',
          life: 4000,
        });
        return;
      }

      this.isLoading = true;

      try{
        const formData = new FormData();
        if (!this.isEditMode) {
          formData.append('game_id', this.selectedGameId);
        }
        formData.append('rating', this.rating);
        if(this.text.trim()){
          formData.append('text', this.text);
        }

        this.screenshots.forEach(shot => {
          if(shot.isNew){
            formData.append('screenshots[]', shot.file);
          } else formData.append('keep_screenshots[]', shot.url);
        });

        if(this.isEditMode){
          await this.dataStore.update_review(this.review.id, formData);
        } else await this.dataStore.create_review(this.selectedGameId, formData);

        if(this.dataStore.errorCode !== 0){
          throw new Error(this.dataStore.errorMessage);
        }
        this.$toast.add({
          severity: 'success',
          summary: 'Успех',
          detail: this.isEditMode ? 'Обновлено' : 'Добавлено',
          life: 4000,
        });

        if(!this.isEditMode){
          this.selectedGameId = null;
          this.rating = null;
          this.text = "";
          this.screenshots = [];
        } else{
          this.$emit('review-updated');
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: this.dataStore.errorMessage || 'Неизвестная ошибка',
          life: 5000,
        })
      } finally {
        this.isLoading = false;
      }
      console.log(this.screenshots);
    }
  },
  computed: {
    isEditMode(){
      return !!this.$route.query.edit;
    },
    editReviewId(){
      return this.$route.query.edit || null;
    },
    errorMessage() {
      return this.dataStore.errorMessage
    },
    errorCode() {
      return this.dataStore.errorCode
    },
    editGameTitle() {
      return this.review?.game?.title || this.review?.game_title || 'КТО ЭТО?'
    }
  },
}
</script>

<style scoped>

</style>
