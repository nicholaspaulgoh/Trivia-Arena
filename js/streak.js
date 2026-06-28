//Called when active player answers CORRECTLY 
function onCorrectAnswer(playerKey) {
  const player = battleState[playerKey]

  player.streak++

  // Check if streak hit 3
  if (player.streak >= 3) {
    player.critPending = true
    player.streak = 0           // reset counter after crit triggered
    onCritReady(playerKey)      // visual + sound
  } else {
    updateStreakDisplay(playerKey)
  }

  console.log(playerKey, 'streak:', player.streak, 'critPending:', player.critPending)
}

//Called when active player answers WRONG or times out
function onWrongAnswer(playerKey) {
  const player = battleState[playerKey]

  player.streak = 0             // reset streak — only on OWN wrong answer
                                 // critPending is NOT cleared here — if they already earned a crit, they keep it even if they answer wrong on a later question


  updateStreakDisplay(playerKey)

  console.log(playerKey, 'streak reset to 0')
}

//Called when opponent attempts a steal (success OR fail)
// Does nothing to the active player's streak
function onStealAttempt(stealingPlayerKey, success) {
  if (success) {
    // Opponent answered correctly, they get a bonus on their next attack
    battleState[stealingPlayerKey].storedBonus += 0.10
    updateBonusDisplay(stealingPlayerKey)
    console.log(stealingPlayerKey, 'steal success — +10% bonus stored')
  } else {
    // Both failed — nothing changes for anyone's streak
    console.log('steal failed — no changes to any streak')
  }
  // Active player's streak: UNTOUCHED regardless of steal outcome
}

// Called when crit is triggered (streak hits 3) 
function onCritReady(playerKey) {
  updateStreakDisplay(playerKey)
  console.log(playerKey, 'CRIT READY!')
}