// questions.js
// Change this one value to switch between live API and custom bank
// 'live'   = Open Trivia DB (needs internet)
// 'custom' = your own questions.json (works offline)
const QUESTION_MODE = 'live'

// Single source of truth for every category — both the trivia routing
// AND the category-select.html UI read from this object, so the card
// grid and the actual question source can never drift out of sync.
//
// otdbIds: real Open Trivia DB category IDs. If more than one is listed,
// a random one is picked each time (used for combined categories like
// Anime & Games). null means there's no matching OTDB category — these
// ALWAYS use the custom bank, regardless of QUESTION_MODE.
//
// ⚠️ cybersecurity and logic-puzzles have NO Open Trivia DB equivalent.
// They rely entirely on questions.json. Until you add real content for
// them there, every question in these two categories will be the
// hardcoded fallback question (see getCustomQuestion below).
//
// ⚠️ Your existing questions.json uses the OLD category keys (science,
// geography, technology, history — inherited from the move-type mapping).
// None of those match these 11 slugs. Relabel questions.json's "category"
// field to match these slugs, or the custom bank won't serve anything
// for ANY category until you do.
const CATEGORIES = {
  'general-knowledge': { label: 'General Knowledge',  icon: '💡', difficulty: 'Medium', desc: 'Test your overall knowledge!',        otdbIds: [9] },
  'science':            { label: 'Science',            icon: '🧪', difficulty: 'Medium', desc: 'From biology to space and beyond!',   otdbIds: [17] },
  'math':               { label: 'Math',                icon: '➗', difficulty: 'Hard',   desc: 'Numbers, equations and logic!',       otdbIds: [19] },
  'history':            { label: 'History',             icon: '🏛️', difficulty: 'Medium', desc: 'Explore the past and civilizations!', otdbIds: [23] },
  'geography':          { label: 'Geography',           icon: '🌍', difficulty: 'Easy',   desc: 'Countries, capitals and landmarks!',  otdbIds: [22] },
  'tech-programming':   { label: 'Tech & Programming',  icon: '💻', difficulty: 'Hard',   desc: 'Code, tech and the digital world!',   otdbIds: [18] },
  'cybersecurity':      { label: 'Cybersecurity',       icon: '🛡️', difficulty: 'Hard',   desc: 'Hack the knowledge. Secure the win.', otdbIds: null },
  'anime-games':        { label: 'Anime & Games',       icon: '🎮', difficulty: 'Medium', desc: 'Anime, games and pop culture!',       otdbIds: [15, 31] },
  'movies-music':       { label: 'Movies & Music',      icon: '🎬', difficulty: 'Easy',   desc: 'Film, songs and entertainment!',      otdbIds: [11, 12] },
  'sports':              { label: 'Sports',              icon: '⚽', difficulty: 'Medium', desc: 'Scores, players and sports legends!', otdbIds: [21] },
  'logic-puzzles':       { label: 'Logic Puzzles',       icon: '🧩', difficulty: 'Hard',   desc: 'Riddles, patterns and brain teasers!', otdbIds: null }
}

// category is now one of the CATEGORIES keys above — chosen directly by
// the player on category-select.html, no longer derived from move type.
async function getQuestion(category) {
  const cfg = CATEGORIES[category]
  if (!cfg) {
    console.error('Unknown category:', category)
    return await getCustomQuestion(category)
  }

  if (QUESTION_MODE === 'live' && cfg.otdbIds) {
    return await getTriviaQuestion(category, cfg)
  }

  return await getCustomQuestion(category)
} // end getQuestion

async function getCustomQuestion(category) {
  try {
    const response = await fetch('../questions.json')

    if (!response.ok) {
      throw new Error('Failed to load questions')
    }
    const data = await response.json()

    const questions = data.questions

    const filtered = questions.filter(q => q.category === category)

    if (filtered.length === 0) {
      throw new Error('No questions found for category: ' + category)
    }

    const random = Math.floor(Math.random() * filtered.length)
    return filtered[random]
  } catch (error) {
    console.error('Error loading questions:', error)

    // Fallback question — shown when a category has no live or custom
    // source available (currently: cybersecurity, logic-puzzles, or any
    // category if the custom bank hasn't been relabeled yet)
    return {
      text: 'What does HTML stand for?',
      category: 'tech-programming',
      options: ['A: HyperText Markup Language', 'B: High Transfer Markup Language', 'C: HyperText Media Language', 'D: Home Tool Markup Language'],
      correct: 'A'
    }
  }
} // end getCustomQuestion

async function getTriviaQuestion(category, cfg) {
  try {
    const categoryId = cfg.otdbIds[Math.floor(Math.random() * cfg.otdbIds.length)]
    const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`)

    if (!response.ok) {
      throw new Error('Failed to fetch trivia question')
    }
    const data = await response.json()

    if (data.response_code !== 0 || data.results.length === 0) {
      throw new Error('No questions returned from API')
    }

    const raw = data.results[0]

    const allAnswers = [...raw.incorrect_answers, raw.correct_answer].map(decodeHTML)
    const shuffled = shuffleArray(allAnswers)

    const labels = ['A', 'B', 'C', 'D']
    const options = shuffled.map((ans, i) => `${labels[i]} : ${ans}`)

    const correctIndex = shuffled.findIndex(ans => decodeHTML(ans.trim()) === decodeHTML(raw.correct_answer.trim()))
    if (correctIndex === -1) {
      throw new Error('Correct answer not found in options')
    }

    const correct = labels[correctIndex]

    return {
      text:     decodeHTML(raw.question),
      options:  options,
      correct:  correct,
      category: category
    }
  } catch (error) {
    console.warn('Live question failed, falling back to custom:', error.message)
    // Always fall back to custom if live fails
    return await getCustomQuestion(category)
  }
} // end getTriviaQuestion

function shuffleArray(array) {
  const arry = [...array]

  // Fisher-Yates Shuffle
  for (let i = arry.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arry[i], arry[j]] = [arry[j], arry[i]]
  }
  return arry
} // end shuffleArray

function decodeHTML(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
} // end decodeHTML