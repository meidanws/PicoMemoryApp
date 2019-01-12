import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {
  gameSettings:any=[];
  images:any=[];
  flag: boolean = true;
  score:number = 0;
  timer:any;
  temp;
  h;
      user = {
      user_id:1,
      time: 2 ,
      end_time:3,
      matches:0,     
     }
    
  constructor(public dataService:DataService){
    this.dataService.getGameSettings().subscribe(data => { 
      this.gameSettings = data; 
      this.images = this.shuffle(this.gameSettings.data.images)  ;
      this.timer = this.gameSettings.data.time;
      this.user.user_id = this.gameSettings.data.user_id;
      this.user.time = Math.floor(new Date().getTime() / 1000);
    });
  }

   shuffle(images) {
    var i,
        j,
        temp;
    for (i = images.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = images[i];
        images[i] = images[j];
        images[j] = temp;
    }
    return images;    
};
 
pickCard(id){
  var card = document.getElementById(id);  
  card.style.visibility="visible";
  // first click 
  if(this.flag){
    this.temp = id;
    this.flag = false;
  }
 
  // second click 
  else{
    if(this.temp!= id) // Check if the user not clicked on the same card
    {
    if(this.images[id].pair_id != this.images[this.temp].id){ 
      document.getElementById("board").style.pointerEvents = "none"; // disabled any click on the board
      setTimeout(()=>{ 
        card.style.visibility="hidden";  
        document.getElementById(this.temp).style.visibility="hidden";
        document.getElementById("board").style.pointerEvents = "auto";
       },2000)
    }
    else{ 
      this.score++; 
      document.getElementById("div"+id).style.pointerEvents = "none"; // disabled clicks on the match cards
      document.getElementById("div"+this.temp).style.pointerEvents = "none";
      if(this.score==this.images.length/2){
        clearInterval(this.h);  
        this.preGame();   
        swal({title:"Good job!",
              text:"Final score: "+this.score,
              icon: "success"}
        )
          .then(() => {
          this.saveGame(); //Save Game
          location.reload();}); // Refresh screen 
      };
    }
   
   this.flag = true;
    }
 }
}

  startGame(){ 
    document.getElementById("boardGame").style.display ="block";
    document.getElementById("preGame").style.display ="none";
    this.h=setInterval(changeTime=>{
      this.timer--;
      if(this.timer==0){
        clearInterval(this.h)
        this.preGame();
        this.saveGame();
        swal("Game Over!","Time is out...", "error")
        .then(() => {
          location.reload();});   // Refresh screen 
      }
    },1000);
    
  }

  preGame(){ // Return to main screen
    document.getElementById("boardGame").style.display ="none";
    document.getElementById("preGame").style.display ="block";
  }

 saveGame(){
   this.user.end_time =  Math.floor(new Date().getTime() / 1000); //Get the end time
   this.user.matches = this.score ; // Get the final score
  console.log(this.user.user_id);
  console.log(this.user.time);
  console.log(this.user.end_time)
  console.log(this.user.matches)

     this.dataService.saveGameSettings(this.user).subscribe(res =>{ //Save the user setting in the DB
       console.log(res);
     })
   } 
  
  ngOnInit() {
  }

}
