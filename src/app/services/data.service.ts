import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DataService {
  
 
  constructor(public httpClient:HttpClient) {
   
   }

   headers = new Headers({
    'Accept': 'application/json'
  });

   getGameSettings(){
    return this.httpClient.get('https://dev-bot.pico.buzz/memory');
}

  saveGameSettings(user){
    return this.httpClient.post("https://dev-bot.pico.buzz/memory",JSON.stringify(user));
  }

  
}
