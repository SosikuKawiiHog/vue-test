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
    }
})
