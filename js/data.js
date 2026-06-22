/*
 * 82-0 — NBA player & team dataset
 *
 * Each entry is a real team-season. Players have basketball-flavoured
 * attributes (0-99):
 *   ins = inside scoring / finishing
 *   out = outside / 3pt shooting
 *   ply = playmaking / passing
 *   reb = rebounding
 *   def = defense
 *   ath = athleticism
 *   ovr = overall rating
 *   pos = the natural positions the player can fill (PG, SG, SF, PF, C)
 *
 * Ratings are subjective, era-adjusted "for fun" values — this is an
 * unofficial fan game, not a simulation.
 */

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const TEAMS = [
  {
    team: "Chicago Bulls",
    abbr: "CHI",
    year: 1996,
    players: [
      { name: "Michael Jordan", pos: ["SG", "SF"], ins: 95, out: 88, ply: 85, reb: 70, def: 92, ath: 96, ovr: 99 },
      { name: "Scottie Pippen", pos: ["SF", "PF"], ins: 82, out: 78, ply: 86, reb: 78, def: 93, ath: 90, ovr: 92 },
      { name: "Dennis Rodman", pos: ["PF", "C"], ins: 64, out: 40, ply: 60, reb: 99, def: 94, ath: 88, ovr: 85 },
      { name: "Toni Kukoc", pos: ["SF", "PF"], ins: 76, out: 80, ply: 82, reb: 66, def: 68, ath: 72, ovr: 82 },
      { name: "Ron Harper", pos: ["PG", "SG"], ins: 72, out: 70, ply: 76, reb: 60, def: 82, ath: 78, ovr: 79 },
      { name: "Steve Kerr", pos: ["PG", "SG"], ins: 58, out: 90, ply: 72, reb: 42, def: 64, ath: 58, ovr: 76 },
      { name: "Luc Longley", pos: ["C"], ins: 70, out: 40, ply: 58, reb: 74, def: 76, ath: 60, ovr: 74 }
    ]
  },
  {
    team: "Chicago Bulls",
    abbr: "CHI",
    year: 1992,
    players: [
      { name: "Michael Jordan", pos: ["SG", "SF"], ins: 94, out: 84, ply: 84, reb: 70, def: 91, ath: 98, ovr: 98 },
      { name: "Scottie Pippen", pos: ["SF", "PF"], ins: 80, out: 74, ply: 84, reb: 76, def: 92, ath: 91, ovr: 90 },
      { name: "Horace Grant", pos: ["PF", "C"], ins: 74, out: 56, ply: 60, reb: 85, def: 84, ath: 84, ovr: 81 },
      { name: "B.J. Armstrong", pos: ["PG"], ins: 64, out: 80, ply: 78, reb: 44, def: 64, ath: 72, ovr: 76 },
      { name: "Bill Cartwright", pos: ["C"], ins: 70, out: 38, ply: 56, reb: 72, def: 78, ath: 56, ovr: 74 },
      { name: "John Paxson", pos: ["PG", "SG"], ins: 56, out: 84, ply: 74, reb: 40, def: 66, ath: 60, ovr: 73 }
    ]
  },
  {
    team: "Los Angeles Lakers",
    abbr: "LAL",
    year: 1987,
    players: [
      { name: "Magic Johnson", pos: ["PG"], ins: 84, out: 78, ply: 99, reb: 80, def: 80, ath: 86, ovr: 97 },
      { name: "Kareem Abdul-Jabbar", pos: ["C"], ins: 92, out: 62, ply: 74, reb: 86, def: 86, ath: 80, ovr: 90 },
      { name: "James Worthy", pos: ["SF", "PF"], ins: 88, out: 66, ply: 74, reb: 72, def: 78, ath: 90, ovr: 87 },
      { name: "Byron Scott", pos: ["SG"], ins: 76, out: 84, ply: 70, reb: 56, def: 74, ath: 82, ovr: 80 },
      { name: "Michael Cooper", pos: ["SG", "SF"], ins: 62, out: 80, ply: 76, reb: 58, def: 90, ath: 84, ovr: 80 },
      { name: "A.C. Green", pos: ["PF"], ins: 70, out: 54, ply: 56, reb: 82, def: 80, ath: 82, ovr: 77 }
    ]
  },
  {
    team: "Los Angeles Lakers",
    abbr: "LAL",
    year: 2001,
    players: [
      { name: "Shaquille O'Neal", pos: ["C"], ins: 99, out: 30, ply: 70, reb: 90, def: 86, ath: 92, ovr: 98 },
      { name: "Kobe Bryant", pos: ["SG", "SF"], ins: 90, out: 84, ply: 80, reb: 64, def: 88, ath: 95, ovr: 93 },
      { name: "Robert Horry", pos: ["PF"], ins: 64, out: 80, ply: 66, reb: 74, def: 80, ath: 74, ovr: 78 },
      { name: "Derek Fisher", pos: ["PG"], ins: 60, out: 80, ply: 76, reb: 46, def: 76, ath: 70, ovr: 76 },
      { name: "Rick Fox", pos: ["SF"], ins: 68, out: 74, ply: 72, reb: 60, def: 76, ath: 72, ovr: 76 },
      { name: "Horace Grant", pos: ["PF", "C"], ins: 68, out: 52, ply: 58, reb: 80, def: 80, ath: 70, ovr: 76 }
    ]
  },
  {
    team: "Los Angeles Lakers",
    abbr: "LAL",
    year: 2010,
    players: [
      { name: "Kobe Bryant", pos: ["SG", "SF"], ins: 90, out: 86, ply: 82, reb: 62, def: 86, ath: 88, ovr: 95 },
      { name: "Pau Gasol", pos: ["PF", "C"], ins: 86, out: 66, ply: 80, reb: 84, def: 80, ath: 74, ovr: 88 },
      { name: "Andrew Bynum", pos: ["C"], ins: 82, out: 38, ply: 56, reb: 84, def: 84, ath: 76, ovr: 80 },
      { name: "Ron Artest", pos: ["SF", "PF"], ins: 72, out: 70, ply: 66, reb: 66, def: 92, ath: 80, ovr: 80 },
      { name: "Derek Fisher", pos: ["PG"], ins: 58, out: 78, ply: 74, reb: 44, def: 74, ath: 62, ovr: 74 },
      { name: "Lamar Odom", pos: ["PF", "SF"], ins: 76, out: 66, ply: 78, reb: 78, def: 74, ath: 80, ovr: 81 }
    ]
  },
  {
    team: "Los Angeles Lakers",
    abbr: "LAL",
    year: 2020,
    players: [
      { name: "LeBron James", pos: ["SF", "PF", "PG"], ins: 92, out: 80, ply: 96, reb: 80, def: 84, ath: 90, ovr: 97 },
      { name: "Anthony Davis", pos: ["PF", "C"], ins: 88, out: 74, ply: 70, reb: 86, def: 94, ath: 90, ovr: 94 },
      { name: "Danny Green", pos: ["SG"], ins: 58, out: 82, ply: 62, reb: 54, def: 84, ath: 72, ovr: 77 },
      { name: "Kentavious Caldwell-Pope", pos: ["SG"], ins: 64, out: 80, ply: 64, reb: 52, def: 80, ath: 78, ovr: 77 },
      { name: "JaVale McGee", pos: ["C"], ins: 76, out: 30, ply: 48, reb: 78, def: 80, ath: 84, ovr: 75 },
      { name: "Rajon Rondo", pos: ["PG"], ins: 64, out: 58, ply: 88, reb: 62, def: 72, ath: 74, ovr: 78 }
    ]
  },
  {
    team: "Golden State Warriors",
    abbr: "GSW",
    year: 2017,
    players: [
      { name: "Stephen Curry", pos: ["PG"], ins: 82, out: 99, ply: 92, reb: 56, def: 76, ath: 82, ovr: 96 },
      { name: "Kevin Durant", pos: ["SF", "PF"], ins: 92, out: 92, ply: 80, reb: 76, def: 86, ath: 88, ovr: 97 },
      { name: "Klay Thompson", pos: ["SG"], ins: 76, out: 94, ply: 68, reb: 56, def: 84, ath: 80, ovr: 88 },
      { name: "Draymond Green", pos: ["PF", "C"], ins: 68, out: 70, ply: 88, reb: 82, def: 95, ath: 82, ovr: 87 },
      { name: "Andre Iguodala", pos: ["SF", "SG"], ins: 70, out: 72, ply: 80, reb: 64, def: 88, ath: 82, ovr: 80 },
      { name: "Shaun Livingston", pos: ["PG", "SG"], ins: 72, out: 50, ply: 78, reb: 56, def: 74, ath: 68, ovr: 76 }
    ]
  },
  {
    team: "Golden State Warriors",
    abbr: "GSW",
    year: 2016,
    players: [
      { name: "Stephen Curry", pos: ["PG"], ins: 80, out: 99, ply: 92, reb: 56, def: 74, ath: 82, ovr: 97 },
      { name: "Klay Thompson", pos: ["SG"], ins: 76, out: 95, ply: 66, reb: 54, def: 84, ath: 80, ovr: 88 },
      { name: "Draymond Green", pos: ["PF", "C"], ins: 68, out: 72, ply: 88, reb: 84, def: 95, ath: 82, ovr: 88 },
      { name: "Harrison Barnes", pos: ["SF", "PF"], ins: 72, out: 76, ply: 62, reb: 64, def: 76, ath: 80, ovr: 78 },
      { name: "Andrew Bogut", pos: ["C"], ins: 70, out: 32, ply: 70, reb: 80, def: 88, ath: 64, ovr: 78 },
      { name: "Andre Iguodala", pos: ["SF", "SG"], ins: 70, out: 70, ply: 80, reb: 62, def: 88, ath: 82, ovr: 80 }
    ]
  },
  {
    team: "Boston Celtics",
    abbr: "BOS",
    year: 1986,
    players: [
      { name: "Larry Bird", pos: ["SF", "PF"], ins: 84, out: 92, ply: 92, reb: 82, def: 78, ath: 70, ovr: 96 },
      { name: "Kevin McHale", pos: ["PF", "C"], ins: 90, out: 58, ply: 66, reb: 82, def: 86, ath: 74, ovr: 88 },
      { name: "Robert Parish", pos: ["C"], ins: 82, out: 50, ply: 60, reb: 86, def: 84, ath: 76, ovr: 84 },
      { name: "Dennis Johnson", pos: ["PG", "SG"], ins: 70, out: 70, ply: 80, reb: 58, def: 88, ath: 78, ovr: 81 },
      { name: "Danny Ainge", pos: ["PG", "SG"], ins: 66, out: 82, ply: 76, reb: 50, def: 72, ath: 74, ovr: 78 },
      { name: "Bill Walton", pos: ["C"], ins: 78, out: 44, ply: 82, reb: 82, def: 86, ath: 62, ovr: 80 }
    ]
  },
  {
    team: "Boston Celtics",
    abbr: "BOS",
    year: 2008,
    players: [
      { name: "Kevin Garnett", pos: ["PF", "C"], ins: 84, out: 74, ply: 80, reb: 86, def: 95, ath: 86, ovr: 92 },
      { name: "Paul Pierce", pos: ["SF"], ins: 84, out: 84, ply: 80, reb: 64, def: 78, ath: 78, ovr: 89 },
      { name: "Ray Allen", pos: ["SG"], ins: 72, out: 95, ply: 74, reb: 52, def: 74, ath: 78, ovr: 87 },
      { name: "Rajon Rondo", pos: ["PG"], ins: 68, out: 56, ply: 88, reb: 64, def: 82, ath: 84, ovr: 82 },
      { name: "Kendrick Perkins", pos: ["C"], ins: 68, out: 30, ply: 50, reb: 78, def: 86, ath: 70, ovr: 75 }
    ]
  },
  {
    team: "Miami Heat",
    abbr: "MIA",
    year: 2013,
    players: [
      { name: "LeBron James", pos: ["SF", "PF", "PG"], ins: 92, out: 80, ply: 94, reb: 78, def: 90, ath: 96, ovr: 98 },
      { name: "Dwyane Wade", pos: ["SG"], ins: 86, out: 70, ply: 82, reb: 60, def: 84, ath: 90, ovr: 89 },
      { name: "Chris Bosh", pos: ["PF", "C"], ins: 80, out: 78, ply: 68, reb: 78, def: 80, ath: 80, ovr: 84 },
      { name: "Ray Allen", pos: ["SG"], ins: 64, out: 92, ply: 70, reb: 48, def: 68, ath: 68, ovr: 81 },
      { name: "Shane Battier", pos: ["SF", "PF"], ins: 58, out: 80, ply: 64, reb: 60, def: 86, ath: 70, ovr: 76 },
      { name: "Mario Chalmers", pos: ["PG"], ins: 62, out: 76, ply: 74, reb: 48, def: 74, ath: 72, ovr: 74 }
    ]
  },
  {
    team: "Cleveland Cavaliers",
    abbr: "CLE",
    year: 2016,
    players: [
      { name: "LeBron James", pos: ["SF", "PF", "PG"], ins: 92, out: 78, ply: 95, reb: 80, def: 85, ath: 90, ovr: 97 },
      { name: "Kyrie Irving", pos: ["PG"], ins: 86, out: 88, ply: 86, reb: 50, def: 66, ath: 86, ovr: 89 },
      { name: "Kevin Love", pos: ["PF", "C"], ins: 78, out: 82, ply: 76, reb: 88, def: 70, ath: 70, ovr: 84 },
      { name: "J.R. Smith", pos: ["SG"], ins: 66, out: 84, ply: 64, reb: 52, def: 72, ath: 78, ovr: 76 },
      { name: "Tristan Thompson", pos: ["C", "PF"], ins: 70, out: 30, ply: 50, reb: 86, def: 80, ath: 84, ovr: 77 }
    ]
  },
  {
    team: "San Antonio Spurs",
    abbr: "SAS",
    year: 2014,
    players: [
      { name: "Tim Duncan", pos: ["PF", "C"], ins: 86, out: 58, ply: 76, reb: 86, def: 92, ath: 78, ovr: 90 },
      { name: "Tony Parker", pos: ["PG"], ins: 82, out: 70, ply: 86, reb: 48, def: 70, ath: 84, ovr: 86 },
      { name: "Manu Ginobili", pos: ["SG"], ins: 76, out: 82, ply: 84, reb: 56, def: 76, ath: 80, ovr: 84 },
      { name: "Kawhi Leonard", pos: ["SF"], ins: 76, out: 80, ply: 66, reb: 70, def: 92, ath: 86, ovr: 84 },
      { name: "Tiago Splitter", pos: ["C"], ins: 72, out: 36, ply: 60, reb: 76, def: 80, ath: 70, ovr: 75 },
      { name: "Danny Green", pos: ["SG"], ins: 58, out: 84, ply: 60, reb: 54, def: 84, ath: 74, ovr: 77 }
    ]
  },
  {
    team: "Detroit Pistons",
    abbr: "DET",
    year: 1989,
    players: [
      { name: "Isiah Thomas", pos: ["PG"], ins: 80, out: 76, ply: 92, reb: 52, def: 80, ath: 86, ovr: 89 },
      { name: "Joe Dumars", pos: ["SG"], ins: 76, out: 80, ply: 78, reb: 50, def: 88, ath: 80, ovr: 84 },
      { name: "Dennis Rodman", pos: ["PF", "SF"], ins: 60, out: 36, ply: 56, reb: 92, def: 94, ath: 90, ovr: 82 },
      { name: "Bill Laimbeer", pos: ["C"], ins: 72, out: 70, ply: 64, reb: 84, def: 84, ath: 56, ovr: 80 },
      { name: "Rick Mahorn", pos: ["PF", "C"], ins: 66, out: 44, ply: 54, reb: 80, def: 86, ath: 62, ovr: 76 },
      { name: "Mark Aguirre", pos: ["SF"], ins: 82, out: 70, ply: 70, reb: 62, def: 64, ath: 72, ovr: 78 }
    ]
  },
  {
    team: "Houston Rockets",
    abbr: "HOU",
    year: 1994,
    players: [
      { name: "Hakeem Olajuwon", pos: ["C"], ins: 90, out: 60, ply: 74, reb: 88, def: 96, ath: 90, ovr: 95 },
      { name: "Otis Thorpe", pos: ["PF"], ins: 76, out: 44, ply: 60, reb: 82, def: 78, ath: 78, ovr: 78 },
      { name: "Robert Horry", pos: ["SF", "PF"], ins: 64, out: 76, ply: 66, reb: 72, def: 80, ath: 78, ovr: 77 },
      { name: "Kenny Smith", pos: ["PG"], ins: 66, out: 82, ply: 80, reb: 44, def: 66, ath: 78, ovr: 78 },
      { name: "Vernon Maxwell", pos: ["SG"], ins: 70, out: 78, ply: 70, reb: 48, def: 72, ath: 76, ovr: 76 }
    ]
  },
  {
    team: "Philadelphia 76ers",
    abbr: "PHI",
    year: 1983,
    players: [
      { name: "Julius Erving", pos: ["SF"], ins: 88, out: 70, ply: 82, reb: 74, def: 82, ath: 94, ovr: 92 },
      { name: "Moses Malone", pos: ["C"], ins: 88, out: 48, ply: 62, reb: 92, def: 84, ath: 82, ovr: 90 },
      { name: "Andrew Toney", pos: ["SG"], ins: 80, out: 80, ply: 76, reb: 48, def: 70, ath: 80, ovr: 81 },
      { name: "Maurice Cheeks", pos: ["PG"], ins: 68, out: 70, ply: 86, reb: 50, def: 86, ath: 82, ovr: 82 },
      { name: "Bobby Jones", pos: ["PF", "SF"], ins: 70, out: 60, ply: 70, reb: 72, def: 90, ath: 80, ovr: 79 }
    ]
  },
  {
    team: "Dallas Mavericks",
    abbr: "DAL",
    year: 2011,
    players: [
      { name: "Dirk Nowitzki", pos: ["PF", "C"], ins: 84, out: 90, ply: 76, reb: 76, def: 70, ath: 72, ovr: 91 },
      { name: "Jason Terry", pos: ["SG", "PG"], ins: 72, out: 86, ply: 78, reb: 46, def: 66, ath: 76, ovr: 80 },
      { name: "Jason Kidd", pos: ["PG"], ins: 60, out: 76, ply: 92, reb: 70, def: 82, ath: 70, ovr: 83 },
      { name: "Tyson Chandler", pos: ["C"], ins: 74, out: 28, ply: 52, reb: 84, def: 90, ath: 84, ovr: 80 },
      { name: "Shawn Marion", pos: ["SF", "PF"], ins: 74, out: 64, ply: 64, reb: 78, def: 86, ath: 86, ovr: 80 }
    ]
  },
  {
    team: "Oklahoma City Thunder",
    abbr: "OKC",
    year: 2012,
    players: [
      { name: "Kevin Durant", pos: ["SF", "PF"], ins: 90, out: 92, ply: 76, reb: 74, def: 78, ath: 88, ovr: 94 },
      { name: "Russell Westbrook", pos: ["PG"], ins: 84, out: 72, ply: 86, reb: 68, def: 78, ath: 96, ovr: 89 },
      { name: "James Harden", pos: ["SG"], ins: 80, out: 86, ply: 84, reb: 56, def: 66, ath: 80, ovr: 85 },
      { name: "Serge Ibaka", pos: ["PF", "C"], ins: 74, out: 64, ply: 52, reb: 78, def: 90, ath: 86, ovr: 80 },
      { name: "Kendrick Perkins", pos: ["C"], ins: 64, out: 28, ply: 48, reb: 74, def: 84, ath: 64, ovr: 73 }
    ]
  },
  {
    team: "Milwaukee Bucks",
    abbr: "MIL",
    year: 2021,
    players: [
      { name: "Giannis Antetokounmpo", pos: ["PF", "C", "SF"], ins: 94, out: 64, ply: 80, reb: 88, def: 92, ath: 98, ovr: 95 },
      { name: "Khris Middleton", pos: ["SF", "SG"], ins: 78, out: 86, ply: 80, reb: 64, def: 76, ath: 74, ovr: 85 },
      { name: "Jrue Holiday", pos: ["PG", "SG"], ins: 76, out: 78, ply: 84, reb: 56, def: 92, ath: 84, ovr: 84 },
      { name: "Brook Lopez", pos: ["C"], ins: 78, out: 76, ply: 56, reb: 74, def: 88, ath: 64, ovr: 80 },
      { name: "P.J. Tucker", pos: ["PF", "SF"], ins: 60, out: 74, ply: 56, reb: 68, def: 86, ath: 70, ovr: 75 }
    ]
  },
  {
    team: "Denver Nuggets",
    abbr: "DEN",
    year: 2023,
    players: [
      { name: "Nikola Jokic", pos: ["C"], ins: 88, out: 80, ply: 96, reb: 90, def: 80, ath: 70, ovr: 96 },
      { name: "Jamal Murray", pos: ["PG", "SG"], ins: 80, out: 84, ply: 82, reb: 50, def: 70, ath: 80, ovr: 85 },
      { name: "Michael Porter Jr.", pos: ["SF", "PF"], ins: 74, out: 86, ply: 60, reb: 74, def: 70, ath: 80, ovr: 82 },
      { name: "Aaron Gordon", pos: ["PF", "SF"], ins: 80, out: 64, ply: 66, reb: 76, def: 86, ath: 92, ovr: 82 },
      { name: "Kentavious Caldwell-Pope", pos: ["SG"], ins: 62, out: 82, ply: 64, reb: 50, def: 82, ath: 76, ovr: 78 }
    ]
  },
  {
    team: "Toronto Raptors",
    abbr: "TOR",
    year: 2019,
    players: [
      { name: "Kawhi Leonard", pos: ["SF", "PF"], ins: 84, out: 84, ply: 74, reb: 72, def: 94, ath: 86, ovr: 93 },
      { name: "Kyle Lowry", pos: ["PG"], ins: 70, out: 80, ply: 86, reb: 60, def: 84, ath: 72, ovr: 83 },
      { name: "Pascal Siakam", pos: ["PF", "SF"], ins: 80, out: 72, ply: 72, reb: 74, def: 82, ath: 88, ovr: 82 },
      { name: "Fred VanVleet", pos: ["PG", "SG"], ins: 64, out: 80, ply: 80, reb: 48, def: 82, ath: 70, ovr: 78 },
      { name: "Marc Gasol", pos: ["C"], ins: 74, out: 72, ply: 80, reb: 76, def: 86, ath: 56, ovr: 80 },
      { name: "Serge Ibaka", pos: ["C", "PF"], ins: 74, out: 66, ply: 54, reb: 74, def: 84, ath: 76, ovr: 79 }
    ]
  },
  {
    team: "Phoenix Suns",
    abbr: "PHX",
    year: 2005,
    players: [
      { name: "Steve Nash", pos: ["PG"], ins: 70, out: 88, ply: 96, reb: 48, def: 60, ath: 70, ovr: 89 },
      { name: "Amar'e Stoudemire", pos: ["PF", "C"], ins: 88, out: 60, ply: 56, reb: 80, def: 68, ath: 94, ovr: 86 },
      { name: "Shawn Marion", pos: ["SF", "PF"], ins: 78, out: 70, ply: 66, reb: 82, def: 84, ath: 90, ovr: 84 },
      { name: "Joe Johnson", pos: ["SG", "SF"], ins: 76, out: 82, ply: 76, reb: 56, def: 72, ath: 78, ovr: 80 },
      { name: "Quentin Richardson", pos: ["SG", "SF"], ins: 64, out: 80, ply: 62, reb: 66, def: 68, ath: 76, ovr: 75 }
    ]
  },
  {
    team: "Utah Jazz",
    abbr: "UTA",
    year: 1997,
    players: [
      { name: "Karl Malone", pos: ["PF"], ins: 90, out: 66, ply: 72, reb: 84, def: 84, ath: 88, ovr: 92 },
      { name: "John Stockton", pos: ["PG"], ins: 66, out: 78, ply: 96, reb: 52, def: 84, ath: 72, ovr: 88 },
      { name: "Jeff Hornacek", pos: ["SG"], ins: 70, out: 84, ply: 78, reb: 50, def: 70, ath: 68, ovr: 79 },
      { name: "Bryon Russell", pos: ["SF"], ins: 64, out: 76, ply: 62, reb: 62, def: 80, ath: 78, ovr: 75 },
      { name: "Greg Ostertag", pos: ["C"], ins: 60, out: 28, ply: 46, reb: 74, def: 80, ath: 56, ovr: 71 }
    ]
  },
  {
    team: "Seattle SuperSonics",
    abbr: "SEA",
    year: 1996,
    players: [
      { name: "Gary Payton", pos: ["PG"], ins: 78, out: 76, ply: 88, reb: 56, def: 94, ath: 84, ovr: 88 },
      { name: "Shawn Kemp", pos: ["PF", "C"], ins: 86, out: 50, ply: 60, reb: 84, def: 80, ath: 94, ovr: 85 },
      { name: "Detlef Schrempf", pos: ["SF", "PF"], ins: 76, out: 80, ply: 78, reb: 68, def: 70, ath: 70, ovr: 80 },
      { name: "Hersey Hawkins", pos: ["SG"], ins: 64, out: 84, ply: 70, reb: 50, def: 78, ath: 72, ovr: 76 },
      { name: "Nate McMillan", pos: ["PG", "SG"], ins: 56, out: 70, ply: 80, reb: 52, def: 84, ath: 70, ovr: 74 }
    ]
  },
  {
    team: "New York Knicks",
    abbr: "NYK",
    year: 1994,
    players: [
      { name: "Patrick Ewing", pos: ["C"], ins: 86, out: 64, ply: 66, reb: 84, def: 90, ath: 82, ovr: 90 },
      { name: "John Starks", pos: ["SG"], ins: 70, out: 80, ply: 74, reb: 48, def: 80, ath: 78, ovr: 78 },
      { name: "Charles Oakley", pos: ["PF"], ins: 70, out: 56, ply: 64, reb: 86, def: 86, ath: 74, ovr: 79 },
      { name: "Anthony Mason", pos: ["PF", "C"], ins: 72, out: 50, ply: 72, reb: 80, def: 84, ath: 76, ovr: 78 },
      { name: "Derek Harper", pos: ["PG"], ins: 64, out: 74, ply: 80, reb: 46, def: 80, ath: 74, ovr: 76 }
    ]
  },
  {
    team: "Orlando Magic",
    abbr: "ORL",
    year: 1995,
    players: [
      { name: "Shaquille O'Neal", pos: ["C"], ins: 96, out: 28, ply: 64, reb: 88, def: 82, ath: 92, ovr: 94 },
      { name: "Anfernee Hardaway", pos: ["PG", "SG"], ins: 80, out: 76, ply: 88, reb: 60, def: 80, ath: 88, ovr: 87 },
      { name: "Nick Anderson", pos: ["SG", "SF"], ins: 72, out: 80, ply: 70, reb: 62, def: 78, ath: 80, ovr: 79 },
      { name: "Horace Grant", pos: ["PF"], ins: 74, out: 54, ply: 62, reb: 84, def: 84, ath: 78, ovr: 80 },
      { name: "Dennis Scott", pos: ["SF"], ins: 60, out: 86, ply: 64, reb: 56, def: 62, ath: 64, ovr: 75 }
    ]
  },
  {
    team: "Portland Trail Blazers",
    abbr: "POR",
    year: 1992,
    players: [
      { name: "Clyde Drexler", pos: ["SG", "SF"], ins: 86, out: 76, ply: 84, reb: 70, def: 82, ath: 94, ovr: 90 },
      { name: "Terry Porter", pos: ["PG"], ins: 70, out: 82, ply: 84, reb: 52, def: 76, ath: 78, ovr: 80 },
      { name: "Buck Williams", pos: ["PF", "C"], ins: 72, out: 40, ply: 56, reb: 84, def: 84, ath: 78, ovr: 78 },
      { name: "Jerome Kersey", pos: ["SF", "PF"], ins: 72, out: 56, ply: 62, reb: 76, def: 82, ath: 88, ovr: 77 },
      { name: "Clifford Robinson", pos: ["PF", "C"], ins: 74, out: 70, ply: 60, reb: 70, def: 80, ath: 80, ovr: 78 }
    ]
  },
  {
    team: "Philadelphia 76ers",
    abbr: "PHI",
    year: 2001,
    players: [
      { name: "Allen Iverson", pos: ["PG", "SG"], ins: 84, out: 78, ply: 84, reb: 50, def: 76, ath: 94, ovr: 90 },
      { name: "Dikembe Mutombo", pos: ["C"], ins: 66, out: 28, ply: 50, reb: 86, def: 94, ath: 78, ovr: 82 },
      { name: "Aaron McKie", pos: ["SG", "PG"], ins: 64, out: 74, ply: 78, reb: 56, def: 80, ath: 72, ovr: 76 },
      { name: "Eric Snow", pos: ["PG"], ins: 60, out: 56, ply: 80, reb: 50, def: 82, ath: 74, ovr: 74 },
      { name: "Tyrone Hill", pos: ["PF"], ins: 66, out: 38, ply: 52, reb: 82, def: 78, ath: 74, ovr: 74 }
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  The 1984-85 season (labelled 1985) — the classic vintage:          */
  /*  Magic & Bird at their peak, plus the rookie years of Jordan,       */
  /*  Olajuwon, Barkley and Stockton.                                    */
  /* ------------------------------------------------------------------ */
  {
    team: "Los Angeles Lakers",
    abbr: "LAL",
    year: 1985,
    players: [
      { name: "Magic Johnson", pos: ["PG"], ins: 82, out: 74, ply: 98, reb: 78, def: 78, ath: 86, ovr: 95 },
      { name: "Kareem Abdul-Jabbar", pos: ["C"], ins: 90, out: 60, ply: 74, reb: 82, def: 84, ath: 76, ovr: 90 },
      { name: "James Worthy", pos: ["SF", "PF"], ins: 86, out: 64, ply: 72, reb: 70, def: 76, ath: 90, ovr: 86 },
      { name: "Byron Scott", pos: ["SG"], ins: 74, out: 82, ply: 68, reb: 54, def: 72, ath: 82, ovr: 79 },
      { name: "Michael Cooper", pos: ["SG", "SF"], ins: 60, out: 78, ply: 76, reb: 56, def: 90, ath: 84, ovr: 80 },
      { name: "Bob McAdoo", pos: ["PF", "C"], ins: 82, out: 68, ply: 64, reb: 74, def: 70, ath: 76, ovr: 80 },
      { name: "Kurt Rambis", pos: ["PF"], ins: 60, out: 36, ply: 52, reb: 78, def: 80, ath: 70, ovr: 72 }
    ]
  },
  {
    team: "Boston Celtics",
    abbr: "BOS",
    year: 1985,
    players: [
      { name: "Larry Bird", pos: ["SF", "PF"], ins: 84, out: 90, ply: 92, reb: 82, def: 78, ath: 70, ovr: 96 },
      { name: "Kevin McHale", pos: ["PF", "C"], ins: 88, out: 56, ply: 64, reb: 82, def: 86, ath: 74, ovr: 87 },
      { name: "Robert Parish", pos: ["C"], ins: 82, out: 50, ply: 60, reb: 86, def: 84, ath: 76, ovr: 84 },
      { name: "Dennis Johnson", pos: ["PG", "SG"], ins: 70, out: 70, ply: 80, reb: 58, def: 88, ath: 78, ovr: 81 },
      { name: "Danny Ainge", pos: ["PG", "SG"], ins: 66, out: 80, ply: 76, reb: 50, def: 72, ath: 74, ovr: 77 },
      { name: "Cedric Maxwell", pos: ["PF", "SF"], ins: 76, out: 52, ply: 66, reb: 70, def: 74, ath: 72, ovr: 77 }
    ]
  },
  {
    team: "Philadelphia 76ers",
    abbr: "PHI",
    year: 1985,
    players: [
      { name: "Moses Malone", pos: ["C"], ins: 88, out: 48, ply: 60, reb: 92, def: 84, ath: 80, ovr: 89 },
      { name: "Julius Erving", pos: ["SF"], ins: 84, out: 68, ply: 80, reb: 70, def: 80, ath: 90, ovr: 88 },
      { name: "Charles Barkley", pos: ["PF", "SF"], ins: 82, out: 56, ply: 70, reb: 84, def: 76, ath: 88, ovr: 80 },
      { name: "Maurice Cheeks", pos: ["PG"], ins: 68, out: 70, ply: 86, reb: 50, def: 86, ath: 82, ovr: 82 },
      { name: "Andrew Toney", pos: ["SG"], ins: 80, out: 80, ply: 76, reb: 48, def: 70, ath: 80, ovr: 80 },
      { name: "Bobby Jones", pos: ["PF", "SF"], ins: 70, out: 58, ply: 70, reb: 70, def: 90, ath: 78, ovr: 78 }
    ]
  },
  {
    team: "Chicago Bulls",
    abbr: "CHI",
    year: 1985,
    players: [
      { name: "Michael Jordan", pos: ["SG", "SF"], ins: 88, out: 76, ply: 80, reb: 66, def: 82, ath: 96, ovr: 88 },
      { name: "Orlando Woolridge", pos: ["SF", "PF"], ins: 80, out: 60, ply: 64, reb: 66, def: 68, ath: 84, ovr: 78 },
      { name: "Quintin Dailey", pos: ["SG"], ins: 76, out: 72, ply: 66, reb: 50, def: 62, ath: 74, ovr: 74 },
      { name: "Steve Johnson", pos: ["PF", "C"], ins: 72, out: 38, ply: 52, reb: 70, def: 68, ath: 70, ovr: 73 },
      { name: "Dave Corzine", pos: ["C"], ins: 66, out: 44, ply: 58, reb: 72, def: 72, ath: 56, ovr: 72 },
      { name: "Caldwell Jones", pos: ["PF", "C"], ins: 56, out: 40, ply: 56, reb: 74, def: 82, ath: 66, ovr: 72 }
    ]
  },
  {
    team: "Houston Rockets",
    abbr: "HOU",
    year: 1985,
    players: [
      { name: "Hakeem Olajuwon", pos: ["C"], ins: 84, out: 50, ply: 66, reb: 86, def: 90, ath: 92, ovr: 85 },
      { name: "Ralph Sampson", pos: ["C", "PF"], ins: 80, out: 60, ply: 70, reb: 84, def: 82, ath: 84, ovr: 83 },
      { name: "Rodney McCray", pos: ["SF", "PF"], ins: 70, out: 58, ply: 72, reb: 72, def: 80, ath: 78, ovr: 76 },
      { name: "Lewis Lloyd", pos: ["SG", "SF"], ins: 76, out: 66, ply: 70, reb: 58, def: 66, ath: 78, ovr: 75 },
      { name: "Robert Reid", pos: ["SF"], ins: 68, out: 66, ply: 68, reb: 64, def: 80, ath: 76, ovr: 75 },
      { name: "John Lucas", pos: ["PG"], ins: 64, out: 66, ply: 82, reb: 44, def: 64, ath: 72, ovr: 74 }
    ]
  },
  {
    team: "Detroit Pistons",
    abbr: "DET",
    year: 1985,
    players: [
      { name: "Isiah Thomas", pos: ["PG"], ins: 80, out: 74, ply: 92, reb: 52, def: 78, ath: 86, ovr: 88 },
      { name: "Kelly Tripucka", pos: ["SF", "SG"], ins: 78, out: 72, ply: 68, reb: 58, def: 62, ath: 72, ovr: 78 },
      { name: "Bill Laimbeer", pos: ["C"], ins: 70, out: 64, ply: 62, reb: 84, def: 80, ath: 54, ovr: 79 },
      { name: "Vinnie Johnson", pos: ["SG"], ins: 78, out: 70, ply: 72, reb: 52, def: 70, ath: 80, ovr: 77 },
      { name: "Kent Benson", pos: ["C", "PF"], ins: 64, out: 44, ply: 56, reb: 72, def: 74, ath: 62, ovr: 71 }
    ]
  },
  {
    team: "Milwaukee Bucks",
    abbr: "MIL",
    year: 1985,
    players: [
      { name: "Sidney Moncrief", pos: ["SG", "SF"], ins: 78, out: 74, ply: 78, reb: 64, def: 92, ath: 84, ovr: 85 },
      { name: "Terry Cummings", pos: ["PF"], ins: 82, out: 56, ply: 66, reb: 80, def: 78, ath: 84, ovr: 82 },
      { name: "Paul Pressey", pos: ["SF", "PG"], ins: 70, out: 62, ply: 84, reb: 62, def: 86, ath: 80, ovr: 79 },
      { name: "Junior Bridgeman", pos: ["SG", "SF"], ins: 72, out: 70, ply: 68, reb: 52, def: 66, ath: 72, ovr: 74 },
      { name: "Alton Lister", pos: ["C"], ins: 64, out: 36, ply: 54, reb: 74, def: 78, ath: 70, ovr: 72 }
    ]
  },
  {
    team: "Denver Nuggets",
    abbr: "DEN",
    year: 1985,
    players: [
      { name: "Alex English", pos: ["SF"], ins: 86, out: 68, ply: 76, reb: 62, def: 64, ath: 80, ovr: 85 },
      { name: "Fat Lever", pos: ["PG"], ins: 68, out: 66, ply: 84, reb: 70, def: 84, ath: 84, ovr: 80 },
      { name: "Calvin Natt", pos: ["SF", "PF"], ins: 80, out: 56, ply: 66, reb: 74, def: 74, ath: 80, ovr: 79 },
      { name: "Dan Issel", pos: ["PF", "C"], ins: 80, out: 70, ply: 66, reb: 72, def: 66, ath: 64, ovr: 78 },
      { name: "T.R. Dunn", pos: ["SG", "SF"], ins: 54, out: 44, ply: 58, reb: 66, def: 86, ath: 76, ovr: 71 }
    ]
  },
  {
    team: "Utah Jazz",
    abbr: "UTA",
    year: 1985,
    players: [
      { name: "Adrian Dantley", pos: ["SF", "PF"], ins: 90, out: 62, ply: 72, reb: 66, def: 64, ath: 78, ovr: 85 },
      { name: "Mark Eaton", pos: ["C"], ins: 56, out: 28, ply: 46, reb: 80, def: 94, ath: 58, ovr: 78 },
      { name: "Darrell Griffith", pos: ["SG"], ins: 76, out: 78, ply: 66, reb: 54, def: 66, ath: 86, ovr: 78 },
      { name: "John Stockton", pos: ["PG"], ins: 60, out: 66, ply: 84, reb: 48, def: 76, ath: 70, ovr: 76 },
      { name: "Thurl Bailey", pos: ["PF", "C"], ins: 74, out: 56, ply: 60, reb: 72, def: 78, ath: 76, ovr: 75 },
      { name: "Rickey Green", pos: ["PG"], ins: 64, out: 62, ply: 80, reb: 44, def: 74, ath: 82, ovr: 74 }
    ]
  },
  {
    team: "Portland Trail Blazers",
    abbr: "POR",
    year: 1985,
    players: [
      { name: "Clyde Drexler", pos: ["SG", "SF"], ins: 80, out: 66, ply: 78, reb: 66, def: 78, ath: 92, ovr: 82 },
      { name: "Kiki Vandeweghe", pos: ["SF", "PF"], ins: 84, out: 80, ply: 66, reb: 58, def: 56, ath: 70, ovr: 81 },
      { name: "Mychal Thompson", pos: ["PF", "C"], ins: 76, out: 54, ply: 66, reb: 76, def: 76, ath: 80, ovr: 78 },
      { name: "Jim Paxson", pos: ["SG"], ins: 74, out: 76, ply: 70, reb: 48, def: 66, ath: 74, ovr: 77 },
      { name: "Sam Bowie", pos: ["C"], ins: 68, out: 50, ply: 62, reb: 78, def: 82, ath: 74, ovr: 75 },
      { name: "Kenny Carr", pos: ["PF"], ins: 66, out: 48, ply: 56, reb: 76, def: 74, ath: 72, ovr: 73 }
    ]
  },
  {
    team: "San Antonio Spurs",
    abbr: "SAS",
    year: 1985,
    players: [
      { name: "George Gervin", pos: ["SG", "SF"], ins: 88, out: 78, ply: 72, reb: 56, def: 60, ath: 82, ovr: 85 },
      { name: "Artis Gilmore", pos: ["C"], ins: 82, out: 40, ply: 58, reb: 82, def: 84, ath: 72, ovr: 82 },
      { name: "Mike Mitchell", pos: ["SF"], ins: 80, out: 64, ply: 62, reb: 64, def: 62, ath: 74, ovr: 77 },
      { name: "Johnny Moore", pos: ["PG"], ins: 64, out: 62, ply: 86, reb: 52, def: 80, ath: 80, ovr: 78 },
      { name: "Alvin Robertson", pos: ["SG", "PG"], ins: 68, out: 62, ply: 74, reb: 58, def: 90, ath: 86, ovr: 76 }
    ]
  },
  {
    team: "Dallas Mavericks",
    abbr: "DAL",
    year: 1985,
    players: [
      { name: "Mark Aguirre", pos: ["SF"], ins: 86, out: 72, ply: 72, reb: 64, def: 60, ath: 76, ovr: 83 },
      { name: "Rolando Blackman", pos: ["SG"], ins: 80, out: 78, ply: 74, reb: 56, def: 78, ath: 80, ovr: 81 },
      { name: "Derek Harper", pos: ["PG"], ins: 66, out: 74, ply: 80, reb: 48, def: 82, ath: 80, ovr: 78 },
      { name: "Sam Perkins", pos: ["PF", "C"], ins: 74, out: 66, ply: 64, reb: 76, def: 78, ath: 74, ovr: 77 },
      { name: "Dale Ellis", pos: ["SG", "SF"], ins: 72, out: 82, ply: 64, reb: 56, def: 62, ath: 80, ovr: 75 }
    ]
  },
  {
    team: "New York Knicks",
    abbr: "NYK",
    year: 1985,
    players: [
      { name: "Bernard King", pos: ["SF"], ins: 92, out: 66, ply: 70, reb: 64, def: 64, ath: 84, ovr: 86 },
      { name: "Bill Cartwright", pos: ["C"], ins: 74, out: 40, ply: 58, reb: 74, def: 76, ath: 60, ovr: 76 },
      { name: "Trent Tucker", pos: ["SG"], ins: 62, out: 80, ply: 64, reb: 48, def: 66, ath: 74, ovr: 73 },
      { name: "Rory Sparrow", pos: ["PG"], ins: 62, out: 66, ply: 78, reb: 46, def: 74, ath: 74, ovr: 73 },
      { name: "Louis Orr", pos: ["SF", "PF"], ins: 66, out: 56, ply: 62, reb: 64, def: 72, ath: 74, ovr: 72 }
    ]
  },
  {
    team: "New Jersey Nets",
    abbr: "NJN",
    year: 1985,
    players: [
      { name: "Buck Williams", pos: ["PF"], ins: 76, out: 40, ply: 58, reb: 86, def: 84, ath: 82, ovr: 81 },
      { name: "Micheal Ray Richardson", pos: ["PG", "SG"], ins: 72, out: 64, ply: 84, reb: 62, def: 86, ath: 84, ovr: 80 },
      { name: "Otis Birdsong", pos: ["SG"], ins: 78, out: 70, ply: 70, reb: 50, def: 66, ath: 80, ovr: 77 },
      { name: "Darryl Dawkins", pos: ["C"], ins: 78, out: 40, ply: 54, reb: 72, def: 76, ath: 84, ovr: 77 },
      { name: "Mike Gminski", pos: ["C", "PF"], ins: 70, out: 60, ply: 60, reb: 74, def: 72, ath: 60, ovr: 74 }
    ]
  }
];
