import {defineStore} from "pinia";
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDataStore = defineStore('data', {
    state: () => ({
        games: [],
        game: null,
        gameReviews: [],
        totalGames: null,
        totalReviews: null,
        errorCode: "",
        errorMessage: "",
    }),
    actions: {
        async get_games(page = 0, perpage = 5){
            this.errorMessage = "";
            try{
                const response = await axios.get(backendUrl + '/game', {
                    params: {
                        page: page,
                        perpage: perpage,
                    }
                });
                this.games = response.data;
            } catch (error) {
                if(error.response){
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                }
                else if(error.request){
                    this.errorMessage = error.message;
                    console.log(error);
                }
                else{
                    console.log(error);
                }
            }
        },
        async get_games_total(){
            this.errorMessage = "";
            try{
                const response = await axios.get(backendUrl + '/game_total', {});
                this.totalGames = response.data;
            } catch (error) {
                if(error.response){
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                }
                else if(error.request){
                    this.errorMessage = error.message;
                    console.log(error);
                }
                else{
                    console.log(error);
                }
            }
        },
        async get_game(id,page = 0, perpage = 5){
            this.errorMessage = "";
            try{
                const response = await axios.get(backendUrl + `/game/${id}`, {
                    params: {
                        page: page,
                        perpage: perpage,
                    }
                });
                this.game = response.data;
                this.gameReviews = response.data.reviews;
            } catch (error) {
                if(error.response){
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                }
                else if(error.request){
                    this.errorMessage = error.message;
                    console.log(error);
                }
                else{
                    console.log(error);
                }
            }
        },
        async get_game_reviews_total(id){
            this.errorMessage = "";
            try{
                const response = await axios.get(`${backendUrl}/game_reviews_total/${id}`, {});
                this.totalReviews = response.data;
            } catch (error) {
                if(error.response){
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                }
                else if(error.request){
                    this.errorMessage = error.message;
                    console.log(error);
                }
                else{
                    console.log(error);
                }
            }
        },
      async create_review(gameId,formData){
          this.errorMessage = "";
          try{
            const response = await axios.post(`${backendUrl}/game/${gameId}/reviews`, formData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            this.errorCode = response.data.code;
            this.errorMessage = response.data.message;
          } catch (error) {
            if(error.response){
              this.errorCode = 11;
              this.errorMessage = error.response.data.message;
              console.log(error);
            } else if(error.request){
              this.errorCode = 12;
              this.errorMessage = error.message;
              console.log(error);
            } else {
              this.errorCode = 13;
              console.log(error);
            }
          }
      }
    }
})
