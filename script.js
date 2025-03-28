// ---------------- Háttérzene kezelése HTML5 Audio-val, Playlist támogatással ----------------

// Az audio elem referenciája
const bgAudio = document.getElementById("bg-audio");

// Globális változók a háttérzenéhez
let currentPlaylist = [];   // Jelenlegi playlist (tömb)
let currentTrackIndex = 0;  // Jelenleg lejátszott track indexe

// A updateAudio függvény egy új "playlist"-et vár; ez lehet string (esetleg egyetlen szám),
// vagy tömb. Ha stringet adsz meg, azt átalakítjuk egyelemű tömbbé.
function updateAudio(newMusic) {
  // Ha nincs megadva zene (null vagy üres), akkor leállítjuk
  if (!newMusic) {
    bgAudio.pause();
    currentPlaylist = [];
    currentTrackIndex = 0;
    return;
  }
  
  // Ha newMusic nem tömb, akkor csomagoljuk be egyelemű tömbbe
  let newPlaylist = Array.isArray(newMusic) ? newMusic : [newMusic];
  
  // Ha a jelenlegi playlist megegyezik a kérttel, nem frissítünk (a zene folytatódik)
  if (JSON.stringify(currentPlaylist) === JSON.stringify(newPlaylist)) {
    return;
  }
  
  // Új playlist esetén:
  currentPlaylist = newPlaylist;
  currentTrackIndex = 0;
  bgAudio.src = currentPlaylist[currentTrackIndex];
  bgAudio.play();
}

// Ha a jelenlegi track véget ér, léptetjük a playlist-ben a következőre
bgAudio.addEventListener("ended", () => {
  if (currentPlaylist.length > 0) {
    currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    bgAudio.src = currentPlaylist[currentTrackIndex];
    bgAudio.play();
  }
});

// Kezdetben induljon a Reseblamblance.mp3
updateAudio("Resemblance.mp3");

// Hangerőszabályzó kezelése
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (event) => {
  const volume = event.target.value / 100; // 0.0 - 1.0
  bgAudio.volume = volume;
});

// ---------------- Interaktív Történet kezelése ----------------

// Globális állapot: inventory és karakterattribútumok
var state = {
  inventory: [],
  attributes: {
    batorsag: 0,
    bolcsesseg: 0
  }
};

// (Opcionális) Állapot kijelző frissítése
function updateStateDisplay() {
  // Ezt bővítheted, ha meg szeretnéd jeleníteni pl. az inventory-t
}

// Alkalmazza a hatásokat (inventory, attribútum módosítások)
function applyEffects(effects) {
  if (!effects) return;
  if (effects.inventory) {
    state.inventory.push(effects.inventory);
  }
  if (effects.attributes) {
    for (let attr in effects.attributes) {
      state.attributes[attr] = (state.attributes[attr] || 0) + effects.attributes[attr];
    }
  }
  updateStateDisplay();
}

// ---------------- Történet csomópontok ----------------

const stories = {
  kezdet: {
    title: "Az Ébredés",
    text: "Felébredsz egy elhagyatott kastélyban. Két ajtó áll előtted: az egyikből hideg szél és suttogások, a másikból meleg fény csalogat.",
    // A Reseblamblance.mp3 az alap, de ha csak egy számot adunk, azt egyelemű listává alakítjuk.
    music: "Resemblance.mp3",
    choices: [
      { text: "Kövesd a hideg szél útját (bal)", next: "arnyakTerme" },
      { text: "Lépj a meleg fény felé (jobb)", next: "tortenetekCsarnoka" }
    ]
  },
  arnyakTerme: {
    title: "Az Árnyak Terme",
    text: "Sötét fények és régi idézetek díszítik a falakat. Egy poros ládában megtalálod a Rejtett Kulcsot.",
    // Itt egy playlist-et adunk meg (például három szám, amelyek folyamatosan jönnek):
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
    // Itt is adhatunk egy playlist-et, akár 3 darabot:
    music: ["Forest.mp3"],
    choices: [
      { text: "Fedezd fel a festmények titkát", next: "festmenyek" },
      { text: "Lépj be egy díszített szobába", next: "dizottSzoba" }
    ]
  },
  titkosSzoba: {
    title: "A Titkos Szoba",
    text: "Régi könyvek és képek sorakoznak, egy sarokban halvány fény világít.",
    music: "titkosszoba.mp3", // Egyszerű egyetlen szám
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
    text: "Ősi szellemek jelennek meg, hogy útmutatást adjanak. Hangjuk egyszerre hordozza az igazságot és a reményt.",
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
    choices: []  // Végállomás – itt opcionálisan kínálhatsz Újrakezdést
  }
};

// ---------------- Eseménykezelés: Hover és Auto-select ----------------

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

// ---------------- A Történet megjelenítése ----------------

function showStory(key) {
  const story = stories[key];

  // Frissítjük a fejlécet
  document.getElementById('story-title').innerText = story.title;
  document.getElementById('story-text').innerText = story.text;

  // Frissítjük a háttérzenét: ha a csomópont rendelkezik "music" property-vel, akkor azzal frissítünk.
  updateAudio(story.music);

  // Ha vannak hatások (inventory, attribútumváltozás), alkalmazzuk azokat
  if (story.effects) {
    applyEffects(story.effects);
  }

  // Megkeressük a választási területet és ürítjük annak tartalmát
  const choicesContainer = document.getElementById('choices-container');
  choicesContainer.innerHTML = '';

  // Ha nincs választási lehetőség (végállomás), kínáljunk "Újrakezdés" opciót
  if (story.choices.length === 0) {
    const restartDiv = document.createElement('div');
    restartDiv.className = 'choice-option single';
    restartDiv.innerText = 'Újrakezdés';
    attachHoverAutoSelectHandlers(restartDiv, 'kezdet');
    choicesContainer.appendChild(restartDiv);
    return;
  }

  // Ha két választási lehetőség van, hozzunk létre egy bal és egy jobb opciót
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
    // Egyetlen választási lehetőség esetén
    const singleDiv = document.createElement('div');
    singleDiv.className = 'choice-option single';
    singleDiv.innerText = story.choices[0].text;
    singleDiv.onclick = () => showStory(story.choices[0].next);
    attachHoverAutoSelectHandlers(singleDiv, story.choices[0].next);
    choicesContainer.appendChild(singleDiv);
  } else {
    // Több, mint két opció esetén – gombok listája
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

// ---------------- A történet indítása ----------------

showStory('kezdet');
