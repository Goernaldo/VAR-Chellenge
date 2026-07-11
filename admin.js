
/* ===========================
   VAR Challenge Admin Center 3.7.1b
   Bundesliga 2026/27 Snapshot: 3.7.1a + Freiburg, Stuttgart, Mainz, Gladbach, Wolfsburg, Köln
   Hinweis: Transferfenster offen, Daten später im Admin Center editierbar.
=========================== */

/* ===========================
   VAR Challenge Admin Center 3.6
   CMS-Struktur mit Dropdowns
=========================== */

const STORAGE_KEY = "varChallengeAdminData";
const ADMIN_USERS_KEY = "varChallengeAdminUsers";
const ADMIN_SESSION_KEY = "varChallengeAdminSession";

let currentAdmin = null;
let adminUsers = [];
let adminState = { currentPage: "dashboard", editingSceneId: null, editing: {}, editingUserId: null, editingNewsId: null, editingMediaId: null, editingSubmissionId: null, editingPassRewardId: null, editingPassMissionId: null, editingBenefit: null };

const ROLE_DEFINITIONS = {
  OWNER: { label: "👑 Owner", permissions: ["all"], description: "Voller Zugriff auf alles." },
  ADMIN: { label: "🛠 Admin", permissions: ["project","projectStatusCenter","users","countries","competitions","seasons","clubs","stadiums","players","referees","scenes","career","settings","media","communityScenes","placepass","newsCenter"], description: "Verwaltet Inhalte und Team." },
  SCENE_AUTHOR: { label: "✍️ Szenen-Autor", permissions: ["scenes","clubs","players"], description: "Erstellt und bearbeitet Szenen." },
  DESIGNER: { label: "🎨 Designer", permissions: ["project","clubs","stadiums","players","scenes","media","placepass","newsCenter"], description: "Pflegt Bilder, Logos und Medienpfade." },
  MODERATOR: { label: "👀 Moderator", permissions: ["communityScenes","scenes","media","newsCenter","view"], description: "Prüft Community-Szenen, Bugs und Inhalte." },
  TESTER: { label: "🧪 Tester", permissions: ["view"], description: "Kann Inhalte ansehen und testen." }
};

let adminData = {
  settings: {
    gameTitle: "VAR Challenge",
    slogan: "Every Decision Matters.",
    edition: "Frauen Edition",
    activeDataBasis: "Frauen",
    version: "Alpha 3.7.7a",
    build: "2026.07.06",
    status: "In Entwicklung",
    progress: 28,
    nextUpdate: "3.7.7b Registrierung",
    developer: "GörnaldoBerlin",
    footer: "VAR Challenge · Alpha · © 2026 GörnaldoBerlin",
    copyright: "© 2026 GörnaldoBerlin",
    changelog: "+ Admin Center 3.1\n+ Männer- und Frauenligen\n+ Vereine, Spieler, Stadien\n+ Dropdown-Szeneneditor\n+ 18 Bundesliga-Vereine 2026/27\n+ Medienbibliothek\n+ Community-Szenen-Warteschlange mit Platzpass-Priorität"
  },
  countries: [], competitions: [], seasons: [], clubs: [], stadiums: [], players: [], referees: [], scenes: [], media: [], communitySubmissions: [], placepass: null, news: [], career: []
};

const DECISION_OPTIONS = ["Tor","Kein Tor","Abseits","Kein Abseits","Elfmeter","Kein Elfmeter","Foul","Kein Foul","Gelbe Karte","Rote Karte","Weiterspielen"];

document.addEventListener("DOMContentLoaded", () => {
  loadAdminUsers(); seedDefaultAdminUser(); loadAdminData(); ensureAdminCollections(); seedDefaultData(); setupNavigation(); setupOptionChecks(); checkAdminSession(); renderAll();
});

function loadAdminUsers(){ try { adminUsers = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || "[]"); } catch { adminUsers = []; } }
function saveAdminUsers(){ localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers)); }
function seedDefaultAdminUser(){ if(adminUsers.length) return; adminUsers = [{ id:createId(), displayName:"GörnaldoBerlin", username:"owner", password:"1234", role:"OWNER", active:true, createdAt:getNow(), updatedAt:getNow() }]; saveAdminUsers(); }
function adminLogin(){ const username=val("loginUsername"), password=val("loginPassword"); const user=adminUsers.find(u=>u.username===username&&u.password===password&&u.active); if(!user){ alert("Login fehlgeschlagen."); return; } currentAdmin=user; localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ id:user.id, role:user.role })); showAdminCenter(); }
function checkAdminSession(){ try{ const session=JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY)||"null"); const user=session?adminUsers.find(u=>u.id===session.id&&u.active):null; if(!user) return showLoginScreen(); currentAdmin=user; showAdminCenter(); } catch { showLoginScreen(); } }
function showAdminCenter(){ byId("loginScreen").style.display="none"; byId("adminApp").classList.remove("hiddenAdmin"); const badge=byId("currentAdminBadge"); if(badge&&currentAdmin) badge.textContent=`${currentAdmin.displayName||"Admin"} · ${currentAdmin.role}`; applyPermissionsToNav(); }
function showLoginScreen(){ byId("loginScreen").style.display="grid"; byId("adminApp").classList.add("hiddenAdmin"); }
function adminLogout(){ localStorage.removeItem(ADMIN_SESSION_KEY); currentAdmin=null; showLoginScreen(); }

function hasPermission(module){ if(!currentAdmin) return false; const role=ROLE_DEFINITIONS[currentAdmin.role]; if(!role) return false; return role.permissions.includes("all")||role.permissions.includes(module)||role.permissions.includes("view"); }
function canWrite(module){ if(!currentAdmin) return false; const role=ROLE_DEFINITIONS[currentAdmin.role]; if(!role) return false; return role.permissions.includes("all")||role.permissions.includes(module); }
function ensureWrite(module){ if(canWrite(module)) return true; alert("Keine Berechtigung für dieses Modul."); return false; }
function applyPermissionsToNav(){ document.querySelectorAll(".navBtn").forEach(btn=>{ const page=btn.dataset.page; if(["dashboard","help"].includes(page)) return; btn.style.display=hasPermission(page)?"block":"none"; }); }

function loadAdminData(){ const saved=localStorage.getItem(STORAGE_KEY); if(!saved) return; try{ const p=JSON.parse(saved); adminData={ settings:{...adminData.settings,...(p.settings||{})}, countries:p.countries||[], competitions:p.competitions||[], seasons:p.seasons||p.leagues||[], clubs:p.clubs||[], stadiums:p.stadiums||[], players:p.players||[], referees:p.referees||[], scenes:p.scenes||[], media:p.media||[], communitySubmissions:p.communitySubmissions||[], placepass:p.placepass||adminData.placepass, news:p.news||[], career:p.career||[] }; } catch(e){ console.error("Admin-Daten konnten nicht geladen werden", e); } }

function ensureAdminCollections(){ ["countries","competitions","seasons","clubs","stadiums","players","referees","scenes","media","communitySubmissions","news","career"].forEach(k=>{ if(!Array.isArray(adminData[k])) adminData[k]=[]; }); }

function saveAdminData(){ ensureAdminCollections(); updateComputedProjectProgress(); localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData)); renderAll(); }

function seedDefaultData(){
  let changed=false;
  const add=(key,items)=>{ if(!adminData[key]||!adminData[key].length){ adminData[key]=items.map(x=>({id:createId(),active:true,createdAt:getNow(),updatedAt:getNow(),...x})); changed=true; } };
  add("countries", [ {name:"Deutschland",code:"DE",flag:"🇩🇪"}, {name:"England",code:"ENG",flag:"🏴"}, {name:"Spanien",code:"ES",flag:"🇪🇸"}, {name:"Italien",code:"IT",flag:"🇮🇹"}, {name:"Frankreich",code:"FR",flag:"🇫🇷"} ]);
  const de=()=>findId(adminData.countries,"name","Deutschland");
  add("competitions", [
    {name:"Bundesliga",countryId:de(),gender:"Männer",type:"Liga",level:1,color:"#ffffff"}, {name:"2. Bundesliga",countryId:de(),gender:"Männer",type:"Liga",level:2,color:"#ffffff"}, {name:"3. Liga",countryId:de(),gender:"Männer",type:"Liga",level:3,color:"#ffffff"}, {name:"DFB-Pokal",countryId:de(),gender:"Männer",type:"Pokal",level:1,color:"#00ff88"},
    {name:"Google Pixel Frauen-Bundesliga",countryId:de(),gender:"Frauen",type:"Liga",level:1,color:"#00ff88"}, {name:"2. Frauen-Bundesliga",countryId:de(),gender:"Frauen",type:"Liga",level:2,color:"#ffb000"}, {name:"DFB-Pokal Frauen",countryId:de(),gender:"Frauen",type:"Pokal",level:1,color:"#00ff88"}, {name:"Champions League",countryId:de(),gender:"Männer",type:"International",level:1,color:"#66ccff"}, {name:"UEFA Women's Champions League",countryId:de(),gender:"Frauen",type:"International",level:1,color:"#cc66ff"}
  ]);
  const comp=n=>findId(adminData.competitions,"name",n);
  add("seasons", [ {name:"2026/27",competitionId:comp("Bundesliga"),start:"2026-08-01",end:"2027-05-31"}, {name:"2026/27",competitionId:comp("2. Bundesliga"),start:"2026-08-01",end:"2027-05-31"}, {name:"2026/27",competitionId:comp("3. Liga"),start:"2026-08-01",end:"2027-05-31"}, {name:"2026/27",competitionId:comp("Google Pixel Frauen-Bundesliga"),start:"2026-08-01",end:"2027-05-31"}, {name:"2026/27",competitionId:comp("2. Frauen-Bundesliga"),start:"2026-08-01",end:"2027-05-31"} ]);
  add("clubs", [
    // Bundesliga 2026/27 Männer
    clubSeed('FC Augsburg','Augsburg',"Männer",comp("Bundesliga"),'Augsburg','WWK Arena','#ba3733','#ffffff',true),
    clubSeed('1. FC Union Berlin','Union',"Männer",comp("Bundesliga"),'Berlin','An der Alten Försterei','#ed1c24','#ffffff',true),
    clubSeed('SV Werder Bremen','Werder',"Männer",comp("Bundesliga"),'Bremen','Weserstadion','#009a44','#ffffff',true),
    clubSeed('Borussia Dortmund','BVB',"Männer",comp("Bundesliga"),'Dortmund','Signal Iduna Park','#fdeb00','#000000',true),
    clubSeed('SV Elversberg','Elversberg',"Männer",comp("Bundesliga"),'Spiesen-Elversberg','URSAPHARM-Arena','#000000','#ffffff',true),
    clubSeed('Eintracht Frankfurt','Frankfurt',"Männer",comp("Bundesliga"),'Frankfurt am Main','Deutsche Bank Park','#e1000f','#000000',true),
    clubSeed('SC Freiburg','Freiburg',"Männer",comp("Bundesliga"),'Freiburg im Breisgau','Europa-Park Stadion','#e30613','#000000',true),
    clubSeed('Hamburger SV','HSV',"Männer",comp("Bundesliga"),'Hamburg','Volksparkstadion','#005ca9','#ffffff',true),
    clubSeed('TSG Hoffenheim','Hoffenheim',"Männer",comp("Bundesliga"),'Sinsheim','SNP Arena','#005ca9','#ffffff',true),
    clubSeed('1. FC Köln','Köln',"Männer",comp("Bundesliga"),'Köln','RheinEnergieSTADION','#ed1c24','#ffffff',true),
    clubSeed('RB Leipzig','Leipzig',"Männer",comp("Bundesliga"),'Leipzig','Red Bull Arena','#ffffff','#dd0741',true),
    clubSeed('Bayer 04 Leverkusen','Leverkusen',"Männer",comp("Bundesliga"),'Leverkusen','BayArena','#e32221','#000000',true),
    clubSeed('1. FSV Mainz 05','Mainz',"Männer",comp("Bundesliga"),'Mainz','MEWA ARENA','#c3141e','#ffffff',true),
    clubSeed('Borussia Mönchengladbach','Gladbach',"Männer",comp("Bundesliga"),'Mönchengladbach','BORUSSIA-PARK','#000000','#ffffff',true),
    clubSeed('FC Bayern München','Bayern',"Männer",comp("Bundesliga"),'München','Allianz Arena','#dc052d','#ffffff',true),
    clubSeed('SC Paderborn 07','Paderborn',"Männer",comp("Bundesliga"),'Paderborn','Home Deluxe Arena','#003b79','#000000',true),
    clubSeed('FC Schalke 04','Schalke',"Männer",comp("Bundesliga"),'Gelsenkirchen','VELTINS-Arena','#004d9d','#ffffff',true),
    clubSeed('VfB Stuttgart','Stuttgart',"Männer",comp("Bundesliga"),'Stuttgart','MHPArena','#e30613','#ffffff',true),

    // 2. Bundesliga 2026/27 Männer
    clubSeed('VfL Wolfsburg','Wolfsburg',"Männer",comp("2. Bundesliga"),'Wolfsburg','Volkswagen Arena','#65b32e','#ffffff',true),
    clubSeed('1. FC Heidenheim','Heidenheim',"Männer",comp("2. Bundesliga"),'Heidenheim','Voith-Arena','#e30613','#004996',true),
    clubSeed('FC St. Pauli','St. Pauli',"Männer",comp("2. Bundesliga"),'Hamburg','Millerntor-Stadion','#5b3a29','#ffffff',true),
    clubSeed('Hannover 96','Hannover',"Männer",comp("2. Bundesliga"),'Hannover','Heinz von Heiden Arena','#008000','#000000',true),
    clubSeed('SV Darmstadt 98','Darmstadt',"Männer",comp("2. Bundesliga"),'Darmstadt','Merck-Stadion am Böllenfalltor','#005ca9','#ffffff',true),
    clubSeed('1. FC Kaiserslautern','Kaiserslautern',"Männer",comp("2. Bundesliga"),'Kaiserslautern','Fritz-Walter-Stadion','#d71920','#ffffff',true),
    clubSeed('Hertha BSC','Hertha',"Männer",comp("2. Bundesliga"),'Berlin','Olympiastadion Berlin','#004c9b','#ffffff',true),
    clubSeed('1. FC Nürnberg','Nürnberg',"Männer",comp("2. Bundesliga"),'Nürnberg','Max-Morlock-Stadion','#8b0000','#ffffff',true),
    clubSeed('VfL Bochum','Bochum',"Männer",comp("2. Bundesliga"),'Bochum','Vonovia Ruhrstadion','#005ca9','#ffffff',true),
    clubSeed('Karlsruher SC','Karlsruhe',"Männer",comp("2. Bundesliga"),'Karlsruhe','BBBank Wildpark','#005ca9','#ffffff',true),
    clubSeed('SG Dynamo Dresden','Dresden',"Männer",comp("2. Bundesliga"),'Dresden','Rudolf-Harbig-Stadion','#ffdd00','#000000',true),
    clubSeed('Holstein Kiel','Kiel',"Männer",comp("2. Bundesliga"),'Kiel','Holstein-Stadion','#005ca9','#ffffff',true),
    clubSeed('DSC Arminia Bielefeld','Bielefeld',"Männer",comp("2. Bundesliga"),'Bielefeld','SchücoArena','#005ca9','#000000',true),
    clubSeed('1. FC Magdeburg','Magdeburg',"Männer",comp("2. Bundesliga"),'Magdeburg','MDCC-Arena','#005ca9','#ffffff',true),
    clubSeed('Eintracht Braunschweig','Braunschweig',"Männer",comp("2. Bundesliga"),'Braunschweig','Eintracht-Stadion','#ffdd00','#005ca9',true),
    clubSeed('SpVgg Greuther Fürth','Fürth',"Männer",comp("2. Bundesliga"),'Fürth','Sportpark Ronhof','#009a44','#ffffff',true),
    clubSeed('VfL Osnabrück','Osnabrück',"Männer",comp("2. Bundesliga"),'Osnabrück','Bremer Brücke','#5b2c83','#ffffff',true),
    clubSeed('FC Energie Cottbus','Energie',"Männer",comp("2. Bundesliga"),'Cottbus','Stadion der Freundschaft','#e30613','#ffffff',true),

    // 3. Liga 2026/27 Männer
    clubSeed('SC Preußen Münster','Münster',"Männer",comp("3. Liga"),'Münster','Preußenstadion','#006633','#000000',true),
    clubSeed('Fortuna Düsseldorf','Düsseldorf',"Männer",comp("3. Liga"),'Düsseldorf','Merkur Spiel-Arena','#e30613','#ffffff',true),
    clubSeed('Rot-Weiss Essen','RWE',"Männer",comp("3. Liga"),'Essen','Stadion an der Hafenstraße','#e30613','#ffffff',true),
    clubSeed('MSV Duisburg','Duisburg',"Männer",comp("3. Liga"),'Duisburg','Schauinsland-Reisen-Arena','#005ca9','#ffffff',true),
    clubSeed('FC Hansa Rostock','Hansa',"Männer",comp("3. Liga"),'Rostock','Ostseestadion','#005ca9','#ffffff',true),
    clubSeed('SC Verl','Verl',"Männer",comp("3. Liga"),'Verl','Sportclub Arena','#000000','#ffffff',true),
    clubSeed('Alemannia Aachen','Aachen',"Männer",comp("3. Liga"),'Aachen','Tivoli','#fdeb00','#000000',true),
    clubSeed('SV Wehen Wiesbaden','Wehen',"Männer",comp("3. Liga"),'Wiesbaden','BRITA-Arena','#e30613','#000000',true),
    clubSeed('SV Waldhof Mannheim','Waldhof',"Männer",comp("3. Liga"),'Mannheim','Carl-Benz-Stadion','#005ca9','#000000',true),
    clubSeed('FC Viktoria Köln','Viktoria Köln',"Männer",comp("3. Liga"),'Köln','Sportpark Höhenberg','#e30613','#ffffff',true),
    clubSeed('FC Ingolstadt 04','Ingolstadt',"Männer",comp("3. Liga"),'Ingolstadt','Audi Sportpark','#000000','#e30613',true),
    clubSeed('SSV Jahn Regensburg','Regensburg',"Männer",comp("3. Liga"),'Regensburg','Jahnstadion Regensburg','#e30613','#ffffff',true),
    clubSeed('VfB Stuttgart II','Stuttgart II',"Männer",comp("3. Liga"),'Stuttgart','Robert-Schlienz-Stadion','#e30613','#ffffff',true),
    clubSeed('1. FC Saarbrücken','Saarbrücken',"Männer",comp("3. Liga"),'Saarbrücken','Ludwigsparkstadion','#005ca9','#000000',true),
    clubSeed('TSG Hoffenheim II','Hoffenheim II',"Männer",comp("3. Liga"),'Sinsheim','Dietmar-Hopp-Stadion','#005ca9','#ffffff',true),
    clubSeed('TSV Havelse','Havelse',"Männer",comp("3. Liga"),'Garbsen','Wilhelm-Langrehr-Stadion','#e30613','#ffffff',true),
    clubSeed('SV Meppen','Meppen',"Männer",comp("3. Liga"),'Meppen','Hänsch-Arena','#005ca9','#ffffff',true),
    clubSeed('SG Sonnenhof Großaspach','Großaspach',"Männer",comp("3. Liga"),'Aspach','WIRmachenDRUCK Arena','#e30613','#000000',true),
    clubSeed('Fortuna Köln','Fortuna Köln',"Männer",comp("3. Liga"),'Köln','Südstadion','#e30613','#ffffff',true),
    clubSeed('Würzburger Kickers','Würzburg',"Männer",comp("3. Liga"),'Würzburg','AKON Arena','#e30613','#ffffff',true),

    // Google Pixel Frauen-Bundesliga 2026/27
    clubSeed('1. FC Union Berlin Frauen','Union Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Berlin','Stadion An der Alten Försterei','#ed1c24','#ffffff',true),
    clubSeed('SV Werder Bremen Frauen','Werder Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Bremen','Weserstadion Platz 11','#009a44','#ffffff',true),
    clubSeed('Eintracht Frankfurt Frauen','Frankfurt Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Frankfurt','Stadion am Brentanobad','#e1000f','#000000',true),
    clubSeed('SC Freiburg Frauen','Freiburg Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Freiburg','Dreisamstadion','#e30613','#000000',true),
    clubSeed('TSG Hoffenheim Frauen','Hoffenheim Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Hoffenheim','Dietmar-Hopp-Stadion','#005ca9','#ffffff',true),
    clubSeed('1. FC Köln Frauen','Köln Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Köln','Franz-Kremer-Stadion','#ed1c24','#ffffff',true),
    clubSeed('RB Leipzig Frauen','Leipzig Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Leipzig','Sportanlage Gontardweg','#ffffff','#dd0741',true),
    clubSeed('Bayer 04 Leverkusen Frauen','Leverkusen Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Leverkusen','Ulrich-Haberland-Stadion','#e32221','#000000',true),
    clubSeed('FC Bayern München Frauen','Bayern Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'München','FC Bayern Campus','#dc052d','#ffffff',true),
    clubSeed('1. FC Nürnberg Frauen','Nürnberg Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Nürnberg','Max-Morlock-Stadion','#8b0000','#ffffff',true),
    clubSeed('VfB Stuttgart Frauen','Stuttgart Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Stuttgart','Stadion Hafenbahnstraße','#e30613','#ffffff',true),
    clubSeed('VfL Wolfsburg Frauen','Wolfsburg Frauen',"Frauen",comp("Google Pixel Frauen-Bundesliga"),'Wolfsburg','AOK Stadion','#65b32e','#ffffff',true),

    // 2. Frauen-Bundesliga 2026/27
    clubSeed('SG 99 Andernach Frauen','Andernach Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Andernach','Stadion am Bassenheimer Weg','#000000','#ffffff',true),
    clubSeed('Viktoria Berlin Frauen','Viktoria Berlin Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Berlin','Stadion Lichterfelde','#005ca9','#ffffff',true),
    clubSeed('Hertha BSC Frauen','Hertha Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Berlin','Stadion auf dem Wurfplatz','#004c9b','#ffffff',true),
    clubSeed('VfL Bochum Frauen','Bochum Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Bochum','Leichtathletikplatz am Ruhrstadion','#005ca9','#ffffff',true),
    clubSeed('SGS Essen','SGS Essen',"Frauen",comp("2. Frauen-Bundesliga"),'Essen','Stadion Essen','#e30613','#ffffff',true),
    clubSeed('Eintracht Frankfurt II Frauen','Frankfurt II Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Frankfurt','Stadion am Brentanobad','#e1000f','#000000',true),
    clubSeed('TSG Hoffenheim II Frauen','Hoffenheim II Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Sankt Leon-Rot','Fit und Fun Sportpark','#005ca9','#ffffff',true),
    clubSeed('FC Ingolstadt Frauen','Ingolstadt Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Ingolstadt','ESV-Stadion','#000000','#e30613',true),
    clubSeed('FC Carl Zeiss Jena Frauen','Jena Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Jena','Ernst-Abbe-Sportfeld','#005ca9','#ffffff',true),
    clubSeed('1. FC Köln II Frauen','Köln II Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Köln','Kunstrasenplatz am Geißbockheim','#ed1c24','#ffffff',true),
    clubSeed('SV Meppen Frauen','Meppen Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Meppen','Hänsch-Arena','#005ca9','#ffffff',true),
    clubSeed('Borussia Mönchengladbach Frauen','Gladbach Frauen',"Frauen",comp("2. Frauen-Bundesliga"),'Mönchengladbach','Grenzlandstadion','#000000','#ffffff',true),
    clubSeed('Turbine Potsdam','Turbine Potsdam',"Frauen",comp("2. Frauen-Bundesliga"),'Potsdam','Karl-Liebknecht-Stadion','#005ca9','#ffffff',true),
    clubSeed('SC Sand Frauen','SC Sand',"Frauen",comp("2. Frauen-Bundesliga"),'Willstätt','Kühnmatt Stadion','#005ca9','#ffffff',true)
  ]);
  add("stadiums", adminData.clubs.map(c=>({name:c.stadium||`${c.shortName} Stadion`,countryId:de(),clubId:c.id,city:c.city,capacity:"",image:""})));
  add("players", [
    playerSeed("Samuel Mbangula","Tshifunda","Männer","LA","SV Werder Bremen","7","Belgien"),
    playerSeed("Justin","Njinmah","Männer","RA","SV Werder Bremen","11","Deutschland"),
    playerSeed("Marco","Grüll","Männer","LA","SV Werder Bremen","17","Österreich"),
    playerSeed("Kenny","Quetant","Männer","ST","SV Werder Bremen","","Frankreich"),
    playerSeed("Keke Maximilian","Topp","Männer","ST","SV Werder Bremen","9","Deutschland"),
    playerSeed("Salim Amani","Musah","Männer","ST","SV Werder Bremen","29","Deutschland"),
    playerSeed("Cédric","Itten","Männer","ST","SV Werder Bremen","","Schweiz"),
    playerSeed("Dawid","Kownacki","Männer","ST","SV Werder Bremen","9","Polen"),
    playerSeed("Romano","Schmid","Männer","OM","SV Werder Bremen","20","Österreich"),
    playerSeed("Jens","Stage","Männer","ZM","SV Werder Bremen","6","Dänemark"),
    playerSeed("Iván San José","Cantalejo","Männer","ZM","SV Werder Bremen","","Spanien"),
    playerSeed("Senne","Lynen","Männer","DM","SV Werder Bremen","14","Belgien"),
    playerSeed("Patrice","Covic","Männer","ZM","SV Werder Bremen","24","Kroatien"),
    playerSeed("Olivier","Deman","Männer","LM","SV Werder Bremen","2","Belgien"),
    playerSeed("Skelly","Alvero","Männer","DM","SV Werder Bremen","28","Frankreich"),
    playerSeed("Dariusz","Stalmach","Männer","ZM","SV Werder Bremen","","Polen"),
    playerSeed("Abdoul Karim","Coulibaly","Männer","IV","SV Werder Bremen","31","Deutschland"),
    playerSeed("Marco","Friedl","Männer","IV","SV Werder Bremen","32","Österreich"),
    playerSeed("Felix","Agu","Männer","LV","SV Werder Bremen","27","Nigeria"),
    playerSeed("Amos","Pieper","Männer","IV","SV Werder Bremen","5","Deutschland"),
    playerSeed("Mitchell","Weiser","Männer","RV","SV Werder Bremen","8","Deutschland"),
    playerSeed("Niklas","Stark","Männer","IV","SV Werder Bremen","4","Deutschland"),
    playerSeed("Julian","Malatini","Männer","IV","SV Werder Bremen","22","Argentinien"),
    playerSeed("Mick","Schmetgens","Männer","IV","SV Werder Bremen","33","Deutschland"),
    playerSeed("Karl","Hein","Männer","TW","SV Werder Bremen","13","Estland"),
    playerSeed("Markus","Kolke","Männer","TW","SV Werder Bremen","25","Deutschland"),
    playerSeed("Stefan Stefanov","Smarkalev","Männer","TW","SV Werder Bremen","37","Bulgarien"),
    playerSeed("Michael","Olise","Männer","RA","FC Bayern München","17","Frankreich"),
    playerSeed("Luis","Díaz","Männer","LA","FC Bayern München","14","Kolumbien"),
    playerSeed("Harry","Kane","Männer","ST","FC Bayern München","9","England"),
    playerSeed("Ismael","Saibari","Männer","OM","FC Bayern München","34","Marokko"),
    playerSeed("Serge","Gnabry","Männer","RA","FC Bayern München","7","Deutschland"),
    playerSeed("Bryan","Zaragoza","Männer","LA","FC Bayern München","17","Spanien"),
    playerSeed("Armindo","Sieb","Männer","ST","FC Bayern München","30","Deutschland"),
    playerSeed("Jamal","Musiala","Männer","OM","FC Bayern München","10","Deutschland"),
    playerSeed("Aleksandar","Pavlović","Männer","DM","FC Bayern München","45","Deutschland"),
    playerSeed("Lennart","Karl","Männer","OM","FC Bayern München","42","Deutschland"),
    playerSeed("Tom","Bischof","Männer","ZM","FC Bayern München","20","Deutschland"),
    playerSeed("Joshua","Kimmich","Männer","DM","FC Bayern München","6","Deutschland"),
    playerSeed("Konrad","Laimer","Männer","ZM","FC Bayern München","27","Österreich"),
    playerSeed("João","Palhinha","Männer","DM","FC Bayern München","16","Portugal"),
    playerSeed("Leon","Goretzka","Männer","ZM","FC Bayern München","8","Deutschland"),
    playerSeed("Arijon","Ibrahimovic","Männer","OM","FC Bayern München","20","Deutschland"),
    playerSeed("Wisdom","Mike","Männer","OM","FC Bayern München","36","Deutschland"),
    playerSeed("Lovro","Zvonarek","Männer","OM","FC Bayern München","34","Kroatien"),
    playerSeed("Dayot","Upamecano","Männer","IV","FC Bayern München","2","Frankreich"),
    playerSeed("Nathaniel","Brown","Männer","LV","FC Bayern München","","Deutschland"),
    playerSeed("Alphonso","Davies","Männer","LV","FC Bayern München","19","Kanada"),
    playerSeed("Josip","Stanišić","Männer","RV","FC Bayern München","44","Kroatien"),
    playerSeed("Jonathan","Tah","Männer","IV","FC Bayern München","4","Deutschland"),
    playerSeed("Kim","Min-Jae","Männer","IV","FC Bayern München","3","Südkorea"),
    playerSeed("Hiroki","Ito","Männer","IV","FC Bayern München","21","Japan"),
    playerSeed("Sacha","Boey","Männer","RV","FC Bayern München","23","Frankreich"),
    playerSeed("Cassiano","Kiala","Männer","IV","FC Bayern München","30","Deutschland"),
    playerSeed("Tarek","Buchmann","Männer","IV","FC Bayern München","28","Deutschland"),
    playerSeed("Jonas","Urbig","Männer","TW","FC Bayern München","40","Deutschland"),
    playerSeed("Alexander","Nübel","Männer","TW","FC Bayern München","","Deutschland"),
    playerSeed("Manuel","Neuer","Männer","TW","FC Bayern München","1","Deutschland"),
    playerSeed("Sven","Ulreich","Männer","TW","FC Bayern München","26","Deutschland"),
    playerSeed("Leon","Klanac","Männer","TW","FC Bayern München","48","Deutschland"),
    playerSeed("Maximilian","Beier","Männer","ST","Borussia Dortmund","14","Deutschland"),
    playerSeed("Sehrou","Guirassy","Männer","ST","Borussia Dortmund","9","Guinea"),
    playerSeed("Fábio","Silva","Männer","ST","Borussia Dortmund","21","Portugal"),
    playerSeed("Samuele","Inacio","Männer","ST","Borussia Dortmund","40","Italien"),
    playerSeed("Cole","Campbell","Männer","RA","Borussia Dortmund","37","USA"),
    playerSeed("Felix","Nmecha","Männer","ZM","Borussia Dortmund","8","Deutschland"),
    playerSeed("Karim","Adeyemi","Männer","LA","Borussia Dortmund","27","Deutschland"),
    playerSeed("Jobe","Bellingham","Männer","ZM","Borussia Dortmund","7","England"),
    playerSeed("Carney","Chukwuemeka","Männer","OM","Borussia Dortmund","17","Österreich"),
    playerSeed("Marcel","Sabitzer","Männer","ZM","Borussia Dortmund","20","Österreich"),
    playerSeed("Justin","Lerma","Männer","OM","Borussia Dortmund","","Ecuador"),
    playerSeed("Emre","Can","Männer","DM","Borussia Dortmund","23","Deutschland"),
    playerSeed("Kjell-Arik","Wätjen","Männer","ZM","Borussia Dortmund","38","Deutschland"),
    playerSeed("Nico","Schlotterbeck","Männer","IV","Borussia Dortmund","4","Deutschland"),
    playerSeed("Julian","Ryerson","Männer","RV","Borussia Dortmund","26","Norwegen"),
    playerSeed("Daniel","Svensson","Männer","LV","Borussia Dortmund","24","Schweden"),
    playerSeed("Kouakou Joane","Gadou","Männer","IV","Borussia Dortmund","","Frankreich"),
    playerSeed("Waldemar","Anton","Männer","IV","Borussia Dortmund","3","Deutschland"),
    playerSeed("Yan","Couto","Männer","RV","Borussia Dortmund","2","Brasilien"),
    playerSeed("Luca","Reggiani","Männer","IV","Borussia Dortmund","49","Italien"),
    playerSeed("Ramy","Bensebaini","Männer","LV","Borussia Dortmund","5","Algerien"),
    playerSeed("Almugera","Kabar","Männer","LV","Borussia Dortmund","42","Deutschland"),
    playerSeed("Filippo","Mane","Männer","IV","Borussia Dortmund","39","Italien"),
    playerSeed("Gregor","Kobel","Männer","TW","Borussia Dortmund","1","Schweiz"),
    playerSeed("Diant","Ramaj","Männer","TW","Borussia Dortmund","","Deutschland"),
    playerSeed("Alexander","Meyer","Männer","TW","Borussia Dortmund","33","Deutschland"),
    playerSeed("Patrick","Drewes","Männer","TW","Borussia Dortmund","30","Deutschland"),
    playerSeed("Silas","Ostrzinski","Männer","TW","Borussia Dortmund","31","Deutschland"),
    playerSeed("Yan","Diomande","Männer","LA","RB Leipzig","49","Elfenbeinküste"),
    playerSeed("Antonio","Nusa","Männer","LA","RB Leipzig","7","Norwegen"),
    playerSeed("Rômulo José Cardoso","da Cruz","Männer","ST","RB Leipzig","40","Brasilien"),
    playerSeed("Johan","Bakayoko","Männer","RA","RB Leipzig","9","Belgien"),
    playerSeed("Conrad","Harder","Männer","ST","RB Leipzig","11","Dänemark"),
    playerSeed("Elif","Elmas","Männer","OM","RB Leipzig","6","Nordmazedonien"),
    playerSeed("Suleman","Sani","Männer","ST","RB Leipzig","18","Nigeria"),
    playerSeed("Tidiam","Gomis","Männer","RA","RB Leipzig","27","Frankreich"),
    playerSeed("Ayodele","Thomas","Männer","ST","RB Leipzig","21","Niederlande"),
    playerSeed("Samba","Konaté","Männer","ST","RB Leipzig","45","Frankreich"),
    playerSeed("Robert","Ramsak","Männer","ST","RB Leipzig","29","Deutschland"),
    playerSeed("Christoph","Baumgartner","Männer","OM","RB Leipzig","14","Österreich"),
    playerSeed("Assan","Ouedraogo","Männer","ZM","RB Leipzig","20","Deutschland"),
    playerSeed("Nicolas","Seiwald","Männer","DM","RB Leipzig","13","Österreich"),
    playerSeed("Rocco","Reitz","Männer","ZM","RB Leipzig","","Deutschland"),
    playerSeed("Arthur","Vermeeren","Männer","DM","RB Leipzig","18","Belgien"),
    playerSeed("Ezechiel","Banzuzi","Männer","ZM","RB Leipzig","6","Niederlande"),
    playerSeed("Andrija","Maksimović","Männer","OM","RB Leipzig","33","Serbien"),
    playerSeed("Joyeux Masanka","Bungi","Männer","ZM","RB Leipzig","42","Belgien"),
    playerSeed("Viggo","Gebel","Männer","ZM","RB Leipzig","47","Deutschland"),
    playerSeed("Benno","Kaltefleiter","Männer","ZM","RB Leipzig","37","Deutschland"),
    playerSeed("Castello Junior","Lukeba","Männer","IV","RB Leipzig","23","Frankreich"),
    playerSeed("David","Raum","Männer","LV","RB Leipzig","22","Deutschland"),
    playerSeed("Lutsharel","Geertruida","Männer","IV","RB Leipzig","3","Niederlande"),
    playerSeed("El Chadaille","Bitshiabu","Männer","IV","RB Leipzig","5","Frankreich"),
    playerSeed("Abdoul","Kone","Männer","IV","RB Leipzig","","Frankreich"),
    playerSeed("Ridle","Baku","Männer","RV","RB Leipzig","17","Deutschland"),
    playerSeed("Benjamin","Henrichs","Männer","RV","RB Leipzig","39","Deutschland"),
    playerSeed("Max","Finkgräfe","Männer","LV","RB Leipzig","35","Deutschland"),
    playerSeed("Willi","Orbán","Männer","IV","RB Leipzig","4","Ungarn"),
    playerSeed("Lukas","Klostermann","Männer","IV","RB Leipzig","16","Deutschland"),
    playerSeed("Maarten","Vandevoordt","Männer","TW","RB Leipzig","26","Belgien"),
    playerSeed("Péter","Gulácsi","Männer","TW","RB Leipzig","1","Ungarn"),
    playerSeed("Leopold","Zingerle","Männer","TW","RB Leipzig","25","Deutschland"),
    playerSeed("Christian","Kofane","Männer","ST","Bayer 04 Leverkusen","35","Kamerun"),
    playerSeed("Ernest","Poku","Männer","RA","Bayer 04 Leverkusen","19","Niederlande"),
    playerSeed("Kerim","Alajbegovic","Männer","LA","Bayer 04 Leverkusen","47","Bosnien und Herzegowina"),
    playerSeed("Afonso","Moreira","Männer","LA","Bayer 04 Leverkusen","","Portugal"),
    playerSeed("Eliesse","Ben Seghir","Männer","LA","Bayer 04 Leverkusen","17","Marokko"),
    playerSeed("Patrik","Schick","Männer","ST","Bayer 04 Leverkusen","14","Tschechien"),
    playerSeed("Montrell","Culbreath","Männer","RA","Bayer 04 Leverkusen","42","Deutschland"),
    playerSeed("Martin","Terrier","Männer","ST","Bayer 04 Leverkusen","11","Frankreich"),
    playerSeed("Aleksa","Damjanovic","Männer","ST","Bayer 04 Leverkusen","","Serbien"),
    playerSeed("Victor Okoh","Boniface","Männer","ST","Bayer 04 Leverkusen","22","Nigeria"),
    playerSeed("Farid","Alfa-Ruprecht","Männer","ST","Bayer 04 Leverkusen","","Deutschland"),
    playerSeed("Alejo","Sarco","Männer","ST","Bayer 04 Leverkusen","18","Argentinien"),
    playerSeed("Ken Eghosa Gideon","Izekor","Männer","ST","Bayer 04 Leverkusen","38","Deutschland"),
    playerSeed("Ibrahim","Maza","Männer","OM","Bayer 04 Leverkusen","30","Algerien"),
    playerSeed("Malik","Tillman","Männer","OM","Bayer 04 Leverkusen","10","USA"),
    playerSeed("Exequiel","Palacios","Männer","ZM","Bayer 04 Leverkusen","25","Argentinien"),
    playerSeed("Kennet","Eichhorn","Männer","ZM","Bayer 04 Leverkusen","","Deutschland"),
    playerSeed("Ignacio Ezequiel Agustín Fernández","Carballo","Männer","ZM","Bayer 04 Leverkusen","6","Argentinien"),
    playerSeed("Aleix","García","Männer","ZM","Bayer 04 Leverkusen","24","Spanien"),
    playerSeed("Nathan","Tella","Männer","RM","Bayer 04 Leverkusen","23","Nigeria"),
    playerSeed("Robert","Andrich","Männer","DM","Bayer 04 Leverkusen","8","Deutschland"),
    playerSeed("Noah","Mbamba","Männer","DM","Bayer 04 Leverkusen","18","Belgien"),
    playerSeed("Jonas","Hofmann","Männer","RM","Bayer 04 Leverkusen","7","Deutschland"),
    playerSeed("Jarell","Quansah","Männer","IV","Bayer 04 Leverkusen","4","England"),
    playerSeed("Edmond","Tapsoba","Männer","IV","Bayer 04 Leverkusen","12","Burkina Faso"),
    playerSeed("Loic","Bade","Männer","IV","Bayer 04 Leverkusen","5","Frankreich"),
    playerSeed("Jeanuël","Belocian","Männer","IV","Bayer 04 Leverkusen","44","Frankreich"),
    playerSeed("Axel","Tape-Kobrissa","Männer","IV","Bayer 04 Leverkusen","16","Frankreich"),
    playerSeed("Arthur Augusto","De Matos Soares","Männer","RV","Bayer 04 Leverkusen","13","Brasilien"),
    playerSeed("Abdoulaye","Faye","Männer","IV","Bayer 04 Leverkusen","","Senegal"),
    playerSeed("Lucas","Vázquez","Männer","RV","Bayer 04 Leverkusen","21","Spanien"),
    playerSeed("Mark","Flekken","Männer","TW","Bayer 04 Leverkusen","1","Niederlande"),
    playerSeed("Janis","Blaswich","Männer","TW","Bayer 04 Leverkusen","28","Deutschland"),
    playerSeed("Niklas","Lomb","Männer","TW","Bayer 04 Leverkusen","36","Deutschland"),
    playerSeed("Ndjicoura Raymond","Bomba","Männer","TW","Bayer 04 Leverkusen","","Mali"),
    playerSeed("Naba","Mensah","Männer","TW","Bayer 04 Leverkusen","","Deutschland"),
    playerSeed("Jonathan","Burkardt","Männer","ST","Eintracht Frankfurt","9","Deutschland"),
    playerSeed("Jean Matteo","Bahoya","Männer","LA","Eintracht Frankfurt","19","Frankreich"),
    playerSeed("Sepe Elye","Wahi","Männer","ST","Eintracht Frankfurt","17","Elfenbeinküste"),
    playerSeed("Ansgar","Knauff","Männer","RA","Eintracht Frankfurt","7","Deutschland"),
    playerSeed("Ayoube","Amaimouni-Echghouyab","Männer","ST","Eintracht Frankfurt","29","Marokko"),
    playerSeed("Younes","Ebnoutalib","Männer","ST","Eintracht Frankfurt","11","Deutschland"),
    playerSeed("Noel","Futkeu","Männer","ST","Eintracht Frankfurt","","Deutschland"),
    playerSeed("Michy","Batshuayi","Männer","ST","Eintracht Frankfurt","30","Belgien"),
    playerSeed("Jessic","Ngankam","Männer","ST","Eintracht Frankfurt","18","Deutschland"),
    playerSeed("Kaan","Inanoglu","Männer","ST","Eintracht Frankfurt","46","Türkei"),
    playerSeed("Can Yilmaz","Uzun","Männer","OM","Eintracht Frankfurt","42","Türkei"),
    playerSeed("Hugo","Larsson","Männer","ZM","Eintracht Frankfurt","16","Schweden"),
    playerSeed("Ritsu","Doan","Männer","RM","Eintracht Frankfurt","20","Japan"),
    playerSeed("Oscar Winther","Hojlund","Männer","ZM","Eintracht Frankfurt","6","Dänemark"),
    playerSeed("Fares","Chaibi","Männer","OM","Eintracht Frankfurt","8","Algerien"),
    playerSeed("Junior","Dina Ebimbe","Männer","ZM","Eintracht Frankfurt","26","Kamerun"),
    playerSeed("Ellyes","Skhiri","Männer","DM","Eintracht Frankfurt","15","Tunesien"),
    playerSeed("Mario","Götze","Männer","OM","Eintracht Frankfurt","27","Deutschland"),
    playerSeed("Nnamdi","Collins","Männer","IV","Eintracht Frankfurt","34","Deutschland"),
    playerSeed("Arthur","Theate","Männer","IV","Eintracht Frankfurt","3","Belgien"),
    playerSeed("Robin","Koch","Männer","IV","Eintracht Frankfurt","4","Deutschland"),
    playerSeed("Aurele","Amenda","Männer","IV","Eintracht Frankfurt","5","Schweiz"),
    playerSeed("Keita","Kosugi","Männer","LV","Eintracht Frankfurt","26","Japan"),
    playerSeed("Elias Niklas","Baum","Männer","RV","Eintracht Frankfurt","2","Deutschland"),
    playerSeed("Niels","Nkounkou","Männer","LV","Eintracht Frankfurt","29","Frankreich"),
    playerSeed("Timothy","Chandler","Männer","RV","Eintracht Frankfurt","22","USA"),
    playerSeed("Kauã","Santos","Männer","TW","Eintracht Frankfurt","40","Brasilien"),
    playerSeed("Michael","Zetterer","Männer","TW","Eintracht Frankfurt","23","Deutschland"),
    playerSeed("Simon","Simoni","Männer","TW","Eintracht Frankfurt","41","Albanien"),
    playerSeed("Jens","Grahl","Männer","TW","Eintracht Frankfurt","33","Deutschland"),
    playerSeed("Amil","Siljevic","Männer","TW","Eintracht Frankfurt","39","Bosnien und Herzegowina"),
    playerSeed("Derry Lionel","Scherhant","Männer","LA","SC Freiburg","7","Deutschland"),
    playerSeed("Cyriaque","Irié","Männer","RA","SC Freiburg","22","Burkina Faso"),
    playerSeed("Igor","Matanović","Männer","ST","SC Freiburg","31","Kroatien"),
    playerSeed("Keisuke","Goto","Männer","ST","SC Freiburg","","Japan"),
    playerSeed("Lucas","Höler","Männer","ST","SC Freiburg","9","Deutschland"),
    playerSeed("Eren","Dinkçi","Männer","RA","SC Freiburg","18","Türkei"),
    playerSeed("Vincenzo","Grifo","Männer","LA","SC Freiburg","32","Italien"),
    playerSeed("Jan-Niklas","Beste","Männer","LM","SC Freiburg","19","Deutschland"),
    playerSeed("Yuito","Suzuki","Männer","OM","SC Freiburg","14","Japan"),
    playerSeed("Rihito","Yamamoto","Männer","ZM","SC Freiburg","","Japan"),
    playerSeed("Maximilian","Eggestein","Männer","ZM","SC Freiburg","8","Deutschland"),
    playerSeed("Florent","Muslija","Männer","OM","SC Freiburg","23","Kosovo"),
    playerSeed("Patrick","Osterhage","Männer","DM","SC Freiburg","6","Deutschland"),
    playerSeed("Johan","Manzambi","Männer","ZM","SC Freiburg","44","Schweiz"),
    playerSeed("Robert","Wagner","Männer","ZM","SC Freiburg","23","Deutschland"),
    playerSeed("Anthony","Jung","Männer","IV","SC Freiburg","5","Deutschland"),
    playerSeed("Philipp","Treu","Männer","RV","SC Freiburg","29","Deutschland"),
    playerSeed("Karl","Steinmann","Männer","IV","SC Freiburg","","Deutschland"),
    playerSeed("Christian","Günter","Männer","LV","SC Freiburg","30","Deutschland"),
    playerSeed("Lukas","Kübler","Männer","RV","SC Freiburg","17","Deutschland"),
    playerSeed("Philipp","Lienhart","Männer","IV","SC Freiburg","3","Österreich"),
    playerSeed("Matthias","Ginter","Männer","IV","SC Freiburg","28","Deutschland"),
    playerSeed("Maximilian","Rosenfelder","Männer","IV","SC Freiburg","37","Deutschland"),
    playerSeed("Jordy","Makengo","Männer","LV","SC Freiburg","33","Frankreich"),
    playerSeed("Bruno Ifechukwu","Ogbus","Männer","IV","SC Freiburg","43","Schweiz"),
    playerSeed("Berkay","Yılmaz","Männer","LV","SC Freiburg","39","Türkei"),
    playerSeed("Mio","Backhaus","Männer","TW","SC Freiburg","","Deutschland"),
    playerSeed("Noah","Atubolu","Männer","TW","SC Freiburg","1","Deutschland"),
    playerSeed("Florian","Müller","Männer","TW","SC Freiburg","21","Deutschland"),
    playerSeed("Jannik","Huth","Männer","TW","SC Freiburg","24","Deutschland"),
    playerSeed("Jamie","Leweling","Männer","RA","VfB Stuttgart","18","Deutschland"),
    playerSeed("Ermedin","Demirović","Männer","ST","VfB Stuttgart","9","Bosnien und Herzegowina"),
    playerSeed("Deniz","Undav","Männer","ST","VfB Stuttgart","26","Deutschland"),
    playerSeed("Tiago","Tomás","Männer","ST","VfB Stuttgart","8","Portugal"),
    playerSeed("Chris","Führich","Männer","LA","VfB Stuttgart","10","Deutschland"),
    playerSeed("Badredine","Bouanani","Männer","RA","VfB Stuttgart","27","Algerien"),
    playerSeed("Jovan","Milošević","Männer","ST","VfB Stuttgart","","Serbien"),
    playerSeed("Jeremy","Arévalo","Männer","ST","VfB Stuttgart","25","Ecuador"),
    playerSeed("Lazar","Jovanović","Männer","LA","VfB Stuttgart","45","Serbien"),
    playerSeed("Justin","Diehl","Männer","LA","VfB Stuttgart","17","Deutschland"),
    playerSeed("Angelo","Stiller","Männer","DM","VfB Stuttgart","6","Deutschland"),
    playerSeed("Bilal","El Khannouss","Männer","OM","VfB Stuttgart","11","Marokko"),
    playerSeed("Chema","Andrés","Männer","DM","VfB Stuttgart","30","Spanien"),
    playerSeed("Nikolas","Nartey","Männer","ZM","VfB Stuttgart","28","Dänemark"),
    playerSeed("Atakan","Karazor","Männer","DM","VfB Stuttgart","16","Türkei"),
    playerSeed("Mirza","Catović","Männer","ZM","VfB Stuttgart","35","Deutschland"),
    playerSeed("Grischa","Prömel","Männer","ZM","VfB Stuttgart","","Deutschland"),
    playerSeed("Finn","Jeltsch","Männer","IV","VfB Stuttgart","29","Deutschland"),
    playerSeed("Ramon","Hendriks","Männer","IV","VfB Stuttgart","3","Niederlande"),
    playerSeed("Maximilian","Mittelstädt","Männer","LV","VfB Stuttgart","7","Deutschland"),
    playerSeed("Jeffrey Julian Gaston","Chabot","Männer","IV","VfB Stuttgart","24","Deutschland"),
    playerSeed("Luca","Jaquez","Männer","IV","VfB Stuttgart","14","Schweiz"),
    playerSeed("Josha","Vagnoman","Männer","RV","VfB Stuttgart","4","Deutschland"),
    playerSeed("Lorenz","Assignon","Männer","RV","VfB Stuttgart","22","Frankreich"),
    playerSeed("Ameen","Al-Dakhil","Männer","IV","VfB Stuttgart","2","Belgien"),
    playerSeed("Leonidas","Stergiou","Männer","IV","VfB Stuttgart","20","Schweiz"),
    playerSeed("Dan-Axel","Zagadou","Männer","IV","VfB Stuttgart","23","Frankreich"),
    playerSeed("Dennis","Seimen","Männer","TW","VfB Stuttgart","41","Deutschland"),
    playerSeed("Fabian","Bredlow","Männer","TW","VfB Stuttgart","1","Deutschland"),
    playerSeed("Stefan","Drljača","Männer","TW","VfB Stuttgart","21","Deutschland"),
    playerSeed("Benedict","Hollerbach","Männer","ST","1. FSV Mainz 05","17","Deutschland"),
    playerSeed("Nelson Felix Patrick","Weiper","Männer","ST","1. FSV Mainz 05","44","Deutschland"),
    playerSeed("Ransford","Königsdörffer","Männer","ST","1. FSV Mainz 05","","Ghana"),
    playerSeed("Phillip","Tietz","Männer","ST","1. FSV Mainz 05","20","Deutschland"),
    playerSeed("William Bøving","Vick","Männer","LA","1. FSV Mainz 05","14","Dänemark"),
    playerSeed("Silas","Wamangituka","Männer","RA","1. FSV Mainz 05","26","DR Kongo"),
    playerSeed("Ben","Bobzien","Männer","RA","1. FSV Mainz 05","38","Deutschland"),
    playerSeed("Sheraldo","Becker","Männer","ST","1. FSV Mainz 05","23","Suriname"),
    playerSeed("Kaishu","Sano","Männer","DM","1. FSV Mainz 05","6","Japan"),
    playerSeed("Paul","Nebel","Männer","OM","1. FSV Mainz 05","8","Deutschland"),
    playerSeed("Nadiem","Amiri","Männer","OM","1. FSV Mainz 05","10","Deutschland"),
    playerSeed("Eric","Martel","Männer","DM","1. FSV Mainz 05","","Deutschland"),
    playerSeed("Anthony","Caci","Männer","LM","1. FSV Mainz 05","19","Frankreich"),
    playerSeed("Hong","Hyun-seok","Männer","OM","1. FSV Mainz 05","14","Südkorea"),
    playerSeed("Lennard","Maloney","Männer","DM","1. FSV Mainz 05","15","USA"),
    playerSeed("Sota","Kawasaki","Männer","ZM","1. FSV Mainz 05","24","Japan"),
    playerSeed("Dominik","Kohr","Männer","DM","1. FSV Mainz 05","31","Deutschland"),
    playerSeed("Lee","Jae-sung","Männer","OM","1. FSV Mainz 05","7","Südkorea"),
    playerSeed("Marco","Richter","Männer","OM","1. FSV Mainz 05","10","Deutschland"),
    playerSeed("Otto","Ruoppi","Männer","ZM","1. FSV Mainz 05","","Finnland"),
    playerSeed("Kacper","Potulski","Männer","IV","1. FSV Mainz 05","48","Polen"),
    playerSeed("Andreas","Hanche-Olsen","Männer","IV","1. FSV Mainz 05","25","Norwegen"),
    playerSeed("Fabio","Gruber","Männer","IV","1. FSV Mainz 05","","Peru"),
    playerSeed("Phillipp","Mwene","Männer","RV","1. FSV Mainz 05","2","Österreich"),
    playerSeed("Danny","da Costa","Männer","RV","1. FSV Mainz 05","21","Deutschland"),
    playerSeed("Silvan","Widmer","Männer","RV","1. FSV Mainz 05","30","Schweiz"),
    playerSeed("Stefan","Bell","Männer","IV","1. FSV Mainz 05","16","Deutschland"),
    playerSeed("Maxim","Dal","Männer","IV","1. FSV Mainz 05","47","Deutschland"),
    playerSeed("Robin","Zentner","Männer","TW","1. FSV Mainz 05","27","Deutschland"),
    playerSeed("Maximilian","Kinzig","Männer","TW","1. FSV Mainz 05","","Deutschland"),
    playerSeed("Shuto","Machino","Männer","ST","Borussia Mönchengladbach","18","Japan"),
    playerSeed("Hugo","Bolin","Männer","LA","Borussia Mönchengladbach","38","Schweden"),
    playerSeed("Isac","Lidberg","Männer","ST","Borussia Mönchengladbach","","Schweden"),
    playerSeed("Tomáš","Čvančara","Männer","ST","Borussia Mönchengladbach","31","Tschechien"),
    playerSeed("Grant Leon","Ranos","Männer","ST","Borussia Mönchengladbach","28","Armenien"),
    playerSeed("Tim","Kleindienst","Männer","ST","Borussia Mönchengladbach","11","Deutschland"),
    playerSeed("Nathan","Ngoumou","Männer","RA","Borussia Mönchengladbach","19","Frankreich"),
    playerSeed("Robin","Hack","Männer","LA","Borussia Mönchengladbach","25","Deutschland"),
    playerSeed("Franck","Honorat","Männer","RA","Borussia Mönchengladbach","9","Frankreich"),
    playerSeed("Giovanni","Reyna","Männer","OM","Borussia Mönchengladbach","13","USA"),
    playerSeed("Wael","Mohya","Männer","ZM","Borussia Mönchengladbach","36","Deutschland"),
    playerSeed("Zento","Uno","Männer","ZM","Borussia Mönchengladbach","","Japan"),
    playerSeed("Enzo","Leopold","Männer","ZM","Borussia Mönchengladbach","","Deutschland"),
    playerSeed("Jan","Leszczyński","Männer","ZM","Borussia Mönchengladbach","","Polen"),
    playerSeed("Florian","Neuhaus","Männer","ZM","Borussia Mönchengladbach","10","Deutschland"),
    playerSeed("Kevin","Stöger","Männer","OM","Borussia Mönchengladbach","7","Österreich"),
    playerSeed("Philipp","Sander","Männer","DM","Borussia Mönchengladbach","16","Deutschland"),
    playerSeed("Jens","Castrop","Männer","ZM","Borussia Mönchengladbach","17","Deutschland"),
    playerSeed("Yukhym","Konoplya","Männer","RV","Borussia Mönchengladbach","","Ukraine"),
    playerSeed("David","Herold","Männer","LV","Borussia Mönchengladbach","","Deutschland"),
    playerSeed("Nico","Elvedi","Männer","IV","Borussia Mönchengladbach","30","Schweiz"),
    playerSeed("Joe","Scally","Männer","RV","Borussia Mönchengladbach","29","USA"),
    playerSeed("Fabio Cristian","Chiarodia","Männer","IV","Borussia Mönchengladbach","2","Italien"),
    playerSeed("Lukas","Ullrich","Männer","LV","Borussia Mönchengladbach","26","Deutschland"),
    playerSeed("Kevin","Diks","Männer","IV","Borussia Mönchengladbach","4","Indonesien"),
    playerSeed("Daniel","Batz","Männer","TW","Borussia Mönchengladbach","","Deutschland"),
    playerSeed("Tobias","Sippel","Männer","TW","Borussia Mönchengladbach","21","Deutschland"),
    playerSeed("Jan Jakob","Olschowsky","Männer","TW","Borussia Mönchengladbach","23","Deutschland"),
    playerSeed("Moritz","Nicolas","Männer","TW","Borussia Mönchengladbach","33","Deutschland"),
    playerSeed("Alessio","Besio","Männer","ST","VfL Wolfsburg","23","Schweiz"),
    playerSeed("Fabian","Reese","Männer","LA","VfL Wolfsburg","11","Deutschland"),
    playerSeed("Robert","Glatzel","Männer","ST","VfL Wolfsburg","19","Deutschland"),
    playerSeed("Fraser","Hornby","Männer","ST","VfL Wolfsburg","","Schottland"),
    playerSeed("Kento","Shiogai","Männer","RA","VfL Wolfsburg","7","Japan"),
    playerSeed("Dženan","Pejčinović","Männer","ST","VfL Wolfsburg","17","Deutschland"),
    playerSeed("Andreas","Skov Olsen","Männer","RA","VfL Wolfsburg","7","Dänemark"),
    playerSeed("David Alessandro","Leal Costa","Männer","LA","VfL Wolfsburg","37","Deutschland"),
    playerSeed("Mohammed","Amoura","Männer","ST","VfL Wolfsburg","9","Algerien"),
    playerSeed("Elvis","Rexhbeçaj","Männer","ZM","VfL Wolfsburg","37","Kosovo"),
    playerSeed("Pharrell","Hensel","Männer","ZM","VfL Wolfsburg","37","Deutschland"),
    playerSeed("Christian","Eriksen","Männer","ZM","VfL Wolfsburg","24","Dänemark"),
    playerSeed("Vinicius","Souza","Männer","DM","VfL Wolfsburg","5","Brasilien"),
    playerSeed("Eryk Artur","Grzywacz","Männer","ZM","VfL Wolfsburg","","Polen"),
    playerSeed("Bence","Dárdai","Männer","OM","VfL Wolfsburg","8","Ungarn"),
    playerSeed("Lovro","Majer","Männer","OM","VfL Wolfsburg","10","Kroatien"),
    playerSeed("Aster","Vranckx","Männer","DM","VfL Wolfsburg","6","Belgien"),
    playerSeed("Mattias","Svanberg","Männer","ZM","VfL Wolfsburg","32","Schweden"),
    playerSeed("Yannick","Gerhardt","Männer","ZM","VfL Wolfsburg","31","Deutschland"),
    playerSeed("Maximilian","Arnold","Männer","DM","VfL Wolfsburg","27","Deutschland"),
    playerSeed("Aaron","Zehnter","Männer","LV","VfL Wolfsburg","25","Deutschland"),
    playerSeed("Hauke","Wahl","Männer","IV","VfL Wolfsburg","6","Deutschland"),
    playerSeed("Jonas","Adjetey","Männer","IV","VfL Wolfsburg","18","Ghana"),
    playerSeed("Cleiton Santana","dos Santos","Männer","IV","VfL Wolfsburg","33","Brasilien"),
    playerSeed("Saël","Kumbedi","Männer","RV","VfL Wolfsburg","26","Frankreich"),
    playerSeed("Konstantinos","Koulierakis","Männer","IV","VfL Wolfsburg","4","Griechenland"),
    playerSeed("Mathys","Angély","Männer","IV","VfL Wolfsburg","22","Frankreich"),
    playerSeed("Moritz","Jenz","Männer","IV","VfL Wolfsburg","15","Deutschland"),
    playerSeed("Denis","Vavro","Männer","IV","VfL Wolfsburg","3","Slowakei"),
    playerSeed("Till","Neininger","Männer","IV","VfL Wolfsburg","44","Deutschland"),
    playerSeed("Jan","Bürger","Männer","IV","VfL Wolfsburg","41","Deutschland"),
    playerSeed("Joakim","Mæhle","Männer","RV","VfL Wolfsburg","21","Dänemark"),
    playerSeed("Rogério","Oliveira da Silva","Männer","LV","VfL Wolfsburg","13","Brasilien"),
    playerSeed("Kilian","Fischer","Männer","RV","VfL Wolfsburg","2","Deutschland"),
    playerSeed("Jakub","Zieliński","Männer","TW","VfL Wolfsburg","30","Polen"),
    playerSeed("Kamil","Grabara","Männer","TW","VfL Wolfsburg","1","Polen"),
    playerSeed("Marius","Müller","Männer","TW","VfL Wolfsburg","29","Deutschland"),
    playerSeed("Pavao","Pervan","Männer","TW","VfL Wolfsburg","12","Österreich"),
    playerSeed("Bruno","Katz","Männer","ST","VfL Wolfsburg","42","Finnland"),
    playerSeed("Said","El Mala","Männer","LA","1. FC Köln","13","Deutschland"),
    playerSeed("Jakub","Kamiński","Männer","LA","1. FC Köln","16","Polen"),
    playerSeed("Ragnar","Ache","Männer","ST","1. FC Köln","9","Deutschland"),
    playerSeed("Linton","Maina","Männer","RA","1. FC Köln","37","Deutschland"),
    playerSeed("Luca","Waldschmidt","Männer","ST","1. FC Köln","7","Deutschland"),
    playerSeed("Marius","Bülter","Männer","ST","1. FC Köln","30","Deutschland"),
    playerSeed("Fynn","Schenten","Männer","ST","1. FC Köln","40","Deutschland"),
    playerSeed("Imad","Rondić","Männer","ST","1. FC Köln","27","Bosnien und Herzegowina"),
    playerSeed("Malek","El Mala","Männer","ST","1. FC Köln","19","Deutschland"),
    playerSeed("Ísak Bergmann","Jóhannesson","Männer","ZM","1. FC Köln","18","Island"),
    playerSeed("Tom","Krauß","Männer","DM","1. FC Köln","5","Deutschland"),
    playerSeed("Alessio","Castro-Montes","Männer","RM","1. FC Köln","17","Belgien"),
    playerSeed("Emin","Kujović","Männer","ZM","1. FC Köln","","Bosnien und Herzegowina"),
    playerSeed("Fayssal","Harchaoui","Männer","ZM","1. FC Köln","34","Deutschland"),
    playerSeed("Jahmai","Simpson-Pusey","Männer","IV","1. FC Köln","22","England"),
    playerSeed("Rav","van den Berg","Männer","IV","1. FC Köln","33","Niederlande"),
    playerSeed("Sebastian Søraas","Sebulonsen","Männer","RV","1. FC Köln","28","Norwegen"),
    playerSeed("Jan","Thielmann","Männer","RV","1. FC Köln","29","Deutschland"),
    playerSeed("Joel","Schmied","Männer","IV","1. FC Köln","2","Schweiz"),
    playerSeed("Luka","Lochoshvili","Männer","IV","1. FC Köln","","Georgien"),
    playerSeed("Julian Andreas","Pauli","Männer","IV","1. FC Köln","24","Deutschland"),
    playerSeed("Jusuf","Gazibegović","Männer","RV","1. FC Köln","25","Bosnien und Herzegowina"),
    playerSeed("Rasmus","Carstensen","Männer","RV","1. FC Köln","18","Dänemark"),
    playerSeed("Timo","Hübers","Männer","IV","1. FC Köln","4","Deutschland"),
    playerSeed("Elias-Geoffrey","Bakatukanda","Männer","IV","1. FC Köln","38","DR Kongo"),
    playerSeed("Neo","Telle","Männer","LV","1. FC Köln","49","Deutschland"),
    playerSeed("Marvin","Schwäbe","Männer","TW","1. FC Köln","1","Deutschland"),
    playerSeed("Ron-Robert","Zieler","Männer","TW","1. FC Köln","20","Deutschland"),
    playerSeed("Matthias","Köbbing","Männer","TW","1. FC Köln","44","Deutschland"),
    playerSeed("Uchenna","Ogundu","Männer","ST","FC Augsburg","39","Nigeria"),
    playerSeed("Rodrigo","Ribeiro","Männer","ST","FC Augsburg","21","Portugal"),
    playerSeed("Elias","Saad","Männer","LA","FC Augsburg","","Tunesien"),
    playerSeed("Nathanael","Mbuku","Männer","RA","FC Augsburg","11","DR Kongo"),
    playerSeed("Michael","Gregoritsch","Männer","ST","FC Augsburg","38","Österreich"),
    playerSeed("Steve","Mounié","Männer","ST","FC Augsburg","15","Benin"),
    playerSeed("Yusuf","Kabadayi","Männer","LA","FC Augsburg","7","Deutschland"),
    playerSeed("Kyliane","Dong","Männer","RA","FC Augsburg","","Frankreich"),
    playerSeed("Thomas","Kastanaras","Männer","ST","FC Augsburg","24","Deutschland"),
    playerSeed("Alexis","Claude-Maurice","Männer","OM","FC Augsburg","20","Frankreich"),
    playerSeed("Fabian","Rieder","Männer","ZM","FC Augsburg","32","Schweiz"),
    playerSeed("Mert","Kömür","Männer","OM","FC Augsburg","36","Deutschland"),
    playerSeed("Anton","Kade","Männer","ZM","FC Augsburg","30","Deutschland"),
    playerSeed("Han-Noah","Massengo","Männer","DM","FC Augsburg","4","Frankreich"),
    playerSeed("Kristijan","Jakić","Männer","DM","FC Augsburg","17","Kroatien"),
    playerSeed("Robin","Fellhauer","Männer","ZM","FC Augsburg","19","Deutschland"),
    playerSeed("Yannik","Keitel","Männer","DM","FC Augsburg","14","Deutschland"),
    playerSeed("Tim","Breithaupt","Männer","DM","FC Augsburg","18","Deutschland"),
    playerSeed("Mahmut","Kücüksahin","Männer","ZM","FC Augsburg","42","Türkei"),
    playerSeed("Chrislain","Matsima","Männer","IV","FC Augsburg","5","Frankreich"),
    playerSeed("Noahkai","Banks","Männer","IV","FC Augsburg","40","USA"),
    playerSeed("Keven","Schlotterbeck","Männer","IV","FC Augsburg","31","Deutschland"),
    playerSeed("Calvin Marc","Brackelmann","Männer","IV","FC Augsburg","","Deutschland"),
    playerSeed("Dimitrios","Giannoulis","Männer","LV","FC Augsburg","13","Griechenland"),
    playerSeed("Marius","Wolf","Männer","RV","FC Augsburg","27","Deutschland"),
    playerSeed("Maximilian","Bauer","Männer","IV","FC Augsburg","23","Deutschland"),
    playerSeed("Jeffrey","Gouweleeuw","Männer","IV","FC Augsburg","6","Niederlande"),
    playerSeed("Mads","Pedersen","Männer","LV","FC Augsburg","3","Dänemark"),
    playerSeed("Felix","Meiser","Männer","IV","FC Augsburg","41","Deutschland"),
    playerSeed("Finn Gilbert","Dahmen","Männer","TW","FC Augsburg","1","Deutschland"),
    playerSeed("Nediljko","Labrović","Männer","TW","FC Augsburg","22","Kroatien"),
    playerSeed("Faik","Sakar","Männer","TW","FC Augsburg","","Deutschland"),
    playerSeed("Oliver","Burke","Männer","ST","1. FC Union Berlin","7","Schottland"),
    playerSeed("Ilyas","Ansah","Männer","ST","1. FC Union Berlin","10","Deutschland"),
    playerSeed("Dmytro","Bogdanov","Männer","ST","1. FC Union Berlin","30","Ukraine"),
    playerSeed("Andrej","Ilić","Männer","ST","1. FC Union Berlin","23","Serbien"),
    playerSeed("Marin","Ljubičić","Männer","ST","1. FC Union Berlin","27","Kroatien"),
    playerSeed("Chris","Bedia","Männer","ST","1. FC Union Berlin","11","Elfenbeinküste"),
    playerSeed("Tim","Skarke","Männer","RA","1. FC Union Berlin","21","Deutschland"),
    playerSeed("Livan","Burcu","Männer","LA","1. FC Union Berlin","9","Türkei"),
    playerSeed("Zeno","Van Den Bosch","Männer","DM","1. FC Union Berlin","","Belgien"),
    playerSeed("Robert","Skov","Männer","RM","1. FC Union Berlin","24","Dänemark"),
    playerSeed("András","Schäfer","Männer","ZM","1. FC Union Berlin","13","Ungarn"),
    playerSeed("Janik","Haberer","Männer","ZM","1. FC Union Berlin","19","Deutschland"),
    playerSeed("Aljoscha","Kemlein","Männer","DM","1. FC Union Berlin","6","Deutschland"),
    playerSeed("Woo-Yeong","Jeong","Männer","OM","1. FC Union Berlin","11","Südkorea"),
    playerSeed("Stanley","N'Soki","Männer","IV","1. FC Union Berlin","34","Frankreich"),
    playerSeed("Derrick","Köhn","Männer","LV","1. FC Union Berlin","39","Deutschland"),
    playerSeed("Andrik","Markgraf","Männer","IV","1. FC Union Berlin","3","Deutschland"),
    playerSeed("Marvin","Friedrich","Männer","IV","1. FC Union Berlin","","Deutschland"),
    playerSeed("Christopher","Trimmel","Männer","RV","1. FC Union Berlin","28","Österreich"),
    playerSeed("Josip","Juranović","Männer","RV","1. FC Union Berlin","18","Kroatien"),
    playerSeed("Oluwaseun","Ogbemudia","Männer","IV","1. FC Union Berlin","41","Deutschland"),
    playerSeed("Leopold","Querfeld","Männer","IV","1. FC Union Berlin","14","Österreich"),
    playerSeed("Tom Alexander","Rothe","Männer","LV","1. FC Union Berlin","15","Deutschland"),
    playerSeed("Matheo","Raab","Männer","TW","1. FC Union Berlin","31","Deutschland"),
    playerSeed("Frederik","Rønnow","Männer","TW","1. FC Union Berlin","1","Dänemark"),
    playerSeed("Carl","Klaus","Männer","TW","1. FC Union Berlin","25","Deutschland"),
    playerSeed("Otto Emerson","Stange","Männer","ST","Hamburger SV","49","Deutschland"),
    playerSeed("Rayan","Philippe","Männer","ST","Hamburger SV","14","Frankreich"),
    playerSeed("Yussuf","Poulsen","Männer","ST","Hamburger SV","15","Dänemark"),
    playerSeed("Fábio","Baldé","Männer","LA","Hamburger SV","45","Portugal"),
    playerSeed("Emir","Sahiti","Männer","RA","Hamburger SV","29","Kosovo"),
    playerSeed("Alexander Rossing","Lelesiit","Männer","ST","Hamburger SV","38","Dänemark"),
    playerSeed("Bakery","Jatta","Männer","RA","Hamburger SV","18","Gambia"),
    playerSeed("Jean-Luc","Dompe","Männer","LA","Hamburger SV","7","Frankreich"),
    playerSeed("Nicolai","Remberg","Männer","ZM","Hamburger SV","21","Deutschland"),
    playerSeed("Nicolás","Capaldo","Männer","ZM","Hamburger SV","24","Argentinien"),
    playerSeed("Albert Sambi","Lokonga","Männer","DM","Hamburger SV","6","Belgien"),
    playerSeed("Albert","Grønbæk","Männer","OM","Hamburger SV","23","Dänemark"),
    playerSeed("Kofi Jeremy","Amoako","Männer","DM","Hamburger SV","","Deutschland"),
    playerSeed("Immanuel","Pherai","Männer","OM","Hamburger SV","10","Niederlande"),
    playerSeed("Daniel","Elfadli","Männer","DM","Hamburger SV","8","Deutschland"),
    playerSeed("Jordan","Torunarigha","Männer","IV","Hamburger SV","25","Deutschland"),
    playerSeed("Warmed","Omari","Männer","IV","Hamburger SV","17","Frankreich"),
    playerSeed("Shafiq","Nandja","Männer","IV","Hamburger SV","43","Deutschland"),
    playerSeed("Miro","Muheim","Männer","LV","Hamburger SV","28","Schweiz"),
    playerSeed("Joel","Agyekum","Männer","RV","Hamburger SV","39","Deutschland"),
    playerSeed("Aboubaka","Soumahoro","Männer","IV","Hamburger SV","22","Frankreich"),
    playerSeed("Fernando","Dickes","Männer","TW","Hamburger SV","41","Deutschland"),
    playerSeed("Sander","Tangvik","Männer","TW","Hamburger SV","12","Norwegen"),
    playerSeed("Daniel","Heuer Fernandes","Männer","TW","Hamburger SV","1","Portugal"),
    playerSeed("Fisnik","Asllani","Männer","ST","TSG Hoffenheim","11","Kosovo"),
    playerSeed("Tim","Lemperle","Männer","ST","TSG Hoffenheim","19","Deutschland"),
    playerSeed("Patrick","Wimmer","Männer","RA","TSG Hoffenheim","","Österreich"),
    playerSeed("Adam","Hložek","Männer","ST","TSG Hoffenheim","23","Tschechien"),
    playerSeed("Alessandro","Vogt","Männer","ST","TSG Hoffenheim","","Schweiz"),
    playerSeed("Gift","Orban","Männer","ST","TSG Hoffenheim","14","Nigeria"),
    playerSeed("Max","Moerstedt","Männer","ST","TSG Hoffenheim","33","Deutschland"),
    playerSeed("Haris","Tabaković","Männer","ST","TSG Hoffenheim","26","Bosnien und Herzegowina"),
    playerSeed("Yannick Fereira","Eduardo","Männer","ST","TSG Hoffenheim","31","Tschechien"),
    playerSeed("Erencan","Yardimci","Männer","ST","TSG Hoffenheim","53","Türkei"),
    playerSeed("Leon","Avdullahu","Männer","DM","TSG Hoffenheim","7","Schweiz"),
    playerSeed("Wouter","Burger","Männer","DM","TSG Hoffenheim","18","Niederlande"),
    playerSeed("Cajetan Benjamin","Lenz","Männer","ZM","TSG Hoffenheim","","Deutschland"),
    playerSeed("Muhammed","Damar","Männer","OM","TSG Hoffenheim","10","Deutschland"),
    playerSeed("Luis","Engelns","Männer","ZM","TSG Hoffenheim","16","Deutschland"),
    playerSeed("Deniz","Zeitler","Männer","ZM","TSG Hoffenheim","38","Deutschland"),
    playerSeed("Bambasé","Conté","Männer","OM","TSG Hoffenheim","31","Deutschland"),
    playerSeed("Umut Deger","Tohumcu","Männer","ZM","TSG Hoffenheim","17","Deutschland"),
    playerSeed("Andrej","Kramarić","Männer","OM","TSG Hoffenheim","27","Kroatien"),
    playerSeed("Dennis","Geiger","Männer","ZM","TSG Hoffenheim","8","Deutschland"),
    playerSeed("Albian","Hajdari","Männer","IV","TSG Hoffenheim","21","Schweiz"),
    playerSeed("Ozan","Kabak","Männer","IV","TSG Hoffenheim","5","Türkei"),
    playerSeed("Mats","Rots","Männer","IV","TSG Hoffenheim","","Niederlande"),
    playerSeed("Robin","Hranáč","Männer","IV","TSG Hoffenheim","2","Tschechien"),
    playerSeed("Alexander","Prass","Männer","LV","TSG Hoffenheim","22","Österreich"),
    playerSeed("Koki","Machida","Männer","IV","TSG Hoffenheim","28","Japan"),
    playerSeed("Valentin","Gendrey","Männer","RV","TSG Hoffenheim","15","Frankreich"),
    playerSeed("Hennes","Behrens","Männer","LV","TSG Hoffenheim","40","Deutschland"),
    playerSeed("Arthur","Chaves","Männer","IV","TSG Hoffenheim","35","Brasilien"),
    playerSeed("Bernardo Fernandes da Silva","Junior","Männer","IV","TSG Hoffenheim","13","Brasilien"),
    playerSeed("Vladimír","Coufal","Männer","RV","TSG Hoffenheim","34","Tschechien"),
    playerSeed("Attila","Szalai","Männer","IV","TSG Hoffenheim","41","Ungarn"),
    playerSeed("Sean","Dulic","Männer","IV","TSG Hoffenheim","","Deutschland"),
    playerSeed("Kelven","Frees","Männer","TW","TSG Hoffenheim","45","Deutschland"),
    playerSeed("Oliver","Baumann","Männer","TW","TSG Hoffenheim","1","Deutschland"),
    playerSeed("Luca","Philipp","Männer","TW","TSG Hoffenheim","37","Deutschland"),
    playerSeed("Lukas","Petersson","Männer","TW","TSG Hoffenheim","36","Island"),
    playerSeed("Francis-Ikechukwu","Onyeka","Männer","ST","SV Elversberg","","Deutschland"),
    playerSeed("David","Mokwa Ntusu","Männer","ST","SV Elversberg","42","Frankreich"),
    playerSeed("Lukas","Petkov","Männer","ST","SV Elversberg","25","Bulgarien"),
    playerSeed("Tom","Zimmerschied","Männer","LA","SV Elversberg","29","Deutschland"),
    playerSeed("Jason","Ceka","Männer","RA","SV Elversberg","11","Deutschland"),
    playerSeed("Luca Pascal","Schnellbacher","Männer","ST","SV Elversberg","24","Deutschland"),
    playerSeed("Luca","Pfeiffer","Männer","ST","SV Elversberg","16","Deutschland"),
    playerSeed("Mohammad","Mahmoud","Männer","ST","SV Elversberg","18","Palästina"),
    playerSeed("Noah","Darvich","Männer","OM","SV Elversberg","","Deutschland"),
    playerSeed("Maurice","Krattenmacher","Männer","OM","SV Elversberg","","Deutschland"),
    playerSeed("Łukasz","Poreba","Männer","ZM","SV Elversberg","8","Polen"),
    playerSeed("Amara","Condé","Männer","ZM","SV Elversberg","6","Deutschland"),
    playerSeed("Frederik","Schmahl","Männer","ZM","SV Elversberg","17","Deutschland"),
    playerSeed("Carlo","Sickinger","Männer","DM","SV Elversberg","23","Deutschland"),
    playerSeed("Filimon","Gerezgiher","Männer","OM","SV Elversberg","27","Eritrea"),
    playerSeed("Lasse","Günther","Männer","LV","SV Elversberg","21","Deutschland"),
    playerSeed("Lukas Finn","Pinckert","Männer","RV","SV Elversberg","19","Deutschland"),
    playerSeed("Felix","Keidel","Männer","RV","SV Elversberg","43","Deutschland"),
    playerSeed("Nicholas","Mickelson","Männer","RV","SV Elversberg","2","Thailand"),
    playerSeed("Maximilian","Rohr","Männer","IV","SV Elversberg","31","Deutschland"),
    playerSeed("Jan","Gyamerah","Männer","RV","SV Elversberg","30","Ghana"),
    playerSeed("Florian","Le Joncour","Männer","IV","SV Elversberg","3","Frankreich"),
    playerSeed("Luis","Seifert","Männer","IV","SV Elversberg","4","Deutschland"),
    playerSeed("Nicolas","Kristof","Männer","TW","SV Elversberg","20","Österreich"),
    playerSeed("Tim","Boss","Männer","TW","SV Elversberg","28","Deutschland"),
    playerSeed("Frank","Lehmann","Männer","TW","SV Elversberg","1","Deutschland"),
    playerSeed("Timur","Gayret","Männer","ST","SC Paderborn 07","","Deutschland"),
    playerSeed("Albert","Millgramm","Männer","ST","SC Paderborn 07","","Deutschland"),
    playerSeed("Kennedy","Okpala","Männer","ST","SC Paderborn 07","10","Deutschland"),
    playerSeed("Steffen","Tigges","Männer","ST","SC Paderborn 07","27","Deutschland"),
    playerSeed("Stefano","Marino","Männer","ST","SC Paderborn 07","30","Deutschland"),
    playerSeed("Marco","Womer","Männer","ST","SC Paderborn 07","18","Deutschland"),
    playerSeed("Sven","Michel","Männer","ST","SC Paderborn 07","11","Deutschland"),
    playerSeed("Oliver","Batista Meier","Männer","OM","SC Paderborn 07","","Deutschland"),
    playerSeed("Tom","Baack","Männer","ZM","SC Paderborn 07","","Deutschland"),
    playerSeed("Luka","Đurić","Männer","ZM","SC Paderborn 07","","Serbien"),
    playerSeed("Mattes","Hansen","Männer","ZM","SC Paderborn 07","22","Deutschland"),
    playerSeed("Nick","Batzner","Männer","OM","SC Paderborn 07","9","Deutschland"),
    playerSeed("Mika","Baur","Männer","OM","SC Paderborn 07","14","Deutschland"),
    playerSeed("Medin","Kojic","Männer","ZM","SC Paderborn 07","44","Deutschland"),
    playerSeed("Sebastian","Klaas","Männer","OM","SC Paderborn 07","26","Deutschland"),
    playerSeed("Santiago","Castaneda","Männer","DM","SC Paderborn 07","5","USA"),
    playerSeed("Raphael","Obermair","Männer","RM","SC Paderborn 07","23","Deutschland"),
    playerSeed("Nyamekye","Awortwie-Grant","Männer","IV","SC Paderborn 07","","Deutschland"),
    playerSeed("Jano","Ter-Horst","Männer","RV","SC Paderborn 07","","Deutschland"),
    playerSeed("Jonah","Sticker","Männer","IV","SC Paderborn 07","3","Deutschland"),
    playerSeed("Niklas","Mohr","Männer","LV","SC Paderborn 07","24","Deutschland"),
    playerSeed("Felix","Götze","Männer","IV","SC Paderborn 07","20","Deutschland"),
    playerSeed("Martin","Ens","Männer","IV","SC Paderborn 07","43","Deutschland"),
    playerSeed("Tristan","Zobel","Männer","IV","SC Paderborn 07","38","Deutschland"),
    playerSeed("Kevin","Krumme","Männer","IV","SC Paderborn 07","42","Deutschland"),
    playerSeed("Tjark Lasse","Scheller","Männer","IV","SC Paderborn 07","25","Deutschland"),
    playerSeed("Marcel","Hoffmeier","Männer","IV","SC Paderborn 07","33","Deutschland"),
    playerSeed("Larin","Curda","Männer","RV","SC Paderborn 07","17","Deutschland"),
    playerSeed("Ruben","Müller","Männer","RV","SC Paderborn 07","2","Deutschland"),
    playerSeed("Nahuel","Noll","Männer","TW","SC Paderborn 07","","Deutschland"),
    playerSeed("Markus","Schubert","Männer","TW","SC Paderborn 07","1","Deutschland"),
    playerSeed("Florian","Pruhs","Männer","TW","SC Paderborn 07","12","Deutschland"),
    playerSeed("Moussa","Sylla","Männer","ST","FC Schalke 04","9","Mali"),
    playerSeed("Junior Chukwubuike","Adamu","Männer","ST","FC Schalke 04","","Österreich"),
    playerSeed("Kenan","Karaman","Männer","ST","FC Schalke 04","19","Türkei"),
    playerSeed("Christian Pierre Louis","Gomis","Männer","LA","FC Schalke 04","7","Senegal"),
    playerSeed("Mika","Wallentowitz","Männer","ST","FC Schalke 04","35","Deutschland"),
    playerSeed("Bryan","Lasme","Männer","ST","FC Schalke 04","11","Frankreich"),
    playerSeed("Emil Winther","Højlund","Männer","ST","FC Schalke 04","15","Dänemark"),
    playerSeed("Jakob","Sachse","Männer","ST","FC Schalke 04","","Deutschland"),
    playerSeed("Soufian","El-Faouzi","Männer","ZM","FC Schalke 04","","Deutschland"),
    playerSeed("Adil","Aouchiche","Männer","OM","FC Schalke 04","","Frankreich"),
    playerSeed("Dejan","Ljubičić","Männer","ZM","FC Schalke 04","","Österreich"),
    playerSeed("Ron","Schallenberg","Männer","DM","FC Schalke 04","","Deutschland"),
    playerSeed("Max","Grüger","Männer","ZM","FC Schalke 04","","Deutschland"),
    playerSeed("Finn Dominik","Porath","Männer","ZM","FC Schalke 04","","Deutschland"),
    playerSeed("Janik","Bachmann","Männer","DM","FC Schalke 04","14","Deutschland"),
    playerSeed("Mauro","Zalazar","Männer","OM","FC Schalke 04","16","Uruguay"),
    playerSeed("Aris","Bayindir","Männer","ZM","FC Schalke 04","20","Deutschland"),
    playerSeed("Mertcan","Ayhan","Männer","IV","FC Schalke 04","43","Türkei"),
    playerSeed("Vitalie","Becker","Männer","LV","FC Schalke 04","33","Deutschland"),
    playerSeed("Satoshi","Tanaka","Männer","DM","FC Schalke 04","","Japan"),
    playerSeed("Hassan","Kurucay","Männer","IV","FC Schalke 04","4","Türkei"),
    playerSeed("Nikola","Katić","Männer","IV","FC Schalke 04","25","Bosnien und Herzegowina"),
    playerSeed("Timo","Becker","Männer","IV","FC Schalke 04","5","Deutschland"),
    playerSeed("Adrian Tobias","Gantenbein","Männer","RV","FC Schalke 04","17","Schweiz"),
    playerSeed("Dylan","Leonard","Männer","RV","FC Schalke 04","3","Australien"),
    playerSeed("Anton","Donkor","Männer","LV","FC Schalke 04","30","Deutschland"),
    playerSeed("Martin Jean","Wasinski","Männer","IV","FC Schalke 04","21","Belgien"),
    playerSeed("Tomáš","Kalas","Männer","IV","FC Schalke 04","26","Tschechien"),
    playerSeed("Tidiane","Toure","Männer","RV","FC Schalke 04","49","Frankreich"),
    playerSeed("Steve","Noode","Männer","IV","FC Schalke 04","","Kamerun"),
    playerSeed("Niklas","Barthel","Männer","IV","FC Schalke 04","36","Deutschland"),
    playerSeed("Loris","Karius","Männer","TW","FC Schalke 04","1","Deutschland"),
    playerSeed("Luca","Podlech","Männer","TW","FC Schalke 04","32","Deutschland")
  ]);
  add("referees", [ {name:"DFB Referee",countryId:de(),license:"DFB",varEnabled:true,image:""}, {name:"UEFA Elite Referee",countryId:de(),license:"UEFA Elite",varEnabled:true,image:""} ]);
  add("career", [ {title:"Kreisliga",xp:0,reward:"Erste Lizenz",unlock:"Training"}, {title:"Bezirksliga",xp:1000,reward:"Neue Prüfungen",unlock:"Schwerere Szenen"}, {title:"Regionalliga",xp:8000,reward:"DFB-Beobachtung",unlock:"VAR-Schulung"}, {title:"Bundesliga",xp:25000,reward:"Elite-Status",unlock:"Topspiele"}, {title:"FIFA Elite VAR",xp:75000,reward:"Welt-VAR",unlock:"WM-Finale"} ]);
  if((!adminData.scenes||!adminData.scenes.length)&&typeof scenes!=="undefined"&&Array.isArray(scenes)){ adminData.scenes=scenes.map(s=>normalizeScene(s)); changed=true; }

  add("media", [
    {type:"Bild",title:"VAR Check Platzhalter",path:"assets/scenes/var-check-placeholder.png",category:"Szene",credit:"VAR Challenge",notes:"Standardbild für Szenen ohne eigenes Bild"},
    {type:"Logo",title:"VAR Challenge Logo",path:"assets/logo.png",category:"Branding",credit:"GörnaldoBerlin",notes:"Hauptlogo des Spiels"}
  ]);
  add("communitySubmissions", [
    {priority:"platzpass",user:"DemoCreator",competitionId:comp("Bundesliga"),homeClubId:findClubIdByName("FC Bayern München"),awayClubId:findClubIdByName("SV Werder Bremen"),title:"Möglicher Strafstoß Bayern gegen Bremen",category:"Strafstoß",description:"{ANGREIFER} geht nach Kontakt im Strafraum zu Boden. Prüfung auf Strafstoß.",correct:"Kein Elfmeter",explanation:"Der Kontakt ist leicht und nicht ursächlich genug für einen Strafstoß.",image:"",video:"",status:"Eingegangen",adminComment:"",submittedAt:getNow()},
    {priority:"standard",user:"Tester01",competitionId:comp("Google Pixel Frauen-Bundesliga"),homeClubId:findClubIdByName("FC Bayern München Frauen"),awayClubId:findClubIdByName("SV Werder Bremen Frauen"),title:"Handspiel nach Flanke",category:"Handspiel",description:"Eine Flanke wird im Strafraum mit ausgestrecktem Arm geblockt.",correct:"Elfmeter",explanation:"Der Arm vergrößert die Körperfläche unnatürlich.",image:"",video:"",status:"Eingegangen",adminComment:"",submittedAt:getNow()}
  ]);

  if(!adminData.placepass){
    adminData.placepass={
      seasonName:"Platzpass Saison 1",
      theme:"Bundesliga 2026/27",
      maxLevel:100,
      currentLevel:0,
      progress:0,
      timeLeft:"Noch 74 Tage verfügbar",
      description:"Mit dem Platzpass unterstützt du die Weiterentwicklung von VAR Challenge. Du erhältst kosmetische Belohnungen, zusätzliche Missionen und Community-Vorteile. Alle spielentscheidenden Funktionen bleiben kostenlos verfügbar.",
      freeBenefits:["Daily Missionen","Wochenmissionen","Saisonmissionen","Kostenlose Belohnungen","Community-Ideen","Community-Szenen einreichen","Creator XP","Basis-Statistiken"],
      premiumBenefits:["Alle kostenlosen Inhalte","Priorisierte Community-Szenen","Antwort innerhalb von 48 Stunden","Platzpass-Warteschlange oben","Creator-Badge","Exklusive Profilrahmen","Exklusive Profilbanner","Exklusive Titel","Premium-Belohnungen","Beta-Zugang","Zusätzliche Missionen","Supporter-Rolle"],
      rewards:[
        {id:createId(),level:1,reward:"100 Credits",track:"free"},
        {id:createId(),level:5,reward:"Profilbanner: VAR Room",track:"premium"},
        {id:createId(),level:10,reward:"Titel: Video Assistant",track:"premium"},
        {id:createId(),level:20,reward:"Creator Badge Bronze",track:"premium"},
        {id:createId(),level:50,reward:"Titel: Bundesliga Experte",track:"premium"},
        {id:createId(),level:100,reward:"Saisonabzeichen Platzpass Elite",track:"premium"}
      ],
      missions:[
        {id:createId(),type:"Daily",title:"10 richtige Entscheidungen",reward:"100 XP"},
        {id:createId(),type:"Weekly",title:"50 Szenen spielen",reward:"500 XP"},
        {id:createId(),type:"Season",title:"1000 richtige Entscheidungen",reward:"Elite Badge"}
      ]
    };
    changed=true;
  }
  if(!adminData.news||!adminData.news.length){
    adminData.news=[
      {id:createId(),title:"Admin Center 3.6 vorbereitet",category:"Update",date:"06.07.2026",pinned:true,text:"+ Platzpass-Seite\n+ News & Infos\n+ Platzpass-Verwaltung\n+ News Center",active:true,createdAt:getNow(),updatedAt:getNow()},
      {id:createId(),title:"Platzpass Saison 1",category:"Platzpass",date:"06.07.2026",pinned:true,text:"Der Platzpass enthält kosmetische Belohnungen, zusätzliche Missionen und Creator-Vorteile. Platzpass-Szenen werden innerhalb von 48 Stunden geprüft.",active:true,createdAt:getNow(),updatedAt:getNow()},
      {id:createId(),title:"Roadmap 0.4 Karriere",category:"Roadmap",date:"06.07.2026",pinned:false,text:"Geplant: Karriere, Lizenzen, Nominierungen und saisonale Herausforderungen.",active:true,createdAt:getNow(),updatedAt:getNow()}
    ];
    changed=true;
  }
  if(changed) saveAdminData();
}
function clubSeed(name,shortName,gender,competitionId,city,stadium,primaryColor,secondaryColor,premium){ return {name,shortName,gender,countryId:findId(adminData.countries,"name","Deutschland"),competitionId,seasonId:null,city,stadium,logo:"",primaryColor,secondaryColor,accentColor:primaryColor,premium,description:""}; }
function playerSeed(firstName,lastName,gender,position,clubName,number="",nationality=""){
  return {
    firstName,lastName,gender,position,number,nationality,
    clubId:findId(adminData.clubs,"name",clubName),
    countryId:findId(adminData.countries,"name","Deutschland"),
    image:"",
    dataStatus:"snapshot",
    season:"2026/27",
    snapshotVersion:"3.7.1c",
    sourceNote:"Bundesliga Snapshot 2026/27 – Stand Juli 2026, Transferfenster offen – 3.7.1c"
  };
}
function normalizeScene(s){
  const gender = s.gender || "Frauen";
  const countryId = s.countryId || findId(adminData.countries,"name","Deutschland");
  const competitionId = s.competitionId || findCompetitionIdByNameAndGender(s.league || s.competition, gender);
  const seasonId = s.seasonId || findSeasonIdByCompetition(competitionId, s.season);
  const clubs = adminData.clubs.filter(c => (!gender || c.gender === gender || c.gender === "Beide") && (!competitionId || c.competitionId === competitionId));
  const fallbackClubs = adminData.clubs.filter(c => !gender || c.gender === gender || c.gender === "Beide");
  const clubPool = clubs.length ? clubs : fallbackClubs;
  const homeClubId = s.homeClubId || findClubIdByName(s.homeClubName || s.home || "") || clubPool[0]?.id || null;
  const awayClubId = s.awayClubId || findClubIdByName(s.awayClubName || s.away || "") || clubPool.find(c => c.id !== homeClubId)?.id || null;
  const stadiumId = s.stadiumId || adminData.stadiums.find(st => st.clubId === homeClubId)?.id || null;
  const refereeId = s.refereeId || adminData.referees.find(r => r.varEnabled)?.id || adminData.referees[0]?.id || null;
  const participants = normalizeSceneParticipants(s, gender, homeClubId, awayClubId);

  return {
    id:createId(), active:true, createdAt:getNow(), updatedAt:getNow(),
    templateVersion:s.templateVersion || "2.0",
    gender,
    countryId,
    competitionId,
    seasonId,
    homeClubId,
    awayClubId,
    stadiumId,
    refereeId,
    minute:s.minute||"00:00",
    scoreline:s.scoreline||"",
    title:s.title||"Unbenannte Szene",
    category:s.category||"Foulspiel",
    description:s.description||"",
    options:s.options||[],
    correct:s.correct||"",
    explanation:s.explanation||"",
    difficulty:s.difficulty||"Normal",
    xp:s.xp || 50,
    weight:s.weight || 10,
    image:s.image||"",
    video:s.video||"",
    league:s.league||nameOf("competitions", competitionId)||"",
    competition:s.competition||"",
    season:s.season||"2026/27",
    participantRoles:s.participantRoles || { attacker:["ST","LF","RF","OM","ZM"], defender:["IV","LV","RV","DM","ZM"], goalkeeper:["TW","GK","TORWART"] },
    participants,
    cameras:s.cameras || { main:"", side:"", goal:"", line:"", zoom:"" }
  };
}

function normalizeSceneParticipants(scene, gender, homeClubId, awayClubId){
  const source = scene.participants || {};
  const roleSet = scene.participantRoles || {};
  const clubIds = [homeClubId, awayClubId].filter(Boolean);
  const attacker = getById(adminData.players, source.attackerId) || pickPlayerForScene(gender, clubIds, roleSet.attacker || ["ST","LF","RF","OM","ZM"]);
  const defender = getById(adminData.players, source.defenderId) || pickPlayerForScene(gender, clubIds, roleSet.defender || ["IV","LV","RV","DM","ZM"], attacker?.id);
  const goalkeeper = getById(adminData.players, source.goalkeeperId) || pickPlayerForScene(gender, clubIds, roleSet.goalkeeper || ["TW","GK","TORWART"], attacker?.id, defender?.id);
  return {
    attackerId: attacker?.id || source.attackerId || null,
    defenderId: defender?.id || source.defenderId || null,
    goalkeeperId: goalkeeper?.id || source.goalkeeperId || null,
    attackerName: playerName(attacker) || source.attackerName || "Angreifer",
    defenderName: playerName(defender) || source.defenderName || "Verteidiger",
    goalkeeperName: playerName(goalkeeper) || source.goalkeeperName || "Torwart"
  };
}

function pickPlayerForScene(gender, clubIds, positions, ...excludeIds){
  const pos = (positions || []).map(p => String(p).toUpperCase());
  let pool = adminData.players.filter(p => (!gender || p.gender === gender || p.gender === "Beide") && !excludeIds.includes(p.id));
  if(clubIds.length){
    const clubPool = pool.filter(p => clubIds.includes(p.clubId));
    if(clubPool.length) pool = clubPool;
  }
  const rolePool = pool.filter(p => pos.includes(String(p.position||"").toUpperCase()));
  const finalPool = rolePool.length ? rolePool : pool;
  return finalPool[0] || null;
}

function findCompetitionIdByNameAndGender(name, gender){
  if(!name) return null;
  const lower = String(name).toLowerCase();
  return adminData.competitions.find(c => c.gender === gender && String(c.name).toLowerCase() === lower)?.id
      || adminData.competitions.find(c => String(c.name).toLowerCase() === lower)?.id
      || null;
}

function findSeasonIdByCompetition(competitionId, seasonName){
  if(!competitionId) return null;
  return adminData.seasons.find(s => s.competitionId === competitionId && (!seasonName || s.name === seasonName))?.id
      || adminData.seasons.find(s => s.competitionId === competitionId)?.id
      || null;
}

function findClubIdByName(name){
  if(!name) return null;
  const lower = String(name).toLowerCase();
  return adminData.clubs.find(c => String(c.name).toLowerCase() === lower || String(c.shortName).toLowerCase() === lower)?.id || null;
}

function setupNavigation(){ document.querySelectorAll(".navBtn").forEach(btn=>btn.addEventListener("click",()=>{ const page=btn.dataset.page; if(!hasPermission(page)&&!["dashboard","help"].includes(page)){ alert("Keine Berechtigung."); return; } document.querySelectorAll(".navBtn").forEach(b=>b.classList.remove("active")); document.querySelectorAll(".page").forEach(p=>p.classList.remove("active")); btn.classList.add("active"); byId(page)?.classList.add("active"); byId("pageTitle").textContent=btn.textContent.replace(/^[^A-Za-zÄÖÜäöüß0-9]+/g,"").trim(); adminState.currentPage=page; refreshAdminDropdowns(); })); }
function renderAll(){ renderDashboard(); renderProjectSettings(); renderDevelopmentStatusAdmin(); renderUsers(); renderRoles(); renderCountries(); renderCompetitions(); renderSeasons(); renderClubs(); renderStadiums(); renderPlayers(); renderReferees(); renderScenes(); renderMediaItems(); renderCommunitySubmissions(); renderPlacepass(); renderNewsItems(); renderCareer(); refreshAdminDropdowns(); }

/* ===========================
   Automatischer Projektfortschritt
   Berechnet aus Datenmenge statt manuell gepflegter Prozentzahl.
=========================== */
function calculateProjectProgress(data = adminData){
  const targets = [
    { key:"countries", weight:5, target:5 },
    { key:"competitions", weight:10, target:10 },
    { key:"seasons", weight:8, target:10 },
    { key:"clubs", weight:12, target:50 },
    { key:"stadiums", weight:7, target:50 },
    { key:"players", weight:12, target:500 },
    { key:"referees", weight:6, target:50 },
    { key:"scenes", weight:24, target:1000 },
    { key:"media", weight:6, target:200 },
    { key:"communitySubmissions", weight:4, target:100 },
    { key:"career", weight:10, target:20 }
  ];

  let progress = 0;

  targets.forEach(item => {
    const count = Array.isArray(data[item.key]) ? data[item.key].filter(x => x.active !== false).length : 0;
    progress += Math.min(count / item.target, 1) * item.weight;
  });

  const settings = data.settings || {};
  const basics = [settings.gameTitle, settings.slogan, settings.edition, settings.version, settings.status].filter(Boolean).length;
  progress += basics * 0.6;

  return clamp(Math.round(progress), 0, 100);
}

function updateComputedProjectProgress(){
  if(!adminData.settings) adminData.settings = {};
  adminData.settings.progress = calculateProjectProgress(adminData);
}

function renderDashboard(){ updateComputedProjectProgress(); setText("sceneCount",adminData.scenes.length); setText("clubCount",adminData.clubs.length); setText("playerCount",adminData.players.length); setText("mediaCount",adminData.media.length); setText("communitySceneCount",adminData.communitySubmissions.length); setText("placepassLevelCount",adminData.placepass?.maxLevel||0); setText("newsCount",adminData.news.length); setText("competitionCount",adminData.competitions.length); setText("countryCount",adminData.countries.length); setText("projectVersionStat",adminData.settings.version); setText("projectEditionStat",adminData.settings.edition || "Frauen Edition"); setText("dashProjectName",adminData.settings.gameTitle); setText("dashProjectStatus",adminData.settings.status); setText("dashProjectProgressText", adminData.settings.progress + "%"); if(byId("dashProjectProgress")) byId("dashProjectProgress").style.width=`${clamp(adminData.settings.progress||0,0,100)}%`; }
function renderProjectSettings(){ updateComputedProjectProgress(); const s=adminData.settings; const map={projectGameTitle:"gameTitle",projectSlogan:"slogan",projectEdition:"edition",projectActiveDataBasis:"activeDataBasis",projectVersion:"version",projectBuild:"build",projectStatus:"status",projectProgress:"progress",projectNextUpdate:"nextUpdate",projectDeveloper:"developer",projectFooter:"footer",projectCopyright:"copyright",projectChangelog:"changelog"}; Object.entries(map).forEach(([id,k])=>{ if(byId(id)) byId(id).value=s[k]??""; }); const progressInput=byId("projectProgress"); if(progressInput){ progressInput.value=s.progress; progressInput.readOnly=true; progressInput.title="Der Fortschritt wird automatisch aus Länder, Wettbewerben, Saisons, Vereinen, Stadien, Spielern, Schiedsrichtern, Szenen und Karriere-Stufen berechnet."; } }
function saveProjectSettings(){ if(!ensureWrite("project")) return; adminData.settings={...adminData.settings,gameTitle:val("projectGameTitle"),slogan:val("projectSlogan"),edition:val("projectEdition"),activeDataBasis:val("projectActiveDataBasis"),version:val("projectVersion"),build:val("projectBuild"),status:val("projectStatus"),progress:calculateProjectProgress(adminData),nextUpdate:val("projectNextUpdate"),developer:val("projectDeveloper"),footer:val("projectFooter"),copyright:val("projectCopyright"),changelog:val("projectChangelog")}; saveAdminData(); }

function renderUsers(){ fillSelect("userRole",Object.keys(ROLE_DEFINITIONS).map(k=>({value:k,label:ROLE_DEFINITIONS[k].label}))); const el=byId("adminUserList"); if(!el)return; el.innerHTML=adminUsers.map(u=>card(`${u.displayName||"Admin"}`,`${ROLE_DEFINITIONS[u.role]?.label||u.role} · ${u.active?"Aktiv":"Inaktiv"}`,`<button class="miniBtn" onclick="toggleAdminUser(${u.id})">${u.active?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn dangerMini" onclick="deleteAdminUser(${u.id})">Löschen</button>`)).join("")||empty("Keine Benutzer."); }
function addAdminUser(){ if(!ensureWrite("users")) return; const displayName=val("userDisplayName"),username=val("userUsername"),password=val("userPassword"),role=val("userRole"); if(!displayName||!username||!password)return alert("Bitte alle Felder ausfüllen."); adminUsers.push({id:createId(),displayName,username,password,role,active:true,createdAt:getNow(),updatedAt:getNow()}); saveAdminUsers(); renderAll(); clearIds("userDisplayName","userUsername","userPassword"); }
function toggleAdminUser(id){ const u=adminUsers.find(x=>x.id===id); if(!u)return; u.active=!u.active; saveAdminUsers(); renderAll(); }
function deleteAdminUser(id){ if(!ensureWrite("users"))return; const u=adminUsers.find(x=>x.id===id); if(!u)return; if(currentAdmin&&u.id===currentAdmin.id)return alert("Du kannst dich nicht selbst löschen."); if(u.role==="OWNER"&&adminUsers.filter(x=>x.role==="OWNER").length<=1)return alert("Der letzte Owner kann nicht gelöscht werden."); if(confirm("Benutzer löschen?")){ adminUsers=adminUsers.filter(x=>x.id!==id); saveAdminUsers(); renderAll(); } }
function renderRoles(){ const el=byId("roleInfoList"); if(!el)return; el.innerHTML=Object.entries(ROLE_DEFINITIONS).map(([k,r])=>`<div class="roleCard"><strong>${r.label}</strong><p>${r.description}</p><small>${r.permissions.join(", ")}</small></div>`).join(""); }

function saveCountry(){ if(!ensureWrite("countries"))return; upsert("countries",{name:val("countryName"),code:val("countryCode"),flag:val("countryFlag")},["countryName"]); clearIds("countryName","countryCode","countryFlag"); }
function saveCompetition(){ if(!ensureWrite("competitions"))return; upsert("competitions",{gender:val("competitionGender"),countryId:num("competitionCountry"),type:val("competitionType"),name:val("competitionName"),level:num("competitionLevel"),color:val("competitionColor")},["competitionName","competitionCountry"]); clearIds("competitionName","competitionLevel","competitionColor"); }
function saveSeason(){ if(!ensureWrite("seasons"))return; upsert("seasons",{competitionId:num("seasonCompetition"),name:val("seasonName"),start:val("seasonStart"),end:val("seasonEnd")},["seasonCompetition","seasonName"]); clearIds("seasonName","seasonStart","seasonEnd"); }
function saveClub(){ if(!ensureWrite("clubs"))return; upsert("clubs",{gender:val("clubGender"),countryId:num("clubCountry"),competitionId:num("clubCompetition"),seasonId:num("clubSeason"),name:val("clubNameInput"),shortName:val("clubShortName"),city:val("clubCity"),stadium:val("clubStadium"),logo:val("clubLogo"),primaryColor:val("clubPrimaryColor"),secondaryColor:val("clubSecondaryColor"),premium:val("clubPremium")==="true",description:val("clubDescription")},["clubNameInput","clubCompetition"]); clearIds("clubNameInput","clubShortName","clubCity","clubStadium","clubLogo","clubPrimaryColor","clubSecondaryColor","clubDescription"); }
function saveStadium(){ if(!ensureWrite("stadiums"))return; upsert("stadiums",{countryId:num("stadiumCountry"),clubId:num("stadiumClub"),name:val("stadiumName"),city:val("stadiumCity"),capacity:val("stadiumCapacity"),image:val("stadiumImage")},["stadiumName"]); clearIds("stadiumName","stadiumCity","stadiumCapacity","stadiumImage"); }
function savePlayer(){ if(!ensureWrite("players"))return; upsert("players",{gender:val("playerGender"),countryId:num("playerCountry"),clubId:num("playerClub"),firstName:val("playerFirstName"),lastName:val("playerLastName"),position:val("playerPosition"),number:val("playerNumber"),image:val("playerImage")},["playerFirstName","playerLastName","playerClub"]); clearIds("playerFirstName","playerLastName","playerNumber","playerImage"); }
function saveReferee(){ if(!ensureWrite("referees"))return; upsert("referees",{name:val("refereeName"),countryId:num("refereeCountry"),license:val("refereeLicense"),varEnabled:val("refereeVar")==="true",image:val("refereeImage")},["refereeName"]); clearIds("refereeName","refereeImage"); }
function saveCareerLevel(){ if(!ensureWrite("career"))return; upsert("career",{title:val("careerTitle"),xp:num("careerXp"),reward:val("careerReward"),unlock:val("careerUnlock")},["careerTitle"]); clearIds("careerTitle","careerXp","careerReward","careerUnlock"); }
function saveScene(){
  if(!ensureWrite("scenes"))return;
  const options=[...document.querySelectorAll(".sceneOptionCheck:checked")].map(i=>i.value);
  if(!val("sceneTitleInput")||!val("sceneCorrect")||!options.length)return alert("Titel, richtige Entscheidung und Antwortoptionen sind Pflicht.");
  if(!options.includes(val("sceneCorrect")))return alert("Die richtige Entscheidung muss auch als Antwortoption aktiv sein.");
  const comp=getById(adminData.competitions,num("sceneCompetition"));
  const attacker=getById(adminData.players,num("sceneAttacker"));
  const defender=getById(adminData.players,num("sceneDefender"));
  const goalkeeper=getById(adminData.players,num("sceneGoalkeeper"));
  const sceneData={
    gender:val("sceneGender"),countryId:num("sceneCountry"),competitionId:num("sceneCompetition"),seasonId:num("sceneSeason"),homeClubId:num("sceneHomeClub"),awayClubId:num("sceneAwayClub"),stadiumId:num("sceneStadium"),refereeId:num("sceneReferee"),league:comp?.name||"",minute:val("sceneMinute"),scoreline:val("sceneScoreline"),title:val("sceneTitleInput"),category:val("sceneCategory"),description:val("sceneDescriptionInput"),options,correct:val("sceneCorrect"),explanation:val("sceneExplanation"),difficulty:val("sceneDifficulty"),image:val("sceneImagePath"),video:val("sceneVideoPath"),
    participants:{
      attackerId:num("sceneAttacker"), defenderId:num("sceneDefender"), goalkeeperId:num("sceneGoalkeeper"),
      attackerName:playerName(attacker)||"Angreifer", defenderName:playerName(defender)||"Verteidiger", goalkeeperName:playerName(goalkeeper)||"Torwart"
    }
  };
  if(adminState.editingSceneId){
    const existing=adminData.scenes.find(x=>x.id===adminState.editingSceneId);
    if(existing){ Object.assign(existing,sceneData,{updatedAt:getNow()}); }
    adminState.editingSceneId=null;
  } else {
    upsertRaw("scenes",sceneData);
    return clearSceneForm();
  }
  saveAdminData(); clearSceneForm();
}
function clearSceneForm(){
  clearIds("sceneMinute","sceneScoreline","sceneTitleInput","sceneDescriptionInput","sceneExplanation","sceneImagePath","sceneVideoPath");
  ["sceneAttacker","sceneDefender","sceneGoalkeeper"].forEach(id=>{ if(byId(id)) byId(id).value=""; });
  document.querySelectorAll(".sceneOptionCheck").forEach(i=>i.checked=false);
  adminState.editingSceneId=null;
  const btn=document.querySelector("#scenes .saveBtn"); if(btn) btn.textContent="Szene speichern";
}
function editScene(id){
  const scene=adminData.scenes.find(x=>x.id===id); if(!scene)return;
  adminState.editingSceneId=id;
  byId("sceneGender").value=scene.gender||"Männer";
  refreshSceneDropdowns();
  setVal("sceneCountry",scene.countryId); refreshSceneDropdowns();
  setVal("sceneCompetition",scene.competitionId); refreshSceneDropdowns();
  setVal("sceneSeason",scene.seasonId);
  setVal("sceneHomeClub",scene.homeClubId);
  setVal("sceneAwayClub",scene.awayClubId);
  refreshScenePlayerDropdowns();
  setVal("sceneStadium",scene.stadiumId);
  setVal("sceneReferee",scene.refereeId);
  setVal("sceneAttacker",scene.participants?.attackerId);
  setVal("sceneDefender",scene.participants?.defenderId);
  setVal("sceneGoalkeeper",scene.participants?.goalkeeperId);
  byId("sceneMinute").value=scene.minute||"";
  byId("sceneScoreline").value=scene.scoreline||"";
  byId("sceneTitleInput").value=scene.title||"";
  byId("sceneCategory").value=scene.category||"Foulspiel";
  byId("sceneCorrect").value=scene.correct||"";
  byId("sceneDifficulty").value=scene.difficulty||"Normal";
  byId("sceneDescriptionInput").value=scene.description||"";
  byId("sceneExplanation").value=scene.explanation||"";
  byId("sceneImagePath").value=scene.image||"";
  byId("sceneVideoPath").value=scene.video||"";
  document.querySelectorAll(".sceneOptionCheck").forEach(i=>i.checked=(scene.options||[]).includes(i.value));
  const btn=document.querySelector("#scenes .saveBtn"); if(btn) btn.textContent="Szene aktualisieren";
  byId("sceneTitleInput")?.focus();
}
function upsert(key,data,requiredIds){ for(const id of requiredIds){ if(!val(id)) return alert("Bitte Pflichtfelder ausfüllen."); } upsertRaw(key,data); }
function upsertRaw(key,data){ adminData[key].push({id:createId(),active:true,createdAt:getNow(),updatedAt:getNow(),...data}); saveAdminData(); }
function deleteItem(key,id){ if(!ensureWrite(key))return; if(confirm("Eintrag löschen?")){ adminData[key]=adminData[key].filter(x=>x.id!==id); saveAdminData(); } }
function toggleItem(key,id){ const x=adminData[key].find(i=>i.id===id); if(!x)return; x.active=!x.active; x.updatedAt=getNow(); saveAdminData(); }

function renderCountries(){ list("countryList",adminData.countries,x=>`${x.flag||""} ${x.name}`,x=>`Code: ${x.code||"-"}`,"countries"); }
function renderCompetitions(){ list("competitionList",adminData.competitions,x=>x.name,x=>`${x.gender} · ${nameOf("countries",x.countryId)} · ${x.type} · Level ${x.level||"-"}`,"competitions"); }
function renderSeasons(){ list("seasonList",adminData.seasons,x=>`${nameOf("competitions",x.competitionId)} ${x.name}`,x=>`${x.start||""} ${x.end?"bis "+x.end:""}`,"seasons"); }
function renderClubs(){
  const gender = val("clubFilterGender");
  const competitionId = num("clubFilterCompetition");
  let clubs = [...adminData.clubs];

  if (gender) {
    clubs = clubs.filter(c => c.gender === gender || c.gender === "Beide");
  }

  if (competitionId) {
    clubs = clubs.filter(c => c.competitionId === competitionId);
  }

  clubs.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||"")));

  const info = byId("clubFilterInfo");
  if (info) {
    const parts = [];
    if (gender) parts.push(gender);
    if (competitionId) parts.push(nameOf("competitions", competitionId));
    info.textContent = `${clubs.length} Verein(e) ${parts.length ? "für " + parts.join(" · ") : "insgesamt"} angezeigt.`;
  }

  list("clubList", clubs, x=>x.name, x=>`${x.gender} · ${nameOf("competitions",x.competitionId)} · ${x.city||""} ${x.premium?"· Premium":""}`, "clubs");
}
function renderStadiums(){ list("stadiumList",adminData.stadiums,x=>x.name,x=>`${x.city||""} · ${nameOf("clubs",x.clubId)} · ${x.capacity||""}`,"stadiums"); }
function renderPlayers(){
  const gender = val("playerFilterGender");
  const clubId = num("playerFilterClub");
  const position = val("playerFilterPosition");

  let players = [...adminData.players];

  if (gender) {
    players = players.filter(p => p.gender === gender || p.gender === "Beide");
  }

  if (clubId) {
    players = players.filter(p => p.clubId === clubId);
  }

  if (position) {
    players = players.filter(p => String(p.position || "").toUpperCase() === position.toUpperCase());
  }

  players.sort((a,b)=>playerName(a).localeCompare(playerName(b)));

  const info = byId("playerFilterInfo");
  if (info) {
    const parts = [];
    if (gender) parts.push(gender);
    if (clubId) parts.push(nameOf("clubs", clubId));
    if (position) parts.push(position);
    info.textContent = `${players.length} Spieler ${parts.length ? "für " + parts.join(" · ") : "insgesamt"} angezeigt.`;
  }

  list("playerList", players, x=>`${x.firstName} ${x.lastName}`, x=>`${x.gender} · ${x.position} · ${nameOf("clubs",x.clubId)}`, "players");
}
function renderReferees(){ list("refereeList",adminData.referees,x=>x.name,x=>`${x.license} · ${x.varEnabled?"VAR":"kein VAR"} · ${nameOf("countries",x.countryId)}`,"referees"); }
function renderScenes(){
  const el=byId("sceneList"); if(!el)return;
  el.innerHTML=adminData.scenes.map(x=>{
    const p=x.participants||{};
    const names=[p.attackerName,p.defenderName,p.goalkeeperName].filter(Boolean).join(" · ");
    const meta=`${x.league||nameOf("competitions",x.competitionId)} · ${x.minute||"00:00"} · ${x.category||""} · richtig: ${x.correct}<br>${names?"Beteiligte: "+escapeHtml(names)+"<br>":""}Status: ${x.active!==false?"Aktiv":"Inaktiv"}`;
    return card(x.title,meta,`<button class="miniBtn" onclick="editScene(${x.id})">Bearbeiten</button><button class="miniBtn" onclick="toggleItem('scenes',${x.id})">${x.active!==false?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn dangerMini" onclick="deleteItem('scenes',${x.id})">Löschen</button>`);
  }).join("")||empty("Noch keine Szenen.");
}
function renderCareer(){ list("careerList",[...adminData.career].sort((a,b)=>(a.xp||0)-(b.xp||0)),x=>x.title,x=>`${x.xp||0} XP · ${x.reward||""} · ${x.unlock||""}`,"career"); }
function list(elementId,arr,titleFn,metaFn,key){ const el=byId(elementId); if(!el)return; el.innerHTML=arr.map(x=>card(titleFn(x),`${metaFn(x)}<br>Status: ${x.active!==false?"Aktiv":"Inaktiv"}`,`<button class="miniBtn" onclick="toggleItem('${key}',${x.id})">${x.active!==false?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn dangerMini" onclick="deleteItem('${key}',${x.id})">Löschen</button>`)).join("")||empty("Noch keine Einträge."); }

function refreshAdminDropdowns(){
  fillSelect("competitionCountry",optionsFrom(adminData.countries));
  fillSelect("seasonCompetition",optionsFrom(adminData.competitions,x=>`${x.gender} · ${x.name}`));
  fillSelect("clubCountry",optionsFrom(adminData.countries));
  fillSelect("stadiumCountry",optionsFrom(adminData.countries));
  fillSelect("playerCountry",optionsFrom(adminData.countries));
  fillSelect("refereeCountry",optionsFrom(adminData.countries));
  fillSelect("clubCompetition",optionsFrom(filterCompetitions(val("clubGender"),num("clubCountry")),x=>`${x.gender} · ${x.name}`));
  fillSelect("clubSeason",optionsFrom(adminData.seasons.filter(s=>s.competitionId===num("clubCompetition")),x=>`${nameOf("competitions",x.competitionId)} ${x.name}`));
  fillSelect("stadiumClub",optionsFrom(adminData.clubs));
  fillSelect("playerClub",optionsFrom(adminData.clubs.filter(c=>!val("playerGender")||c.gender===val("playerGender")||c.gender==="Beide")));
  fillSelect("clubFilterCompetition",optionsFrom(adminData.competitions,x=>`${x.gender} · ${x.name}`));
  setFirstOptionText("clubFilterCompetition", "Alle Ligen/Wettbewerbe");
  fillSelect("playerFilterClub",optionsFrom(adminData.clubs,x=>`${x.gender} · ${x.name}`));
  setFirstOptionText("playerFilterClub", "Alle Vereine");
  fillSelect("submissionCompetition",optionsFrom(adminData.competitions,x=>`${x.gender} · ${x.name}`));
  fillSelect("submissionHomeClub",optionsFrom(adminData.clubs,x=>`${x.gender} · ${x.name}`));
  fillSelect("submissionAwayClub",optionsFrom(adminData.clubs,x=>`${x.gender} · ${x.name}`));
  refreshSceneDropdowns();
}
function refreshSceneDropdowns(){
  fillSelect("sceneCountry",optionsFrom(adminData.countries));
  const gender=val("sceneGender"), countryId=num("sceneCountry");
  const comps=filterCompetitions(gender,countryId);
  fillSelect("sceneCompetition",optionsFrom(comps,x=>`${x.gender} · ${x.name}`));
  const compId=num("sceneCompetition");
  fillSelect("sceneSeason",optionsFrom(adminData.seasons.filter(s=>s.competitionId===compId),x=>`${nameOf("competitions",x.competitionId)} ${x.name}`));
  const clubs=adminData.clubs.filter(c=>(!gender||c.gender===gender||c.gender==="Beide")&&(!compId||c.competitionId===compId));
  fillSelect("sceneHomeClub",optionsFrom(clubs));
  fillSelect("sceneAwayClub",optionsFrom(clubs));
  fillSelect("sceneStadium",optionsFrom(adminData.stadiums));
  fillSelect("sceneReferee",optionsFrom(adminData.referees));
  refreshScenePlayerDropdowns();
}
function refreshScenePlayerDropdowns(){
  const gender=val("sceneGender");
  const clubIds=[num("sceneHomeClub"),num("sceneAwayClub")].filter(Boolean);
  let players=adminData.players.filter(p=>(!gender||p.gender===gender||p.gender==="Beide")&&(!clubIds.length||clubIds.includes(p.clubId)));
  if(!players.length) players=adminData.players.filter(p=>!gender||p.gender===gender||p.gender==="Beide");
  const attackers=players.filter(p=>["ST","LF","RF","OM","ZM","LM","RM"].includes((p.position||"").toUpperCase()));
  const defenders=players.filter(p=>["IV","LV","RV","DM","ZM"].includes((p.position||"").toUpperCase()));
  const keepers=players.filter(p=>["TW","GK","TORWART"].includes((p.position||"").toUpperCase()));
  fillSelect("sceneAttacker",optionsFrom(attackers.length?attackers:players,playerName));
  fillSelect("sceneDefender",optionsFrom(defenders.length?defenders:players,playerName));
  fillSelect("sceneGoalkeeper",optionsFrom(keepers.length?keepers:players,playerName));
}
function filterCompetitions(gender,countryId){
  const basis = adminData.settings.activeDataBasis || "Mixed";
  return adminData.competitions.filter(c=>{
    const basisOk = basis === "Mixed" || basis === "International" || c.gender === basis || c.gender === "Mixed";
    const genderOk = !gender || c.gender === gender || c.gender === "Mixed";
    const countryOk = !countryId || c.countryId === countryId;
    return basisOk && genderOk && countryOk;
  });
}
function fillSelect(id,options){ const el=byId(id); if(!el)return; const old=el.value; el.innerHTML=`<option value="">Auswählen</option>`+options.map(o=>`<option value="${o.value}">${escapeHtml(o.label)}</option>`).join(""); if(old) el.value=old; }
function optionsFrom(arr,labelFn=x=>x.name){ return arr.filter(x=>x.active!==false).map(x=>({value:x.id,label:labelFn(x)})); }
function setFirstOptionText(id,text){ const el=byId(id); if(el && el.options && el.options[0]) el.options[0].textContent=text; }
function setupOptionChecks(){ const el=byId("sceneOptionChecks"); if(!el)return; el.innerHTML=DECISION_OPTIONS.map(o=>`<label><input type="checkbox" class="sceneOptionCheck" value="${o}"> ${o}</label>`).join(""); }

const sceneTemplates={ offside_goal:{title:"Tor nach möglichem Abseits",description:"{ANGREIFER} erzielt ein Tor. Beim Zuspiel steht {ANGREIFER} knapp vor der letzten Verteidigungslinie.",correct:"Abseits",options:["Tor","Abseits","Weiterspielen"],difficulty:"Normal",explanation:"Beim Abspiel befindet sich der Angreifer in einer strafbaren Abseitsposition."}, handball_penalty:{title:"Handspiel im Strafraum",description:"Eine verteidigende Person blockt eine Flanke. Der Ball springt gegen den ausgestreckten Arm.",correct:"Elfmeter",options:["Elfmeter","Kein Elfmeter"],difficulty:"Schwer",explanation:"Der Arm vergrößert die Körperfläche unnatürlich. Strafstoß ist korrekt."}, soft_contact:{title:"Leichter Kontakt im Strafraum",description:"{ANGREIFER} fällt nach leichtem Kontakt im Strafraum.",correct:"Kein Elfmeter",options:["Elfmeter","Kein Elfmeter","Weiterspielen"],difficulty:"Normal",explanation:"Der Kontakt reicht nicht für einen Strafstoß."}, last_defender:{title:"Notbremse",description:"{VERTEIDIGER} stoppt {ANGREIFER} als letzte Person vor dem Tor.",correct:"Rote Karte",options:["Gelbe Karte","Rote Karte","Weiterspielen"],difficulty:"Elite",explanation:"Eine klare Torchance wird verhindert. Rot ist korrekt."}, goal_line:{title:"Ball hinter der Linie",description:"Der Ball springt von der Latte auf den Boden und wieder heraus.",correct:"Tor",options:["Tor","Kein Tor"],difficulty:"Schwer",explanation:"Der Ball muss die Linie vollständig überschritten haben."}, red_card_foul:{title:"Hartes Foulspiel",description:"{VERTEIDIGER} trifft {ANGREIFER} mit offener Sohle oberhalb des Knöchels.",correct:"Rote Karte",options:["Gelbe Karte","Rote Karte","Foul","Weiterspielen"],difficulty:"Schwer",explanation:"Das Einsteigen gefährdet die Gesundheit. Rot ist korrekt."}, dive:{title:"Mögliche Schwalbe",description:"{ANGREIFER} hebt ohne klaren Kontakt ab und fordert Elfmeter.",correct:"Kein Elfmeter",options:["Elfmeter","Kein Elfmeter","Gelbe Karte"],difficulty:"Normal",explanation:"Kein ausreichender Kontakt für einen Strafstoß."} };
function applySceneTemplate(){ const t=sceneTemplates[val("sceneTemplate")]; if(!t)return; byId("sceneTitleInput").value=t.title; byId("sceneDescriptionInput").value=t.description; byId("sceneCorrect").value=t.correct; byId("sceneDifficulty").value=t.difficulty; byId("sceneExplanation").value=t.explanation; document.querySelectorAll(".sceneOptionCheck").forEach(i=>i.checked=t.options.includes(i.value)); }


/* ===========================
   Medienbibliothek 3.4
=========================== */
function saveMediaItem(){
  if(!ensureWrite("media")) return;
  const item={type:val("mediaType"),title:val("mediaTitle"),path:val("mediaPath"),category:val("mediaCategory"),credit:val("mediaCredit"),notes:val("mediaNotes")};
  if(!item.title||!item.path) return alert("Titel und Pfad sind Pflicht.");
  upsertRaw("media",item);
  clearIds("mediaTitle","mediaPath","mediaCategory","mediaCredit","mediaNotes");
}
function renderMediaItems(){
  const el=byId("mediaList"); if(!el) return;
  const type=val("mediaFilterType");
  let items=[...adminData.media];
  if(type) items=items.filter(m=>m.type===type);
  items.sort((a,b)=>String(a.title||"").localeCompare(String(b.title||"")));
  const info=byId("mediaFilterInfo"); if(info) info.textContent=`${items.length} Medium/Medien ${type?"vom Typ "+type:"insgesamt"} angezeigt.`;
  el.innerHTML=items.map(m=>{
    const isImage=(m.type==="Bild"||m.type==="Logo"||m.type==="Banner"||m.type==="Stadionbild") && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(m.path||"");
    const preview=isImage?`<img src="${escapeHtml(m.path)}" alt="${escapeHtml(m.title)}">`:`<span>${escapeHtml(m.type||"Medium")}</span>`;
    return `<div class="mediaCard"><div class="mediaPreview">${preview}</div><span class="mediaTypeBadge">${escapeHtml(m.type||"Medium")}</span><strong>${escapeHtml(m.title)}</strong><p>${escapeHtml(m.path||"")}</p><small>${escapeHtml(m.category||"")} ${m.credit?"· "+escapeHtml(m.credit):""}</small><div class="itemActions"><button class="miniBtn" onclick="toggleItem('media',${m.id})">${m.active!==false?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn dangerMini" onclick="deleteItem('media',${m.id})">Löschen</button></div></div>`;
  }).join("")||empty("Noch keine Medien.");
}

/* ===========================
   Community-Szenen 3.4
=========================== */
function saveCommunitySubmission(){
  if(!ensureWrite("communityScenes")) return;
  const item={
    priority:val("submissionPriority")||"standard",
    user:val("submissionUser")||"Unbekannt",
    competitionId:num("submissionCompetition"),
    homeClubId:num("submissionHomeClub"),
    awayClubId:num("submissionAwayClub"),
    title:val("submissionTitle"),
    category:val("submissionCategory"),
    description:val("submissionDescription"),
    correct:val("submissionCorrect"),
    explanation:val("submissionExplanation"),
    image:val("submissionImage"),
    video:val("submissionVideo"),
    status:"Eingegangen",
    adminComment:"",
    submittedAt:getNow()
  };
  if(!item.title||!item.description||!item.correct) return alert("Titel, Beschreibung und richtige Entscheidung sind Pflicht.");
  upsertRaw("communitySubmissions",item);
  clearIds("submissionUser","submissionTitle","submissionDescription","submissionExplanation","submissionImage","submissionVideo");
}
function renderCommunitySubmissions(){
  const priorityEl=byId("prioritySubmissionList"), standardEl=byId("standardSubmissionList");
  if(!priorityEl||!standardEl) return;
  const status=val("submissionFilterStatus"), priority=val("submissionFilterPriority");
  let items=[...adminData.communitySubmissions];
  if(status) items=items.filter(s=>s.status===status);
  if(priority) items=items.filter(s=>s.priority===priority);
  items.sort((a,b)=>{
    if((a.priority==="platzpass") !== (b.priority==="platzpass")) return a.priority==="platzpass" ? -1 : 1;
    return new Date(a.submittedAt||a.createdAt||0)-new Date(b.submittedAt||b.createdAt||0);
  });
  const prio=items.filter(x=>x.priority==="platzpass");
  const standard=items.filter(x=>x.priority!=="platzpass");
  const info=byId("submissionQueueInfo"); if(info) info.textContent=`${prio.length} Platzpass · ${standard.length} Standard · Platzpass wird bevorzugt geprüft.`;
  priorityEl.innerHTML=prio.map(renderSubmissionCard).join("")||empty("Keine Platzpass-Einreichungen.");
  standardEl.innerHTML=standard.map(renderSubmissionCard).join("")||empty("Keine Standard-Einreichungen.");
}
function renderSubmissionCard(s){
  const sla=getSlaInfo(s);
  const badge=s.priority==="platzpass"?`<span class="priorityBadge">⭐ Platzpass · 48h</span>`:`<span class="statusBadge">Standard · 30 Tage</span>`;
  const meta=`${badge}<span class="slaBadge ${sla.className}">${sla.text}</span><br><span class="submissionMeta">Von: ${escapeHtml(s.user||"-")}<br>${escapeHtml(nameOf("competitions",s.competitionId))} · ${escapeHtml(nameOf("clubs",s.homeClubId))} - ${escapeHtml(nameOf("clubs",s.awayClubId))}<br>Kategorie: ${escapeHtml(s.category||"")} · Entscheidung: ${escapeHtml(s.correct||"")}<br>Status: ${escapeHtml(s.status||"Eingegangen")}</span>`;
  return card(s.title||"Community-Szene", meta, `<button class="miniBtn" onclick="setSubmissionStatus(${s.id},'In Prüfung')">Prüfen</button><button class="miniBtn" onclick="approveSubmission(${s.id})">Freigeben</button><button class="miniBtn" onclick="setSubmissionStatus(${s.id},'Überarbeitung nötig')">Überarbeitung</button><button class="miniBtn dangerMini" onclick="setSubmissionStatus(${s.id},'Abgelehnt')">Ablehnen</button><button class="miniBtn dangerMini" onclick="deleteItem('communitySubmissions',${s.id})">Löschen</button>`);
}
function getSlaInfo(s){
  const submitted=new Date(s.submittedAt||s.createdAt||getNow()).getTime();
  const hours=s.priority==="platzpass"?48:24*30;
  const deadline=submitted+hours*60*60*1000;
  const diff=deadline-Date.now();
  if(["Freigegeben","Abgelehnt"].includes(s.status)) return {text:"Abgeschlossen",className:"slaOk"};
  if(diff<=0) return {text:"Frist überschritten",className:"slaLate"};
  const remainingHours=Math.ceil(diff/(60*60*1000));
  if(s.priority==="platzpass") return {text:`${remainingHours} Std. verbleibend`,className:remainingHours<=12?"slaWarn":"slaOk"};
  const days=Math.ceil(remainingHours/24);
  return {text:`${days} Tage verbleibend`,className:days<=5?"slaWarn":"slaOk"};
}
function setSubmissionStatus(id,status){
  if(!ensureWrite("communityScenes")) return;
  const s=adminData.communitySubmissions.find(x=>x.id===id); if(!s) return;
  s.status=status; s.updatedAt=getNow(); saveAdminData();
}
function approveSubmission(id){
  if(!ensureWrite("communityScenes")) return;
  const s=adminData.communitySubmissions.find(x=>x.id===id); if(!s) return;
  const comp=getById(adminData.competitions,s.competitionId);
  adminData.scenes.push({
    id:createId(),active:true,createdAt:getNow(),updatedAt:getNow(),gender:comp?.gender||"Mixed",countryId:comp?.countryId||null,competitionId:s.competitionId,seasonId:null,homeClubId:s.homeClubId,awayClubId:s.awayClubId,stadiumId:null,refereeId:null,league:comp?.name||"",minute:"00:00",scoreline:"0:0",title:s.title,category:s.category,description:s.description,options:[s.correct,"Weiterspielen","Kein Foul","Foul"].filter((v,i,a)=>v&&a.indexOf(v)===i),correct:s.correct,explanation:s.explanation,difficulty:"Normal",image:s.image||"",video:s.video||"",participants:{}
  });
  s.status="Freigegeben"; s.updatedAt=getNow(); saveAdminData(); alert("Community-Szene wurde freigegeben und als Spielszene übernommen.");
}


/* ===========================
   Platzpass 3.5
=========================== */
function savePlacepassSettings(){
  if(!ensureWrite("placepass")) return;
  adminData.placepass={
    ...(adminData.placepass||{}),
    seasonName:val("passSeasonNameInput")||"Platzpass Saison 1",
    theme:val("passThemeInput")||"Bundesliga 2026/27",
    maxLevel:Number(val("passMaxLevelInput"))||100,
    currentLevel:Number(val("passCurrentLevelInput"))||0,
    progress:Number(val("passProgressInput"))||0,
    timeLeft:val("passTimeLeftInput")||"Noch 74 Tage verfügbar",
    description:val("passDescriptionInput")||""
  };
  saveAdminData();
}
function renderPlacepass(){
  const pass=adminData.placepass; if(!pass) return;
  setVal("passSeasonNameInput",pass.seasonName);
  setVal("passThemeInput",pass.theme);
  setVal("passMaxLevelInput",pass.maxLevel);
  setVal("passCurrentLevelInput",pass.currentLevel);
  setVal("passProgressInput",pass.progress);
  setVal("passTimeLeftInput",pass.timeLeft);
  setVal("passDescriptionInput",pass.description);
  renderBenefitAdminList("freeBenefitList",pass.freeBenefits||[],"free");
  renderBenefitAdminList("premiumBenefitList",pass.premiumBenefits||[],"premium");
  const rewardList=byId("passRewardList");
  if(rewardList) rewardList.innerHTML=(pass.rewards||[]).sort((a,b)=>(a.level||0)-(b.level||0)).map(r=>card(`Level ${r.level}`,`<span class="passTrackBadge">${r.track==="premium"?"Platzpass":"Kostenlos"}</span>${escapeHtml(r.reward)}`,`<button class="miniBtn dangerMini" onclick="deletePassReward(${r.id})">Löschen</button>`)).join("")||empty("Noch keine Belohnungen.");
  const missionList=byId("passMissionList");
  if(missionList) missionList.innerHTML=(pass.missions||[]).map(m=>card(m.title,`${m.type} · ${m.reward}`,`<button class="miniBtn dangerMini" onclick="deletePassMission(${m.id})">Löschen</button>`)).join("")||empty("Noch keine Missionen.");
}
function renderBenefitAdminList(id,arr,type){ const el=byId(id); if(!el)return; el.innerHTML=arr.map((b,i)=>card(b,type==="premium"?"💎 Platzpass-Vorteil":"✅ Kostenloser Vorteil",`<button class="miniBtn dangerMini" onclick="deletePassBenefit('${type}',${i})">Löschen</button>`)).join("")||empty("Noch keine Vorteile."); }
function addPassBenefit(type){ if(!ensureWrite("placepass"))return; const inputId=type==="premium"?"premiumBenefitInput":"freeBenefitInput"; const text=val(inputId); if(!text)return alert("Bitte Vorteil eingeben."); if(!adminData.placepass) adminData.placepass={freeBenefits:[],premiumBenefits:[],rewards:[],missions:[]}; const key=type==="premium"?"premiumBenefits":"freeBenefits"; adminData.placepass[key]=adminData.placepass[key]||[]; adminData.placepass[key].push(text); clearIds(inputId); saveAdminData(); }
function deletePassBenefit(type,index){ if(!ensureWrite("placepass"))return; const key=type==="premium"?"premiumBenefits":"freeBenefits"; adminData.placepass[key].splice(index,1); saveAdminData(); }
function addPassReward(){ if(!ensureWrite("placepass"))return; const level=Number(val("passRewardLevel")); const reward=val("passRewardText"); const track=val("passRewardTrack")||"free"; if(!level||!reward)return alert("Level und Belohnung sind Pflicht."); adminData.placepass.rewards=adminData.placepass.rewards||[]; adminData.placepass.rewards.push({id:createId(),level,reward,track}); clearIds("passRewardLevel","passRewardText"); saveAdminData(); }
function deletePassReward(id){ if(!ensureWrite("placepass"))return; adminData.placepass.rewards=(adminData.placepass.rewards||[]).filter(r=>r.id!==id); saveAdminData(); }
function addPassMission(){ if(!ensureWrite("placepass"))return; const type=val("passMissionType"), title=val("passMissionTitle"), reward=val("passMissionReward"); if(!title||!reward)return alert("Mission und Belohnung sind Pflicht."); adminData.placepass.missions=adminData.placepass.missions||[]; adminData.placepass.missions.push({id:createId(),type,title,reward}); clearIds("passMissionTitle","passMissionReward"); saveAdminData(); }
function deletePassMission(id){ if(!ensureWrite("placepass"))return; adminData.placepass.missions=(adminData.placepass.missions||[]).filter(m=>m.id!==id); saveAdminData(); }

/* ===========================
   News Center 3.5
=========================== */
function saveNewsItem(){
  if(!ensureWrite("newsCenter")) return;
  const item={title:val("newsTitleInput"),category:val("newsCategoryInput")||"News",date:val("newsDateInput")||new Date().toLocaleDateString("de-DE"),pinned:val("newsPinnedInput")==="true",text:val("newsTextInput"),active:true,createdAt:getNow(),updatedAt:getNow()};
  if(!item.title||!item.text) return alert("Titel und Text sind Pflicht.");
  adminData.news.push({id:createId(),...item});
  clearIds("newsTitleInput","newsDateInput","newsTextInput");
  saveAdminData();
}
function renderNewsItems(){
  const el=byId("newsAdminList"); if(!el)return;
  const cat=val("newsFilterCategory");
  let items=[...adminData.news]; if(cat) items=items.filter(n=>n.category===cat);
  items.sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned));
  const info=byId("newsFilterInfo"); if(info) info.textContent=`${items.length} News ${cat?"in "+cat:"insgesamt"} angezeigt.`;
  el.innerHTML=items.map(n=>card(n.title,`${n.pinned?"<span class=\"newsPinnedBadge\">📌 Angeheftet</span>":""}<span class="newsCategoryBadge">${escapeHtml(n.category)}</span>${escapeHtml(n.date||"")}<br>${escapeHtml(n.text||"").replaceAll("\n","<br>")}`,`<button class="miniBtn" onclick="toggleItem('news',${n.id})">${n.active!==false?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn dangerMini" onclick="deleteItem('news',${n.id})">Löschen</button>`)).join("")||empty("Noch keine News.");
}

function exportAdminData(){ const blob=new Blob([JSON.stringify(adminData,null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="var-challenge-admin-data.json"; a.click(); URL.revokeObjectURL(a.href); }
function importAdminData(e){ const file=e.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(r.result); adminData={...adminData,...data,settings:{...adminData.settings,...(data.settings||{})}}; saveAdminData(); alert("Import erfolgreich."); } catch{ alert("Ungültige JSON-Datei."); } }; r.readAsText(file); }
function resetAdminData(){ if(!confirm("Alle Admin-Daten zurücksetzen?"))return; localStorage.removeItem(STORAGE_KEY); adminData={...adminData,countries:[],competitions:[],seasons:[],clubs:[],stadiums:[],players:[],referees:[],scenes:[],media:[],communitySubmissions:[],placepass:null,news:[],career:[]}; seedDefaultData(); renderAll(); }
function createDemoScenes(){ if(typeof scenes!=="undefined"&&Array.isArray(scenes)){ adminData.scenes.push(...scenes.slice(0,10).map(s=>normalizeScene(s))); saveAdminData(); alert("Demo-Szenen ergänzt."); } }
function byId(id){ return document.getElementById(id); } function val(id){ return byId(id)?.value?.trim()||""; } function setVal(id,value){ if(byId(id)&&value!==undefined&&value!==null) byId(id).value=String(value); } function num(id){ return Number(val(id))||null; } function setText(id,v){ if(byId(id)) byId(id).textContent=v; } function clearIds(...ids){ ids.forEach(id=>{ if(byId(id)) byId(id).value=""; }); } function createId(){ return Date.now()+Math.floor(Math.random()*1000000); } function getNow(){ return new Date().toISOString(); } function escapeHtml(v){ return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); } function card(title,meta,actions=""){ return `<div class="listItem"><strong>${escapeHtml(title)}</strong><p>${meta}</p><div class="itemActions">${actions}</div></div>`; } function empty(text){ return `<div class="listItem">${escapeHtml(text)}</div>`; } function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); } function getById(arr,id){ return arr.find(x=>x.id===id); } function findId(arr,key,val){ return arr.find(x=>x[key]===val)?.id||null; } function nameOf(key,id){ return adminData[key]?.find(x=>x.id===id)?.name||"-"; } function playerName(p){ return p ? `${p.firstName||""} ${p.lastName||""}`.trim() : ""; }
console.log("VAR Challenge Admin Center 3.6 geladen.");


/* ===========================
   Admin Center 3.6 – Universal Editor / CRUD
   Ergänzt Bearbeiten, Duplizieren, Aktiv/Inaktiv, Archivieren und Papierkorb-Logik
=========================== */
const EDIT_CONFIG = {
  countries: { page: "countries", saveButton: "#countries .saveBtn", buttonText: "Land aktualisieren", fields: { countryName:"name", countryCode:"code", countryFlag:"flag" } },
  competitions: { page: "competitions", saveButton: "#competitions .saveBtn", buttonText: "Wettbewerb aktualisieren", fields: { competitionGender:"gender", competitionCountry:"countryId", competitionType:"type", competitionName:"name", competitionLevel:"level", competitionColor:"color" } },
  seasons: { page: "seasons", saveButton: "#seasons .saveBtn", buttonText: "Saison aktualisieren", fields: { seasonCompetition:"competitionId", seasonName:"name", seasonStart:"start", seasonEnd:"end" } },
  clubs: { page: "clubs", saveButton: "#clubs .saveBtn", buttonText: "Verein aktualisieren", fields: { clubGender:"gender", clubCountry:"countryId", clubCompetition:"competitionId", clubSeason:"seasonId", clubNameInput:"name", clubShortName:"shortName", clubCity:"city", clubStadium:"stadium", clubLogo:"logo", clubPrimaryColor:"primaryColor", clubSecondaryColor:"secondaryColor", clubPremium:"premium", clubDescription:"description" } },
  stadiums: { page: "stadiums", saveButton: "#stadiums .saveBtn", buttonText: "Stadion aktualisieren", fields: { stadiumCountry:"countryId", stadiumClub:"clubId", stadiumName:"name", stadiumCity:"city", stadiumCapacity:"capacity", stadiumImage:"image" } },
  players: { page: "players", saveButton: "#players .saveBtn", buttonText: "Spieler aktualisieren", fields: { playerGender:"gender", playerCountry:"countryId", playerClub:"clubId", playerFirstName:"firstName", playerLastName:"lastName", playerPosition:"position", playerNumber:"number", playerImage:"image" } },
  referees: { page: "referees", saveButton: "#referees .saveBtn", buttonText: "Schiedsrichter aktualisieren", fields: { refereeName:"name", refereeCountry:"countryId", refereeLicense:"license", refereeVar:"varEnabled", refereeImage:"image" } },
  career: { page: "career", saveButton: "#career .saveBtn", buttonText: "Stufe aktualisieren", fields: { careerTitle:"title", careerXp:"xp", careerReward:"reward", careerUnlock:"unlock" } },
  media: { page: "media", saveButton: "#media .saveBtn", buttonText: "Medium aktualisieren", fields: { mediaType:"type", mediaTitle:"title", mediaPath:"path", mediaCategory:"category", mediaCredit:"credit", mediaNotes:"notes" } },
  communitySubmissions: { page: "communityScenes", saveButton: "#communityScenes .saveBtn", buttonText: "Einreichung aktualisieren", fields: { submissionPriority:"priority", submissionUser:"user", submissionCompetition:"competitionId", submissionHomeClub:"homeClubId", submissionAwayClub:"awayClubId", submissionTitle:"title", submissionCategory:"category", submissionCorrect:"correct", submissionImage:"image", submissionVideo:"video", submissionDescription:"description", submissionExplanation:"explanation" } },
  news: { page: "newsCenter", saveButton: "#newsCenter .saveBtn", buttonText: "News aktualisieren", fields: { newsTitleInput:"title", newsCategoryInput:"category", newsDateInput:"date", newsPinnedInput:"pinned", newsTextInput:"text" } }
};

function universalActions(key,id,extra=""){
  const item = adminData[key]?.find(x=>x.id===id);
  const activeLabel = item && item.active === false ? "Aktivieren" : "Deaktivieren";
  return `
    <button class="miniBtn viewMini" onclick="viewItem('${key}',${id})">Anzeigen</button>
    <button class="miniBtn" onclick="editItem('${key}',${id})">Bearbeiten</button>
    <button class="miniBtn" onclick="duplicateItem('${key}',${id})">Duplizieren</button>
    <button class="miniBtn" onclick="toggleItem('${key}',${id})">${activeLabel}</button>
    <button class="miniBtn archiveMini" onclick="archiveItem('${key}',${id})">Archivieren</button>
    ${extra}
    <button class="miniBtn dangerMini" onclick="deleteItem('${key}',${id})">Löschen</button>
  `;
}

function viewItem(key,id){
  const item = key === "users" ? adminUsers.find(x=>x.id===id) : adminData[key]?.find(x=>x.id===id);
  if(!item) return;
  const safe = {...item};
  if(safe.password) safe.password = "********";
  alert(JSON.stringify(safe,null,2));
}



/* ===========================
   3.7.6d – showAdminPage Fix
   Repariert Bearbeiten-Buttons: editItem() braucht showAdminPage().
=========================== */
window.showAdminPage = function(page){
  if(!page) return;

  const targetPage = document.getElementById(page);
  if(!targetPage){
    console.warn('Admin-Seite nicht gefunden:', page);
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  targetPage.classList.add('active');

  document.querySelectorAll('.navBtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  const activeBtn = document.querySelector(`.navBtn[data-page="${page}"]`);
  const title = document.getElementById('pageTitle');
  if(title){
    title.textContent = activeBtn
      ? activeBtn.textContent.replace(/^[^A-Za-zÄÖÜäöüß0-9]+/g,'').trim()
      : page;
  }

  if(typeof adminState !== 'undefined') adminState.currentPage = page;
  if(typeof refreshAdminDropdowns === 'function') refreshAdminDropdowns();
  if(page === 'scenes' && typeof refreshSceneDropdowns === 'function') refreshSceneDropdowns();
};

function editItem(key,id){
  const cfg = EDIT_CONFIG[key];
  const item = adminData[key]?.find(x=>x.id===id);
  if(!cfg || !item) return alert("Für dieses Modul ist noch kein Bearbeiten-Formular verknüpft.");
  showAdminPage(cfg.page);
  Object.entries(cfg.fields).forEach(([fieldId, prop])=>{
    const el = byId(fieldId); if(!el) return;
    let value = item[prop];
    if(typeof value === "boolean") value = String(value);
    el.value = value ?? "";
  });
  adminState.editing = adminState.editing || {};
  adminState.editing[key] = id;
  const btn = document.querySelector(cfg.saveButton);
  if(btn){
    if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
    btn.textContent = cfg.buttonText || "Aktualisieren";
  }
}

function finishEditing(key){
  if(adminState.editing) delete adminState.editing[key];
  const cfg = EDIT_CONFIG[key];
  if(cfg){
    const btn = document.querySelector(cfg.saveButton);
    if(btn && btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
  }
}

function duplicateItem(key,id){
  if(!ensureWrite(key)) return;
  const item = adminData[key]?.find(x=>x.id===id); if(!item) return;
  const copy = JSON.parse(JSON.stringify(item));
  copy.id = createId();
  copy.active = true;
  copy.archived = false;
  copy.deleted = false;
  copy.createdAt = getNow();
  copy.updatedAt = getNow();
  if(copy.name) copy.name += " Kopie";
  if(copy.title) copy.title += " Kopie";
  adminData[key].push(copy);
  saveAdminData();
}

function archiveItem(key,id){
  if(!ensureWrite(key)) return;
  const item = adminData[key]?.find(x=>x.id===id); if(!item) return;
  item.archived = true;
  item.active = false;
  item.updatedAt = getNow();
  saveAdminData();
}

function deleteItem(key,id){
  if(!ensureWrite(key)) return;
  const item = adminData[key]?.find(x=>x.id===id); if(!item) return;
  if(confirm("Eintrag in den Papierkorb verschieben?")){
    item.deleted = true;
    item.active = false;
    item.deletedAt = getNow();
    item.updatedAt = getNow();
    saveAdminData();
  }
}

function toggleItem(key,id){
  const item = adminData[key]?.find(x=>x.id===id); if(!item) return;
  item.active = item.active === false;
  item.updatedAt = getNow();
  saveAdminData();
}

function upsertRaw(key,data){
  adminState.editing = adminState.editing || {};
  const editingId = adminState.editing[key];
  if(editingId){
    const existing = adminData[key].find(x=>x.id===editingId);
    if(existing){
      Object.assign(existing, data, { updatedAt:getNow(), active: existing.active !== false, deleted:false });
    }
    finishEditing(key);
  } else {
    adminData[key].push({id:createId(),active:true,createdAt:getNow(),updatedAt:getNow(),...data});
  }
  saveAdminData();
}

function list(elementId,arr,titleFn,metaFn,key){
  const el=byId(elementId); if(!el)return;
  const visible = (arr||[]).filter(x=>!x.deleted);
  el.innerHTML=visible.map(x=>{
    const statusParts = [];
    statusParts.push(x.active!==false?"Aktiv":"Inaktiv");
    if(x.archived) statusParts.push("Archiviert");
    const meta = `${metaFn(x)}<br>Status: ${statusParts.join(" · ")}`;
    return card(titleFn(x), meta, universalActions(key,x.id));
  }).join("")||empty("Noch keine Einträge.");
}

function renderUsers(){
  fillSelect("userRole",Object.keys(ROLE_DEFINITIONS).map(k=>({value:k,label:ROLE_DEFINITIONS[k].label})));
  const el=byId("adminUserList"); if(!el)return;
  el.innerHTML=adminUsers.filter(u=>!u.deleted).map(u=>card(`${u.displayName||"Admin"}`,`${ROLE_DEFINITIONS[u.role]?.label||u.role} · ${u.active?"Aktiv":"Inaktiv"}`,`
    <button class="miniBtn viewMini" onclick="viewAdminUser(${u.id})">Anzeigen</button>
    <button class="miniBtn" onclick="editAdminUser(${u.id})">Bearbeiten</button>
    <button class="miniBtn" onclick="duplicateAdminUser(${u.id})">Duplizieren</button>
    <button class="miniBtn" onclick="toggleAdminUser(${u.id})">${u.active?"Deaktivieren":"Aktivieren"}</button>
    <button class="miniBtn dangerMini" onclick="deleteAdminUser(${u.id})">Löschen</button>
  `)).join("")||empty("Keine Benutzer.");
}
function viewAdminUser(id){ const u=adminUsers.find(x=>x.id===id); if(!u)return; const safe={...u,password:"********"}; alert(JSON.stringify(safe,null,2)); }
function editAdminUser(id){ const u=adminUsers.find(x=>x.id===id); if(!u)return; showAdminPage("users"); adminState.editingUserId=id; setVal("userDisplayName",u.displayName); setVal("userUsername",u.username); setVal("userRole",u.role); setVal("userPassword",""); const btn=document.querySelector("#users .saveBtn"); if(btn){ if(!btn.dataset.originalText)btn.dataset.originalText=btn.textContent; btn.textContent="Benutzer aktualisieren"; } }
function duplicateAdminUser(id){ if(!ensureWrite("users"))return; const u=adminUsers.find(x=>x.id===id); if(!u)return; const copy={...u,id:createId(),displayName:(u.displayName||"Admin")+" Kopie",username:(u.username||"user")+"_kopie",active:true,createdAt:getNow(),updatedAt:getNow()}; adminUsers.push(copy); saveAdminUsers(); renderAll(); }
function addAdminUser(){
  if(!ensureWrite("users")) return;
  const displayName=val("userDisplayName"), username=val("userUsername"), password=val("userPassword"), role=val("userRole");
  if(!displayName||!username) return alert("Anzeigename und Login-Name sind Pflicht.");
  if(adminState.editingUserId){
    const u=adminUsers.find(x=>x.id===adminState.editingUserId); if(!u)return;
    u.displayName=displayName; u.username=username; u.role=role; if(password)u.password=password; u.updatedAt=getNow();
    adminState.editingUserId=null;
    const btn=document.querySelector("#users .saveBtn"); if(btn&&btn.dataset.originalText)btn.textContent=btn.dataset.originalText;
  } else {
    if(!password)return alert("Bitte Passwort festlegen.");
    adminUsers.push({id:createId(),displayName,username,password,role,active:true,createdAt:getNow(),updatedAt:getNow()});
  }
  saveAdminUsers(); renderAll(); clearIds("userDisplayName","userUsername","userPassword");
}
function deleteAdminUser(id){ if(!ensureWrite("users"))return; const u=adminUsers.find(x=>x.id===id); if(!u)return; if(currentAdmin&&u.id===currentAdmin.id)return alert("Du kannst dich nicht selbst löschen."); if(u.role==="OWNER"&&adminUsers.filter(x=>x.role==="OWNER"&&!x.deleted).length<=1)return alert("Der letzte Owner kann nicht gelöscht werden."); if(confirm("Benutzer löschen?")){ u.deleted=true; u.active=false; u.updatedAt=getNow(); saveAdminUsers(); renderAll(); } }

function renderScenes(){
  const el=byId("sceneList"); if(!el)return;
  const items=(adminData.scenes||[]).filter(x=>!x.deleted);
  el.innerHTML=items.map(x=>{
    const p=x.participants||{};
    const names=[p.attackerName,p.defenderName,p.goalkeeperName].filter(Boolean).join(" · ");
    const meta=`${x.league||nameOf("competitions",x.competitionId)} · ${x.minute||"00:00"} · ${x.category||""} · richtig: ${escapeHtml(x.correct||"")}<br>${names?"Beteiligte: "+escapeHtml(names)+"<br>":""}Status: ${x.active!==false?"Aktiv":"Inaktiv"}${x.archived?" · Archiviert":""}`;
    return card(x.title,meta,`<button class="miniBtn viewMini" onclick="viewItem('scenes',${x.id})">Anzeigen</button><button class="miniBtn" onclick="editScene(${x.id})">Bearbeiten</button><button class="miniBtn" onclick="duplicateItem('scenes',${x.id})">Duplizieren</button><button class="miniBtn" onclick="toggleItem('scenes',${x.id})">${x.active!==false?"Deaktivieren":"Aktivieren"}</button><button class="miniBtn archiveMini" onclick="archiveItem('scenes',${x.id})">Archivieren</button><button class="miniBtn dangerMini" onclick="deleteItem('scenes',${x.id})">Löschen</button>`);
  }).join("")||empty("Noch keine Szenen.");
}

function saveMediaItem(){
  if(!ensureWrite("media")) return;
  const item={type:val("mediaType"),title:val("mediaTitle"),path:val("mediaPath"),category:val("mediaCategory"),credit:val("mediaCredit"),notes:val("mediaNotes")};
  if(!item.title||!item.path) return alert("Titel und Pfad sind Pflicht.");
  upsertRaw("media",item);
  clearIds("mediaTitle","mediaPath","mediaCategory","mediaCredit","mediaNotes");
}
function renderMediaItems(){
  const el=byId("mediaList"); if(!el) return;
  const type=val("mediaFilterType");
  let items=[...adminData.media].filter(m=>!m.deleted);
  if(type) items=items.filter(m=>m.type===type);
  items.sort((a,b)=>String(a.title||"").localeCompare(String(b.title||"")));
  const info=byId("mediaFilterInfo"); if(info) info.textContent=`${items.length} Medium/Medien ${type?"vom Typ "+type:"insgesamt"} angezeigt.`;
  el.innerHTML=items.map(m=>{
    const isImage=(m.type==="Bild"||m.type==="Logo"||m.type==="Banner"||m.type==="Stadionbild") && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(m.path||"");
    const preview=isImage?`<img src="${escapeHtml(m.path)}" alt="${escapeHtml(m.title)}">`:`<span>${escapeHtml(m.type||"Medium")}</span>`;
    return `<div class="mediaCard"><div class="mediaPreview">${preview}</div><span class="mediaTypeBadge">${escapeHtml(m.type||"Medium")}</span><strong>${escapeHtml(m.title)}</strong><p>${escapeHtml(m.path||"")}</p><small>${escapeHtml(m.category||"")} ${m.credit?"· "+escapeHtml(m.credit):""}</small><div class="itemActions">${universalActions('media',m.id)}</div></div>`;
  }).join("")||empty("Noch keine Medien.");
}

function saveCommunitySubmission(){
  if(!ensureWrite("communityScenes")) return;
  const item={priority:val("submissionPriority")||"standard",user:val("submissionUser")||"Unbekannt",competitionId:num("submissionCompetition"),homeClubId:num("submissionHomeClub"),awayClubId:num("submissionAwayClub"),title:val("submissionTitle"),category:val("submissionCategory"),description:val("submissionDescription"),correct:val("submissionCorrect"),explanation:val("submissionExplanation"),image:val("submissionImage"),video:val("submissionVideo")};
  if(!item.title||!item.description||!item.correct) return alert("Titel, Beschreibung und richtige Entscheidung sind Pflicht.");
  if(adminState.editing && adminState.editing.communitySubmissions){ item.status = adminData.communitySubmissions.find(x=>x.id===adminState.editing.communitySubmissions)?.status || "Eingegangen"; item.submittedAt = adminData.communitySubmissions.find(x=>x.id===adminState.editing.communitySubmissions)?.submittedAt || getNow(); }
  else { item.status="Eingegangen"; item.adminComment=""; item.submittedAt=getNow(); }
  upsertRaw("communitySubmissions",item);
  clearIds("submissionUser","submissionTitle","submissionDescription","submissionExplanation","submissionImage","submissionVideo");
}
function renderCommunitySubmissions(){
  const priorityEl=byId("prioritySubmissionList"), standardEl=byId("standardSubmissionList");
  if(!priorityEl||!standardEl) return;
  const status=val("submissionFilterStatus"), priority=val("submissionFilterPriority");
  let items=[...adminData.communitySubmissions].filter(s=>!s.deleted);
  if(status) items=items.filter(s=>s.status===status);
  if(priority) items=items.filter(s=>s.priority===priority);
  items.sort((a,b)=>{ if((a.priority==="platzpass") !== (b.priority==="platzpass")) return a.priority==="platzpass" ? -1 : 1; return new Date(a.submittedAt||a.createdAt||0)-new Date(b.submittedAt||b.createdAt||0); });
  const prio=items.filter(x=>x.priority==="platzpass"); const standard=items.filter(x=>x.priority!=="platzpass");
  const info=byId("submissionQueueInfo"); if(info) info.textContent=`${prio.length} Platzpass · ${standard.length} Standard · Platzpass wird bevorzugt geprüft.`;
  priorityEl.innerHTML=prio.map(renderSubmissionCard).join("")||empty("Keine Platzpass-Einreichungen.");
  standardEl.innerHTML=standard.map(renderSubmissionCard).join("")||empty("Keine Standard-Einreichungen.");
}
function renderSubmissionCard(s){
  const sla=getSlaInfo(s);
  const badge=s.priority==="platzpass"?`<span class="priorityBadge">⭐ Platzpass · 48h</span>`:`<span class="statusBadge">Standard · 30 Tage</span>`;
  const meta=`${badge}<span class="slaBadge ${sla.className}">${sla.text}</span><br><span class="submissionMeta">Von: ${escapeHtml(s.user||"-")}<br>${escapeHtml(nameOf("competitions",s.competitionId))} · ${escapeHtml(nameOf("clubs",s.homeClubId))} - ${escapeHtml(nameOf("clubs",s.awayClubId))}<br>Kategorie: ${escapeHtml(s.category||"")} · Entscheidung: ${escapeHtml(s.correct||"")}<br>Status: ${escapeHtml(s.status||"Eingegangen")}</span>`;
  return card(s.title||"Community-Szene", meta, `<button class="miniBtn viewMini" onclick="viewItem('communitySubmissions',${s.id})">Anzeigen</button><button class="miniBtn" onclick="editItem('communitySubmissions',${s.id})">Bearbeiten</button><button class="miniBtn" onclick="duplicateItem('communitySubmissions',${s.id})">Duplizieren</button><button class="miniBtn" onclick="setSubmissionStatus(${s.id},'In Prüfung')">Prüfen</button><button class="miniBtn" onclick="approveSubmission(${s.id})">Freigeben</button><button class="miniBtn" onclick="setSubmissionStatus(${s.id},'Überarbeitung nötig')">Überarbeitung</button><button class="miniBtn dangerMini" onclick="setSubmissionStatus(${s.id},'Abgelehnt')">Ablehnen</button><button class="miniBtn archiveMini" onclick="archiveItem('communitySubmissions',${s.id})">Archivieren</button><button class="miniBtn dangerMini" onclick="deleteItem('communitySubmissions',${s.id})">Löschen</button>`);
}

function renderPlacepass(){
  const pass=adminData.placepass; if(!pass) return;
  setVal("passSeasonNameInput",pass.seasonName); setVal("passThemeInput",pass.theme); setVal("passMaxLevelInput",pass.maxLevel); setVal("passCurrentLevelInput",pass.currentLevel); setVal("passProgressInput",pass.progress); setVal("passTimeLeftInput",pass.timeLeft); setVal("passDescriptionInput",pass.description);
  renderBenefitAdminList("freeBenefitList",pass.freeBenefits||[],"free");
  renderBenefitAdminList("premiumBenefitList",pass.premiumBenefits||[],"premium");
  const rewardList=byId("passRewardList");
  if(rewardList) rewardList.innerHTML=(pass.rewards||[]).filter(r=>!r.deleted).sort((a,b)=>(a.level||0)-(b.level||0)).map(r=>card(`Level ${r.level}`,`<span class="passTrackBadge">${r.track==="premium"?"Platzpass":"Kostenlos"}</span>${escapeHtml(r.reward)}`,`<button class="miniBtn" onclick="editPassReward(${r.id})">Bearbeiten</button><button class="miniBtn" onclick="duplicatePassReward(${r.id})">Duplizieren</button><button class="miniBtn dangerMini" onclick="deletePassReward(${r.id})">Löschen</button>`)).join("")||empty("Noch keine Belohnungen.");
  const missionList=byId("passMissionList");
  if(missionList) missionList.innerHTML=(pass.missions||[]).filter(m=>!m.deleted).map(m=>card(m.title,`${m.type} · ${m.reward}`,`<button class="miniBtn" onclick="editPassMission(${m.id})">Bearbeiten</button><button class="miniBtn" onclick="duplicatePassMission(${m.id})">Duplizieren</button><button class="miniBtn dangerMini" onclick="deletePassMission(${m.id})">Löschen</button>`)).join("")||empty("Noch keine Missionen.");
}
function renderBenefitAdminList(id,arr,type){ const el=byId(id); if(!el)return; el.innerHTML=arr.map((b,i)=>card(b,type==="premium"?"💎 Platzpass-Vorteil":"✅ Kostenloser Vorteil",`<button class="miniBtn" onclick="editPassBenefit('${type}',${i})">Bearbeiten</button><button class="miniBtn" onclick="duplicatePassBenefit('${type}',${i})">Duplizieren</button><button class="miniBtn dangerMini" onclick="deletePassBenefit('${type}',${i})">Löschen</button>`)).join("")||empty("Noch keine Vorteile."); }
function editPassBenefit(type,index){ const key=type==="premium"?"premiumBenefits":"freeBenefits"; const inputId=type==="premium"?"premiumBenefitInput":"freeBenefitInput"; setVal(inputId,adminData.placepass[key][index]); adminState.editingBenefit={type,index}; }
function duplicatePassBenefit(type,index){ const key=type==="premium"?"premiumBenefits":"freeBenefits"; adminData.placepass[key].splice(index+1,0,adminData.placepass[key][index]+" Kopie"); saveAdminData(); }
function addPassBenefit(type){ if(!ensureWrite("placepass"))return; const inputId=type==="premium"?"premiumBenefitInput":"freeBenefitInput"; const text=val(inputId); if(!text)return alert("Bitte Vorteil eingeben."); const key=type==="premium"?"premiumBenefits":"freeBenefits"; adminData.placepass[key]=adminData.placepass[key]||[]; if(adminState.editingBenefit && adminState.editingBenefit.type===type){ adminData.placepass[key][adminState.editingBenefit.index]=text; adminState.editingBenefit=null; } else { adminData.placepass[key].push(text); } clearIds(inputId); saveAdminData(); }
function editPassReward(id){ const r=adminData.placepass.rewards.find(x=>x.id===id); if(!r)return; setVal("passRewardLevel",r.level); setVal("passRewardText",r.reward); setVal("passRewardTrack",r.track); adminState.editingPassRewardId=id; }
function duplicatePassReward(id){ const r=adminData.placepass.rewards.find(x=>x.id===id); if(!r)return; adminData.placepass.rewards.push({...r,id:createId(),reward:r.reward+" Kopie"}); saveAdminData(); }
function addPassReward(){ if(!ensureWrite("placepass"))return; const level=Number(val("passRewardLevel")); const reward=val("passRewardText"); const track=val("passRewardTrack")||"free"; if(!level||!reward)return alert("Level und Belohnung sind Pflicht."); if(adminState.editingPassRewardId){ const r=adminData.placepass.rewards.find(x=>x.id===adminState.editingPassRewardId); if(r) Object.assign(r,{level,reward,track,updatedAt:getNow()}); adminState.editingPassRewardId=null; } else { adminData.placepass.rewards=adminData.placepass.rewards||[]; adminData.placepass.rewards.push({id:createId(),level,reward,track}); } clearIds("passRewardLevel","passRewardText"); saveAdminData(); }
function deletePassReward(id){ if(!ensureWrite("placepass"))return; const r=adminData.placepass.rewards.find(x=>x.id===id); if(r){ r.deleted=true; saveAdminData(); } }
function editPassMission(id){ const m=adminData.placepass.missions.find(x=>x.id===id); if(!m)return; setVal("passMissionType",m.type); setVal("passMissionTitle",m.title); setVal("passMissionReward",m.reward); adminState.editingPassMissionId=id; }
function duplicatePassMission(id){ const m=adminData.placepass.missions.find(x=>x.id===id); if(!m)return; adminData.placepass.missions.push({...m,id:createId(),title:m.title+" Kopie"}); saveAdminData(); }
function addPassMission(){ if(!ensureWrite("placepass"))return; const type=val("passMissionType"), title=val("passMissionTitle"), reward=val("passMissionReward"); if(!title||!reward)return alert("Mission und Belohnung sind Pflicht."); if(adminState.editingPassMissionId){ const m=adminData.placepass.missions.find(x=>x.id===adminState.editingPassMissionId); if(m) Object.assign(m,{type,title,reward,updatedAt:getNow()}); adminState.editingPassMissionId=null; } else { adminData.placepass.missions=adminData.placepass.missions||[]; adminData.placepass.missions.push({id:createId(),type,title,reward}); } clearIds("passMissionTitle","passMissionReward"); saveAdminData(); }
function deletePassMission(id){ if(!ensureWrite("placepass"))return; const m=adminData.placepass.missions.find(x=>x.id===id); if(m){ m.deleted=true; saveAdminData(); } }

function saveNewsItem(){
  if(!ensureWrite("newsCenter")) return;
  const item={title:val("newsTitleInput"),category:val("newsCategoryInput")||"News",date:val("newsDateInput")||new Date().toLocaleDateString("de-DE"),pinned:val("newsPinnedInput")==="true",text:val("newsTextInput"),active:true,updatedAt:getNow()};
  if(!item.title||!item.text) return alert("Titel und Text sind Pflicht.");
  upsertRaw("news",item);
  clearIds("newsTitleInput","newsDateInput","newsTextInput");
}
function renderNewsItems(){
  const el=byId("newsAdminList"); if(!el)return;
  const cat=val("newsFilterCategory");
  let items=[...adminData.news].filter(n=>!n.deleted); if(cat) items=items.filter(n=>n.category===cat);
  items.sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned));
  const info=byId("newsFilterInfo"); if(info) info.textContent=`${items.length} News ${cat?"in "+cat:"insgesamt"} angezeigt.`;
  el.innerHTML=items.map(n=>card(n.title,`${n.pinned?"<span class=\"newsPinnedBadge\">📌 Angeheftet</span>":""}<span class="newsCategoryBadge">${escapeHtml(n.category)}</span>${escapeHtml(n.date||"")}<br>${escapeHtml(n.text||"").replaceAll("\n","<br>")}`,universalActions('news',n.id))).join("")||empty("Noch keine News.");
}

console.log("VAR Challenge Admin Center 3.6 Universal Editor geladen.");

/* ===========================
   FIX 3.7.1d – Admin Bearbeiten & Listen-Aktionen
   Behebt: Bearbeiten speichert als neuen Eintrag / News ohne Bearbeiten.
=========================== */

function upsertRaw(key,data){
  adminState.editing = adminState.editing || {};
  const editingId = adminState.editing[key];

  if(editingId){
    const existing = adminData[key]?.find(x => Number(x.id) === Number(editingId));
    if(existing){
      Object.assign(existing, data, {
        updatedAt: getNow(),
        active: existing.active !== false,
        deleted: false
      });
    }
    finishEditing(key);
  } else {
    adminData[key].push({
      id: createId(),
      active: true,
      deleted: false,
      archived: false,
      createdAt: getNow(),
      updatedAt: getNow(),
      ...data
    });
  }

  saveAdminData();
}

function saveNewsItem(){
  if(!ensureWrite("newsCenter")) return;
  const item = {
    title: val("newsTitleInput"),
    category: val("newsCategoryInput") || "News",
    date: val("newsDateInput") || new Date().toLocaleDateString("de-DE"),
    pinned: val("newsPinnedInput") === "true",
    text: val("newsTextInput")
  };
  if(!item.title || !item.text) return alert("Titel und Text sind Pflicht.");
  upsertRaw("news", item);
  clearIds("newsTitleInput","newsDateInput","newsTextInput");
}

function renderNewsItems(){
  const el = byId("newsAdminList");
  if(!el) return;
  const cat = val("newsFilterCategory");
  let items = [...adminData.news].filter(n => !n.deleted);
  if(cat) items = items.filter(n => n.category === cat);
  items.sort((a,b) => Number(!!b.pinned) - Number(!!a.pinned));
  const info = byId("newsFilterInfo");
  if(info) info.textContent = `${items.length} News ${cat ? "in " + cat : "insgesamt"} angezeigt.`;
  el.innerHTML = items.map(n => card(
    n.title,
    `${n.pinned ? '<span class="newsPinnedBadge">📌 Angeheftet</span>' : ''}<span class="newsCategoryBadge">${escapeHtml(n.category)}</span>${escapeHtml(n.date || "")}<br>${escapeHtml(n.text || "").replaceAll("\n","<br>")}`,
    universalActions("news", n.id)
  )).join("") || empty("Noch keine News.");
}

function saveMediaItem(){
  if(!ensureWrite("media")) return;
  const item = {
    type: val("mediaType"),
    title: val("mediaTitle"),
    path: val("mediaPath"),
    category: val("mediaCategory"),
    credit: val("mediaCredit"),
    notes: val("mediaNotes")
  };
  if(!item.title || !item.path) return alert("Titel und Pfad sind Pflicht.");
  upsertRaw("media", item);
  clearIds("mediaTitle","mediaPath","mediaCategory","mediaCredit","mediaNotes");
}

function saveCommunitySubmission(){
  if(!ensureWrite("communityScenes")) return;
  const item = {
    priority: val("submissionPriority") || "standard",
    user: val("submissionUser") || "Unbekannt",
    competitionId: num("submissionCompetition"),
    homeClubId: num("submissionHomeClub"),
    awayClubId: num("submissionAwayClub"),
    title: val("submissionTitle"),
    category: val("submissionCategory"),
    description: val("submissionDescription"),
    correct: val("submissionCorrect"),
    explanation: val("submissionExplanation"),
    image: val("submissionImage"),
    video: val("submissionVideo"),
    status: val("submissionStatus") || "Eingegangen",
    adminComment: val("submissionAdminComment") || ""
  };
  if(!item.title || !item.description || !item.correct) return alert("Titel, Beschreibung und Entscheidung sind Pflicht.");
  upsertRaw("communitySubmissions", item);
  clearIds("submissionTitle","submissionDescription","submissionExplanation","submissionImage","submissionVideo","submissionAdminComment");
}

/* ===========================
   VAR Challenge 3.7.6 – Admin Render Restore
   Repariert Admin-Listen, Bearbeiten/Speichern und lokale Statistik-Anzeige,
   ohne bestehende Daten zu löschen.
=========================== */
(function(){
  const VERSION_REPAIR = "3.7.6";

  function sameId(a,b){ return String(a) === String(b); }
  function jsArg(value){ return JSON.stringify(value); }
  function arr(key){ if(!adminData[key] || !Array.isArray(adminData[key])) adminData[key] = []; return adminData[key]; }
  function findItem(key,id){ return arr(key).find(x => sameId(x.id,id)); }
  function visibleItems(items){ return (items || []).filter(x => !x.deleted); }
  function safeTitle(value,fallback="Unbenannt"){ return escapeHtml(value || fallback); }

  window.universalActions = function(key,id,extra=""){
    const item = findItem(key,id);
    const activeLabel = item && item.active === false ? "Aktivieren" : "Deaktivieren";
    const idArg = jsArg(id);
    const keyArg = jsArg(key);
    return `
      <button class="miniBtn viewMini" onclick='viewItem(${keyArg},${idArg})'>Anzeigen</button>
      <button class="miniBtn" onclick='editItem(${keyArg},${idArg})'>Bearbeiten</button>
      <button class="miniBtn" onclick='duplicateItem(${keyArg},${idArg})'>Duplizieren</button>
      <button class="miniBtn" onclick='toggleItem(${keyArg},${idArg})'>${activeLabel}</button>
      <button class="miniBtn archiveMini" onclick='archiveItem(${keyArg},${idArg})'>Archivieren</button>
      ${extra || ""}
      <button class="miniBtn dangerMini" onclick='deleteItem(${keyArg},${idArg})'>Löschen</button>
    `;
  };

  window.viewItem = function(key,id){
    const item = key === "users" ? adminUsers.find(x=>sameId(x.id,id)) : findItem(key,id);
    if(!item) return alert("Eintrag nicht gefunden.");
    const copy = {...item};
    if(copy.password) copy.password = "********";
    alert(JSON.stringify(copy,null,2));
  };

  window.editItem = function(key,id){
    const cfg = EDIT_CONFIG[key];
    const item = findItem(key,id);
    if(!cfg || !item) return alert("Für dieses Modul ist noch kein Bearbeiten-Formular verknüpft.");

    showAdminPage(cfg.page);
    refreshAdminDropdowns();
    if(key === "scenes" && typeof refreshSceneDropdowns === "function") refreshSceneDropdowns();

    Object.entries(cfg.fields).forEach(([fieldId, prop])=>{
      const el = byId(fieldId);
      if(!el) return;
      let value = item[prop];
      if(prop === "varEnabled") value = item[prop] === true ? "true" : "false";
      if(prop === "premium" || prop === "pinned") value = item[prop] === true ? "true" : "false";
      el.value = value ?? "";
    });

    adminState.editing = adminState.editing || {};
    adminState.editing[key] = id;
    const btn = document.querySelector(cfg.saveButton);
    if(btn){
      if(!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
      btn.textContent = cfg.buttonText || "Aktualisieren";
    }
  };

  window.finishEditing = function(key){
    if(adminState.editing) delete adminState.editing[key];
    const cfg = EDIT_CONFIG[key];
    const btn = cfg ? document.querySelector(cfg.saveButton) : null;
    if(btn && btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
  };

  window.upsertRaw = function(key,data){
    adminState.editing = adminState.editing || {};
    const editingId = adminState.editing[key];
    const collection = arr(key);

    if(editingId !== undefined && editingId !== null && editingId !== ""){
      const existing = collection.find(x => sameId(x.id,editingId));
      if(existing){
        Object.assign(existing,data,{updatedAt:getNow(),deleted:false,active:existing.active!==false});
      }
      finishEditing(key);
    } else {
      collection.push({id:createId(),active:true,deleted:false,archived:false,createdAt:getNow(),updatedAt:getNow(),...data});
    }
    saveAdminData();
  };

  window.upsert = function(key,data,requiredIds){
    for(const id of (requiredIds || [])){
      if(!val(id)) return alert("Bitte Pflichtfelder ausfüllen.");
    }
    upsertRaw(key,data);
  };

  window.duplicateItem = function(key,id){
    if(!ensureWrite(key)) return;
    const item = findItem(key,id); if(!item) return;
    const copy = JSON.parse(JSON.stringify(item));
    copy.id = createId();
    copy.active = true;
    copy.archived = false;
    copy.deleted = false;
    copy.createdAt = getNow();
    copy.updatedAt = getNow();
    if(copy.name) copy.name += " Kopie";
    if(copy.title) copy.title += " Kopie";
    arr(key).push(copy);
    saveAdminData();
  };

  window.archiveItem = function(key,id){
    if(!ensureWrite(key)) return;
    const item = findItem(key,id); if(!item) return;
    item.archived = true;
    item.active = false;
    item.updatedAt = getNow();
    saveAdminData();
  };

  window.deleteItem = function(key,id){
    if(!ensureWrite(key)) return;
    const item = findItem(key,id); if(!item) return;
    if(confirm("Eintrag in den Papierkorb verschieben?")){
      item.deleted = true;
      item.active = false;
      item.deletedAt = getNow();
      item.updatedAt = getNow();
      saveAdminData();
    }
  };

  window.toggleItem = function(key,id){
    if(!ensureWrite(key)) return;
    const item = findItem(key,id); if(!item) return;
    item.active = item.active === false;
    item.updatedAt = getNow();
    saveAdminData();
  };

  window.list = function(elementId,items,titleFn,metaFn,key){
    const el = byId(elementId); if(!el) return;
    const rows = visibleItems(items);
    el.innerHTML = rows.map(x=>{
      const status = [x.active!==false ? "Aktiv" : "Inaktiv", x.archived ? "Archiviert" : ""].filter(Boolean).join(" · ");
      return card(titleFn(x), `${metaFn(x)}<br>Status: ${escapeHtml(status)}`, universalActions(key,x.id));
    }).join("") || empty("Noch keine Einträge.");
  };

  window.renderCountries = function(){ list("countryList",arr("countries"),x=>`${x.flag||""} ${x.name||""}`,x=>`Code: ${x.code||"-"}`,"countries"); };
  window.renderCompetitions = function(){ list("competitionList",arr("competitions"),x=>x.name,x=>`${x.gender||""} · ${nameOf("countries",x.countryId)} · ${x.type||""} · Level ${x.level||"-"}`,"competitions"); };
  window.renderSeasons = function(){ list("seasonList",arr("seasons"),x=>`${nameOf("competitions",x.competitionId)} ${x.name||""}`,x=>`${x.start||""} ${x.end?"bis "+x.end:""}`,"seasons"); };

  window.renderClubs = function(){
    const gender = val("clubFilterGender");
    const competitionId = num("clubFilterCompetition");
    let clubs = visibleItems(arr("clubs"));
    if(gender) clubs = clubs.filter(c => c.gender === gender || c.gender === "Beide");
    if(competitionId) clubs = clubs.filter(c => sameId(c.competitionId,competitionId));
    clubs.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""),"de"));
    const info = byId("clubFilterInfo");
    if(info) info.textContent = `${clubs.length} Verein(e) angezeigt.`;
    list("clubList",clubs,x=>x.name,x=>`${x.gender||""} · ${nameOf("competitions",x.competitionId)} · ${x.city||""}${x.premium?" · Premium":""}`,"clubs");
  };

  window.renderStadiums = function(){ list("stadiumList",visibleItems(arr("stadiums")),x=>x.name,x=>`${x.city||""} · ${nameOf("clubs",x.clubId)} · ${x.capacity||""}`,"stadiums"); };

  window.renderPlayers = function(){
    const gender = val("playerFilterGender");
    const clubId = num("playerFilterClub");
    const position = val("playerFilterPosition");
    let players = visibleItems(arr("players"));
    if(gender) players = players.filter(p => p.gender === gender || p.gender === "Beide");
    if(clubId) players = players.filter(p => sameId(p.clubId,clubId));
    if(position) players = players.filter(p => String(p.position||"").toUpperCase() === position.toUpperCase());
    players.sort((a,b)=>playerName(a).localeCompare(playerName(b),"de"));
    const info = byId("playerFilterInfo");
    if(info) info.textContent = `${players.length} Spieler angezeigt.`;
    list("playerList",players,x=>playerName(x),x=>`${x.gender||""} · ${x.position||""} · #${x.number||"-"} · ${nameOf("clubs",x.clubId)} · ${x.nationality||""}`,"players");
  };

  window.renderReferees = function(){ list("refereeList",visibleItems(arr("referees")),x=>x.name,x=>`${x.license||""} · ${x.varEnabled?"VAR":"kein VAR"} · ${nameOf("countries",x.countryId)}`,"referees"); };
  window.renderCareer = function(){ list("careerList",visibleItems(arr("career")).sort((a,b)=>(a.xp||0)-(b.xp||0)),x=>x.title,x=>`${x.xp||0} XP · ${x.reward||""} · ${x.unlock||""}`,"career"); };

  window.renderScenes = function(){
    const el = byId("sceneList"); if(!el) return;
    const items = visibleItems(arr("scenes"));
    el.innerHTML = items.map(x=>{
      const p = x.participants || {};
      const names = [p.attackerName,p.defenderName,p.goalkeeperName].filter(Boolean).join(" · ");
      const league = x.league || nameOf("competitions",x.competitionId) || "-";
      const meta = `${escapeHtml(league)} · ${escapeHtml(x.minute||"00:00")} · ${escapeHtml(x.category||"")} · richtig: ${escapeHtml(x.correct||"")}<br>${names ? "Beteiligte: "+escapeHtml(names)+"<br>" : ""}Status: ${x.active!==false?"Aktiv":"Inaktiv"}${x.archived?" · Archiviert":""}`;
      return card(x.title || "Unbenannte Szene", meta, universalActions("scenes",x.id));
    }).join("") || empty("Noch keine Szenen.");
  };

  window.renderMediaItems = function(){
    const el = byId("mediaList"); if(!el) return;
    const type = val("mediaFilterType");
    let items = visibleItems(arr("media"));
    if(type) items = items.filter(m=>m.type===type);
    const info = byId("mediaFilterInfo"); if(info) info.textContent = `${items.length} Medien angezeigt.`;
    el.innerHTML = items.map(m=>{
      const isImage = m.path && /\.(png|jpg|jpeg|webp|gif)$/i.test(m.path);
      const preview = isImage ? `<img src="${escapeHtml(m.path)}" alt="">` : `<div class="mediaPlaceholder">${escapeHtml(m.type||"Medium")}</div>`;
      return `<div class="mediaCard"><div class="mediaPreview">${preview}</div><span class="mediaTypeBadge">${escapeHtml(m.type||"Medium")}</span><strong>${escapeHtml(m.title||"")}</strong><p>${escapeHtml(m.path||"")}</p><small>${escapeHtml(m.category||"")} ${m.credit?"· "+escapeHtml(m.credit):""}</small><div class="itemActions">${universalActions("media",m.id)}</div></div>`;
    }).join("") || empty("Noch keine Medien.");
  };

  window.renderNewsItems = function(){
    const el = byId("newsAdminList"); if(!el) return;
    const cat = val("newsFilterCategory");
    let items = visibleItems(arr("news"));
    if(cat) items = items.filter(n=>n.category===cat);
    items.sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned));
    const info = byId("newsFilterInfo"); if(info) info.textContent = `${items.length} News angezeigt.`;
    el.innerHTML = items.map(n=>card(n.title||"News",`${n.pinned?'<span class="newsPinnedBadge">📌 Angeheftet</span> ':""}<span class="newsCategoryBadge">${escapeHtml(n.category||"News")}</span> ${escapeHtml(n.date||"")}<br>${escapeHtml(n.text||"").replaceAll("\n","<br>")}`,universalActions("news",n.id))).join("") || empty("Noch keine News.");
  };

  window.renderCommunitySubmissions = function(){
    const priorityEl = byId("prioritySubmissionList");
    const standardEl = byId("standardSubmissionList");
    if(!priorityEl || !standardEl) return;
    const status = val("submissionFilterStatus");
    const prio = val("submissionFilterPriority");
    let items = visibleItems(arr("communitySubmissions"));
    if(status) items = items.filter(s=>s.status===status);
    if(prio) items = items.filter(s=>s.priority===prio);
    const priority = items.filter(s=>s.priority==="platzpass");
    const standard = items.filter(s=>s.priority!=="platzpass");
    const info = byId("submissionQueueInfo"); if(info) info.textContent = `${priority.length} Platzpass · ${standard.length} Standard`;
    priorityEl.innerHTML = priority.map(renderSubmissionCard).join("") || empty("Keine Platzpass-Einreichungen.");
    standardEl.innerHTML = standard.map(renderSubmissionCard).join("") || empty("Keine Standard-Einreichungen.");
  };

  window.renderSubmissionCard = function(s){
    const deadline = getSubmissionDeadline ? getSubmissionDeadline(s) : null;
    const remain = deadline && getDeadlineText ? getDeadlineText(deadline) : "";
    const meta = `${s.priority==="platzpass"?"⭐ Platzpass":"Standard"} · ${escapeHtml(s.status||"Eingegangen")} · ${escapeHtml(s.user||"Unbekannt")}<br>${escapeHtml(nameOf("competitions",s.competitionId))} · ${escapeHtml(nameOf("clubs",s.homeClubId))} vs ${escapeHtml(nameOf("clubs",s.awayClubId))}<br>${remain}`;
    return card(s.title||"Community-Szene",meta,universalActions("communitySubmissions",s.id,`<button class="miniBtn" onclick='setSubmissionStatus(${jsArg(s.id)},"In Prüfung")'>Prüfen</button><button class="miniBtn" onclick='approveSubmission(${jsArg(s.id)})'>Freigeben</button>`));
  };

  window.renderDashboard = function(){
    updateComputedProjectProgress();
    const counts = {
      sceneCount: visibleItems(arr("scenes")).length,
      clubCount: visibleItems(arr("clubs")).length,
      playerCount: visibleItems(arr("players")).length,
      mediaCount: visibleItems(arr("media")).length,
      communitySceneCount: visibleItems(arr("communitySubmissions")).length,
      newsCount: visibleItems(arr("news")).length,
      competitionCount: visibleItems(arr("competitions")).length,
      countryCount: visibleItems(arr("countries")).length,
      placepassLevelCount: adminData.placepass?.maxLevel || 0,
      projectVersionStat: adminData.settings?.version || "-",
      projectEditionStat: adminData.settings?.edition || "-"
    };
    Object.entries(counts).forEach(([id,value])=>setText(id,value));
    setText("dashProjectName",adminData.settings?.gameTitle || "VAR Challenge");
    setText("dashProjectStatus",adminData.settings?.status || "In Entwicklung");
    setText("dashProjectProgressText",(adminData.settings?.progress || 0)+"%");
    if(byId("dashProjectProgress")) byId("dashProjectProgress").style.width = `${clamp(adminData.settings?.progress || 0,0,100)}%`;
    renderAnalyticsDashboard();
  };

  window.renderAnalyticsDashboard = function(){
    const dashboard = byId("dashboard");
    if(!dashboard) return;
    let panel = byId("analyticsPanel");
    if(!panel){
      panel = document.createElement("div");
      panel.id = "analyticsPanel";
      panel.className = "panel";
      panel.innerHTML = `<h2>📊 Statistik</h2><div class="statsGrid"><div class="statCard"><span>Besuche</span><strong id="analyticsVisits">0</strong></div><div class="statCard"><span>Spiele gestartet</span><strong id="analyticsGamesStarted">0</strong></div><div class="statCard"><span>Spiele beendet</span><strong id="analyticsGamesFinished">0</strong></div><div class="statCard"><span>Gespielte Szenen</span><strong id="analyticsScenesPlayed">0</strong></div><div class="statCard"><span>Richtig</span><strong id="analyticsCorrect">0</strong></div><div class="statCard"><span>Falsch</span><strong id="analyticsWrong">0</strong></div></div>`;
      dashboard.appendChild(panel);
    }
    let a = {};
    try{ a = JSON.parse(localStorage.getItem("varChallengeAnalytics") || "{}"); }catch{}
    setText("analyticsVisits",a.visits || 0);
    setText("analyticsGamesStarted",a.gamesStarted || 0);
    setText("analyticsGamesFinished",a.gamesFinished || 0);
    setText("analyticsScenesPlayed",a.scenesPlayed || 0);
    setText("analyticsCorrect",a.correctAnswers || 0);
    setText("analyticsWrong",a.wrongAnswers || 0);
  };



  /* ===========================
     3.7.6c Fix: Community-SLA Helpers
     Verhindert, dass renderCommunitySubmissions() abbricht.
  =========================== */
  function getSubmissionDeadline(submission){
    const createdRaw = submission?.createdAt || submission?.submittedAt || submission?.date || submission?.created || new Date().toISOString();
    const created = new Date(createdRaw);
    const safeCreated = Number.isNaN(created.getTime()) ? new Date() : created;
    const hours = submission?.priority === "platzpass" ? 48 : 24 * 30;
    return new Date(safeCreated.getTime() + hours * 60 * 60 * 1000);
  }

  function getDeadlineText(deadline){
    const target = deadline instanceof Date ? deadline : new Date(deadline);
    if(Number.isNaN(target.getTime())) return "";

    const diff = target.getTime() - Date.now();
    const overdue = diff < 0;
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const restHours = hours % 24;

    if(days > 0){
      return overdue
        ? `⏰ Frist überschritten: ${days} Tg. ${restHours} Std.`
        : `⏱️ Frist: ${days} Tg. ${restHours} Std.`;
    }

    return overdue
      ? `⏰ Frist überschritten: ${hours} Std.`
      : `⏱️ Frist: ${hours} Std.`;
  }

  window.getSubmissionDeadline = getSubmissionDeadline;
  window.getDeadlineText = getDeadlineText;

  window.renderAll = function(){
    renderDashboard();
    renderProjectSettings();
    renderUsers();
    renderRoles();
    renderCountries();
    renderCompetitions();
    renderSeasons();
    renderClubs();
    renderStadiums();
    renderPlayers();
    renderReferees();
    renderScenes();
    renderMediaItems();
    renderCommunitySubmissions();
    renderPlacepass();
    renderNewsItems();
    renderCareer();
    refreshAdminDropdowns();
  };

  console.log("VAR Challenge Admin 3.7.6 Render Restore geladen.");
})();


/* ===========================
   Alpha 3.7.7a – Support Admin
   Wird nur ergänzt und greift bestehende Daten nicht an.
=========================== */
(function(){
  const DEFAULT_SUPPORT_ADMIN = {
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
      { id: createId(), version: "Alpha 3.7.7a", title: "Community & Support", status: "Aktiv" },
      { id: createId(), version: "Alpha 3.7.7b", title: "Registrierung & Login", status: "Geplant" },
      { id: createId(), version: "Alpha 3.7.8", title: "Analytics PRO", status: "Geplant" },
      { id: createId(), version: "Alpha 3.8", title: "2. Bundesliga", status: "Geplant" }
    ],
    changelog: [
      { id: createId(), version: "Alpha 3.7.7a", text: "Support-Seite, Social Links, Roadmap und Unterstützerbereich vorbereitet." },
      { id: createId(), version: "Alpha 3.7.6", text: "Stable-Basis: Admin Center, Daten und Szenen repariert." }
    ],
    supporters: []
  };

  const supportArg = (value) => JSON.stringify(value);

  function ensureSupportData(){
    if(!adminData.support || typeof adminData.support !== "object") adminData.support = {};
    adminData.support = {
      ...DEFAULT_SUPPORT_ADMIN,
      ...adminData.support,
      roadmap: Array.isArray(adminData.support.roadmap) ? adminData.support.roadmap : DEFAULT_SUPPORT_ADMIN.roadmap,
      changelog: Array.isArray(adminData.support.changelog) ? adminData.support.changelog : DEFAULT_SUPPORT_ADMIN.changelog,
      supporters: Array.isArray(adminData.support.supporters) ? adminData.support.supporters : []
    };
  }

  ["OWNER","ADMIN","MODERATOR"].forEach(roleKey=>{
    if(ROLE_DEFINITIONS[roleKey] && !ROLE_DEFINITIONS[roleKey].permissions.includes("supportHub") && !ROLE_DEFINITIONS[roleKey].permissions.includes("all")){
      ROLE_DEFINITIONS[roleKey].permissions.push("supportHub");
    }
  });

  const originalLoadAdminData = window.loadAdminData || loadAdminData;
  window.loadAdminData = function(){
    originalLoadAdminData();
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if(saved.support) adminData.support = saved.support;
    }catch{}
    ensureSupportData();
  };

  const originalSaveAdminData = window.saveAdminData || saveAdminData;
  window.saveAdminData = function(){
    ensureSupportData();
    originalSaveAdminData();
  };

  window.saveSupportSettings = function(){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    Object.assign(adminData.support, {
      title: val("supportTitleInput") || "VAR Challenge unterstützen",
      intro: val("supportIntroInput"),
      paypal: val("supportPaypalInput"),
      kofi: val("supportKofiInput"),
      discord: val("supportDiscordInput"),
      tiktok: val("supportTikTokInput"),
      youtube: val("supportYouTubeInput"),
      twitch: val("supportTwitchInput"),
      instagram: val("supportInstagramInput"),
      website: val("supportWebsiteInput"),
      bugReport: val("supportBugReportInput"),
      ideaSubmit: val("supportIdeaSubmitInput")
    });
    saveAdminData();
  };

  window.renderSupportAdmin = function(){
    ensureSupportData();
    const s = adminData.support;
    setVal("supportTitleInput", s.title);
    setVal("supportIntroInput", s.intro);
    setVal("supportPaypalInput", s.paypal);
    setVal("supportKofiInput", s.kofi);
    setVal("supportDiscordInput", s.discord);
    setVal("supportTikTokInput", s.tiktok);
    setVal("supportYouTubeInput", s.youtube);
    setVal("supportTwitchInput", s.twitch);
    setVal("supportInstagramInput", s.instagram);
    setVal("supportWebsiteInput", s.website);
    setVal("supportBugReportInput", s.bugReport);
    setVal("supportIdeaSubmitInput", s.ideaSubmit);

    const roadmap = byId("supportRoadmapAdminList");
    if(roadmap) roadmap.innerHTML = (s.roadmap || []).map(item=>card(item.version || "Roadmap", `<span class="supportStatusBadge">${escapeHtml(item.status || "")}</span>${escapeHtml(item.title || "")}`, `<button class="miniBtn dangerMini" onclick="deleteSupportRoadmapItem(${supportArg(item.id)})">Löschen</button>`)).join("") || empty("Noch keine Roadmap-Einträge.");

    const changelog = byId("supportChangelogAdminList");
    if(changelog) changelog.innerHTML = (s.changelog || []).map(item=>card(item.version || "Update", escapeHtml(item.text || ""), `<button class="miniBtn dangerMini" onclick="deleteSupportChangelogItem(${supportArg(item.id)})">Löschen</button>`)).join("") || empty("Noch keine Changelog-Einträge.");

    const supporters = byId("supporterAdminList");
    if(supporters) supporters.innerHTML = (s.supporters || []).map(item=>card(item.publicName || item.name || "Anonymer Unterstützer", `${item.visible === false ? "Nicht öffentlich" : "Öffentlich"}${item.message ? "<br>"+escapeHtml(item.message) : ""}`, `<button class="miniBtn" onclick="toggleSupporterVisibility(${supportArg(item.id)})">${item.visible === false ? "Öffentlich" : "Ausblenden"}</button><button class="miniBtn dangerMini" onclick="deleteSupporterItem(${supportArg(item.id)})">Löschen</button>`)).join("") || empty("Noch keine Unterstützer eingetragen.");
  };

  window.addSupportRoadmapItem = function(){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    const item = { id:createId(), version:val("supportRoadmapVersion"), title:val("supportRoadmapTitle"), status:val("supportRoadmapStatus") || "Geplant" };
    if(!item.version || !item.title) return alert("Version und Titel sind Pflicht.");
    adminData.support.roadmap.push(item);
    clearIds("supportRoadmapVersion","supportRoadmapTitle","supportRoadmapStatus");
    saveAdminData();
  };

  window.deleteSupportRoadmapItem = function(id){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    adminData.support.roadmap = (adminData.support.roadmap || []).filter(x=>String(x.id)!==String(id));
    saveAdminData();
  };

  window.addSupportChangelogItem = function(){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    const item = { id:createId(), version:val("supportChangelogVersion"), text:val("supportChangelogText") };
    if(!item.version || !item.text) return alert("Version und Text sind Pflicht.");
    adminData.support.changelog.unshift(item);
    clearIds("supportChangelogVersion","supportChangelogText");
    saveAdminData();
  };

  window.deleteSupportChangelogItem = function(id){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    adminData.support.changelog = (adminData.support.changelog || []).filter(x=>String(x.id)!==String(id));
    saveAdminData();
  };

  window.addSupporterItem = function(){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    const name = val("supporterNameInput") || "Anonymer Unterstützer";
    const item = { id:createId(), publicName:name, message:val("supporterMessageInput"), visible:val("supporterVisibleInput") !== "false", createdAt:getNow() };
    adminData.support.supporters.push(item);
    clearIds("supporterNameInput","supporterMessageInput");
    saveAdminData();
  };

  window.toggleSupporterVisibility = function(id){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    const item = adminData.support.supporters.find(x=>String(x.id)===String(id));
    if(item){ item.visible = item.visible === false; saveAdminData(); }
  };

  window.deleteSupporterItem = function(id){
    if(!ensureWrite("supportHub")) return;
    ensureSupportData();
    adminData.support.supporters = (adminData.support.supporters || []).filter(x=>String(x.id)!==String(id));
    saveAdminData();
  };

  const originalRenderAll = window.renderAll || renderAll;
  window.renderAll = function(){
    originalRenderAll();
    renderSupportAdmin();
  };

  console.log("VAR Challenge Alpha 3.7.7a Support-Modul geladen.");
})();


/* ===========================
   Benutzer Manager 3.7.7c
   Erweitert den vorhandenen Benutzer-Bereich um Account-/Profilsteuerung.
=========================== */

const USER_MANAGER_ACCOUNTS_KEY = "varChallengeAccounts";

function userManagerLoadAccounts() {
  const saved = localStorage.getItem(USER_MANAGER_ACCOUNTS_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function userManagerSaveAccounts(accounts) {
  localStorage.setItem(USER_MANAGER_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function renderUserManager() {
  const list = document.getElementById("userManagerList");
  if (!list) return;

  const search = String(document.getElementById("userManagerSearchInput")?.value || "").trim().toLowerCase();
  const roleFilter = String(document.getElementById("userManagerRoleFilter")?.value || "");
  const statusFilter = String(document.getElementById("userManagerStatusFilter")?.value || "");

  let accounts = userManagerLoadAccounts();

  accounts = accounts.filter((account) => {
    const text = [
      account.username,
      account.email,
      account.role,
      account.supporterName
    ].join(" ").toLowerCase();

    if (search && !text.includes(search)) return false;
    if (roleFilter && String(account.role || "").toUpperCase() !== roleFilter) return false;

    if (statusFilter === "active" && account.active === false) return false;
    if (statusFilter === "inactive" && account.active !== false) return false;
    if (statusFilter === "supporter" && !account.supporter) return false;
    if (statusFilter === "premium" && account.placepass !== "PREMIUM") return false;

    return true;
  });

  if (!accounts.length) {
    list.innerHTML = `<div class="emptyState">Noch keine registrierten Accounts vorhanden.</div>`;
    return;
  }

  list.innerHTML = accounts.map((account) => {
    const badges = Array.isArray(account.badges) ? account.badges.join(" ") : "";
    return `
      <div class="userAdminCard">
        <div>
          <strong>${userManagerEscape(account.avatar || "👤")} ${userManagerEscape(account.username || "Unbekannt")}</strong>
          <div class="mutedText">${userManagerEscape(account.email || "-")}</div>
          <div class="userMeta">
            <span class="userPill">${userManagerEscape(userManagerRoleLabel(account.role))}</span>
            <span class="userPill">${account.placepass === "PREMIUM" ? "🏆 Platzpass Premium" : "🎫 Free"}</span>
            ${account.supporter ? `<span class="userPill">❤️ Unterstützer</span>` : ""}
            ${account.active === false ? `<span class="userPill">🔴 Deaktiviert</span>` : `<span class="userPill">🟢 Aktiv</span>`}
            ${badges ? `<span class="userPill">${userManagerEscape(badges)}</span>` : ""}
          </div>
        </div>
        <div class="adminActionRow">
          <button class="adminGhostBtn" onclick="editUserManager('${userManagerEscape(account.id)}')">Bearbeiten</button>
          <button class="adminGhostBtn" onclick="toggleUserManagerActive('${userManagerEscape(account.id)}')">${account.active === false ? "Aktivieren" : "Deaktivieren"}</button>
        </div>
      </div>
    `;
  }).join("");
}

function editUserManager(id) {
  const accounts = userManagerLoadAccounts();
  const account = accounts.find((item) => String(item.id) === String(id));

  if (!account) {
    alert("Benutzer nicht gefunden.");
    return;
  }

  populateUserManagerClubSelect("userManagerFavoriteClub", account.favoriteClubId || "");

  userManagerSetValue("userManagerEditId", account.id);
  userManagerSetValue("userManagerUsername", account.username || "");
  userManagerSetValue("userManagerEmail", account.email || "");
  userManagerSetValue("userManagerAvatar", account.avatar || "👤");
  userManagerSetValue("userManagerRole", String(account.role || "BENUTZER").toUpperCase());
  userManagerSetValue("userManagerPlacepass", account.placepass || "FREE");
  userManagerSetValue("userManagerFavoriteClub", account.favoriteClubId || "");
  userManagerSetValue("userManagerSupporter", account.supporter ? "true" : "false");
  userManagerSetValue("userManagerSupporterPublic", account.supporterPublic ? "true" : "false");
  userManagerSetValue("userManagerSupporterName", account.supporterName || "");
  userManagerSetValue("userManagerLevel", account.level || 1);
  userManagerSetValue("userManagerXp", account.xp || 0);
  userManagerSetValue("userManagerActive", account.active === false ? "false" : "true");
  userManagerSetValue("userManagerBadges", Array.isArray(account.badges) ? account.badges.join(", ") : "");
  userManagerSetValue("userManagerPassword", "");

  const panel = document.getElementById("userManagerEditPanel");
  if (panel) {
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function saveUserManagerEdit() {
  const id = userManagerGetValue("userManagerEditId");
  if (!id) return;

  const accounts = userManagerLoadAccounts();
  const index = accounts.findIndex((item) => String(item.id) === String(id));

  if (index < 0) {
    alert("Benutzer nicht gefunden.");
    return;
  }

  const password = userManagerGetValue("userManagerPassword");

  accounts[index] = {
    ...accounts[index],
    username: userManagerGetValue("userManagerUsername"),
    email: userManagerGetValue("userManagerEmail"),
    avatar: userManagerGetValue("userManagerAvatar") || "👤",
    role: userManagerGetValue("userManagerRole") || "BENUTZER",
    placepass: userManagerGetValue("userManagerPlacepass") || "FREE",
    favoriteClubId: userManagerGetValue("userManagerFavoriteClub"),
    supporter: userManagerGetValue("userManagerSupporter") === "true",
    supporterPublic: userManagerGetValue("userManagerSupporterPublic") === "true",
    supporterName: userManagerGetValue("userManagerSupporterName"),
    level: Number(userManagerGetValue("userManagerLevel")) || 1,
    xp: Number(userManagerGetValue("userManagerXp")) || 0,
    active: userManagerGetValue("userManagerActive") !== "false",
    badges: userManagerGetValue("userManagerBadges")
      .split(",")
      .map((badge) => badge.trim())
      .filter(Boolean),
    updatedAt: new Date().toISOString()
  };

  if (password) {
    accounts[index].password = password;
  }

  userManagerSaveAccounts(accounts);
  cancelUserManagerEdit();
  renderUserManager();
  alert("Benutzer gespeichert.");
}

function cancelUserManagerEdit() {
  const panel = document.getElementById("userManagerEditPanel");
  if (panel) panel.classList.add("hidden");
}

function deleteUserManagerAccount() {
  const id = userManagerGetValue("userManagerEditId");
  if (!id) return;

  if (!confirm("Benutzer wirklich löschen?")) return;

  const accounts = userManagerLoadAccounts().filter((account) => String(account.id) !== String(id));
  userManagerSaveAccounts(accounts);
  cancelUserManagerEdit();
  renderUserManager();
}

function toggleUserManagerActive(id) {
  const accounts = userManagerLoadAccounts();
  const account = accounts.find((item) => String(item.id) === String(id));

  if (!account) return;

  account.active = account.active === false ? true : false;
  account.updatedAt = new Date().toISOString();

  userManagerSaveAccounts(accounts);
  renderUserManager();
}

function populateUserManagerClubSelect(selectId, selectedValue) {
  const select = document.getElementById(selectId);
  if (!select) return;

  let data = {};
  if (typeof getAdminData === "function") {
    data = getAdminData();
  } else if (window.adminData) {
    data = window.adminData;
  }

  const clubs = Array.isArray(data.clubs) ? data.clubs : [];

  select.innerHTML = `<option value="">Kein Lieblingsverein</option>` +
    clubs
      .filter((club) => club && club.active !== false && !club.deleted)
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "de"))
      .map((club) => `<option value="${userManagerEscape(club.id)}">${userManagerEscape(club.name || club.shortName || club.id)}</option>`)
      .join("");

  select.value = selectedValue || "";
}

function userManagerSetValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function userManagerGetValue(id) {
  const el = document.getElementById(id);
  return el ? String(el.value || "").trim() : "";
}

function userManagerEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function userManagerRoleLabel(role) {
  const map = {
    OWNER: "👑 Owner",
    ADMIN: "🛠 Admin",
    MODERATOR: "🛡 Moderator",
    CREATOR: "🎬 Creator",
    TESTER: "🧪 Tester",
    SUPPORTER: "❤️ Supporter",
    BENUTZER: "👤 Benutzer"
  };

  return map[String(role || "").toUpperCase()] || "👤 Benutzer";
}

/* Benutzerseite automatisch mit Account Manager verbinden */
(function attachUserManagerPageHook() {
  const originalShowAdminPage = window.showAdminPage;
  if (typeof originalShowAdminPage === "function" && !window.__userManagerPageHooked) {
    window.showAdminPage = function(pageName) {
      originalShowAdminPage(pageName);

      if (pageName === "users" || pageName === "benutzer" || pageName === "userManager") {
        const allPages = document.querySelectorAll(".adminPage");
        allPages.forEach((page) => page.classList.remove("active"));
        const userManagerPage = document.getElementById("userManagerPage");
        if (userManagerPage) userManagerPage.classList.add("active");
        renderUserManager();
      }
    };
    window.__userManagerPageHooked = true;
  }
})();


/* ===========================
   VAR Challenge 3.8.0
   Admin Projektstatus-Zentrale
=========================== */

const DEVELOPMENT_STATUS_ADMIN_DEFAULTS = {
  version: "Alpha 3.8.0",
  status: "In Entwicklung",
  overall: 18,
  nextUpdate: "Alpha 3.8.1",
  lastUpdate: "2026-07-11",
  modules: {
    menu: 95,
    account: 90,
    admin: 88,
    support: 80,
    placepass: 70,
    scenes: 20,
    career: 10,
    community: 30,
    bundesliga: 20,
    women: 10
  },
  currentWork: [
    "Neues Hauptmenü stabilisieren",
    "Geräteerkennung für Desktop, Tablet und Handy",
    "Admin-Rechte und Projektstatus absichern"
  ],
  nextTasks: [
    "Menü final testen",
    "Statusdaten im Admin Center pflegen",
    "Responsive Darstellung weiter verbessern"
  ],
  changelog: [
    "Projektstatus-Zentrale ergänzt",
    "Fortschritt je Entwicklungsbereich hinzugefügt"
  ]
};

function getAdminDevelopmentStatus() {
  const saved = adminData.settings.developmentStatus || {};
  return {
    ...DEVELOPMENT_STATUS_ADMIN_DEFAULTS,
    ...saved,
    version: saved.version || adminData.settings.version || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.version,
    status: saved.status || adminData.settings.status || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.status,
    overall: clampStatusPercent(saved.overall ?? adminData.settings.progress ?? DEVELOPMENT_STATUS_ADMIN_DEFAULTS.overall),
    nextUpdate: saved.nextUpdate || adminData.settings.nextUpdate || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.nextUpdate,
    modules: {
      ...DEVELOPMENT_STATUS_ADMIN_DEFAULTS.modules,
      ...(saved.modules || {})
    },
    currentWork: adminStatusLines(saved.currentWork || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.currentWork),
    nextTasks: adminStatusLines(saved.nextTasks || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.nextTasks),
    changelog: adminStatusLines(saved.changelog || adminData.settings.changelog || DEVELOPMENT_STATUS_ADMIN_DEFAULTS.changelog)
  };
}

function clampStatusPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function adminStatusLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function renderDevelopmentStatusAdmin() {
  const data = getAdminDevelopmentStatus();
  const moduleMap = {
    statusModuleMenu: "menu",
    statusModuleAccount: "account",
    statusModuleAdmin: "admin",
    statusModuleSupport: "support",
    statusModulePlacepass: "placepass",
    statusModuleScenes: "scenes",
    statusModuleCareer: "career",
    statusModuleCommunity: "community",
    statusModuleBundesliga: "bundesliga",
    statusModuleWomen: "women"
  };

  setVal("developmentStatusVersion", data.version);
  setVal("developmentStatusState", data.status);
  setVal("developmentStatusOverall", data.overall);
  setVal("developmentStatusNextUpdate", data.nextUpdate);
  setVal("developmentStatusLastUpdate", data.lastUpdate || "");

  Object.entries(moduleMap).forEach(([id, key]) => setVal(id, clampStatusPercent(data.modules[key])));

  setVal("developmentStatusCurrentWork", data.currentWork.join("\n"));
  setVal("developmentStatusNextTasks", data.nextTasks.join("\n"));
  setVal("developmentStatusChangelog", data.changelog.join("\n"));
}

function saveDevelopmentStatus() {
  if (!ensureWrite("project")) return;

  const modules = {
    menu: clampStatusPercent(val("statusModuleMenu")),
    account: clampStatusPercent(val("statusModuleAccount")),
    admin: clampStatusPercent(val("statusModuleAdmin")),
    support: clampStatusPercent(val("statusModuleSupport")),
    placepass: clampStatusPercent(val("statusModulePlacepass")),
    scenes: clampStatusPercent(val("statusModuleScenes")),
    career: clampStatusPercent(val("statusModuleCareer")),
    community: clampStatusPercent(val("statusModuleCommunity")),
    bundesliga: clampStatusPercent(val("statusModuleBundesliga")),
    women: clampStatusPercent(val("statusModuleWomen"))
  };

  const overallInput = val("developmentStatusOverall");
  const calculatedAverage = Math.round(
    Object.values(modules).reduce((sum, value) => sum + value, 0) /
    Object.values(modules).length
  );

  const developmentStatus = {
    version: val("developmentStatusVersion") || adminData.settings.version,
    status: val("developmentStatusState") || "In Entwicklung",
    overall: overallInput === "" ? calculatedAverage : clampStatusPercent(overallInput),
    nextUpdate: val("developmentStatusNextUpdate"),
    lastUpdate: val("developmentStatusLastUpdate"),
    modules,
    currentWork: adminStatusLines(val("developmentStatusCurrentWork")),
    nextTasks: adminStatusLines(val("developmentStatusNextTasks")),
    changelog: adminStatusLines(val("developmentStatusChangelog"))
  };

  adminData.settings.developmentStatus = developmentStatus;
  adminData.settings.version = developmentStatus.version;
  adminData.settings.status = developmentStatus.status;
  adminData.settings.progress = developmentStatus.overall;
  adminData.settings.nextUpdate = developmentStatus.nextUpdate;
  adminData.settings.changelog = developmentStatus.changelog.join("\n");

  saveAdminData();
  alert("Projektstatus gespeichert.");
}
