// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// Card symbols (18 pairs for 6x6 grid)
const symbols = [
  '🐠', '🐙', '🦈', '🐚', '🦀', '🐡',
  '🦑', '🐢', '🦭', '🐳', '🦞', '🦐',
  '🐬', '🪼', '🦈', '🐟', '🦦', '🪸'
];

// Initialize game
function initGame() {
  // Reset state
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  gameStarted = false;
  flippedCards = [];
  
  // Stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Update UI
  updateStats();
  
  // Create card pairs
  cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol: symbol,
      flipped: false,
      matched: false
    }));
  
  // Render board
  renderBoard();
}

// Render game board
function renderBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.id = card.id;
    
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">${card.symbol}</div>
      </div>
    `;
    
    cardElement.addEventListener('click', () => handleCardClick(card.id));
    board.appendChild(cardElement);
  });
}

// Handle card click
function handleCardClick(cardId) {
  const card = cards.find(c => c.id === cardId);
  const cardElement = document.querySelector(`[data-id="${cardId}"]`);
  
  // Prevent clicking if:
  // - Card is already flipped
  // - Card is already matched
  // - Two cards are already flipped
  if (card.flipped || card.matched || flippedCards.length === 2) {
    return;
  }
  
  // Start timer on first move
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  
  // Flip card
  card.flipped = true;
  cardElement.classList.add('flipped');
  flippedCards.push(card);
  
  // Check for match when two cards are flipped
  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    checkMatch();
  }
}

// Check if two flipped cards match
function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.symbol === card2.symbol) {
    // Match found
    setTimeout(() => {
      card1.matched = true;
      card2.matched = true;
      
      const card1Element = document.querySelector(`[data-id="${card1.id}"]`);
      const card2Element = document.querySelector(`[data-id="${card2.id}"]`);
      
      card1Element.classList.add('matched');
      card2Element.classList.add('matched');
      
      matchedPairs++;
      updateStats();
      flippedCards = [];
      
      // Check for win
      if (matchedPairs === 18) {
        setTimeout(() => showWinModal(), 500);
      }
    }, 500);
  } else {
    // No match - flip back
    setTimeout(() => {
      card1.flipped = false;
      card2.flipped = false;
      
      const card1Element = document.querySelector(`[data-id="${card1.id}"]`);
      const card2Element = document.querySelector(`[data-id="${card2.id}"]`);
      
      card1Element.classList.remove('flipped');
      card2Element.classList.remove('flipped');
      
      flippedCards = [];
    }, 1000);
  }
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    updateStats();
  }, 1000);
}

// Update stats display
function updateStats() {
  document.getElementById('moves').textContent = moves;
  document.getElementById('pairs').textContent = `${matchedPairs}/18`;
  
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  document.getElementById('timer').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Show win modal
function showWinModal() {
  clearInterval(timerInterval);
  
  document.getElementById('final-moves').textContent = moves;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  document.getElementById('final-time').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  document.getElementById('win-modal').classList.remove('hidden');
}

// Hide win modal
function hideWinModal() {
  document.getElementById('win-modal').classList.add('hidden');
}

// Event listeners
document.getElementById('reset-btn').addEventListener('click', initGame);
document.getElementById('play-again-btn').addEventListener('click', () => {
  hideWinModal();
  initGame();
});

// Initialize game on load
initGame();