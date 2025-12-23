let moves = 0;
let timer = 0;
let maxChances = 5;        
let turnChances = maxChances;
let timerInterval = null;
let timerStarted = false;
let currentSong = null;    

const soundFiles = {
  flip:  "assests/songs/flip.mp3",
  match: "assests/songs/match.mp3",
  wrong: "assests/songs/wrong.mp3",
  win:   "assests/songs/win.mp3"
};

function playSound(type) {
  const path = soundFiles[type];
  if (!path) return;
  try {
    const audio = new Audio(path);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {}
}

function showConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } });
    confetti({ particleCount: 60, spread: 140, origin: { y: 0.6 } });
  }
}

const pairs = [
  { hero: "Pawan Kalyan", movie: "Gabbar Singh", heroImg: "assests/hero/pk2.jpg", movieImg: "assests/movie/gabbar.jpg", song: "assests/song/gabbar.mp3" },
  { hero: "Allu Arjun", movie: "Pushpa", heroImg: "assests/hero/allu.jpg", movieImg: "assests/movie/pushpa title.jpg", song: "assests/song/pushpa.mp3" },
  { hero: "Prabhas", movie: "Baahubali", heroImg: "assests/hero/prabhas.jpg", movieImg: "assests/movie/bahu title.jpg", song: "assests/song/bahu.mp3" },
  { hero: "Jr NTR", movie: "Devara", heroImg: "assests/hero/ntr.jpg", movieImg: "assests/movie/ntr title.jpeg", song: "assests/song/ayudha.mp3" },
  { hero: "Ram Charan", movie: "Rangasthalam", heroImg: "assests/hero/ram1.png", movieImg: "assests/movie/ram title.jpg", song: "assests/song/ranga.mp3" },
  { hero: "Mahesh Babu", movie: "Sarileru Neekevvaru", heroImg: "assests/hero/mb1.jpg", movieImg: "assests/movie/mb title.jpg", song: "assests/song/mb .mp3" }
];

function startGame() {
  moves = 0;
  turnChances = maxChances;
  timer = 0;
  timerStarted = false;
  clearInterval(timerInterval);

  document.getElementById("moves").textContent = `Moves: ${moves}`;
  document.getElementById("chances").textContent = `Chances: ${turnChances}`;
  document.getElementById("timer").textContent = `Time: ${timer}s`;
  document.getElementById("status").textContent = "";

  if (currentSong) {
    currentSong.pause();
    currentSong.currentTime = 0;
    currentSong = null;
  }

  let deck = [];
  pairs.forEach(p => {
    deck.push({ type: "hero", pair: p, img: p.heroImg });
    deck.push({ type: "movie", pair: p, img: p.movieImg });
  });
  deck = deck.sort(() => 0.5 - Math.random());

  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  let firstCard = null, lock = false, matched = 0;

  deck.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${item.img}')"></div>
      </div>
    `;
    card.dataset.type = item.type;
    card.dataset.hero = item.pair.hero;
    card.dataset.movie = item.pair.movie;
    card.dataset.song = item.pair.song;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  function flipCard(card) {
    if (lock || card.classList.contains("flipped")) return;

    if (!timerStarted) {
      timerStarted = true;
      timerInterval = setInterval(() => {
        timer++;
        document.getElementById("timer").textContent = `Time: ${timer}s`;
      }, 1000);
    }

    card.classList.add("flipped");
    playSound("flip");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    let secondCard = card;
    lock = true;

    if (isMatch(firstCard, secondCard)) {
      moves++;
      document.getElementById("moves").textContent = `Moves: ${moves}`;
      playSound("match");

      matched += 2;

      firstCard.classList.add("move-center", firstCard.dataset.type);
      secondCard.classList.add("move-center", secondCard.dataset.type);

      setTimeout(() => playSong(secondCard.dataset.song), 500);

      setTimeout(() => {
        firstCard.classList.remove("move-center", firstCard.dataset.type);
        secondCard.classList.remove("move-center", secondCard.dataset.type);

        firstCard.classList.add("match");
        secondCard.classList.add("match");

        firstCard = null;
        secondCard = null;
        lock = false;
        turnChances = maxChances;
        document.getElementById("chances").textContent = `Chances: ${turnChances}`;

        if (matched === deck.length) {
          document.getElementById("status").innerText = "🎉 You matched all Heroes & Movies!";
          playSound("win");
          showConfetti();
          clearInterval(timerInterval);
        }
      }, 1500);

    } else {
      moves++;
      turnChances--;
      document.getElementById("moves").textContent = `Moves: ${moves}`;
      document.getElementById("chances").textContent = `Chances: ${turnChances}`;
      playSound("wrong");

      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        lock = false;

        if (turnChances <= 0) {
          document.getElementById("status").innerText = "😢 No more chances for this pair!";
          turnChances = maxChances;
          document.getElementById("chances").textContent = `Chances: ${turnChances}`;
        }
      }, 1000);
    }
  }

  function isMatch(c1, c2) {
    return (
      (c1.dataset.type === "hero" && c2.dataset.type === "movie" && c1.dataset.hero === c2.dataset.hero) ||
      (c1.dataset.type === "movie" && c2.dataset.type === "hero" && c1.dataset.hero === c2.dataset.hero)
    );
  }

  function playSong(songPath) {
    if (currentSong) {
      currentSong.pause();
      currentSong.currentTime = 0;
    }
    currentSong = new Audio(songPath);
    currentSong.volume = 1.0;
    currentSong.play().catch(err => console.log("Song blocked:", err));
  }
}

const container = document.getElementById("symbol-container");
const symbols = ["✨","⭐","💖","🎵","🔥","🎉","💎","★","✦","✧","❉","✪","✩","✫","✬","♡","⚡"];
function createSymbol() {
  const span = document.createElement("span");
  span.classList.add("symbol");
  span.innerText = symbols[Math.floor(Math.random() * symbols.length)];
  span.style.left = Math.random() * 100 + "vw";
  span.style.fontSize = (Math.random() * 20 + 15) + "px";
  span.style.animationDuration = (Math.random() * 5 + 4) + "s";
  container.appendChild(span);
  setTimeout(() => span.remove(), 7000);
}
setInterval(createSymbol, 200);
document.getElementById("restartBtn").addEventListener("click", startGame);
startGame();
