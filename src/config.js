/* =====================================================================
   ♥  EDIT ME  ♥   —   THIS IS THE ONLY FILE YOU NEED TO CHANGE  ♥

   Everything on the website comes from this file. You never need to
   touch App.jsx or styles.css.

   HOW TO FIND WHAT TO CHANGE
   --------------------------
   Search this file for  "TODO: REPLACE"  — every placeholder is marked.

   QUICK CHECKLIST
   ---------------
   1. SITE_PASSWORD ........ the boarding code she types (or set VITE_SITE_PASSWORD in a .env file)
   2. HER_NAME / MY_NAME ... names shown on the boarding pass, letter, etc.
   3. ANNIVERSARY_DATE ..... drives the "days together" counters
   4. NEXT_VISIT_DATE ...... drives the live countdown in the footer
   5. STATS ................ flights + kilometres on the departure board
   6. MEMORIES ............. 8 photos + captions (put photos in /public/images/)
   7. TIMELINE ............. your "flight log" milestones
   8. REASONS .............. "why I love you" cards
   9. LETTER ............... the big letter at the end
  10. MUSIC_FILE ........... drop an mp3 in /public/music/ and set the path
  11. SECRET_MESSAGE ....... the easter egg (tap the plane in the hero 5 times)
  12. COLORS ............... optional palette tweaks

   TIPS
   ----
   • Use ’ (curly apostrophe) and “ ” in text if you like — plain ' works too.
   • Dates: use "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss+05:30" (+05:30 = Pune time).
   • You can have more or fewer MEMORIES / TIMELINE / REASONS items — the
     layout adapts. (Memories look best with 6–10.)
   ===================================================================== */

/* ---------- 1. PASSWORD ------------------------------------------------
   Note: this is a *playful* gate, not real security — the password ships
   inside the website code. Perfect for a surprise, not for secrets.      */
// TODO: REPLACE (or leave "GazBob" if that's the one you want)
const ENV_PASSWORD = import.meta.env.VITE_SITE_PASSWORD; // optional .env override
export const SITE_PASSWORD = ENV_PASSWORD || "lovie";
export const PASSWORD_CASE_SENSITIVE = false; // false = "gazbob" also works (friendlier on phones)

/* ---------- 2. NAMES ---------------------------------------------------*/
export const HER_NAME = "Gazelle Brian Dourado"; // TODO: REPLACE  (shown on the boarding pass & letter)
export const MY_NAME = "Shubham Kiran Barathe"; // TODO: REPLACE

/* ---------- 3. DATES ---------------------------------------------------*/
export const ANNIVERSARY_DATE = "2025-11-16"; // TODO: REPLACE (the day you met / got together)
export const NEXT_VISIT_DATE = "2026-11-13T21:55:00+05:30"; // TODO: REPLACE (when she lands in Pune next, Pune time)
export const LANDED_MESSAGE = "She’s landed. Go hug her."; // shown after the countdown hits zero

/* ---------- 4. BOARDING PASS (password screen) ------------------------ */
export const FLIGHT = {
  number: "GF 286", // TODO: REPLACE (optional)
  gate: "♥",
  seat: "Next to me",
  from: { code: "BAH", city: "Bahrain" },
  to: { code: "PNQ", city: "Pune" },
};
export const GATE = {
  title: "Boarding now",
  subtitle: "A flight just for you",
  // Cute messages shown on wrong passwords (cycled in order)
  wrongMessages: [
    "Hmm, that’s not your boarding code ✈️",
    "Almost, captain! Try again 💕",
    "Still not it… think of us ♥",
  ],
  hint: "Hint: You used to call me by this name(lowercase)", // TODO: REPLACE (shown after 3 wrong tries; "" to disable)
};

/* ---------- 5. HERO ----------------------------------------------------*/
export const HERO = {
  eyebrow: "BAH → PNQ",
  headline: "From Bahrain to Pune, every time you have visited it has been heaven on earth my honbun", // TODO: REPLACE (optional)
  subline: "Happy anniversary, my love", // TODO: REPLACE (optional)
};

/* ---------- 6. DEPARTURE BOARD (stats) --------------------------------
   "Days since we met" is calculated automatically from ANNIVERSARY_DATE. */
export const STATS = {
  flights: 8, // TODO: REPLACE — how many times she has flown to see you
  // BAH → PNQ is roughly 2,540 km one way. Return trips double it.
  kilometres: 14 * 2540 * 2, // TODO: REPLACE (or type a number like 71120)
};
export const TIMEZONES = {
  her: { label: "Her time", city: "Bahrain", zone: "Asia/Bahrain" },
  me: { label: "My time", city: "Pune", zone: "Asia/Kolkata" },
};

/* ---------- 7. MEMORIES (carousel) ------------------------------------
   image: put your photos in /public/images/ and keep the filenames here.
   If an image can’t be found, a soft placeholder is shown instead.      */

export const MEMORIES = [
  {
    image: "/images/memory1.jpg",
    title: "Arrivals hall",
    date: "Dec 2025",
    location: "Bom airport",
    caption: "The first hug after weeks apart."
  },
  {
    image: "/images/memory2.JPG",
    title: "First Toit stop",
    date: "Dec 2025",
    location: "Pune",
    caption: "Initial thoughts: Never thought I'd bag such a hottie."
  },
  {
    image: "/images/memory3.JPG",
    title: "First Sephora Hall",
    date: "Dec 2025",
    location: "Pune",
    caption: "I was fascinated by you."
  },
  {
    image: "/images/memory4.jpg",
    title: "Goodbye of our first trip",
    date: "Jan 2026",
    location: "Pune",
    caption: "Started the new year together. And the hardest ‘see you soon’."
  },
  {
    image: "/images/memory5.jpg",
    title: "My Bday celebration",
    date: "Jan 2026",
    location: "Pune",
    caption: "Your hand in mine, and us intertwined."
  },
  {
    image: "/images/memory6.jpg",
    title: "My Desi baddie",
    date: "Jan 2026",
    location: "Pune",
    caption: "Lost, laughing, found, happiest."
  },
  {
    image: "/images/memory7.jpg",
    title: "Always irritating me",
    date: "Jan 2026",
    location: "Pune",
    caption: "Anytime of the day, you will find a way to irritate me."
  },
  {
    image: "/images/memory8.jpg",
    title: "Aurika times",
    date: "Jan 2026",
    location: "Bom",
    caption: "Bom street hopping and beautiful times."
  },
  {
    image: "/images/memory9.jpg",
    title: "Thanks for making my bday special.",
    date: "Jan 2026",
    location: "Pune",
    caption: "Well planned and well executed bday. Thanks bb."
  },
  {
    image: "/images/memory10.jpg",
    title: "First trip together",
    date: "Feb 2026",
    location: "GOI",
    caption: "Fun, beach, smashing, love."
  },
  {
    image: "/images/memory15.JPG",
    title: "Cutesy date",
    date: "Jun 2026",
    location: "Pune",
    caption: "Asian food and love."
  },
  {
    image: "/images/memory16.jpg",
    title: "Hyd cringe club fun",
    date: "Jul 2026",
    location: "Hyd",
    caption: "Can't get over this night. Embarrassing but fun."
  },
  {
    image: "/images/memory17.JPG",
    title: "Hyd date",
    date: "Jul 2026",
    location: "Hyd",
    caption: "Beautiful escape."
  },
  {
    image: "/images/memory18.jpg",
    title: "My Home",
    date: "Sept 2026",
    location: "Pune",
    caption: "My home at my home."
  },
  {
    image: "/images/memory19.jpg",
    title: "Weird, sassy, fun!",
    date: "Sept 2026",
    location: "Pune",
    caption: "A fun couple who knows everything!"
  },
  {
    image: "/images/memory20.JPG",
    title: "Cute and scary Gazelle.",
    date: "Sept 2026",
    location: "Pune",
    caption: "A nice boy scared of his lovely baddie."
  }
];


/* ---------- 8. OUR FLIGHT LOG (timeline) ------------------------------ */
export const TIMELINE = [
  { flight: "01", route: "BAH → PNQ", date: "December 2025", title: "The first hello as SOMEONE in your life", text: "Nervous, smiling, and not ready for how much my life was about to change." }, // TODO: REPLACE
  { flight: "02", route: "BAH → BOM", date: "January 2026", title: "Bom Layover", text: "Had my best time in BOM." }, // TODO: REPLACE
  { flight: "02", route: "BAH → PNQ", date: "January 2026", title: "You came back", text: "Two visit turned into a promise that you’d keep coming." }, // TODO: REPLACE
  { flight: "03", route: "BAH → GOI", date: "Febraury 2026", title: "Our first trip together", text: "A small getaway, a big memory." }, // TODO: REPLACE
  { flight: "04", route: "BAH → BOM", date: "March 2026", title: "Being my world", text: "Fell way too deep with every bit." }, // TODO: REPLACE
  { flight: "05", route: "BAH → PNQ", date: "June 2026", title: "Finally, seeing you again", text: "Months of waiting, countless countdowns, and one hug that made it all worth it." }, // TODO: REPLACE
  { flight: "06", route: "BAH → HYD", date: "July 2026", title: "Hyd layover", text: "Hyd will never be the same without you" }, // TODO: REPLACE
  { flight: "07", route: "BAH → PNQ", date: "Aug 2026", title: "Ptown baby", text: "Beautiful dates and cutesy moments." }, // TODO: REPLACE
  { flight: "08", route: "BAH → PNQ", date: "Sept 2026", title: "Love and Party chaos", text: "Prettiest wherever you go" }, // TODO: REPLACE
];

/* ---------- 9. WHY I LOVE YOU (flip cards) ---------------------------- */
export const REASONS = [
  "You make me laugh like no one else ever has.",
  "You turn a 10-hour journey into the shortest distance between us.",
  "You are ridiculously pretty, effortlessly hot, and always the best in the room.",
  "You've always taken care of me, even when I'm miles away.",
  "No one puts in the kind of effort you do, and I never take that for granted.",
  "You're an amazing friend, an incredible human, and the most wonderful daughter.",
  "You make every place feel like home, simply by being there.",
  "Whether virtually or in person, you always make sure I'm safe, happy, and okay.",
  "You're strong, independent, smart, and my favourite girlie.",
  "You're my person. My favourite person, always.",
];

/* ---------- 10. THE LETTER ---------------------------------------------
   Each string in "paragraphs" becomes one paragraph. It is revealed
   word by word. Keep paragraphs short for phones.                        */
export const LETTER = {
  speedMs: 85, // typing speed: lower = faster
  greeting: "My dearest love,", // TODO: REPLACE
  paragraphs: [
    "I’m writing this with a full heart and a very big smile, because every time I think about us, I realise how lucky I am.", // TODO: REPLACE
    "Distance has tried its best, with time zones, early flights and long goodbyes, and it still hasn’t managed to make me love you any less. If anything, it taught me how precious every hour with you is.", // TODO: REPLACE
    "Thank you for the airport hugs, the late-night calls, the patience, the laughter, and for choosing us again and again.", // TODO: REPLACE
    "One day soon, there will be no more boarding passes between us. Until then, I’ll keep counting the days, and I’ll keep loving you across every kilometre.", // TODO: REPLACE
    "Happy anniversary, my love. I can’t wait for our next landing.", // TODO: REPLACE
  ],
  signOff: "Forever yours,", // TODO: REPLACE
  signature: MY_NAME,
};

/* ---------- 11. MUSIC --------------------------------------------------
   Put an mp3 in /public/music/ and set the path below.
   If the file doesn’t exist, the music button is simply hidden.          */
export const MUSIC_FILE = "/music/our-song.mp3"; // TODO: REPLACE (add the mp3 file to public/music/)

/* ---------- 12. EASTER EGG --------------------------------------------
   Shown when she taps the little plane in the hero 5 times.              */
export const SECRET_MESSAGE = {
  title: "You found the secret hangar ✈️",
  text: "Psst… I’m already planning our next adventure. Pack light, bring that smile.", // TODO: REPLACE
};

/* ---------- 13. COLOURS (optional) -------------------------------------
   These feed the CSS variables. Leave as is for the dusk-sky look.       */
export const COLORS = {
  navy: "#1a1a3e",
  plum: "#4a2c5e",
  rose: "#f4a6b8",
  gold: "#f6d365",
};