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
export const SITE_PASSWORD = ENV_PASSWORD || "GazBob";
export const PASSWORD_CASE_SENSITIVE = false; // false = "gazbob" also works (friendlier on phones)

/* ---------- 2. NAMES ---------------------------------------------------*/
export const HER_NAME = "Her Name"; // TODO: REPLACE  (shown on the boarding pass & letter)
export const MY_NAME = "Your Name"; // TODO: REPLACE

/* ---------- 3. DATES ---------------------------------------------------*/
export const ANNIVERSARY_DATE = "2025-03-14"; // TODO: REPLACE (the day you met / got together)
export const NEXT_VISIT_DATE = "2026-12-12T19:30:00+05:30"; // TODO: REPLACE (when she lands in Pune next, Pune time)
export const LANDED_MESSAGE = "She’s landed. Go hug her."; // shown after the countdown hits zero

/* ---------- 4. BOARDING PASS (password screen) ------------------------ */
export const FLIGHT = {
  number: "LOVE 143", // TODO: REPLACE (optional)
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
  hint: "Hint: it’s a nickname only we know.", // TODO: REPLACE (shown after 3 wrong tries; "" to disable)
};

/* ---------- 5. HERO ----------------------------------------------------*/
export const HERO = {
  eyebrow: "BAH → PNQ",
  headline: "From Bahrain to Pune, every flight was worth it", // TODO: REPLACE (optional)
  subline: "Happy anniversary, my love", // TODO: REPLACE (optional)
};

/* ---------- 6. DEPARTURE BOARD (stats) --------------------------------
   "Days since we met" is calculated automatically from ANNIVERSARY_DATE. */
export const STATS = {
  flights: 14, // TODO: REPLACE — how many times she has flown to see you
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
  { image: "/images/memory1.jpg", title: "Arrivals hall", date: "Mar 2025", location: "Pune airport", caption: "The first hug after weeks apart." }, // TODO: REPLACE
  { image: "/images/memory2.jpg", title: "Chai stop", date: "Apr 2025", location: "Pune", caption: "Chai, rain and you laughing." }, // TODO: REPLACE
  { image: "/images/memory3.jpg", title: "Sunset drive", date: "May 2025", location: "Sinhagad road", caption: "The sky tried, but you still won." }, // TODO: REPLACE
  { image: "/images/memory4.jpg", title: "Lazy Sunday", date: "Jun 2025", location: "Home", caption: "Doing nothing, perfectly." }, // TODO: REPLACE
  { image: "/images/memory5.jpg", title: "City lights", date: "Aug 2025", location: "Pune", caption: "Your hand in mine, always." }, // TODO: REPLACE
  { image: "/images/memory6.jpg", title: "Little adventure", date: "Oct 2025", location: "Lonavala", caption: "Lost, laughing, found." }, // TODO: REPLACE
  { image: "/images/memory7.jpg", title: "Airport goodbye", date: "Dec 2025", location: "Pune airport", caption: "The hardest ‘see you soon’." }, // TODO: REPLACE
  { image: "/images/memory8.jpg", title: "Video-call night", date: "Every night", location: "Bahrain ↔ Pune", caption: "Same moon, two cities." }, // TODO: REPLACE
];

/* ---------- 8. OUR FLIGHT LOG (timeline) ------------------------------ */
export const TIMELINE = [
  { flight: "01", route: "BAH → PNQ", date: "March 2025", title: "The first hello", text: "Nervous, smiling, and not ready for how much my life was about to change." }, // TODO: REPLACE
  { flight: "02", route: "BAH → PNQ", date: "April 2025", title: "You came back", text: "One visit turned into a promise that you’d keep coming." }, // TODO: REPLACE
  { flight: "03", route: "BAH → PNQ", date: "June 2025", title: "Our first trip together", text: "A small getaway, a big memory." }, // TODO: REPLACE
  { flight: "04", route: "BAH → PNQ", date: "September 2025", title: "Meeting my world", text: "You made every person you met fall for you too." }, // TODO: REPLACE
  { flight: "05", route: "BAH → PNQ", date: "December 2025", title: "A festive landing", text: "The lights were pretty. You were prettier." }, // TODO: REPLACE
  { flight: "06", route: "BAH → PNQ", date: "Today", title: "Still choosing you", text: "Every flight, every month, every time." }, // TODO: REPLACE
];

/* ---------- 9. WHY I LOVE YOU (flip cards) ---------------------------- */
export const REASONS = [
  "The way you laugh at your own jokes before the punchline.", // TODO: REPLACE
  "You turn a 3-hour flight into the shortest distance between us.", // TODO: REPLACE
  "You are kind to everyone, even on the longest shifts.", // TODO: REPLACE
  "Your voice notes are my favourite playlist.", // TODO: REPLACE
  "You make every ordinary day feel like a holiday.", // TODO: REPLACE
  "You never let the distance win.", // TODO: REPLACE
  "Your smile when you walk through arrivals.", // TODO: REPLACE
  "You make me want to be better, gently.", // TODO: REPLACE
  "You feel like home, wherever we are.", // TODO: REPLACE
  "Because it’s you. It’s always been you.", // TODO: REPLACE
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