//Called when active player answers CORRECTLY
function onCorrectAnswer(playerKey) {
  const player = battleState[playerKey]

  // Roll crit BEFORE incrementing streak, so the first correct answer
  // in a fresh streak gets the base 10% chance, not a pre-boosted one.
  const critChance = Math.min(0.5, 0.10 + 0.10 * player.streak)
  const isCrit = Math.random() < critChance

  player.streak++

  if (isCrit) {
    player.critPending = true
    onCritReady(playerKey)      // visual + sound
  }

  updateStreakDisplay(playerKey)

  console.log(
    playerKey,
    'streak:', player.streak,
    'critChance:', Math.round(critChance * 100) + '%',
    'critPending:', player.critPending
  )
}

//Called when active player answers WRONG or times out
function onWrongAnswer(playerKey) {
  const player = battleState[playerKey]

  player.streak = 0             // reset streak — only on OWN wrong answer
  player.critPending = false    // a banked crit is lost on a wrong answer too

  updateStreakDisplay(playerKey)

  console.log(playerKey, 'streak reset to 0, critPending cleared')
}

//Called when opponent attempts a steal — logging only now
function onStealAttempt(stealingPlayerKey, success) {
  // Bonus application removed — resolveSteal() in steal.js is the only
  // place storedBonus gets touched, to avoid double-applying the +10%.
  if (success) {
    console.log(stealingPlayerKey, 'steal success — bonus applied via steal.js')
  } else {
    console.log('steal failed — no changes to any streak')
  }
}

// Called when crit is triggered (random roll succeeds)
function onCritReady(playerKey) {
  updateStreakDisplay(playerKey)
  console.log(playerKey, 'CRIT READY!')
}