/* ===========================
   VAR Challenge
   script.js – stabile Version
=========================== */

let currentScene = null;
let sceneQueue = [];

let score = 0;
let xp = 0;
let level = 1;

let correctAnswers = 0;
let wrongAnswers = 0;
let currentStreak = 0;
let bestStreak = 0;
let cachedAdminData = null;

const PLAYER_SAVE_KEY = "varChallengePlayerSave";
const ANALYTICS_KEY = "varChallengeAnalytics";

const splashScreen = document.getElementById("splashScreen");
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const leagueName = document.getElementById("leagueName");
const matchMinute = document.getElementById("matchMinute");
const scoreElement = document.getElementById("score");

const sceneTitle = document.getElementById("sceneTitle");
const sceneDescription = document.getElementById("sceneDescription");
const answerButtons = document.getElementById("answerButtons");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

window.addEventListener("load", () => {
  trackVisit();
  loadPlayerProgress();
  initAccountSystem();
  updatePlayerUI();
  updateAccountMenuUI();
  updateProjectStatusBar();
  showScreen("splashScreen");

  setTimeout(() => {
    showScreen("menuScreen");
  }, 1200);
});



/* ===========================
   Lokale Spiel-Statistiken
   Hinweis: GitHub Pages speichert diese Werte pro Browser/Gerät.
=========================== */

function getDefaultAnalytics() {
  return {
    visits: 0,
    gamesStarted: 0,
    gamesFinished: 0,
    scenesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    lastVisit: "",
    lastGameStarted: "",
    lastGameFinished: "",
    updatedAt: ""
  };
}

function loadAnalytics() {
  const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
  if (!savedAnalytics) return getDefaultAnalytics();

  try {
    return {
      ...getDefaultAnalytics(),
      ...JSON.parse(savedAnalytics)
    };
  } catch (error) {
    console.warn("Statistiken konnten nicht geladen werden:", error);
    return getDefaultAnalytics();
  }
}

function saveAnalytics(analytics) {
  analytics.updatedAt = new Date().toISOString();
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

function trackVisit() {
  const analytics = loadAnalytics();
  analytics.visits += 1;
  analytics.lastVisit = new Date().toISOString();
  saveAnalytics(analytics);
}

function trackGameStarted() {
  const analytics = loadAnalytics();
  analytics.gamesStarted += 1;
  analytics.lastGameStarted = new Date().toISOString();
  saveAnalytics(analytics);
}

function trackScenePlayed(isCorrect) {
  const analytics = loadAnalytics();
  analytics.scenesPlayed += 1;

  if (isCorrect) {
    analytics.correctAnswers += 1;
  } else {
    analytics.wrongAnswers += 1;
  }

  saveAnalytics(analytics);
}

function trackGameFinished() {
  const analytics = loadAnalytics();
  analytics.gamesFinished += 1;
  analytics.lastGameFinished = new Date().toISOString();
  saveAnalytics(analytics);
}

function resetAnalytics() {
  if (!confirm("Lokale Statistiken wirklich zurücksetzen?")) return;
  localStorage.removeItem(ANALYTICS_KEY);
  alert("Lokale Statistiken wurden zurückgesetzt.");
}

/* ===========================
   Projektstatus im Hauptmenü
=========================== */

function updateProjectStatusBar() {
  const savedAdminData = localStorage.getItem("varChallengeAdminData");

  let settings = {
    version: "Alpha 0.2",
    edition: "Frauen Edition",
    status: "In Entwicklung",
    nextUpdate: "0.3 Beta",
    progress: 18
  };

  if (savedAdminData) {
    try {
      const adminData = JSON.parse(savedAdminData);
      settings = {
        ...settings,
        ...(adminData.settings || {})
      };
    } catch (error) {
      console.warn("Projektstatus konnte nicht geladen werden:", error);
    }
  }

  const progressValue = Number(settings.progress || settings.projectProgress || 18);
  const safeProgress = Math.max(0, Math.min(100, progressValue));

  const versionElement = document.getElementById("menuProjectVersion");
  const statusElement = document.getElementById("menuProjectStatus");
  const progressText = document.getElementById("menuProjectProgressText");
  const progressFill = document.getElementById("menuProjectProgressFill");
  const nextUpdateElement = document.getElementById("menuProjectNextUpdate");
  const editionElement = document.getElementById("menuProjectEdition");

  if (editionElement) editionElement.textContent = settings.edition || "Frauen Edition";
  if (versionElement) versionElement.textContent = settings.version || "Alpha 0.2";
  if (statusElement) statusElement.textContent = getStatusIcon(settings.status) + " " + (settings.status || "In Entwicklung");
  if (progressText) progressText.textContent = safeProgress + "%";
  if (progressFill) progressFill.style.width = safeProgress + "%";
  if (nextUpdateElement) nextUpdateElement.textContent = settings.nextUpdate || "0.3 Beta";
}

function getStatusIcon(status) {
  if (!status) return "🟢";

  const value = status.toLowerCase();

  if (value.includes("pause")) return "🟡";
  if (value.includes("fehler") || value.includes("kritisch")) return "🔴";
  if (value.includes("beta")) return "🔵";
  if (value.includes("release")) return "🟣";

  return "🟢";
}

/* ===========================
   Spiel starten
=========================== */

function startGame() {
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  currentStreak = 0;
  bestStreak = 0;

  const availableScenes = getActiveScenes();

  if (!availableScenes || availableScenes.length === 0) {
    alert("Keine aktiven Szenen vorhanden. Prüfe data/scenes.js oder Admin Center.");
    return;
  }

  sceneQueue = shuffleScenes(availableScenes);

  trackGameStarted();
  updateScoreUI();

  showScreen("gameScreen");
  loadNextScene();
}

/* ===========================
   Szenen
=========================== */

function loadGameScenes() {
  const adminScenes = getAdminScenesFromStorage();

  if (adminScenes && adminScenes.length > 0) {
    return adminScenes;
  }

  if (typeof scenes !== "undefined" && Array.isArray(scenes)) {
    return scenes;
  }

  return [];
}

function getAdminScenesFromStorage() {
  const savedAdminData = localStorage.getItem("varChallengeAdminData");

  if (!savedAdminData) return null;

  try {
    const adminData = JSON.parse(savedAdminData);

    if (!adminData.scenes || !Array.isArray(adminData.scenes)) {
      return null;
    }

    return adminData.scenes;
  } catch (error) {
    console.error("Admin-Szenen konnten nicht geladen werden:", error);
    return null;
  }
}

function getActiveScenes() {
  const gameScenes = loadGameScenes();

  return gameScenes.filter((scene) => {
    if (!scene) return false;
    if (scene.active === false) return false;
    if (!Array.isArray(scene.options)) return false;
    if (scene.options.length === 0) return false;
    if (!scene.correct) return false;
    return true;
  });
}

function shuffleScenes(sceneArray) {
  const shuffled = [...sceneArray];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

function loadNextScene() {
  hideResultBox();
  clearAnswerButtons();

  if (sceneQueue.length === 0) {
    endGame();
    return;
  }

  currentScene = sceneQueue.shift();
  renderScene(currentScene);
}

function renderScene(scene) {
  if (!scene) return;

  leagueName.textContent = scene.league || "Unbekannte Liga";
  matchMinute.textContent = scene.minute || "00:00";
  sceneTitle.textContent = scene.title || "Unbenannte Szene";
  sceneDescription.textContent = scene.description || "";

  renderSceneMedia(scene);
  renderAnswerButtons(scene);
}

function renderSceneMedia(scene) {
  const sceneImage = document.getElementById("sceneImage");
  const sceneVideo = document.getElementById("sceneVideo");
  const monitorPlaceholder = document.getElementById("monitorPlaceholder");

  if (!sceneImage || !sceneVideo || !monitorPlaceholder) return;

  sceneImage.classList.add("hidden");
  sceneVideo.classList.add("hidden");
  monitorPlaceholder.classList.remove("hidden");

  sceneImage.removeAttribute("src");
  sceneVideo.removeAttribute("src");

  if (scene.video) {
    sceneVideo.src = scene.video;
    sceneVideo.classList.remove("hidden");
    monitorPlaceholder.classList.add("hidden");
    return;
  }

  if (scene.image) {
    sceneImage.src = scene.image;
    sceneImage.classList.remove("hidden");
    monitorPlaceholder.classList.add("hidden");
  }
}

function renderAnswerButtons(scene) {
  clearAnswerButtons();

  scene.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answerBtn";
    button.textContent = option;
    button.onclick = () => checkAnswer(option);

    answerButtons.appendChild(button);
  });
}

/* ===========================
   Antworten
=========================== */

function checkAnswer(selectedAnswer) {
  if (!currentScene) return;

  const buttons = document.querySelectorAll(".answerBtn");

  buttons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === currentScene.correct) {
      button.classList.add("correct");
    }

    if (
      button.textContent === selectedAnswer &&
      selectedAnswer !== currentScene.correct
    ) {
      button.classList.add("wrong");
    }
  });

  const isCorrect = selectedAnswer === currentScene.correct;
  trackScenePlayed(isCorrect);

  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer(selectedAnswer);
  }

  updateScoreUI();
  savePlayerProgress();
  showResultBox();
}

function handleCorrectAnswer() {
  correctAnswers++;
  currentStreak++;

  bestStreak = Math.max(bestStreak, currentStreak);

  const gainedScore = getSceneScore(currentScene);
  const gainedXp = getSceneXp(currentScene);

  score += gainedScore;
  xp += gainedXp;
  level = calculateLevel(xp);

  resultTitle.textContent = "✅ Richtige Entscheidung";
  resultText.innerText =
    `${currentScene.explanation}\n\n+${gainedScore} Punkte · +${gainedXp} XP`;
}

function handleWrongAnswer(selectedAnswer) {
  wrongAnswers++;
  currentStreak = 0;

  score -= 50;
  if (score < 0) score = 0;

  resultTitle.textContent = "❌ Falsche Entscheidung";
  resultText.innerText =
    `Deine Entscheidung: ${selectedAnswer}\n` +
    `Richtig wäre: ${currentScene.correct}\n\n` +
    currentScene.explanation;
}

function nextScene() {
  loadNextScene();
}

/* ===========================
   Punkte / XP
=========================== */

function getSceneScore(scene) {
  const difficulty = scene.difficulty || "Normal";

  if (difficulty === "Leicht") return 50;
  if (difficulty === "Normal") return 100;
  if (difficulty === "Schwer") return 200;
  if (difficulty === "Elite") return 500;

  return 100;
}

function getSceneXp(scene) {
  const difficulty = scene.difficulty || "Normal";

  if (difficulty === "Leicht") return 25;
  if (difficulty === "Normal") return 50;
  if (difficulty === "Schwer") return 100;
  if (difficulty === "Elite") return 250;

  return 50;
}

function calculateLevel(totalXp) {
  return Math.floor(totalXp / 1000) + 1;
}

/* ===========================
   Spielende
=========================== */

function endGame() {
  clearAnswerButtons();

  sceneTitle.textContent = "Spiel beendet";
  sceneDescription.textContent =
    "Alle Szenen wurden geprüft. Deine finale Auswertung steht bereit.";

  resultTitle.textContent = "VAR-Auswertung";
  resultText.innerText = getFinalSummary();

  showResultBox();
  trackGameFinished();
  savePlayerProgress();
}

function getFinalSummary() {
  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    `Punkte: ${score}\n` +
    `XP gesamt: ${xp}\n` +
    `Level: ${level}\n\n` +
    `Richtige Entscheidungen: ${correctAnswers}\n` +
    `Falsche Entscheidungen: ${wrongAnswers}\n` +
    `Trefferquote: ${accuracy}%\n` +
    `Beste Serie: ${bestStreak}\n\n` +
    getFinalRating(score, accuracy)
  );
}

function getFinalRating(finalScore, accuracy) {
  if (accuracy >= 90 && finalScore >= 1000) {
    return "FIFA-Elite. Sehr starke Leistung im VAR-Raum.";
  }

  if (accuracy >= 75) {
    return "Bundesliga-Niveau. Gute Entscheidungen mit kleinen Unsicherheiten.";
  }

  if (accuracy >= 55) {
    return "Regionalliga-Niveau. Solide, aber noch ausbaufähig.";
  }

  return "Kreisliga-Niveau. Da müssen wir nochmal in die Schulung.";
}

/* ===========================
   Speicherstand
=========================== */

function loadPlayerProgress() {
  const savedProgress = localStorage.getItem(PLAYER_SAVE_KEY);

  if (!savedProgress) {
    xp = 0;
    level = 1;
    return;
  }

  try {
    const data = JSON.parse(savedProgress);
    xp = data.xp || 0;
    level = data.level || calculateLevel(xp);
  } catch {
    xp = 0;
    level = 1;
  }
}

function savePlayerProgress() {
  const saveData = {
    xp,
    level,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(PLAYER_SAVE_KEY, JSON.stringify(saveData));
  syncAccountProgress();
}

/* ===========================
   UI Helfer
=========================== */

function updateScoreUI() {
  if (scoreElement) {
    scoreElement.textContent = score;
  }

  updatePlayerUI();
}

function clearAnswerButtons() {
  if (answerButtons) {
    answerButtons.innerHTML = "";
  }
}

function hideResultBox() {
  if (resultBox) {
    resultBox.classList.add("hidden");
  }
}

function showResultBox() {
  if (resultBox) {
    resultBox.classList.remove("hidden");
  }
}

function backToMenu() {
  showScreen("menuScreen");
}


function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }

  if (screenId === "placepassScreen") {
    renderPlacepass();
  }

  if (screenId === "newsScreen") {
    renderNewsCenter("all");
  }

  if (screenId === "supportScreen") {
    renderSupportCenter();
  }

  if (screenId === "registerScreen") {
    populateFavoriteClubSelect("registerFavoriteClub");
  }

  if (screenId === "profileScreen") {
    renderProfileScreen();
  }
}

function updatePlayerUI() {
  const playerLevel = document.getElementById("playerLevel");
  const playerXP = document.getElementById("playerXP");
  const careerLevel = document.getElementById("careerLevel");
  const careerXP = document.getElementById("careerXP");
  const highscoreXP = document.getElementById("highscoreXP");
  const highscoreLevel = document.getElementById("highscoreLevel");
  const highscoreTitle = document.getElementById("highscoreTitle");

  if (playerLevel) playerLevel.textContent = level;
  if (playerXP) playerXP.textContent = xp;
  if (careerLevel) careerLevel.textContent = level;
  if (careerXP) careerXP.textContent = xp;
  if (highscoreXP) highscoreXP.textContent = xp;
  if (highscoreLevel) highscoreLevel.textContent = level;
  if (highscoreTitle) highscoreTitle.textContent = getPlayerTitle();
}

function resetPlayerProgress() {
  const confirmReset = confirm("Spielstand wirklich zurücksetzen?");

  if (!confirmReset) return;

  localStorage.removeItem(PLAYER_SAVE_KEY);

  score = 0;
  xp = 0;
  level = 1;
  correctAnswers = 0;
  wrongAnswers = 0;
  currentStreak = 0;
  bestStreak = 0;

  updateScoreUI();
  alert("Spielstand wurde zurückgesetzt.");
}

function getPlayerTitle() {
  if (level >= 75) return "FIFA Elite VAR";
  if (level >= 50) return "UEFA Elite VAR";
  if (level >= 30) return "Bundesliga-VAR";
  if (level >= 20) return "Profi-Schiedsrichter";
  if (level >= 10) return "Regionalliga-Schiedsrichter";
  if (level >= 5) return "Bezirks-Schiedsrichter";

  return "Schiedsrichter-Anwärter";
}


/* ===========================
   Platzpass
=========================== */

const DEFAULT_PLACEPASS = {
  seasonName: "Platzpass Saison 1",
  theme: "Bundesliga 2026/27",
  maxLevel: 100,
  currentLevel: 0,
  progress: 0,
  timeLeft: "Noch 74 Tage verfügbar",
  description: "Mit dem Platzpass unterstützt du die Weiterentwicklung von VAR Challenge. Du erhältst kosmetische Belohnungen, zusätzliche Missionen und Community-Vorteile. Alle spielentscheidenden Funktionen bleiben für kostenlose Spieler verfügbar.",
  freeBenefits: [
    "Daily Missionen",
    "Wochenmissionen",
    "Saisonmissionen",
    "Kostenlose Belohnungen",
    "Community-Ideen",
    "Community-Szenen einreichen",
    "Creator XP",
    "Basis-Statistiken"
  ],
  premiumBenefits: [
    "Alle kostenlosen Inhalte",
    "Priorisierte Community-Szenen",
    "Antwort innerhalb von 48 Stunden",
    "Platzpass-Warteschlange oben",
    "Creator-Badge",
    "Exklusive Profilrahmen",
    "Exklusive Profilbanner",
    "Exklusive Titel",
    "Premium-Belohnungen",
    "Beta-Zugang",
    "Zusätzliche Missionen",
    "Supporter-Rolle"
  ],
  rewards: [
    { level: 1, reward: "100 Credits" },
    { level: 5, reward: "Profilbanner: VAR Room" },
    { level: 10, reward: "Titel: Video Assistant" },
    { level: 20, reward: "Creator Badge Bronze" },
    { level: 35, reward: "Profilrahmen Grün" },
    { level: 50, reward: "Titel: Bundesliga Experte" },
    { level: 75, reward: "Profilbanner Elite Check" },
    { level: 100, reward: "Saisonabzeichen Platzpass Elite" }
  ]
};

function getPlacepassData() {
  const savedAdminData = localStorage.getItem("varChallengeAdminData");

  if (!savedAdminData) return (typeof placepassData !== "undefined" ? placepassData : DEFAULT_PLACEPASS);

  try {
    const adminData = JSON.parse(savedAdminData);
    return {
      ...DEFAULT_PLACEPASS,
      ...(adminData.placepass || {})
    };
  } catch {
    return DEFAULT_PLACEPASS;
  }
}

function renderPlacepass() {
  const pass = getPlacepassData();
  const level = Number(pass.currentLevel || 0);
  const maxLevel = Number(pass.maxLevel || 100);
  const progress = Math.max(0, Math.min(100, Number(pass.progress || Math.round((level / maxLevel) * 100))));

  setElementText("passSeasonName", pass.seasonName);
  setElementText("passSeasonTheme", pass.theme);
  setElementText("passLevel", `${level} / ${maxLevel}`);
  setElementText("passProgressText", `${progress}%`);
  setElementText("passTimeLeft", pass.timeLeft);
  setElementText("passDescription", pass.description);

  const fill = document.getElementById("passProgressFill");
  if (fill) fill.style.width = `${progress}%`;

  renderBenefitList("freePassBenefits", pass.freeBenefits || []);
  renderBenefitList("premiumPassBenefits", pass.premiumBenefits || []);

  const rewards = document.getElementById("passRewards");
  if (rewards) {
    rewards.innerHTML = (pass.rewards || []).map(item => `
      <div class="rewardItem">
        <strong>Level ${escapeHtml(item.level)}</strong>
        <span>${escapeHtml(item.reward)}</span>
      </div>
    `).join("");
  }
}

function renderBenefitList(id, benefits) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = benefits.map(item => `<li>✔ ${escapeHtml(item)}</li>`).join("");
}

function claimPlacepassMock() {
  alert("Platzpass ist vorbereitet. Bezahlfunktion kommt später. Alle spielentscheidenden Inhalte bleiben fair.");
}

/* ===========================
   News & Infos
=========================== */

const DEFAULT_NEWS = [
  {
    title: "Admin Center 3.5 vorbereitet",
    category: "Update",
    date: "06.07.2026",
    pinned: true,
    text: "+ Platzpass-Seite\n+ News & Infos\n+ Community-Szenen-Warteschlange\n+ Medienbibliothek"
  },
  {
    title: "Platzpass Saison 1",
    category: "Platzpass",
    date: "06.07.2026",
    pinned: true,
    text: "Der Platzpass enthält kosmetische Belohnungen, zusätzliche Missionen und Creator-Vorteile. Platzpass-Szenen werden innerhalb von 48 Stunden geprüft."
  },
  {
    title: "Bekannter Fehler: localStorage nach Updates",
    category: "Bug",
    date: "06.07.2026",
    pinned: false,
    text: "Falls alte Daten angezeigt werden, Admin-Daten im Admin Center zurücksetzen oder den Browser-Cache aktualisieren."
  },
  {
    title: "Roadmap 0.4 Karriere",
    category: "Roadmap",
    date: "06.07.2026",
    pinned: false,
    text: "Geplant: Karriere, Lizenzen, Nominierungen und saisonale Herausforderungen."
  }
];

function getNewsData() {
  const savedAdminData = localStorage.getItem("varChallengeAdminData");

  if (!savedAdminData) return (typeof newsData !== "undefined" ? newsData : DEFAULT_NEWS);

  try {
    const adminData = JSON.parse(savedAdminData);
    const news = adminData.news;
    return Array.isArray(news) && news.length ? news : DEFAULT_NEWS;
  } catch {
    return DEFAULT_NEWS;
  }
}

function renderNewsCenter(category = "all") {
  document.querySelectorAll(".miniTab").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".miniTab").forEach(btn => {
    if (btn.textContent.toLowerCase().includes(String(category).toLowerCase()) || (category === "all" && btn.textContent.includes("Alle"))) {
      btn.classList.add("active");
    }
  });

  const list = document.getElementById("newsList");
  if (!list) return;

  let news = getNewsData();
  if (category !== "all") news = news.filter(item => item.category === category);

  news.sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  list.innerHTML = news.map(item => `
    <article class="newsCard">
      <div class="newsCardTop">
        <span class="newsBadge">${escapeHtml(item.pinned ? "📌 " : "")}${escapeHtml(item.category || "News")}</span>
        <span class="newsDate">${escapeHtml(item.date || "")}</span>
      </div>
      <h2>${escapeHtml(item.title || "News")}</h2>
      <p>${escapeHtml(item.text || "")}</p>
    </article>
  `).join("") || `<div class="newsCard"><p>Keine Einträge vorhanden.</p></div>`;
}

function setElementText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===========================
   FIX 3.7.1d – Platzhalter & automatische Spielerzuordnung
   Behebt {Verteidiger}/{Angreifer}/{Torwart} im Spiel.
=========================== */

function renderScene(scene) {
  if (!scene) return;

  const resolved = resolveSceneContext(scene);
  currentScene = resolved;

  if (leagueName) leagueName.textContent = resolved.league || resolved.competitionName || "Unbekannte Liga";
  if (matchMinute) matchMinute.textContent = resolved.minute || "00:00";
  if (sceneTitle) sceneTitle.textContent = resolveScenePlaceholders(resolved.title || "Unbenannte Szene", resolved);
  if (sceneDescription) sceneDescription.textContent = resolveScenePlaceholders(resolved.description || "", resolved);

  renderSceneMedia(resolved);
  renderAnswerButtons(resolved);
}

function resolveSceneContext(scene) {
  const copy = JSON.parse(JSON.stringify(scene || {}));
  copy.participants = copy.participants || {};

  const homeClubId = copy.homeClubId || copy.homeClub?.id || null;
  const awayClubId = copy.awayClubId || copy.awayClub?.id || null;

  if (!copy.participants.attackerId) {
    const attacker = pickPlayerForScene(homeClubId, ["ST","MS","LA","RA","LF","RF","OM","ZM","RM","LM"]);
    if (attacker) {
      copy.participants.attackerId = attacker.id;
      copy.participants.attackerName = playerFullName(attacker);
    }
  }

  if (!copy.participants.defenderId) {
    const defender = pickPlayerForScene(awayClubId || homeClubId, ["IV","LV","RV","DM","ZM"]);
    if (defender) {
      copy.participants.defenderId = defender.id;
      copy.participants.defenderName = playerFullName(defender);
    }
  }

  if (!copy.participants.goalkeeperId) {
    const goalkeeper = pickPlayerForScene(awayClubId || homeClubId, ["TW","GK"]);
    if (goalkeeper) {
      copy.participants.goalkeeperId = goalkeeper.id;
      copy.participants.goalkeeperName = playerFullName(goalkeeper);
    }
  }

  return copy;
}

function pickPlayerForScene(clubId, positions) {
  const data = getCachedAdminData();
  if (!data || !Array.isArray(data.players)) return null;

  let players = data.players.filter((p) => p && p.active !== false && !p.deleted);

  if (clubId) {
    players = players.filter((p) => Number(p.clubId) === Number(clubId));
  }

  const posSet = new Set((positions || []).map((p) => String(p).toUpperCase()));
  let filtered = players.filter((p) => posSet.has(String(p.position || "").toUpperCase()));

  if (filtered.length === 0 && clubId) {
    filtered = players;
  }

  if (filtered.length === 0) {
    filtered = data.players.filter((p) => p && p.active !== false && !p.deleted);
  }

  if (filtered.length === 0) return null;

  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getCachedAdminData() {
  if (cachedAdminData) return cachedAdminData;

  const savedAdminData = localStorage.getItem("varChallengeAdminData");
  if (!savedAdminData) return null;

  try {
    cachedAdminData = JSON.parse(savedAdminData);
    return cachedAdminData;
  } catch (error) {
    console.warn("Admin-Daten konnten nicht gelesen werden:", error);
    return null;
  }
}


function getCachedItem(collectionName, id) {
  const data = getCachedAdminData();
  if (!data || !Array.isArray(data[collectionName])) return null;
  return data[collectionName].find((item) => String(item.id) === String(id)) || null;
}

function resolveScenePlaceholders(text, scene) {
  const data = getCachedAdminData();
  const participants = scene.participants || {};

  const homeClub = getCachedItem("clubs", scene.homeClubId);
  const awayClub = getCachedItem("clubs", scene.awayClubId);
  const stadium = getCachedItem("stadiums", scene.stadiumId);
  const referee = getCachedItem("referees", scene.refereeId);
  const competition = getCachedItem("competitions", scene.competitionId);

  const attackerName = cleanGenericName(participants.attackerName, "Angreifer") || getPlayerName(participants.attackerId) || "Angreifer";
  const defenderName = cleanGenericName(participants.defenderName, "Verteidiger") || getPlayerName(participants.defenderId) || "Verteidiger";
  const goalkeeperName = cleanGenericName(participants.goalkeeperName, "Torwart") || getPlayerName(participants.goalkeeperId) || "Torwart";

  const replacements = {
    ANGREIFER: attackerName,
    VERTEIDIGER: defenderName,
    TORWART: goalkeeperName,
    HEIM: homeClub?.name || scene.homeClubName || scene.home || "Heimteam",
    GAST: awayClub?.name || scene.awayClubName || scene.away || "Auswärtsteam",
    STADION: stadium?.name || scene.stadiumName || "Stadion",
    SCHIEDSRICHTER: referee?.name || scene.refereeName || "Schiedsrichter",
    WETTBEWERB: competition?.name || scene.league || scene.competition || "Wettbewerb",
    MINUTE: scene.minute || "00:00",
    SPIELSTAND: scene.scoreline || "0:0"
  };

  let output = String(text || "");

  Object.entries(replacements).forEach(([key, value]) => {
    output = output.replace(new RegExp(`\\{${key}\\}`, "gi"), value);
  });

  return output;
}

function cleanGenericName(value, generic) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.toLowerCase() === generic.toLowerCase()) return "";
  return text;
}

function getPlayerName(id) {
  const player = getCachedItem("players", id);
  return player ? playerFullName(player) : "";
}

function playerFullName(player) {
  if (!player) return "";
  return `${player.firstName || ""} ${player.lastName || ""}`.trim() || player.name || "";
}


/* ===========================
   Alpha 3.7.7a – Support
=========================== */

const DEFAULT_SUPPORT = {
  title: "VAR Challenge unterstützen",
  intro: "VAR Challenge wird in der Freizeit entwickelt. Wenn dir das Projekt gefällt, kannst du die Weiterentwicklung freiwillig unterstützen. Alle Spielinhalte bleiben kostenlos spielbar.",
  paypal: "",
  kofi: "",
  discord: "",
  tiktok: "https://www.tiktok.com/@goernaldoberlin",
  youtube: "",
  twitch: "",
  instagram: "",
  website: "",
  bugReport: "",
  ideaSubmit: "",
  roadmap: [
    { version: "Alpha 3.7.7a", title: "Community & Support", status: "Aktiv" },
    { version: "Alpha 3.7.7b", title: "Registrierung & Login", status: "Geplant" },
    { version: "Alpha 3.7.8", title: "Analytics PRO", status: "Geplant" },
    { version: "Alpha 3.8", title: "2. Bundesliga", status: "Geplant" }
  ],
  changelog: [
    { version: "Alpha 3.7.7a", text: "Support-Seite, Social Links, Roadmap und Unterstützerbereich vorbereitet." },
    { version: "Alpha 3.7.6", text: "Stable-Basis: Admin Center, Daten und Szenen repariert." }
  ],
  supporters: []
};

function getSupportData() {
  const savedAdminData = localStorage.getItem("varChallengeAdminData");
  if (!savedAdminData) return { ...DEFAULT_SUPPORT, ...(typeof supportData !== "undefined" ? supportData : {}) };

  try {
    const adminData = JSON.parse(savedAdminData);
    return { ...DEFAULT_SUPPORT, ...(typeof supportData !== "undefined" ? supportData : {}), ...(adminData.support || {}) };
  } catch {
    return { ...DEFAULT_SUPPORT, ...(typeof supportData !== "undefined" ? supportData : {}) };
  }
}

function renderSupportCenter() {
  const support = getSupportData();
  setElementText("supportTitle", support.title);
  setElementText("supportIntro", support.intro);

  const socialLinks = [
    ["discord", "💬 Discord"],
    ["tiktok", "🎵 TikTok"],
    ["youtube", "▶️ YouTube"],
    ["twitch", "🎮 Twitch"],
    ["instagram", "📷 Instagram"],
    ["website", "🌐 Website"]
  ];

  const socialBox = document.getElementById("supportSocialLinks");
  if (socialBox) {
    socialBox.innerHTML = socialLinks.map(([key, label]) => {
      const url = support[key];
      return `<button class="ghostBtn socialBtn" onclick="openSupportLink('${key}')" ${url ? "" : "disabled"}>${escapeHtml(label)}</button>`;
    }).join("");
  }

  const supporterList = document.getElementById("supporterList");
  if (supporterList) {
    const supporters = Array.isArray(support.supporters) ? support.supporters.filter(s => s.visible !== false) : [];
    supporterList.innerHTML = supporters.length
      ? supporters.map(s => `<div class="supporterItem"><strong>❤️ ${escapeHtml(s.publicName || s.name || "Anonymer Unterstützer")}</strong>${s.message ? `<p>${escapeHtml(s.message)}</p>` : ""}</div>`).join("")
      : `<div class="supporterItem"><strong>Noch keine öffentlichen Unterstützer.</strong><p>Unterstützer können freiwillig anonym bleiben.</p></div>`;
  }

  renderSupportMiniList("supportRoadmap", support.roadmap || [], item => `<strong>${escapeHtml(item.version || "Roadmap")}</strong><span>${escapeHtml(item.title || "")}</span><small>${escapeHtml(item.status || "")}</small>`);
  renderSupportMiniList("supportChangelog", support.changelog || [], item => `<strong>${escapeHtml(item.version || "Update")}</strong><span>${escapeHtml(item.text || "")}</span>`);
}

function renderSupportMiniList(id, items, template) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(item => `<div class="miniListItem">${template(item)}</div>`).join("") : `<div class="miniListItem">Noch keine Einträge.</div>`;
}

function openSupportLink(key) {
  const support = getSupportData();
  const url = support[key];
  if (!url) {
    alert("Dieser Link ist noch nicht hinterlegt. Bitte später erneut prüfen.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}


/* ===========================
   Account System 3.7.7b
   Hinweis: lokale Alpha-Accounts pro Browser/Gerät.
=========================== */

const ACCOUNT_USERS_KEY = "varChallengeAccounts";
const ACCOUNT_SESSION_KEY = "varChallengeCurrentAccount";

function getDefaultAccountRole() {
  return "BENUTZER";
}

function loadAccounts() {
  const saved = localStorage.getItem(ACCOUNT_USERS_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNT_USERS_KEY, JSON.stringify(accounts));
}

function getCurrentAccountId() {
  return localStorage.getItem(ACCOUNT_SESSION_KEY) || "";
}

function getCurrentAccount() {
  const id = getCurrentAccountId();
  if (!id) return null;
  return loadAccounts().find((account) => String(account.id) === String(id)) || null;
}

function initAccountSystem() {
  populateFavoriteClubSelect("registerFavoriteClub");
}

function createAccountId() {
  return "ACC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function setFormMessage(id, message, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message || "";
  el.classList.remove("success", "error");
  if (type) el.classList.add(type);
}

function registerAccount() {
  const username = normalizeText(document.getElementById("registerUsername")?.value);
  const email = normalizeText(document.getElementById("registerEmail")?.value);
  const password = String(document.getElementById("registerPassword")?.value || "");
  const repeat = String(document.getElementById("registerPasswordRepeat")?.value || "");
  const country = normalizeText(document.getElementById("registerCountry")?.value) || "Deutschland";
  const favoriteClubId = normalizeText(document.getElementById("registerFavoriteClub")?.value);
  const avatar = normalizeText(document.getElementById("registerAvatar")?.value) || "👤";

  if (username.length < 3) {
    setFormMessage("registerMessage", "Benutzername muss mindestens 3 Zeichen haben.", "error");
    return;
  }

  if (!email || !email.includes("@")) {
    setFormMessage("registerMessage", "Bitte eine gültige E-Mail eintragen.", "error");
    return;
  }

  if (password.length < 4) {
    setFormMessage("registerMessage", "Passwort muss mindestens 4 Zeichen haben.", "error");
    return;
  }

  if (password !== repeat) {
    setFormMessage("registerMessage", "Die Passwörter stimmen nicht überein.", "error");
    return;
  }

  const accounts = loadAccounts();
  const usernameKey = normalizeKey(username);
  const emailKey = normalizeKey(email);

  if (accounts.some((account) => normalizeKey(account.username) === usernameKey)) {
    setFormMessage("registerMessage", "Dieser Benutzername ist bereits vergeben.", "error");
    return;
  }

  if (accounts.some((account) => normalizeKey(account.email) === emailKey)) {
    setFormMessage("registerMessage", "Diese E-Mail ist bereits registriert.", "error");
    return;
  }

  const account = {
    id: createAccountId(),
    username,
    email,
    password,
    country,
    avatar,
    favoriteClubId,
    role: getDefaultAccountRole(),
    placepass: "FREE",
    supporter: false,
    supporterPublic: false,
    supporterName: "",
    badges: ["👤 Spieler"],
    xp: xp || 0,
    level: level || 1,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    active: true
  };

  accounts.push(account);
  saveAccounts(accounts);
  localStorage.setItem(ACCOUNT_SESSION_KEY, account.id);

  setFormMessage("registerMessage", "Account erstellt. Du bist jetzt eingeloggt.", "success");
  updateAccountMenuUI();

  setTimeout(() => {
    showScreen("profileScreen");
  }, 350);
}

function loginAccount() {
  const identifier = normalizeKey(document.getElementById("loginIdentifier")?.value);
  const password = String(document.getElementById("loginPassword")?.value || "");

  if (!identifier || !password) {
    setFormMessage("loginMessage", "Bitte Benutzername/E-Mail und Passwort eintragen.", "error");
    return;
  }

  const accounts = loadAccounts();
  const account = accounts.find((item) => {
    return normalizeKey(item.username) === identifier || normalizeKey(item.email) === identifier;
  });

  if (!account || account.password !== password) {
    setFormMessage("loginMessage", "Login fehlgeschlagen. Daten prüfen.", "error");
    return;
  }

  if (account.active === false) {
    setFormMessage("loginMessage", "Dieser Account ist deaktiviert.", "error");
    return;
  }

  account.lastLoginAt = new Date().toISOString();
  account.xp = xp || account.xp || 0;
  account.level = level || account.level || 1;

  saveAccounts(accounts);
  localStorage.setItem(ACCOUNT_SESSION_KEY, account.id);

  setFormMessage("loginMessage", "Login erfolgreich.", "success");
  updateAccountMenuUI();

  setTimeout(() => {
    showScreen("profileScreen");
  }, 250);
}

function logoutAccount() {
  localStorage.removeItem(ACCOUNT_SESSION_KEY);
  updateAccountMenuUI();
  showScreen("menuScreen");
}

function updateAccountMenuUI() {
  const current = getCurrentAccount();
  const loginBtn = document.getElementById("loginMenuBtn");
  const profileBtn = document.getElementById("profileMenuBtn");

  if (loginBtn) loginBtn.classList.toggle("hidden", !!current);
  if (profileBtn) {
    profileBtn.classList.toggle("hidden", !current);
    if (current) profileBtn.textContent = "👤 " + current.username;
  }
}

function getFavoriteClubNameById(clubId) {
  if (!clubId) return "-";
  const data = getCachedAdminData();
  if (!data || !Array.isArray(data.clubs)) return "-";
  const club = data.clubs.find((item) => String(item.id) === String(clubId));
  return club ? (club.name || club.shortName || "-") : "-";
}

function populateFavoriteClubSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const data = getCachedAdminData();
  const clubs = data && Array.isArray(data.clubs)
    ? data.clubs.filter((club) => club && club.active !== false && !club.deleted)
    : [];

  const currentValue = select.value;

  select.innerHTML = `<option value="">Kein Lieblingsverein gewählt</option>` +
    clubs
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "de"))
      .map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name || club.shortName || club.id)}</option>`)
      .join("");

  if (currentValue) select.value = currentValue;
}

function renderProfileScreen() {
  const account = getCurrentAccount();

  if (!account) {
    showScreen("loginScreen");
    return;
  }

  const analytics = loadAnalytics();
  const totalAnswers = (analytics.correctAnswers || 0) + (analytics.wrongAnswers || 0);
  const accuracy = totalAnswers > 0 ? Math.round(((analytics.correctAnswers || 0) / totalAnswers) * 100) : 0;

  setElementText("profileUsername", account.username || "Benutzer");
  setElementText("profileBadges", getAccountBadges(account).join("  "));
  setElementText("profileCreatedAt", formatAccountDate(account.createdAt));
  setElementText("profileAvatar", account.avatar || "👤");
  setElementText("profileLevel", level || account.level || 1);
  setElementText("profileXP", xp || account.xp || 0);
  setElementText("profileFavoriteClub", getFavoriteClubNameById(account.favoriteClubId));
  setElementText("profilePlacepass", account.placepass === "PREMIUM" ? "Premium" : "Free");
  setElementText("profileSupporter", account.supporter ? "Ja" : "Nein");
  setElementText("profileRole", formatRoleName(account.role));

  setElementText("profileVisits", analytics.visits || 0);
  setElementText("profileGamesStarted", analytics.gamesStarted || 0);
  setElementText("profileScenesPlayed", analytics.scenesPlayed || 0);
  setElementText("profileCorrect", analytics.correctAnswers || 0);
  setElementText("profileWrong", analytics.wrongAnswers || 0);
  setElementText("profileAccuracy", accuracy + "%");

  const badgeList = document.getElementById("profileBadgeList");
  if (badgeList) {
    const badges = getAccountBadges(account);
    badgeList.innerHTML = badges.length
      ? badges.map((badge) => `<span class="badgePill">${escapeHtml(badge)}</span>`).join("")
      : `<span class="badgePill">👤 Spieler</span>`;
  }
}

function getAccountBadges(account) {
  const badges = Array.isArray(account.badges) ? [...account.badges] : [];

  if (account.placepass === "PREMIUM") badges.push("🏆 Platzpass");
  if (account.supporter) badges.push("❤️ Unterstützer");

  const role = String(account.role || "").toUpperCase();
  if (role === "OWNER") badges.push("👑 Owner");
  if (role === "ADMIN") badges.push("🛠️ Admin");
  if (role === "TESTER") badges.push("🧪 Tester");
  if (role === "CREATOR") badges.push("🎬 Creator");

  return [...new Set(badges)];
}

function formatRoleName(role) {
  const map = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MODERATOR: "Moderator",
    CREATOR: "Creator",
    TESTER: "Tester",
    SUPPORTER: "Supporter",
    BENUTZER: "Benutzer"
  };

  return map[String(role || "").toUpperCase()] || "Benutzer";
}

function formatAccountDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("de-DE");
  } catch {
    return "-";
  }
}

function syncAccountProgress() {
  const account = getCurrentAccount();
  if (!account) return;

  const accounts = loadAccounts();
  const target = accounts.find((item) => String(item.id) === String(account.id));
  if (!target) return;

  target.xp = xp || target.xp || 0;
  target.level = level || target.level || 1;
  target.updatedAt = new Date().toISOString();

  saveAccounts(accounts);
}


/* ===========================
   VAR Challenge 3.7.8e
   Device Detection
=========================== */

function detectDeviceType() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const touch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  const ratio = window.devicePixelRatio || 1;

  let deviceType = "desktop";

  if (width <= 767) {
    deviceType = "mobile";
  } else if (width <= 1180 || (touch && width <= 1366)) {
    deviceType = "tablet";
  }

  document.documentElement.dataset.device = deviceType;
  document.body.dataset.device = deviceType;

  document.documentElement.classList.remove("device-desktop", "device-tablet", "device-mobile");
  document.body.classList.remove("device-desktop", "device-tablet", "device-mobile");

  document.documentElement.classList.add(`device-${deviceType}`);
  document.body.classList.add(`device-${deviceType}`);

  window.varChallengeDevice = {
    type: deviceType,
    width,
    height,
    touch,
    ratio
  };

  return window.varChallengeDevice;
}

function applyDeviceLayout() {
  const device = detectDeviceType();

  const logo = document.querySelector(".menuV2Logo");
  if (logo) {
    logo.style.display = "";
  }

  const menuScreen = document.getElementById("menuScreen");
  if (menuScreen) {
    menuScreen.setAttribute("data-active-device", device.type);
  }
}

window.addEventListener("DOMContentLoaded", applyDeviceLayout);
window.addEventListener("resize", () => {
  clearTimeout(window.__deviceResizeTimer);
  window.__deviceResizeTimer = setTimeout(applyDeviceLayout, 150);
});
window.addEventListener("orientationchange", () => {
  setTimeout(applyDeviceLayout, 250);
});
