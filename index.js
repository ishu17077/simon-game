window.jQuery || document.writeln("<script src = \"static/jquery-3.5.1.min.js\">")
// ? Checks whether jQuery is activated and if not then use a local one

var buttonColors = ["red", "blue", "green", "yellow"];
var level = 1;
var generatedSequence = [];
var userSeqIndx = 0;
var hasGameEnded = true;
var winningTexts = [
   "Keep going! 🎉",
   "Amazing!🔥",
   "Champion vibes! 🏆",
   "Incredible!🌟",
   "You're unstoppable! 🚀",
   "Fantastic! 💫",
   "Great job! 👏",
   "Superb! 🌈",
   "You're a star! ⭐",
   "Outstanding! 🥇",
   "Bravo! 🎊",
   "Legendary! 🐾"
];
var wrongAudio = new Audio("./sounds/wrong.mp3");
var winningTextIndex = 0;

function cycleQuotes() {
   if ((++winningTextIndex) + 1 > winningTexts.length) {
      winningTextIndex = 0;
   }
   return winningTexts[winningTextIndex];
}


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
   if (!hasGameEnded) {
      for (var i = 0; i < generatedSequence.length; i++) {
         var audio = new Audio(`./sounds/${generatedSequence[i]}.mp3`);
         audio.play().then(function () {
            audio.remove();
         });
         await $("#" + generatedSequence[i]).animate({
            opacity: 0.3
         }).animate({
            opacity: 1.0
         }).promise();
      }
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
   $(".btn").on("click", function (event) {
      var button = $(this);
      var audio = new Audio(`./sounds/${this.id}.mp3`);
      audio.play().then(function () {
         audio.remove();
      });

      button.addClass("pressed");
      button.animate({
         opacity: 0.3
      }).animate({
         opacity: 1.0
      }).promise();
      setTimeout(function () {
         button.removeClass("pressed");
      }, 200);
      if (userSeqIndx + 1 == generatedSequence.length) {
         if (this.id != generatedSequence[userSeqIndx++]) {
            gameLost();
            return false;
         }
         setTimeout(function () {
            nextLevel();
         }, 1000);
         return true;

      } else if (userSeqIndx < generatedSequence.length) {
         if (this.id != generatedSequence[userSeqIndx++]) {
            gameLost();
            return false;
         }
      } else {
         gameLost();
         return false;
      }


   });
}

function gameLost() {
   $("#level-title").text("Aw cutie, you lost! Wanna marry me?💐 Press A.");
   wrongAudio.play();
   $("body").addClass("game-over");
   setTimeout(function () {
      $("body").removeClass("game-over");
   }, 200);
   
   hasGameEnded = true;
   $(".btn").off("click");
}

function nextLevel() {
   $("#level-title").text(winningTexts[randomNumber()]);
   setTimeout(function () {
      $("#level-title").text("Level: " + (++level));
   }, 1000);
   userSeqIndx = 0;
   levelHandler();
   $(".btn").off("click");
}

function startGame() {
   level = 1;
   generatedSequence = [];
   userSeqIndx = 0;
   hasGameEnded = false;
   levelHandler();
}

$(document).on("click", function () {
   if (hasGameEnded) {
      startGame();
      $("#level-title").text("Game On!");
   }
});

$(document).on("keydown", function (event) {
   if (event.key.toLowerCase() == 'a' && hasGameEnded) {
      startGame();
      $("#level-title").text("Game On!");
   }
});