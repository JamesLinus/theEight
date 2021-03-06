
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var analyser ;
var timer ; 

function Game(){  
    this.role = new Role();
    this.blocks = [];
}


Game.prototype.init = function(){
  this.die = false;
  this.voiceSize = 0;
  this.role.h=140;

  for(var i = 0, length1 = this.blocks.length; i < length1; i++){
    document.querySelector('.stage').removeChild(this.blocks[i].block);
  }
  this.blocks = [];

  var block = new Block(320 , 140 , 0);
  this.blocks.push(block);
  
};


Game.prototype.gameStart = function() {
  this.init();
  AudioAPI.start().then(a => {
          analyser = a;
          this.startGetVoiceSize();
    })
};

Game.prototype.startGetVoiceSize = function() {

          let voiceSize = AudioAPI.getVoiceSize(analyser)
          this.voiceSize = voiceSize/1000;

          
          if (!this.die) {
              if (this.voiceSize>0.5) {
                //jump
                if (this.voiceSize > 30) {
                  this.role.jump(this.voiceSize-30);
                }
                
                //move
                this.role.move();
                this.blocks.forEach(function(item){
                  item.move(this.voiceSize/100);
                }.bind(this));


              }else{
                this.role.static();
                this.role.jump(0);
              }
          }
                    

          // jumpDown
          if (this.die || (this.blocks[0].deltaX > this.blocks[0].w+288 && this.blocks[1].deltaX < 252 && this.voiceSize<0.5)) {
            this.role.jumpDown()
          }

          // if delete block
          if (this.blocks[0].deltaX>this.blocks[0].w+320) {
            document.querySelector('.stage').removeChild(this.blocks[0].block);
            this.blocks.shift();
          }


          //change role height
          if (this.blocks[1] && this.blocks[1].deltaX>252) {
            this.role.h = this.blocks[1].h;
          }

          // create block
          var len = this.blocks.length-1;
          if (this.blocks[len].deltaX>this.blocks[len].w+60) {
            var block = new Block();
            this.blocks.push(block);
          }

          //game over 
          if (((this.blocks[1] && this.blocks[1].deltaX>252) || this.blocks[0].deltaX > this.blocks[0].w+252) && this.role.h<this.blocks[1].h/2) {
            this.die = true;
          }

          //game over
          if (this.role.h <0) {
            cancelAnimationFrame(timer);
            $mask.show();
            $mask.css("backgroundColor","rgba(255,255,255,0.7)");
            $btnAgain.show();
          }else{
            timer = requestAnimationFrame(this.startGetVoiceSize.bind(this));
          }


};
