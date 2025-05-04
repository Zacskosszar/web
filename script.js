const bgAudio = document.getElementById("bg-audio");

let currentPlaylist = [];   
let currentTrackIndex = ;


function updateAudio(newMusic) {
  if (!newMusic) {
    bgAudio.pause();
    currentPlaylist = [];
    currentTrackIndex = ;
    return;
  }
  
  let newPlaylist = Array.isArray(newMusic) ? newMusic : [newMusic];
  
  if (JSON.stringify(currentPlaylist) === JSON.stringify(newPlaylist)) {
    return;
  }
  
  currentPlaylist = newPlaylist;
  currentTrackIndex = ;
  bgAudio.src = currentPlaylist[currentTrackIndex];
  bgAudio.play();
}

bgAudio.addEventListener("ended", () => {
  if (currentPlaylist.length > ) {
    currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    bgAudio.src = currentPlaylist[currentTrackIndex];
    bgAudio.play();
  }
});

updateAudio("Resemblance.mp3");

const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (event) => {
  const volume = event.target.value / 100;
  bgAudio.volume = volume;
});

var state = {
  inventory: [],
  attributes: {
    batorsag: ,
    bolcsesseg: 
  }
};

function updateStateDisplay() {
}

function applyEffects(effects) {
  if (!effects) return;
  if (effects.inventory) {
    state.inventory.push(effects.inventory);
  }
  if (effects.attributes) {
    for (let attr in effects.attributes) {
      state.attributes[attr] = (state.attributes[attr] || ) + effects.attributes[attr];
    }
  }
  updateStateDisplay();
}

const stories = {
  kezdet: {
    title: "Az Ébredés",
    text: "Felébredsz egy elhagyatott kastélyban. Két ajtó áll előtted: az egyikből hideg szél és suttogások, a másikból meleg fény csalogat.",
    music: "Resemblance.mp3",
    choices: [
      { text: "Kövesd a hideg szél útját (bal)", next: "arnyakTerme" },
      { text: "Lépj a meleg fény felé (jobb)", next: "tortenetekCsarnoka" }
    ]
  },
  arnyakTerme: {
    title: "Az Árnyak Terme",
    text: "Sötét fények és régi idézetek díszítik a falakat. Egy poros ládában megtalálod a Rejtett Kulcsot.",
    music: ["Archangel.mp3", "Strenghtof.mp3"],
    effects: {
      inventory: "Rejtett Kulcs"
    },
    choices: [
      { text: "Használd a kulcsot, és nyisd meg a titkos ajtót", next: "titkosSzoba" },
      { text: "Maradj a szobában, és kutass tovább", next: "idozottSors" }
    ]
  },
  tortenetekCsarnoka: {
    title: "A Történetek Csarnoka",
    text: "Egy világos csarnok, régi festmények és emléktárgyak tárulnak eléd.",
    music: ["Forest.mp3"],
    choices: [
      { text: "Fedezd fel a festmények titkát", next: "festmenyek" },
      { text: "Lépj be egy díszített szobába", next: "dizottSzoba" }
    ]
  },
  titkosSzoba: {
    title: "A Titkos Szoba",
    text: "Régi könyvek és képek sorakoznak, egy sarokban halvány fény világít.",
    music: "titkosszoba.mp3",
    choices: [
      { text: "Nyisd ki a fény mögötti ajtót", next: "varazsKert" },
      { text: "Olvasd el a poros naplót", next: "naplo" }
    ]
  },
  varazsKert: {
    title: "A Varázs Kertje",
    text: "Mesés kert, ragyogó virágok, és lebegő fények – a mágia életre kel.",
    music: "Forest.mp3",
    effects: {
      attributes: { bolcsesseg: 1 }
    },
    choices: [
      { text: "Csodáld a kert csodáit", next: "kertElet" },
      { text: "Keress titkokat a kert mélyén", next: "titkokForrasa" }
    ]
  },
  naplo: {
    title: "Az Elveszett Napló",
    text: "A napló lapjain tragikus sorsok és titkok elevenednek meg.",
    effects: {
      attributes: { bolcsesseg: 1 }
    },
    music: "isolated.mp3",
    choices: [
      { text: "Kövesd a napló utasításait", next: "titkokForrasa" },
      { text: "Térj vissza az Árnyak Termébe", next: "arnyakTerme" }
    ]
  },
  idozottSors: {
    title: "Időzött Sors",
    text: "Az idő kereke pörg, sorsod most változik.",
    music: null,
    choices: [
      { text: "Kezdd újra", next: "kezdet" }
    ]
  },
  festmenyek: {
    title: "A Festmények Titka",
    text: "A festmények mély érzelmeket hordoznak, mintha a múlt titkai suttognának bennük.",
    music: null,
    choices: [
      { text: "Térj vissza a Csarnokhoz", next: "tortenetekCsarnoka" }
    ]
  },
  dizottSzoba: {
    title: "A Díszített Szoba",
    text: "Pompás berendezés és antik tárgyak mesélik el a kastély titkait.",
    music: null,
    choices: [
      { text: "Térj vissza a Csarnokhoz", next: "tortenetekCsarnoka" }
    ]
  },
  kertElet: {
    title: "A Kert Élete",
    text: "A kert minden virága egy-egy történetet mesél, miközben az élet színei benned is újraélednek.",
    effects: {
      attributes: { batorsag: 1 },
      inventory: "Virágos Medál"
    },
    music: null,
    choices: [
      { text: "Maradj itt, hogy megismerd a titkokat", next: "ujSors" },
      { text: "Indulj vissza a kastélyba", next: "kezdet" }
    ]
  },
  titkokForrasa: {
    title: "A Titkok Forrása",
    text: "A kastély mélyén ősi erő rejtőzik, mely megváltoztathatja a sorsodat.",
    effects: {
      attributes: { batorsag: 1 }
    },
    music: null,
    choices: [
      { text: "Fogadd el az erőt", next: "ujSors" },
      { text: "Menekülj", next: "menekules" }
    ]
  },
  menekules: {
    title: "Menekülés",
    text: "Úgy döntesz, nem fogadod el a sorsodat. Elhagyod a kastélyt, ám titkaid még követnek.",
    effects: {
      attributes: { batorsag: -1 }
    },
    music: null,
    choices: [
      { text: "Keress segítséget", next: "kihivasok" },
      { text: "Térj vissza a kastélyhoz", next: "kezdet" }
    ]
  },
  kihivasok: {
    title: "A Kihívások Útja",
    text: "Életed próbatételei tárulnak eléd, felfedezve belső erődet.",
    effects: {
      attributes: { batorsag: 1 }
    },
    music: null,
    choices: [
      { text: "Folytasd bátran az utadat", next: "vegsoMehetoseg" },
      { text: "Kérj útmutatást az ősi szellemektől", next: "szellemek" }
    ]
  },
  szellemek: {
    title: "Szellemek Üzenete",
    text: "Ősi szellemek jelennek meg, hogy útmutatást adjanak. Hangjuk egyszerre hordozja az igazságot és a reményt.",
    effects: {
      attributes: { bolcsesseg: 1 }
    },
    music: null,
    choices: [
      { text: "Hallgasd meg üzenetüket", next: "ujSors" },
      { text: "Folytasd egyedül", next: "kihivasok" }
    ]
  },
  ujSors: {
    title: "Új Sors",
    text: "Az ősi erő befogadása után a kastély falai életre kelnek. Útad kihívásokkal teli, de belső hited vezet.",
    effects: {
      attributes: { batorsag: 1, bolcsesseg: 1 }
    },
    music: null,
    choices: [
      { text: "Készülj a következő próbatételekre", next: "kihivasok" },
      { text: "Pihenj, és engedd át magad az erőnek", next: "kertElet" }
    ]
  },
  vegsoMehetoseg: {
    title: "Végső Döntés",
    text: "Elérkeztél az utolsó próbatételhez. A kastély titkai a kezedben vannak.",
    music: null,
    choices: [
      { text: "Elfogadom a sorsomat", next: "vegsoVege" },
      { text: "Új utakat keresek", next: "menekules" }
    ]
  },
  vegsoVege: {
    title: "A Megváltás Ösvénye",
    text: "A kastély titkai feltárultak, életed új irányt kapott. Köszönjük, hogy kalandoztál!",
    music: null,
    choices: [] 
  }
};

function attachHoverAutoSelectHandlers(element, nextKey) {
  element.addEventListener('mouseenter', function () {
    const siblings = element.parentNode.querySelectorAll('.choice-option');
    siblings.forEach(sib => {
      if (sib !== element) {
        sib.classList.add('dimmed');
      }
    });
    element.classList.add('hovered');
    element.autoSelectTimer = setTimeout(function () {
      showStory(nextKey);
    }, 2000);
  });
  element.addEventListener('mouseleave', function () {
    clearTimeout(element.autoSelectTimer);
    element.autoSelectTimer = null;
    const siblings = element.parentNode.querySelectorAll('.choice-option');
    siblings.forEach(sib => {
      if (sib !== element) {
        sib.classList.remove('dimmed');
      }
    });
    element.classList.remove('hovered');
  });
}

function showStory(key) {
  const story = stories[key];

  document.getElementById('story-title').innerText = story.title;
  document.getElementById('story-text').innerText = story.text;

  updateAudio(story.music);

  if (story.effects) {
    applyEffects(story.effects);
  }

  const choicesContainer = document.getElementById('choices-container');
  choicesContainer.innerHTML = '';

  if (story.choices.length === ) {
    const restartDiv = document.createElement('div');
    restartDiv.className = 'choice-option single';
    restartDiv.innerText = 'Újrakezdés';
    attachHoverAutoSelectHandlers(restartDiv, 'kezdet');
    choicesContainer.appendChild(restartDiv);
    return;
  }

  if (story.choices.length === 2) {
    const leftDiv = document.createElement('div');
    leftDiv.className = 'choice-option left';
    leftDiv.innerText = story.choices[0].text;
    leftDiv.onclick = () => showStory(story.choices[0].next);
    attachHoverAutoSelectHandlers(leftDiv, story.choices[0].next);

    const rightDiv = document.createElement('div');
    rightDiv.className = 'choice-option right';
    rightDiv.innerText = story.choices[1].text;
    rightDiv.onclick = () => showStory(story.choices[1].next);
    attachHoverAutoSelectHandlers(rightDiv, story.choices[1].next);

    choicesContainer.appendChild(leftDiv);
    choicesContainer.appendChild(rightDiv);
  } else if (story.choices.length === 1) {
    const singleDiv = document.createElement('div');
    singleDiv.className = 'choice-option single';
    singleDiv.innerText = story.choices[0].text;
    singleDiv.onclick = () => showStory(story.choices[0].next);
    attachHoverAutoSelectHandlers(singleDiv, story.choices[0].next);
    choicesContainer.appendChild(singleDiv);
  } else {
    story.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-option';
      btn.innerText = choice.text;
      btn.onclick = () => showStory(choice.next);
      attachHoverAutoSelectHandlers(btn, choice.next);
      choicesContainer.appendChild(btn);
    });
  }
}

showStory('kezdet');
