window.jQuery || document.writeln("<script src = \"static/jquery-3.5.1.min.js\">")
// ? Checks whether jQuery is activated and if not then use a local one

var buttonColors = ["red", "blue", "green", "yellow"];
var level = 1;
var generatedSequence = [];
var userSeqIndx = 0;
var hasGameEnded = true;
var winningStreakTexts = [
   "You're on fire! 🔥",
   "Unstoppable! 🚀",
   "Unbeatable! 🥇",
   "Incredible streak! 🎉"
];


function addNewColor() {
   generatedSequence.push(buttonColors[randomNumber()]);
}

function randomNumber() {
   var random = parseInt(Math.random() * 4);
   if (random >= 4) {
      randomException();
   }
   // ? there's a very possibility of random func generating 4 as output which would create an exception in our array
   function randomException() {
      random = parseInt(Math.random() * 4);
      if (random >= 4) {
         randomException();
      }
   }
   return random;
}



async function animateSequence() {
   for (var i = 0; i < generatedSequence.length; i++) {
      await $("#" + generatedSequence[i]).animate({
         opacity: 0.3
      }).animate({
         opacity: 1.0
      }).promise();
   }

}


async function levelHandler() {
   if (!hasGameEnded) {
      addNewColor();
      await animateSequence();
      checkSequence();
   }
}

async function checkSequence() {
   $(".btn").on("click", async function (event) {

      var button = $(this);
      await logicHandler(button);

   });
}

async function logicHandler(button) {

   button.addClass("pressed");
   console.log("clicked");
   await button.animate({
      opacity: 0.3
   }).animate({
      opacity: 1.0
   }).promise();
   setTimeout(function () {
      button.removeClass("pressed");
      console.log()
   }, 500);
   if (userSeqIndx + 1 == generatedSequence.length) {
      if (this.id != generatedSequence[userSeqIndx++]) {
         gameLost();
         return false;
      } else {
         setTimeout(function () {
            nextLevel();
         }, 1000);

      }


   } else if (userSeqIndx < generatedSequence.length) {
      if (this.id != generatedSequence[userSeqIndx++]) {
         gameLost();
         return false;
      } else {
         nextLevel();
         return false;
      }

   } else {
      setTimeout(function () {
         nextLevel();
      }, 1000);
      return true;
   }


}

function gameLost() {
   $("#level-title").text("Aw cutie, you lost! Wanna marry me?🎕 Press A.");
   hasGameEnded = true;
   $(".btn").off("click");
}

function nextLevel() {
   level++;
   userSeqIndx = 0;
   levelHandler();
   $(".btn").off("click");
}

function startGame() {
   userSeqIndx = 0;
   level = 1;
   hasGameEnded = false;
   levelHandler();
}

$(document).on("keydown", function (event) {
   if (event.key.toLowerCase() == 'a' && hasGameEnded) {
      startGame();
      $("#level-title").text("Game!");
   }
});