<template>
  <div class="p4- max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold">Оставить отзыв</h2>

    <div class="mb-4">
      <label for="game" class="block mb-2">Выберите игру</label>
      <Select v-model="selectedGameId" :options="gameOptions" option-label="title"
              option-value="id" placeholder="Выберите игру"/>
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
      <FileUpload name="screenshots[]" :multiple="true" :max-file-size="2000000"
                  accept="image/*" :custom-upload="true" @uploader="onUpload"/>
    </div>

    <Button label="Оставить отзыв" icon="pi pi-send" @click="submitReview"
            :disable="!selectedGameId || !rating"/>
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
    }
  },
  async mounted() {
    await this.dataStore.get_games(0,100);
    this.gameOptions = this.dataStore.games;
  },
  methods: {
    onUpload(event) {
      this.screenshots = Array.from(event.files);
    },
    async submitReview() {
      if(!this.selectedGameId || this.rating === null) {
        this.$toast.add({
          severity: 'warning',
          summary: 'Ошибка',
          detail: 'Заполните все поля',
          life: 4000,
        });
        return;
      }

      const formData = new FormData();
      formData.append('game_id', this.selectedGameId);
      formData.append('rating', this.rating);
      if(this.text.trim()){
        formData.append('text', this.text);
      }
      this.screenshots.forEach((file) => {
        formData.append('screenshots[]', file);
      });

      try{
        await this.dataStore.create_review(this.selectedGameId, formData);
        if(this.dataStore.errorCode !== 0){
          throw new Error(this.dataStore.errorMessage);
        }
        this.$toast.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Добавлено',
          life: 4000,
        });

        this.selectedGameId = null;
        this.rating = null;
        this.text = "";
        this.screenshots = [];
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: this.dataStore.errorMessage || 'Неизвестная ошибка',
          life: 5000,
        })
      }
      console.log(this.screenshots);
    }
  },
  computed: {
    errorMessage(){
      return this.dataStore.errorMessage
    },
    errorCode(){
      return this.dataStore.errorCode
    }
  },
}
</script>

<style scoped>

</style>
