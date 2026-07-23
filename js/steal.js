// ── Called when steal phase resolves ─────────────────────────
// stealerKey  = the player who attempted the steal (opponent)
// activeKey   = the player whose turn it was (who answered wrong)
// success     = true if stealer answered correctly

function resolveSteal(stealerKey, activeKey, success) {
  if (success) {
    // Stealer answered correctly — store the +10% bonus
    battleState[stealerKey].storedBonus += 0.10

    // Cap bonus at 30% so multiple steals don't stack infinitely
    battleState[stealerKey].storedBonus = Math.min(
      battleState[stealerKey].storedBonus,
      0.30
    )

    logEvent(stealerKey + ' steals! +10% bonus stored', 'steal')

    // Show the bonus badge on the stealer's UI
    showBonusBadge(stealerKey)

  } else {
    // if both failed no damage, no bonus, nothing changes
    logEvent('Steal failed — no damage this turn', 'system')
  }

  // Active player's streak: NEVER touched here
  // (already reset in handleWrongAnswer before steal phase started)
}

// ── Apply bonus inside calculateDamage ─────────
// Call this every time damage is calculated
// Returns the final damage amount after all modifiers

function applyDamageModifiers(attackerKey, baseDamage) {
  const attacker = battleState[attackerKey]
  let damage = baseDamage
  let isCrit = false
  let bonusApplied = 0

  // 1 — Apply crit multiplier first (from streak)
  if (attacker.critPending) {
    damage = Math.floor(damage * 1.5)
    attacker.critPending = false
    isCrit = true
  }

  // 2 — Apply steal bonus on top
  if (attacker.storedBonus > 0) {
    bonusApplied = attacker.storedBonus
    damage = Math.floor(damage * (1 + attacker.storedBonus))
    attacker.storedBonus = 0    // consume the bonus — one use only

    // Hide the bonus badge since it's been used
    hideBonusBadge(attackerKey)
  }

  return {
    damage,
    isCrit,
    bonusApplied   // useful for the battle log message
  }
}

// ── Show/hide the bonus badge on the fighter card ────────────
function showBonusBadge(playerKey) {
  const badge = document.getElementById('bonus-' + playerKey)
  if (badge) {
    const pct = Math.round(battleState[playerKey].storedBonus * 100)
    badge.textContent = '+' + pct + '% bonus'
    badge.classList.add('visible')
  }
}

function hideBonusBadge(playerKey) {
  const badge = document.getElementById('bonus-' + playerKey)
  if (badge) badge.classList.remove('visible')
}