/* Starlight Encounters (SFW)
   All characters are 25+; no explicit content. */

const characters = {
  sato: { id: 'sato', displayName: 'Ms. Sato (32)', color: '#f472b6', sprite: '' },
  aiko: { id: 'aiko', displayName: 'Dr. Aiko (29)', color: '#a78bfa', sprite: '' },
  narrator: { id: 'narrator', displayName: 'Narrator', color: '#93c5fd' },
};

const state = {
  currentNodeId: 'start',
  playerName: 'Player',
  flags: {},
};

const SAVE_KEY = 'starlight_encounters_save_v1';

const script = {
  start: {
    speaker: 'narrator',
    text: 'Late afternoon sun slips through the café windows. A quiet hum of conversation blends with the smell of roasted beans.',
    bg: '',
    sprite: '',
    choices: [
      { text: 'Order a latte at the counter', next: 'meetSato' },
      { text: 'Browse the little book corner', next: 'meetAiko' },
    ],
  },
  meetSato: {
    speaker: 'sato',
    text: 'Busy day? Take your time—good things brew slowly. I\'m Sato, I run this place.',
    bg: '',
    sprite: '',
    choices: [
      { text: 'Chat about coffee', next: 'satoChat' },
      { text: 'Head to the book corner', next: 'meetAiko' },
      { text: 'Back to the entrance', next: 'start' },
    ],
  },
  satoChat: {
    speaker: 'sato',
    text: 'There\'s a rhythm to a good day. Beans, water, and patience. What\'s your name?',
    input: { key: 'playerName', placeholder: 'Enter your name' },
    next: 'satoAfterName',
  },
  satoAfterName: {
    speaker: 'sato',
    text: () => `Nice to meet you, ${state.playerName}. If you\'re ever curious, I\'ll show you how to pull a perfect shot.`,
    choices: [
      { text: 'Ask about her café', next: 'satoCafe' },
      { text: 'Say thanks and look around', next: 'meetAiko' },
    ],
  },
  satoCafe: {
    speaker: 'sato',
    text: 'I opened it five years ago. It\'s small, but it\'s ours. People come here to slow down.',
    choices: [
      { text: 'Nod appreciatively', next: 'crossroad' },
    ],
  },
  meetAiko: {
    speaker: 'aiko',
    text: 'Oh—hi there. I\'m Aiko. I consult at the clinic down the street. Long day, but the tea here helps.',
    choices: [
      { text: 'Ask about her work', next: 'aikoWork' },
      { text: 'Return to the counter', next: 'meetSato' },
      { text: 'Back to the entrance', next: 'start' },
    ],
  },
  aikoWork: {
    speaker: 'aiko',
    text: 'Mostly community care and wellness programs. It\'s rewarding—quiet moments matter.',
    choices: [
      { text: 'Agree and share a small story', next: 'crossroad' },
    ],
  },
  crossroad: {
    speaker: 'narrator',
    text: 'The café settles into a comfortable hush. Evening lights flicker on outside.',
    choices: [
      { text: 'Spend more time with Ms. Sato', next: 'satoPath' },
      { text: 'Walk with Dr. Aiko to the bookstore', next: 'aikoPath' },
      { text: 'Call it a night', next: 'end' },
    ],
  },
  satoPath: {
    speaker: 'sato',
    text: 'I\'m closing soon. If you\'re free tomorrow, drop by. I\'ll save a seat by the window.',
    choices: [
      { text: 'Promise to visit', next: 'end' },
      { text: 'Thank her and step out', next: 'end' },
    ],
  },
  aikoPath: {
    speaker: 'aiko',
    text: 'The shop is quiet this hour. They have a poetry shelf—you might like it.',
    choices: [
      { text: 'Browse poems together', next: 'end' },
      { text: 'Say goodbye at the corner', next: 'end' },
    ],
  },
  end: {
    speaker: 'narrator',
    text: 'You step into the cool night air, pockets a bit warmer with new moments. Tomorrow feels promising.',
    choices: [
      { text: 'Restart', next: 'start' },
    ],
  },
};

function getElement(id) {
  return document.getElementById(id);
}

function setBackground(urlOrEmpty) {
  const bg = getElement('bg');
  if (urlOrEmpty) {
    bg.style.backgroundImage = `url("${urlOrEmpty}")`;
  } else {
    bg.style.backgroundImage = 'none';
  }
}

function showSprite(characterId, spriteUrl) {
  const layer = getElement('sprite-layer');
  layer.innerHTML = '';
  if (!characterId) return;
  const character = characters[characterId];
  if (!character) return;
  const url = spriteUrl || character.sprite;
  if (!url) return;
  const img = document.createElement('img');
  img.className = 'sprite';
  img.alt = character.displayName;
  img.src = url;
  layer.appendChild(img);
}

function setSpeaker(speakerId) {
  const nameEl = getElement('name');
  if (!speakerId || !characters[speakerId]) {
    nameEl.textContent = '';
    nameEl.style.color = '';
    return;
  }
  const c = characters[speakerId];
  nameEl.textContent = c.displayName;
  nameEl.style.color = c.color || '';
}

function setText(textOrFn) {
  const textEl = getElement('text');
  const text = typeof textOrFn === 'function' ? textOrFn() : textOrFn;
  textEl.textContent = text || '';
}

function clearChoices() {
  const choicesEl = getElement('choices');
  choicesEl.innerHTML = '';
}

function addChoice(label, nextId) {
  const choicesEl = getElement('choices');
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.onclick = () => goToNode(nextId);
  choicesEl.appendChild(btn);
}

function addInputPrompt(config, nextId) {
  const choicesEl = getElement('choices');
  const input = document.createElement('input');
  input.placeholder = (config && config.placeholder) || 'Type here';
  input.maxLength = 40;
  input.style.padding = '10px';
  input.style.borderRadius = '10px';
  input.style.border = '1px solid #3b4a66';
  input.style.background = '#0b1220';
  input.style.color = '#e2e8f0';
  const ok = document.createElement('button');
  ok.textContent = 'OK';
  ok.onclick = () => {
    const key = config && config.key ? config.key : 'input';
    state[key] = input.value.trim() || state[key] || '';
    goToNode(nextId);
  };
  choicesEl.appendChild(input);
  choicesEl.appendChild(ok);
  input.focus();
}

function goToNode(nodeId) {
  const node = script[nodeId];
  if (!node) {
    console.error('Unknown node:', nodeId);
    return;
  }
  state.currentNodeId = nodeId;
  // Presentation
  setSpeaker(node.speaker);
  setText(node.text);
  setBackground(node.bg || '');
  showSprite(node.speaker, node.sprite || '');
  clearChoices();

  // Input node
  if (node.input) {
    addInputPrompt(node.input, node.next);
    return;
  }

  // Choices
  const choices = node.choices || [];
  if (choices.length === 0) {
    addChoice('Continue', 'start');
    return;
  }
  for (const choice of choices) {
    addChoice(choice.text, choice.next);
  }
}

function saveGame() {
  const payload = JSON.stringify(state);
  localStorage.setItem(SAVE_KEY, payload);
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (typeof data === 'object' && data.currentNodeId && data.playerName) {
      Object.assign(state, data);
      return true;
    }
  } catch (_) {
    // ignore
  }
  return false;
}

function restart() {
  Object.assign(state, { currentNodeId: 'start', playerName: 'Player', flags: {} });
  goToNode('start');
}

function bindUi() {
  document.getElementById('btn-save').onclick = () => { saveGame(); };
  document.getElementById('btn-load').onclick = () => { if (loadGame()) goToNode(state.currentNodeId); };
  document.getElementById('btn-restart').onclick = () => { restart(); };
}

// Boot
bindUi();
goToNode(state.currentNodeId);