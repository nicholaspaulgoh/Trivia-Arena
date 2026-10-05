

# Trivia Arena

A Turn-Based Quiz Battle Experience with AI-Generated Characters

Human-Computer Interaction capstone project — a two-player, browser-based quiz battle game combining turn-based combat mechanics with knowledge-based gameplay.

**Student:** Nicholas Paul Goh Chang Yew 
**Project duration:** 11-week solo project, ~1 hour/day (~77 hours total)

---

## Executive Summary

Trivia Arena merges turn-based combat mechanics with the educational value of knowledge quizzes. Two players create personalized pixel-art characters generated from their own selfies via AI, choose 4 combat moves each, and battle in a Street Fighter–inspired arena. The core innovation is a **question-gated attack system**: every move must be earned by answering a general knowledge question under time pressure.

Three interlocking engagement mechanics drive the experience: a 25-second answer timer, a steal phase for wrong answers, and a streak system that rewards consecutive correct answers with a critical hit. A 3-minute battle clock adds urgency and ends in a dramatic sudden-death HP drain if no winner is decided in time.

Built entirely in plain HTML, CSS, and JavaScript — no frameworks, no server, no installation. Anyone with a browser and stable network connection can play.

### Sustainable Development Goals

- **SDG 4 — Quality Education:** Transforms passive knowledge recall into an active, consequence-driven interaction. The steal mechanic and streak system create intrinsic motivation to engage seriously with each question.
- **SDG 9 — Industry, Innovation and Infrastructure:** A novel interaction model combining gaming and education, including a creative application of AI-generated pixel art sprites.
- **SDG 10 — Reduced Inequalities:** Built entirely on free tools — Open Trivia DB, plain HTML/CSS/JS, free Vercel hosting. No paywalls, no downloads, no expensive hardware.

---

## Problem Statement

Two well-established categories of interactive software suffer from opposite engagement problems:

- **Educational quiz tools are passive.** A student answers a question, sees a result, and moves on. There are no stakes, no opponent, no tension. Engagement drops quickly and completion rates remain low.
- **Competitive games are highly engaging but educationally empty.** Games like Pokémon and Street Fighter reward reflex and strategy but teach nothing transferable beyond the game world.

Trivia Arena addresses both at once: by attaching a quiz mechanic to something players genuinely care about — defeating an opponent in battle — every question suddenly matters. A wrong answer doesn't just lose a point; it hands the opponent a steal opportunity. A streak of correct answers doesn't just feel satisfying; it charges a critical hit.

---

## Game Overview

A complete session has four phases:

1. **Character Creation** — Each player uploads a selfie. An AI model (Replicate API) generates a pixel-art sprite of them as a game character in Street Fighter style. The player enters their name and preferred gender for their character. Character data is saved to `localStorage`.
2. **Category Selection** — Each player picks exactly 1 category from a list of 11 (General Knowledge, Cybersecurity, Geography, History, Logic Puzzles, Mathematics, Movies & Music, Science, Sports, Tech & Programming, Anime & Games).
3. **Move Selection** — Each player picks exactly 4 combat moves from a catalogue, organised by type: assault, arcane, and guardian.
4. **Battle** — Players take turns attacking. Every attack is gated by a timed knowledge question. A 3-minute background timer adds urgency throughout.
5. **Resolution** — The player whose HP hits 0 first loses. If the 3-minute timer expires, sudden death drains both HP bars simultaneously. Equal HP at drain end results in a draw.

```
                        localStorage — data glue connecting all pages
        ┌───────────────────┬──────────────────────┬──────────────────┐
        ▼                   ▼                      ▼                  ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐  ┌───────────────┐
│ Character     │   │ Move          │      │ Battle        │  │ Win / Lose    │
│ Creation      │ ► │ Catalogue     │  ►   │ Screen        │► │ Screen        │
│ pages/index   │   │ pages/        │      │ pages/        │  │               │
│ .html         │   │ catalogue.html│      │ battle.html   │  │               │
└───────┬───────┘   └───────┬───────┘      └───────┬───────┘  └───────────────┘
        ▼                   ▼                      ▼
┌───────────────┐   ┌───────────────┐      ┌───────────────┐
│ AI Pixel Art  │   │ Question      │      │ 3-Min Timer   │
│ API           │   │ Engine        │      │               │
└───────────────┘   └───────────────┘      └───────────────┘
```

---

## The Question-Gated Attack System

The question mechanic is the primary HCI contribution of this project. Before every attack lands, the active player sees a multiple-choice question with a **25-second countdown**.

Outcome | Result 
**Correct** | The attack deals full damage. The active player's streak counter increments by 1. At 3 consecutive correct answers, the next attack  automatically deals 1.5× critical damage and the streak resets. 
**Wrong / Timeout** | No damage is dealt. The active player's streak resets to 0. A steal phase immediately activates — the opponent gets 5 seconds to answer the same question. Correct steal = +10% bonus stored for their next attack. Both fail = no damage, turn passes. 

The binary design (correct vs. wrong) was chosen deliberately over a partial-damage model. Two clean outcomes are easier to understand at a glance, produce clearer emotional feedback and are simpler to implement and balance correctly.

---

## The Streak System

Every correct answer in a row increments a visible counter above the active player's character. At 3 consecutive correct answers, a CRIT READY badge appears and the next attack deals 1.5× damage.

**Design rules:**
- Streak increments only on the active player's own correct answer.
- Streak resets to 0 only when the active player answers wrong or times out.
- A failed steal by the opponent does NOT reset the active player's streak.
- The streak counter is visible to both players at all times, creating mounting psychological pressure as it approaches 3.

---

## The 3-Minute Battle Timer & Sudden Death

A silent countdown runs from 3:00 throughout the entire battle, turning red and pulsing when 30 seconds remain. When it reaches zero:

- "TIME'S UP!" — a full-screen popup appears for 2 seconds.
- Both HP bars begin draining simultaneously at 5 HP per 200ms.
- The player whose HP hits 0 first loses. If both hit 0 on the same tick, the result is a draw.
- If a question is mid-answer when time expires, the current question resolves first — sudden death triggers immediately after the turn completes.

---

## HCI Design Principles & Justifications

| Mechanic | HCI Principle | Justification |

| Question timer (25s) | Feedback & Urgency | Immediate consequence for inaction. The countdown creates time pressure that elevates even easy questions into tense moments (Norman: feedback must be immediate and informative). |
| Steal phase | Engagement / Flow | The inactive player is never merely watching. Giving them a stake in every question sustains Flow state (Csikszentmihalyi) for both players simultaneously. |
| Streak counter | Variable Ratio Reinforcement | A counter visible to both players creates mounting tension. The reward (crit) is predictable in structure but uncertain in timing — the strongest engagement pattern in behavioural learning theory. |
| Binary outcome (correct/wrong) | Learnability & Clarity | Two clean outcomes are understood within one turn. Partial-damage systems require explanation. Simplicity reduces cognitive load (Miller's Law). |
| +10% steal bonus | Perceived Fairness | Small enough not to decide the game, large enough to feel meaningful. Gives the losing player a route back without breaking competitive balance. |
| AI-generated sprite | Personalisation & Identity | Players see themselves in the game. Named custom characters increase emotional investment and ownership of outcomes (Self-Determination Theory). |
| 3-minute battle timer | Pacing & Tension Design | Prevents stalling and guarantees every battle has a climax. Sudden death creates a shared dramatic peak both players experience simultaneously. |
| HP colour shift (green to red) | Progressive Disclosure | Critical information (low HP) is revealed at the moment it becomes relevant, reducing cognitive load while increasing situational awareness. |

---

## Tech Stack

| Category | Technology | What It's Used For |

| Version Control | Git & GitHub | Branching workflow, daily commits, pull requests, GitHub releases. |
| Code Editor | VS Code + Live Server | Live-preview HTML/CSS/JS, syntax highlighting, error detection. |
| Page Structure | HTML5 | Semantic elements, file input for photo uploads, multi-page navigation. |
| Styling & Animation | CSS3 | Flexbox & Grid layouts, CSS variables, `@keyframes` animations, HP bar transitions, responsive design. |
| Game Logic | JavaScript ES6+ | Variables, functions, arrays, objects, `Math.random()`, DOM manipulation, event listeners, `setInterval`/`setTimeout` for timers, state machine pattern. |
| Data Persistence | `localStorage` API | Saves and loads player data (name, sprite, moves, streak, bonus) across pages without a database or server. |
| Async Programming | `fetch()` + `async`/`await` | Calls to external APIs for sprite generation and question generation; graceful handling of loading states and errors. |
| AI Sprite Generation | Replicate API | Sends a base64-encoded user photo to a pixel-art AI model and displays the returned sprite. |
| Custom Questions | `questions.json` | Hardcoded question bank for offline mode, switchable via a single mode flag. |
| Audio | Web Audio API | Sound effects for every game event (hit, crit, correct, wrong, steal, victory, defeat) plus looping background music. |
| Testing & Debugging | Chrome DevTools | Console for JS errors, Network tab for API calls, Application tab for `localStorage`, device toolbar for mobile testing. |
| Input Hardware (optional) | Dual PS2 controllers via USB adapter | Optional dual-controller gameplay for an enhanced experience. |

---

## Project Timeline

11 weeks at 1 hour per day (~77 hours total). Each week has a fixed deadline and a clear deliverable.

| Week | Phase | Key Deliverable |
|---|---|---|
| 1 | Foundations | Dev environment, Git repo, static HTML/CSS battle card, JS fundamentals |
| 2 | Foundations | `fetch()` & `async`/`await`, `localStorage`, Flexbox & Grid layouts |
| 3 | Character Creation | File upload UI, Replicate AI sprite pipeline, two-player `localStorage` save |
| 4 | Move Catalogue | `moves.json`, catalogue grid UI, 4-move selection guard |
| 5 | Question Engine | `getQuestion()`, `questions.json` (30+), question overlay UI with timer |
| 6 | Question Mechanics | Streak counter (crit at 3), steal phase (+10% bonus), full question flow |
| 7 | Battle Engine | `calculateDamage()`, turn state machine, full battle screen UI, first playable build |
| 8 | Effects & Sound | CSS animation library, 9+ sound effects, HP colour shifts, feedback visuals |
| 9 | Polish | Entrance cinematics, win/lose screen, 3-min timer + sudden death, balance tuning |
| 10 | Testing & Deploy | Think-aloud user testing (3 testers), Vercel deployment, HCI report draft |
| 11 | Final Submission | Bug sweep, v1.0 GitHub release, complete HCI report, 5-min demo rehearsal |

---

## Risk Assessment & Contingency Plan

| Risk | Likelihood | Mitigation |

| Replicate API costs money or hits rate limits | Medium | Placeholder PNG sprite during development; limit real API calls; pre-generate and cache sprites if needed. |
| 3-minute timer fires mid-question | Low | Check a `suddenDeathActive` flag at turn start; finish the current question first, then trigger sudden death. |
| Streak/steal state desync | Medium | All game state lives in one `battleState` object in `battle.js`; UI layer never writes streak/bonus directly. |
| Two-player handoff confuses testers | Medium | Full-screen overlay between every turn; think-aloud testing in Week 10 specifically watches for handoff confusion. |
| Running out of time in Week 11 | Low | Entrance cinematic is the first thing to cut; core mechanics are scoped to Weeks 5–6 and 9 with buffer built in. |

---

## Getting Started

### Prerequisites
- Any modern web browser
- A Replicate API key for AI sprite generation (optional — a placeholder sprite can be used during development)

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd trivia-arena

# js/config.js is gitignored — create it locally with your own keys:
#   const CONFIG = { REPLICATE_API_KEY: '...', PROXY_URL: '...' }

# Open index.html directly, or serve with Live Server
```

### Playing

Open `index.html` using a live server (eg 'Live Server (Five Server)'  by Yannick) in a browser. Both players create characters, select a category, choose 4 moves, then battle on the same shared device, passing it between turns.

---

## Project Structure

```
trivia-arena/
├── index.html                  # Character creation (Player 1 and Player 2)
├── pages/
│   ├── catalogue.html          # Move selection
│   └── battle.html             # Battle screen
├── js/
│   ├── config.js                # Gitignored — API keys
│   ├── moves.js
│   ├── questions.js
│   ├── streak.js
│   ├── steal.js
│   └── battle.js
├── moves.json
├── questions.json
└── docs/
    ├── Trivia Arena Final Report.pdf
    ├── Demo Video
    
```

---

## Usability, UX, and Design Principle Goals

| Usability Goal | Achieved | UX Goal | Achieved | Design Principle | Achieved |

| Effectiveness | Y | Satisfying | Y | Visibility | Y |
| Efficiency | Y | Enjoyable | Y | Feedback | Y |
| Safety | Y | Helpful | Y | Constraints | Y |
| Utility | Y | Motivating | Y | Consistency | Y |
| Learnability | Y | Aesthetically pleasing | Y | Mapping | Y |
| Memorability | Y | Supportive of creativity | Y | Affordance | Y |
| | | Emotionally fulfilling | Y | | |

---

## Conclusion

Trivia Arena is a practical, buildable, and academically substantive HCI project for an audience of any age. It addresses a genuine engagement problem in quiz-based learning tools using established game design and HCI principles. Every mechanic — from the 25-second question timer to the steal phase to the sudden death drain — is a conscious interaction design decision that can be justified, evaluated through user testing and written about in a report.

---

## Acknowledgements

Developed as a solo Human-Computer Interaction capstone project. AI tools (ChatGPT, Claude) were used for information search/summarisation, content-creation support and image generation; the final submission reflects original work and understanding.
