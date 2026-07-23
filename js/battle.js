const battleState = {
  currentTurn: 'player1',  

  player1: {
    name: 'Alex',
    hp: 500,
    maxHP: 500,
    streak: 0,              
    critPending: false,      
    storedBonus: 0,          
    moves: []
  },

  player2: {
    name: 'Sam',
    hp: 500,
    maxHP: 500,
    streak: 0,
    critPending: false,
    storedBonus: 0,
    moves: []
  }
}

// ---------------------------------------------------------------------
// Task 18: Turn state machine + damage calculation
// Depends on streak.js (onCorrectAnswer, onWrongAnswer) and
// steal.js (resolveSteal, applyDamageModifiers) being loaded BEFORE this.
// ---------------------------------------------------------------------

const TURN_STATES = {
  TURN_START: 'TURN_START',
  MOVE_SELECT: 'MOVE_SELECT',
  QUESTION_ACTIVE: 'QUESTION_ACTIVE',
  STEAL_ACTIVE: 'STEAL_ACTIVE',
  STEAL_MOVE_SELECT: 'STEAL_MOVE_SELECT',
  DAMAGE_RESOLUTION: 'DAMAGE_RESOLUTION',
  TURN_END: 'TURN_END',
  BATTLE_END: 'BATTLE_END'
};

function rollAccuracy(move) {
  if (move.power >= 110) {
    return Math.random() < 0.9;
  }
  return true;
}

class BattleStateMachine {
  constructor(state, callbacks = {}) {
    this.state = state;
    this.callbacks = callbacks;
    this.currentState = TURN_STATES.TURN_START;
    this.activeMove = null;
  }

  _setState(newState, data = {}) {
    this.currentState = newState;
    if (this.callbacks.onStateChange) this.callbacks.onStateChange(newState, data);
  }

  _otherKey(key) {
    return key === 'player1' ? 'player2' : 'player1';
  }

  selectMove(move) {
    this.activeMove = move;
    this._setState(TURN_STATES.QUESTION_ACTIVE, { move });
  }

  resolveQuestion(wasCorrect, timedOut = false) {
    const activeKey = this.state.currentTurn;

    if (wasCorrect) {
      onCorrectAnswer(activeKey);
      this._resolveAttack(activeKey, this._otherKey(activeKey), this.activeMove);
    } else {
      onWrongAnswer(activeKey);
      this._setState(TURN_STATES.STEAL_ACTIVE, { move: this.activeMove });
    }
  }

  resolveStealAttempt(wasCorrect) {
    const activeKey = this.state.currentTurn;
    const stealerKey = this._otherKey(activeKey);

    resolveSteal(stealerKey, activeKey, wasCorrect); // steal.js

    if (wasCorrect) {
      this._setState(TURN_STATES.STEAL_MOVE_SELECT, { stealerKey });
    } else {
      this._setState(TURN_STATES.TURN_END);
      this._endTurn({ turnWasStolen: false });
    }
  }

  stealerSelectMove(move) {
    const activeKey = this.state.currentTurn;
    const stealerKey = this._otherKey(activeKey);
    this._resolveAttack(stealerKey, activeKey, move, { turnWasStolen: true });
  }

  _resolveAttack(attackerKey, defenderKey, move, endTurnOpts = {}) {
    const hit = rollAccuracy(move);

    if (!hit) {
      if (this.callbacks.onMiss) this.callbacks.onMiss(attackerKey);
      this._setState(TURN_STATES.DAMAGE_RESOLUTION, { damage: 0, hit: false });
      this._endTurn(endTurnOpts);
      return;
    }

    const result = applyDamageModifiers(attackerKey, move.power); // steal.js
    this.state[defenderKey].hp = Math.max(0, this.state[defenderKey].hp - result.damage);

    this._setState(TURN_STATES.DAMAGE_RESOLUTION, result);
    if (this.callbacks.onDamageDealt) {
      this.callbacks.onDamageDealt(attackerKey, defenderKey, result.damage, result.isCrit, result.bonusApplied);
    }
    this._endTurn(endTurnOpts);
  }

  _endTurn(opts = {}) {
    this._setState(TURN_STATES.TURN_END);

    const winner = this._checkWinCondition();
    if (winner !== undefined) {
      this._setState(TURN_STATES.BATTLE_END, { winner });
      if (this.callbacks.onBattleEnd) this.callbacks.onBattleEnd(winner);
      return;
    }

    if (!opts.turnWasStolen) {
      this.state.currentTurn = this._otherKey(this.state.currentTurn);
    }

    this.activeMove = null;
    this._setState(TURN_STATES.TURN_START);
  }

  _checkWinCondition() {
    const { player1, player2 } = this.state;
    if (player1.hp <= 0 && player2.hp <= 0) return null;
    if (player1.hp <= 0) return 'player2';
    if (player2.hp <= 0) return 'player1';
    return undefined;
  }

  forceSuddenDeath() {
    const { player1, player2 } = this.state;
    let winner;
    if (player1.hp === player2.hp) winner = null;
    else winner = player1.hp > player2.hp ? 'player1' : 'player2';

    this._setState(TURN_STATES.BATTLE_END, { winner });
    if (this.callbacks.onBattleEnd) this.callbacks.onBattleEnd(winner);
  }
}