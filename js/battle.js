const battleState = {
  currentTurn: 'player1',  

  player1: {
    name: 'Alex',
    hp: 200,
    maxHP: 200,
    streak: 0,              
    critPending: false,      
    storedBonus: 0,          
    moves: []
  },

  player2: {
    name: 'Sam',
    hp: 200,
    maxHP: 200,
    streak: 0,
    critPending: false,
    storedBonus: 0,
    moves: []
  }
}