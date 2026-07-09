/* ===========================
   VAR Challenge
   Szenen-Datenbank v2.0
   50 dynamische Szenen-Vorlagen mit Platzhaltern

   Platzhalter im Text:
   {ANGREIFER}, {VERTEIDIGER}, {TORWART}
   {HEIM}, {GAST}, {SCHIEDSRICHTER}, {STADION}
   {MINUTE}, {SPIELSTAND}, {WETTBEWERB}
=========================== */

const scenes = [
  {
    "id": "VC-SC-001",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "07:20",
    "scoreline": "1:0",
    "title": "Frühes taktisches Foul",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} hält {ANGREIFER} nach Ballverlust kurz am Trikot fest und stoppt damit einen aussichtsreichen Angriff.",
    "options": [
      "Weiterspielen",
      "Foul",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Gelbe Karte",
    "explanation": "Das Halten unterbindet einen aussichtsreichen Angriff. Freistoß und Gelbe Karte sind korrekt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-002",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "09:27",
    "scoreline": "1:1",
    "title": "Körperkontakt an der Seitenlinie",
    "category": "Foulspiel",
    "description": "{ANGREIFER} und {VERTEIDIGER} laufen Schulter an Schulter zum Ball. {ANGREIFER} kommt zu Fall, der Ball bleibt im Feld.",
    "options": [
      "Foul",
      "Weiterspielen",
      "Gelbe Karte",
      "Einwurf"
    ],
    "correct": "Weiterspielen",
    "explanation": "Schulter-an-Schulter-Kontakt im Kampf um den Ball ist zulässig, solange er nicht unfair oder rücksichtslos erfolgt.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-003",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "11:34",
    "scoreline": "2:1",
    "title": "Grätsche trifft zuerst den Ball",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} grätscht im Strafraum und spielt klar zuerst den Ball. Danach kommt es zu leichtem Kontakt mit {ANGREIFER}.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Da der Ball kontrolliert zuerst gespielt wird und der anschließende Kontakt gering ist, liegt kein strafbares Foul vor.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-004",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "13:41",
    "scoreline": "0:1",
    "title": "Offene Sohle im Mittelfeld",
    "category": "Rote Karte",
    "description": "{VERTEIDIGER} springt mit offener Sohle in den Zweikampf und trifft {ANGREIFER} oberhalb des Knöchels.",
    "options": [
      "Weiterspielen",
      "Gelbe Karte",
      "Rote Karte",
      "Indirekter Freistoß"
    ],
    "correct": "Rote Karte",
    "explanation": "Das Einsteigen gefährdet die Gesundheit der Gegenspielerin/des Gegenspielers. Wegen groben Foulspiels ist Rot korrekt.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-005",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "15:48",
    "scoreline": "0:0",
    "title": "Schubser vor dem Abschluss",
    "category": "Elfmeter",
    "description": "{ANGREIFER} ist frei vor {TORWART}. {VERTEIDIGER} schiebt deutlich von hinten, bevor der Schuss abgegeben wird.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Weiterspielen"
    ],
    "correct": "Elfmeter",
    "explanation": "Ein deutlicher Stoß im Strafraum verhindert den Abschluss. Strafstoß ist korrekt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-006",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "17:55",
    "scoreline": "1:0",
    "title": "Angelegter Arm nach kurzer Distanz",
    "category": "Handspiel",
    "description": "Eine Flanke von {ANGREIFER} springt aus kurzer Distanz an den angelegten Arm von {VERTEIDIGER}.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Der Arm ist nah am Körper und der Ball kommt aus kurzer Distanz. Das ist kein strafbares Handspiel.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-007",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "19:02",
    "scoreline": "1:1",
    "title": "Ausgestreckter Arm im Strafraum",
    "category": "Handspiel",
    "description": "{VERTEIDIGER} blockt eine Hereingabe von {ANGREIFER}. Der Arm ist deutlich vom Körper abgespreizt.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Weiterspielen",
      "Gelbe Karte"
    ],
    "correct": "Elfmeter",
    "explanation": "Der abgespreizte Arm vergrößert die Körperfläche unnatürlich. Strafstoß ist korrekt.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-008",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "21:09",
    "scoreline": "2:1",
    "title": "Tor nach knapper Abseitsposition",
    "category": "Abseits",
    "description": "{ANGREIFER} startet beim Zuspiel hinter der letzten Verteidigungslinie und schiebt den Ball an {TORWART} vorbei ins Tor.",
    "options": [
      "Tor",
      "Abseits",
      "Weiterspielen",
      "Foul"
    ],
    "correct": "Abseits",
    "explanation": "Beim Abspiel befindet sich {ANGREIFER} in einer strafbaren Abseitsposition. Der Treffer zählt nicht.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-009",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "23:16",
    "scoreline": "0:1",
    "title": "Passiver Spieler greift nicht ein",
    "category": "Abseits",
    "description": "Ein Mitspieler steht im Abseits, berührt den Ball aber nicht. {ANGREIFER} kommt aus legaler Position und schließt ab.",
    "options": [
      "Tor",
      "Abseits",
      "Weiterspielen",
      "Indirekter Freistoß"
    ],
    "correct": "Tor",
    "explanation": "Eine Abseitsposition allein ist nicht strafbar. Da der abseitsstehende Spieler nicht aktiv eingreift, zählt das Tor.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-010",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "25:23",
    "scoreline": "0:0",
    "title": "Ball knapp hinter der Linie",
    "category": "Torlinie",
    "description": "{ANGREIFER} schießt, {TORWART} lenkt den Ball an die Unterkante der Latte. Der Ball springt knapp hinter der Linie auf.",
    "options": [
      "Tor",
      "Kein Tor",
      "Ecke",
      "Weiterspielen"
    ],
    "correct": "Tor",
    "explanation": "Der Ball hat die Torlinie vollständig überschritten. Tor ist korrekt.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-011",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "27:30",
    "scoreline": "1:0",
    "title": "Ball auf der Linie",
    "category": "Torlinie",
    "description": "Nach einem Kopfball von {ANGREIFER} liegt der Ball auf der Torlinie. {TORWART} kratzt ihn weg, bevor er vollständig hinter der Linie ist.",
    "options": [
      "Tor",
      "Kein Tor",
      "Elfmeter",
      "Ecke"
    ],
    "correct": "Kein Tor",
    "explanation": "Für ein Tor muss der Ball die Linie vollständig überschritten haben. Das ist hier nicht der Fall.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-012",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "29:37",
    "scoreline": "1:1",
    "title": "Rücksichtsloses Einsteigen",
    "category": "Gelbe Karte",
    "description": "{VERTEIDIGER} kommt zu spät und trifft {ANGREIFER} am Fuß. Die Intensität ist deutlich, aber nicht gesundheitsgefährdend.",
    "options": [
      "Foul",
      "Gelbe Karte",
      "Rote Karte",
      "Weiterspielen"
    ],
    "correct": "Gelbe Karte",
    "explanation": "Das Einsteigen ist rücksichtslos. Freistoß und Gelbe Karte sind korrekt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-013",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "31:44",
    "scoreline": "2:1",
    "title": "Notbremse vor dem Strafraum",
    "category": "Rote Karte",
    "description": "{ANGREIFER} läuft allein auf {TORWART} zu. {VERTEIDIGER} zieht kurz vor dem Strafraum am Trikot.",
    "options": [
      "Gelbe Karte",
      "Rote Karte",
      "Weiterspielen",
      "Elfmeter"
    ],
    "correct": "Rote Karte",
    "explanation": "Eine klare Torchance wird verhindert. Außerhalb des Strafraums ist die Rote Karte korrekt.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-014",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "33:51",
    "scoreline": "0:1",
    "title": "Kontakt nach Schussabgabe",
    "category": "Elfmeter",
    "description": "{ANGREIFER} schießt aufs Tor. Erst danach trifft {VERTEIDIGER} das Standbein leicht.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Der Kontakt kommt nach dem abgeschlossenen Schuss und ist gering. Kein Strafstoß.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-015",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "35:58",
    "scoreline": "0:0",
    "title": "Bein gestellt im Strafraum",
    "category": "Elfmeter",
    "description": "{ANGREIFER} legt sich den Ball vorbei. {VERTEIDIGER} stellt das Bein und bringt {ANGREIFER} zu Fall.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Weiterspielen",
      "Gelbe Karte"
    ],
    "correct": "Elfmeter",
    "explanation": "Das Beinstellen im Strafraum ist ein Foulspiel. Strafstoß ist korrekt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-016",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "37:05",
    "scoreline": "1:0",
    "title": "Kontakt vorgetäuscht",
    "category": "Schwalbe",
    "description": "{ANGREIFER} hebt im Strafraum ab, obwohl {VERTEIDIGER} keinen klaren Kontakt verursacht.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Es liegt kein strafbarer Kontakt vor. Kein Strafstoß; je nach Bewertung kann eine Verwarnung wegen Täuschung folgen.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-017",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "39:12",
    "scoreline": "1:1",
    "title": "Vorteil nach Foul im Mittelfeld",
    "category": "Vorteil",
    "description": "{VERTEIDIGER} foult {ANGREIFER}, doch der Ball landet bei einem Mitspieler von {HEIM}, der frei Richtung Strafraum läuft.",
    "options": [
      "Foul sofort",
      "Vorteil laufen lassen",
      "Gelbe Karte sofort",
      "Abseits"
    ],
    "correct": "Vorteil laufen lassen",
    "explanation": "Der Vorteil ist klar und unmittelbar. Die persönliche Strafe kann bei der nächsten Unterbrechung ausgesprochen werden.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-018",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "41:19",
    "scoreline": "2:1",
    "title": "Stützarm beim Fallen",
    "category": "Handspiel",
    "description": "{VERTEIDIGER} rutscht aus und stützt sich mit dem Arm ab. Der Ball springt dabei an diesen Stützarm.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Weiterspielen"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Ein Stützarm beim Fallen wird in der Regel nicht als strafbares Handspiel bewertet.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-019",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "43:26",
    "scoreline": "0:1",
    "title": "Hand über Schulterhöhe",
    "category": "Handspiel",
    "description": "{VERTEIDIGER} springt hoch, der Arm ist über Schulterhöhe. Eine Flanke von {ANGREIFER} trifft diesen Arm.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Weiterspielen",
      "Ecke"
    ],
    "correct": "Elfmeter",
    "explanation": "Ein Arm über Schulterhöhe vergrößert die Körperfläche klar. Strafstoß ist korrekt.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-020",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "45:33",
    "scoreline": "0:0",
    "title": "Torwart-Abpraller nach Abseits",
    "category": "Abseits",
    "description": "{ANGREIFER} steht beim Schuss eines Mitspielers im Abseits. {TORWART} wehrt ab, danach verwertet {ANGREIFER} den Abpraller.",
    "options": [
      "Tor",
      "Abseits",
      "Ecke",
      "Weiterspielen"
    ],
    "correct": "Abseits",
    "explanation": "Ein Abpraller vom Torwart hebt die Abseitsstellung nicht auf. {ANGREIFER} profitiert aus der vorherigen Abseitsposition.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-021",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "47:40",
    "scoreline": "1:0",
    "title": "Rückpass vom Gegner",
    "category": "Abseits",
    "description": "{VERTEIDIGER} spielt den Ball kontrolliert zurück. {ANGREIFER} startet aus abseitsverdächtiger Position und erreicht den Ball.",
    "options": [
      "Abseits",
      "Weiterspielen",
      "Indirekter Freistoß",
      "Foul"
    ],
    "correct": "Weiterspielen",
    "explanation": "Ein bewusstes Spielen des Balls durch den Gegner hebt die vorherige Abseitsbewertung auf.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-022",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "49:47",
    "scoreline": "1:1",
    "title": "Rempler ohne Ballnähe",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} rempelt {ANGREIFER} mehrere Meter abseits des Balls um.",
    "options": [
      "Weiterspielen",
      "Foul",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Foul",
    "explanation": "Da kein fairer Zweikampf um den Ball vorliegt, ist ein direkter Freistoß korrekt.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-023",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "51:54",
    "scoreline": "2:1",
    "title": "Ball wegschlagen",
    "category": "Gelbe Karte",
    "description": "Nach dem Pfiff schlägt {ANGREIFER} den Ball deutlich weg und verzögert die Spielfortsetzung.",
    "options": [
      "Keine Karte",
      "Gelbe Karte",
      "Rote Karte",
      "Schiedsrichterball"
    ],
    "correct": "Gelbe Karte",
    "explanation": "Das Wegschlagen des Balls verzögert die Spielfortsetzung und ist verwarnungswürdig.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-024",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "53:01",
    "scoreline": "0:1",
    "title": "Tätlichkeit abseits des Balls",
    "category": "Rote Karte",
    "description": "{VERTEIDIGER} stößt {ANGREIFER} abseits des Spielgeschehens mit beiden Händen ins Gesicht.",
    "options": [
      "Gelbe Karte",
      "Rote Karte",
      "Weiterspielen",
      "Indirekter Freistoß"
    ],
    "correct": "Rote Karte",
    "explanation": "Ein Stoß ins Gesicht abseits des Balls ist eine Tätlichkeit. Rote Karte ist korrekt.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-025",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "55:08",
    "scoreline": "0:0",
    "title": "Torwart trifft Angreifer",
    "category": "Elfmeter",
    "description": "{ANGREIFER} legt den Ball an {TORWART} vorbei. {TORWART} trifft nicht den Ball, sondern bringt {ANGREIFER} zu Fall.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Abseits"
    ],
    "correct": "Elfmeter",
    "explanation": "Wenn der Torwart den Ball nicht spielt und den Angreifer zu Fall bringt, ist Strafstoß korrekt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-026",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "57:15",
    "scoreline": "1:0",
    "title": "Torwart nimmt Rückpass auf",
    "category": "Torwart",
    "description": "{VERTEIDIGER} spielt den Ball absichtlich mit dem Fuß zu {TORWART}. {TORWART} nimmt ihn mit den Händen auf.",
    "options": [
      "Weiterspielen",
      "Indirekter Freistoß",
      "Elfmeter",
      "Gelbe Karte"
    ],
    "correct": "Indirekter Freistoß",
    "explanation": "Ein absichtlicher Rückpass mit dem Fuß darf vom Torwart nicht mit der Hand aufgenommen werden.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-027",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "59:22",
    "scoreline": "1:1",
    "title": "Hoher Fuß gefährlich",
    "category": "Foulspiel",
    "description": "{ANGREIFER} versucht einen hohen Ball zu spielen und setzt den Fuß gefährlich nahe am Kopf von {VERTEIDIGER} ein.",
    "options": [
      "Weiterspielen",
      "Indirekter Freistoß",
      "Rote Karte",
      "Elfmeter"
    ],
    "correct": "Indirekter Freistoß",
    "explanation": "Gefährliches Spiel ohne Kontakt wird mit indirektem Freistoß geahndet.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-028",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "61:29",
    "scoreline": "2:1",
    "title": "Halten bei Ecke",
    "category": "Elfmeter",
    "description": "Bei einer Ecke hält {VERTEIDIGER} {ANGREIFER} deutlich am Trikot, bevor der Ball im Strafraum ankommt.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Wiederholung Ecke"
    ],
    "correct": "Elfmeter",
    "explanation": "Ein deutliches Halten im Strafraum bei laufendem Spiel ist ein Foul. Strafstoß ist korrekt.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-029",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "63:36",
    "scoreline": "0:1",
    "title": "Sichtlinie des Torwarts blockiert",
    "category": "Abseits",
    "description": "{ANGREIFER} steht beim Schuss eines Mitspielers in Abseitsposition direkt vor {TORWART} und nimmt die Sicht.",
    "options": [
      "Tor",
      "Abseits",
      "Weiterspielen",
      "Ecke"
    ],
    "correct": "Abseits",
    "explanation": "Das Blockieren der Sicht des Torwarts ist aktives Eingreifen. Abseits ist korrekt.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-030",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "65:43",
    "scoreline": "0:0",
    "title": "Foul vor dem Tor",
    "category": "Torentscheidung",
    "description": "Kurz vor dem Torabschluss stößt {ANGREIFER} {VERTEIDIGER} im Luftduell sichtbar weg.",
    "options": [
      "Tor",
      "Foul",
      "Abseits",
      "Elfmeter"
    ],
    "correct": "Foul",
    "explanation": "Ein klares Stoßen vor dem Tor macht den Treffer ungültig. Direkter Freistoß für die verteidigende Mannschaft.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-031",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "67:50",
    "scoreline": "1:0",
    "title": "Kein Vorteil trotz Ballbesitz",
    "category": "Vorteil",
    "description": "{ANGREIFER} wird gefoult. Der Ball springt zwar zu {HEIM}, aber sofort unter Druck an der Seitenlinie.",
    "options": [
      "Vorteil laufen lassen",
      "Foul sofort",
      "Weiterspielen",
      "Gelbe Karte sofort"
    ],
    "correct": "Foul sofort",
    "explanation": "Ein Vorteil liegt nur vor, wenn die Mannschaft wirklich profitieren kann. Hier ist der Freistoß die bessere Entscheidung.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-032",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "69:57",
    "scoreline": "1:1",
    "title": "Sauberer Körpereinsatz",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} stellt den Körper zwischen Ball und {ANGREIFER}, ohne zu halten oder zu schieben.",
    "options": [
      "Foul",
      "Weiterspielen",
      "Gelbe Karte",
      "Indirekter Freistoß"
    ],
    "correct": "Weiterspielen",
    "explanation": "Körpereinsatz zum Abschirmen des Balls ist erlaubt, solange der Ball in spielbarer Nähe ist.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-033",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "71:04",
    "scoreline": "2:1",
    "title": "Arm am Körper",
    "category": "Handspiel",
    "description": "Ein harter Schuss von {ANGREIFER} trifft {VERTEIDIGER} am Arm, der eng am Körper anliegt.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Ecke"
    ],
    "correct": "Kein Elfmeter",
    "explanation": "Der Arm vergrößert die Körperfläche nicht. Kein strafbares Handspiel.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-034",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "73:11",
    "scoreline": "0:1",
    "title": "Simulation im Strafraum",
    "category": "Gelbe Karte",
    "description": "{ANGREIFER} lässt sich im Strafraum fallen und fordert lautstark Elfmeter, obwohl kein Kontakt erkennbar ist.",
    "options": [
      "Elfmeter",
      "Kein Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Gelbe Karte",
    "explanation": "Eine bewusste Täuschung zur Erlangung eines Strafstoßes kann mit Gelb bestraft werden.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-035",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "75:18",
    "scoreline": "0:0",
    "title": "Brutales Nachtreten",
    "category": "Rote Karte",
    "description": "Nach einem verlorenen Zweikampf tritt {VERTEIDIGER} gegen {ANGREIFER} nach.",
    "options": [
      "Weiterspielen",
      "Gelbe Karte",
      "Rote Karte",
      "Foul"
    ],
    "correct": "Rote Karte",
    "explanation": "Nachtreten ist eine Tätlichkeit und wird mit Roter Karte bestraft.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-036",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "77:25",
    "scoreline": "1:0",
    "title": "Eigene Hälfte",
    "category": "Abseits",
    "description": "{ANGREIFER} startet aus der eigenen Hälfte und erhält einen langen Pass in den Lauf.",
    "options": [
      "Abseits",
      "Weiterspielen",
      "Indirekter Freistoß",
      "Foul"
    ],
    "correct": "Weiterspielen",
    "explanation": "In der eigenen Hälfte kann keine strafbare Abseitsposition vorliegen.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-037",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "79:32",
    "scoreline": "1:1",
    "title": "Torwart hält auf der Linie",
    "category": "Torlinie",
    "description": "{TORWART} hält einen Schuss von {ANGREIFER}. Der Ball ist teilweise hinter der Linie, aber nicht vollständig.",
    "options": [
      "Tor",
      "Kein Tor",
      "Ecke",
      "Schiedsrichterball"
    ],
    "correct": "Kein Tor",
    "explanation": "Der Ball muss vollständig die Torlinie überschreiten. Teilweise hinter der Linie reicht nicht.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-038",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "81:39",
    "scoreline": "2:1",
    "title": "Ball zuerst, dann harter Kontakt",
    "category": "Elfmeter",
    "description": "{VERTEIDIGER} spitzelt den Ball leicht weg, trifft {ANGREIFER} danach aber mit hoher Intensität am Knöchel.",
    "options": [
      "Kein Elfmeter",
      "Elfmeter",
      "Gelbe Karte",
      "Rote Karte"
    ],
    "correct": "Elfmeter",
    "explanation": "Ballkontakt allein rechtfertigt nicht jeden Kontakt. Die Intensität kann trotzdem ein Foul begründen.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-039",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "83:46",
    "scoreline": "0:1",
    "title": "Sperren ohne Ball",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} blockiert den Laufweg von {ANGREIFER}, obwohl der Ball nicht in spielbarer Nähe ist.",
    "options": [
      "Weiterspielen",
      "Indirekter Freistoß",
      "Direkter Freistoß",
      "Gelbe Karte"
    ],
    "correct": "Indirekter Freistoß",
    "explanation": "Sperren ohne Kontakt wird mit indirektem Freistoß bestraft.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-040",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "85:53",
    "scoreline": "0:0",
    "title": "Tor unmittelbar mit der Hand erzielt",
    "category": "Handspiel",
    "description": "{ANGREIFER} berührt den Ball unabsichtlich mit der Hand und erzielt unmittelbar danach ein Tor.",
    "options": [
      "Tor",
      "Kein Tor",
      "Elfmeter",
      "Gelbe Karte"
    ],
    "correct": "Kein Tor",
    "explanation": "Ein unmittelbar nach Handkontakt erzieltes Tor durch denselben Angreifer zählt nicht.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-041",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "87:00",
    "scoreline": "1:0",
    "title": "Sechs-Sekunden-Regel",
    "category": "Torwart",
    "description": "{TORWART} hält den Ball sehr lange in den Händen und verzögert die Spielfortsetzung deutlich.",
    "options": [
      "Weiterspielen",
      "Indirekter Freistoß",
      "Gelbe Karte",
      "Elfmeter"
    ],
    "correct": "Indirekter Freistoß",
    "explanation": "Bei deutlicher Überschreitung der erlaubten Ballkontrolle kann ein indirekter Freistoß verhängt werden.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-042",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "89:07",
    "scoreline": "1:1",
    "title": "Abseits nach Einwurf",
    "category": "Abseits",
    "description": "{ANGREIFER} erhält den Ball direkt aus einem Einwurf in abseitsverdächtiger Position.",
    "options": [
      "Abseits",
      "Weiterspielen",
      "Indirekter Freistoß",
      "Foul"
    ],
    "correct": "Weiterspielen",
    "explanation": "Aus einem Einwurf gibt es kein Abseits. Weiterspielen ist korrekt.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-043",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "01:14",
    "scoreline": "2:1",
    "title": "Halten beginnt außerhalb",
    "category": "Foulspiel",
    "description": "{VERTEIDIGER} hält {ANGREIFER} außerhalb des Strafraums. Das Halten setzt sich bis in den Strafraum fort.",
    "options": [
      "Freistoß",
      "Elfmeter",
      "Weiterspielen",
      "Gelbe Karte"
    ],
    "correct": "Elfmeter",
    "explanation": "Wenn ein Halten außerhalb beginnt und im Strafraum fortgesetzt wird, ist Strafstoß korrekt.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-044",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "03:21",
    "scoreline": "0:1",
    "title": "Unsportliches Fordern einer Karte",
    "category": "Gelbe Karte",
    "description": "{ANGREIFER} fordert nach einem Foul gestenreich eine Karte gegen {VERTEIDIGER}.",
    "options": [
      "Keine Karte",
      "Gelbe Karte",
      "Rote Karte",
      "Schiedsrichterball"
    ],
    "correct": "Gelbe Karte",
    "explanation": "Das demonstrative Fordern einer Karte kann als Unsportlichkeit verwarnt werden.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-045",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "Google Pixel Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "05:28",
    "scoreline": "0:0",
    "title": "Verhindern eines Tores mit Hand",
    "category": "Rote Karte",
    "description": "{VERTEIDIGER} blockt einen sicheren Treffer kurz vor der Linie absichtlich mit der Hand.",
    "options": [
      "Elfmeter",
      "Gelbe Karte",
      "Rote Karte",
      "Kein Tor"
    ],
    "correct": "Rote Karte",
    "explanation": "Das Verhindern eines Tores durch absichtliches Handspiel ist mit Rot zu bestrafen. Strafstoß zusätzlich, wenn im Strafraum.",
    "difficulty": "Elite",
    "xp": 250,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-046",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "2. Frauen-Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "07:35",
    "scoreline": "1:0",
    "title": "Kontakt außerhalb des Strafraums",
    "category": "Elfmeter",
    "description": "{VERTEIDIGER} trifft {ANGREIFER} knapp außerhalb des Strafraums. {ANGREIFER} fällt erst im Strafraum.",
    "options": [
      "Elfmeter",
      "Freistoß",
      "Weiterspielen",
      "Gelbe Karte"
    ],
    "correct": "Freistoß",
    "explanation": "Entscheidend ist der Ort des Foulkontakts. Der Kontakt erfolgt außerhalb, daher Freistoß.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-047",
    "templateVersion": "2.0",
    "gender": "Frauen",
    "league": "DFB-Pokal Frauen",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "09:42",
    "scoreline": "1:1",
    "title": "Tor trotz Foul",
    "category": "Vorteil",
    "description": "{ANGREIFER} wird im Strafraum gefoult, bleibt aber stabil und schießt direkt danach ein Tor.",
    "options": [
      "Elfmeter",
      "Tor",
      "Weiterspielen",
      "Gelbe Karte"
    ],
    "correct": "Tor",
    "explanation": "Wenn trotz Foul unmittelbar ein Tor erzielt wird, ist der Vorteil eingetreten. Das Tor zählt.",
    "difficulty": "Normal",
    "xp": 50,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-048",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "11:49",
    "scoreline": "2:1",
    "title": "Abgefälschter Ball",
    "category": "Abseits",
    "description": "Ein Pass auf {ANGREIFER} wird von {VERTEIDIGER} nur unkontrolliert abgefälscht. {ANGREIFER} stand zuvor im Abseits.",
    "options": [
      "Tor",
      "Abseits",
      "Weiterspielen",
      "Ecke"
    ],
    "correct": "Abseits",
    "explanation": "Eine bloße Abfälschung durch den Gegner hebt die strafbare Abseitsposition nicht auf.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-049",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "2. Bundesliga",
    "competition": "Liga",
    "season": "2026/27",
    "minute": "13:56",
    "scoreline": "0:1",
    "title": "Ball aus dem Spiel vor Flanke",
    "category": "Torentscheidung",
    "description": "Der Ball scheint vor der Flanke von {ANGREIFER} knapp die Seitenlinie vollständig überschritten zu haben. Danach fällt ein Tor.",
    "options": [
      "Tor",
      "Einwurf",
      "Abseits",
      "Elfmeter"
    ],
    "correct": "Einwurf",
    "explanation": "Wenn der Ball die Seitenlinie vollständig überschritten hat, ist das Spiel vorher unterbrochen. Der Treffer zählt nicht.",
    "difficulty": "Schwer",
    "xp": 100,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  },
  {
    "id": "VC-SC-050",
    "templateVersion": "2.0",
    "gender": "Männer",
    "league": "DFB-Pokal",
    "competition": "Pokal",
    "season": "2026/27",
    "minute": "15:03",
    "scoreline": "0:0",
    "title": "Zusammenprall ohne Vergehen",
    "category": "Foulspiel",
    "description": "{ANGREIFER} und {VERTEIDIGER} schauen beide zum Ball und stoßen unglücklich zusammen.",
    "options": [
      "Foul",
      "Weiterspielen",
      "Gelbe Karte",
      "Schiedsrichterball"
    ],
    "correct": "Weiterspielen",
    "explanation": "Ein unbeabsichtigter Zusammenprall ohne fahrlässiges oder rücksichtsloses Verhalten ist kein Foul.",
    "difficulty": "Leicht",
    "xp": 25,
    "weight": 10,
    "active": true,
    "image": "",
    "video": "",
    "participantRoles": {
      "attacker": [
        "ST",
        "LF",
        "RF",
        "OM",
        "ZM"
      ],
      "defender": [
        "IV",
        "LV",
        "RV",
        "DM",
        "ZM"
      ],
      "goalkeeper": [
        "TW",
        "GK",
        "TORWART"
      ]
    },
    "participants": {
      "attackerId": null,
      "defenderId": null,
      "goalkeeperId": null,
      "attackerName": "",
      "defenderName": "",
      "goalkeeperName": ""
    },
    "cameras": {
      "main": "",
      "side": "",
      "goal": "",
      "line": "",
      "zoom": ""
    }
  }
];
