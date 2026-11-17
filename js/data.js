// Images live in images/<pool>/<id>.webp or .png  (e.g. images/animals/panda.webp).
// If an image is missing, the emoji is shown instead, so the app always works.
const REQUIRE_CORRECT = false; // false = any tile can be picked (true = only the sensible answers)

// For each animal, place/food/problem are the "sensible" answers (one id, or a list of ids).
// Each PROBLEM lists the solution(s) that fix it (fix -> solutions). Whatever problem the student
// picks, one of its fixes is always among the four solution tiles.
// Every id MUST exist in its pool below; the app warns in the console if one is missing.
// Every question shows one sensible tile plus three random others from the same pool.
const ITEMS = {
  animals: [
    { id: "panda", word: "panda", plural: "pandas", emoji: "🐼", place: "forest", food: "bamboo", problem: "forest-loss" },
    { id: "sea-turtle", word: "sea turtle", plural: "sea turtles", emoji: "🐢", place: "sea", food: "jellyfish", problem: "plastic" },
    { id: "penguin", word: "penguin", plural: "penguins", emoji: "🐧", place: "ice", food: "many-fish", problem: ["global-warming", "overfishing"] },
    { id: "giraffe", word: "giraffe", plural: "giraffes", emoji: "🦒", place: "savanna", food: "lots-leaves", problem: "hunting" },
    { id: "gorilla", word: "gorilla", plural: "gorillas", emoji: "🦍", place: "forest", food: "fruit-ants", problem: ["forest-loss", "hunting"] },
    { id: "lion", word: "lion", plural: "lions", emoji: "🦁", place: "savanna", food: "lots-meat", problem: "hunting" }
  ],
  places: [
    { id: "forest", word: "in the forest", emoji: "🌲" },
    { id: "sea", word: "in the sea", emoji: "🌊" },
    { id: "ice", word: "on the ice", emoji: "🧊" },
    { id: "savanna", word: "in the savanna", emoji: "🌾" },
    // extras
    { id: "moon", word: "on the moon", emoji: "🌙" },
    { id: "desert", word: "in the desert", emoji: "🏜️" },
    { id: "mountains", word: "in the mountains", emoji: "⛰️" },
    { id: "city", word: "in the city", emoji: "🏙️" }
  ],
  foods: [
    { id: "bamboo", word: "bamboo leaves", emoji: "🎋" },
    { id: "jellyfish", word: "jellyfish", emoji: "🪼" },
    { id: "many-fish", word: "many fish", emoji: "🐟" },
    { id: "lots-leaves", word: "lots of leaves", emoji: "🍃" },
    { id: "fruit-ants", word: "fruit and ants", emoji: "🍎" },
    { id: "lots-meat", word: "lots of meat", emoji: "🥩" },
    // extras
    { id: "pizza", word: "pizza", emoji: "🍕" },
    { id: "ice-cream", word: "ice cream", emoji: "🍦" },
    { id: "bugs", word: "bugs", emoji: "🐛" },
    { id: "bananas", word: "bananas", emoji: "🍌" },
    { id: "hamburgers", word: "hamburgers", emoji: "🍔" }
  ],
  problems: [
    { id: "plastic", word: "plastic", emoji: "🥤", fix: ["eco-bags"] },
    { id: "air-pollution", word: "air pollution", emoji: "🏭", fix: ["reduce-pollution"] },
    { id: "traffic-accidents", word: "traffic accidents", emoji: "🚗", fix: ["reduce-accidents"] },
    { id: "overfishing", word: "overfishing", emoji: "🎣", fix: ["reduce-overfishing"] },
    { id: "forest-loss", word: "forest loss", emoji: "🪓", fix: ["plant-trees"] },
    { id: "chemicals", word: "chemicals", emoji: "🧪", fix: ["reduce-chemicals"], be: "are" },
    { id: "global-warming", word: "global warming", emoji: "🌡️", fix: ["save-energy"] },
    { id: "hunting", word: "hunting", emoji: "🏹", fix: ["reduce-hunting"] }
  ],
  // r = which of the 4Rs it belongs to (not shown yet)
  solutions: [
    { id: "eco-bags", word: "use eco-friendly bags", emoji: "🛍️" },
    { id: "save-energy", word: "save energy", emoji: "💡" },
    { id: "plant-trees", word: "plant trees", emoji: "🌱" },
    { id: "reduce-hunting", word: "reduce hunting", emoji: "🚫", r: "reduce" },
    { id: "reduce-overfishing", word: "reduce overfishing", emoji: "🐠", r: "reduce" },
    { id: "reduce-chemicals", word: "reduce chemicals", emoji: "🧪", r: "reduce" },
    { id: "reduce-pollution", word: "reduce air pollution", emoji: "🏭", r: "reduce" },
    { id: "reduce-accidents", word: "reduce traffic accidents", emoji: "🚗", r: "reduce" }
  ]
};
