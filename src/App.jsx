/* =====================================================================
   App.jsx — every component lives here.
   You should NOT need to edit this file: all content is in config.js.
   Sections:
     helpers · PasswordGate · Hero · FlightCounter · MemoriesCarousel
     Timeline · WhyILoveYou · Letter · Footer · Nav · MusicButton · App
   ===================================================================== */
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import {
  AnimatePresence, motion, useAnimation, useMotionValue, useTransform,
  useScroll, useSpring, useReducedMotion, useInView, animate, useMotionValueEvent,
} from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import confetti from "canvas-confetti";
import {
  Home, Images, Route, Heart, Mail, Music, Pause, X, Eye, EyeOff,
  ChevronDown, Layers, LayoutGrid, FastForward,
} from "lucide-react";
import * as C from "./config.js";

/* ============================ HELPERS ============================ */
const DAY = 86400000;
const SESSION_KEY = "anniv-unlocked";
const pad2 = (n) => String(Math.max(0, n)).padStart(2, "0");
const daysSince = (d) => Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / DAY));
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
};

// Tiny seeded random so stars/hearts are stable between renders
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rnd = seeded(42);
const STARS = Array.from({ length: 70 }, () => ({ x: rnd() * 100, y: rnd() * 100, s: 1 + rnd() * 2.2, d: rnd() * 6, t: 2.5 + rnd() * 4 }));
const FLOATERS = Array.from({ length: 16 }, () => ({ x: rnd() * 100, s: 12 + rnd() * 20, d: rnd() * 9, t: 7 + rnd() * 6, gold: rnd() > 0.6 }));

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

// Plane silhouette pointing RIGHT (24x24 box)
const PLANE_D = "M22 12c0-.9-.9-1.6-2-1.6h-4.3L10.6 3.3a1 1 0 0 0-.8-.4H8.4l2.5 7.5H5.6L3.8 8.2H2.4L3.2 12l-.8 3.8h1.4l1.8-2.2h5.3l-2.5 7.5h1.4a1 1 0 0 0 .8-.4l5.1-7.1H20c1.1 0 2-.7 2-1.6z";
const PlaneIcon = ({ size = 24, className, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill="currentColor" aria-hidden="true">
    <path d={PLANE_D} />
  </svg>
);

// Heart confetti (canvas-confetti custom shape)
const HEART_PATH = "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z";
let heartShape;
function heartBurst(big = true) {
  heartShape = heartShape || confetti.shapeFromPath({ path: HEART_PATH });
  const base = { shapes: [heartShape], colors: [C.COLORS.rose, "#ff5d8f", C.COLORS.gold, "#ffffff"], scalar: 2.2, disableForReducedMotion: true, zIndex: 300 };
  confetti({ ...base, particleCount: big ? 90 : 40, spread: 120, origin: { y: 0.65 }, ticks: 220 });
  if (!big) return;
  const end = Date.now() + 900;
  (function frame() {
    confetti({ ...base, particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.8 } });
    confetti({ ...base, particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.8 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Soft gradient placeholder used if a photo file is missing
const PH = [["#f4a6b8", "#4a2c5e"], ["#f6d365", "#fda085"], ["#a18cd1", "#fbc2eb"], ["#84a9ff", "#c4a1ff"], ["#ffd6c0", "#f58fa8"], ["#9fb4e8", "#e6c6f0"], ["#f093fb", "#f5576c"], ["#667eea", "#764ba2"]];
function placeholder(i) {
  const [a, b] = PH[i % PH.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><text x='400' y='500' font-size='140' text-anchor='middle' fill='white' fill-opacity='.85'>♥</text><text x='400' y='600' font-family='Georgia,serif' font-size='46' text-anchor='middle' fill='white' fill-opacity='.9'>Photo ${i + 1}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function Photo({ item, index, className }) {
  const [bad, setBad] = useState(false);
  return (
    <img className={className} src={bad ? placeholder(index) : item.image} alt={item.title}
      loading="lazy" decoding="async" draggable={false} onError={() => setBad(true)} />
  );
}

const Reveal = ({ children, delay = 0, y = 22, className, as = "div" }) => {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  );
};
const SectionHead = ({ eyebrow, title, sub }) => (
  <Reveal className="sec-head">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {sub && <p className="sec-sub">{sub}</p>}
  </Reveal>
);

function CountUp({ value, duration = 2.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const c = animate(0, value, { duration, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce, duration]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}</span>;
}

/* Fixed dusk sky behind everything */
const Sky = () => (
  <div className="sky" aria-hidden="true">
    {STARS.map((s, i) => (
      <i key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }} />
    ))}
  </div>
);

/* ========================= 1. PASSWORD GATE ========================= */
function PasswordGate({ onSuccess, onDone }) {
  const [val, setVal] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [tries, setTries] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | tear | takeoff
  const shake = useAnimation();
  const reduce = useReducedMotion();

  const norm = (s) => (C.PASSWORD_CASE_SENSITIVE ? s.trim() : s.trim().toLowerCase());

  const submit = (e) => {
    e.preventDefault();
    if (stage !== "idle") return;
    if (norm(val) === norm(C.SITE_PASSWORD)) {
      setMsg("Welcome aboard ♥");
      onSuccess(); // starts music inside the user gesture (needed for iOS)
      setStage("tear");
      setTimeout(() => setStage("takeoff"), reduce ? 100 : 900);
      setTimeout(onDone, reduce ? 500 : 2500);
    } else {
      const n = tries + 1;
      setTries(n);
      const list = C.GATE.wrongMessages;
      setMsg(n >= 3 && C.GATE.hint ? C.GATE.hint : list[(n - 1) % list.length]);
      if (!reduce) shake.start({ x: [0, -12, 12, -9, 9, -4, 4, 0], transition: { duration: 0.55 } });
    }
  };

  const torn = stage !== "idle";
  const bars = useMemo(() => Array.from({ length: 34 }, (_, i) => 1 + ((i * 7) % 4)), []);

  return (
    <motion.div className="gate" exit={{ opacity: 0, transition: { duration: 0.9 } }}>
      <div className="gate-glow" aria-hidden="true" />
      <motion.header className="gate-title" initial={{ opacity: 0, y: -12 }} animate={{ opacity: torn ? 0 : 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1>{C.GATE.title}</h1>
        <p>{C.GATE.subtitle}</p>
      </motion.header>

      <motion.div className="pass-shake" animate={shake}>
        <motion.div className="pass" initial={{ y: 50, opacity: 0, rotate: -2 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <motion.section className="pass-main" animate={torn ? { x: -8, rotate: -1.6 } : { x: 0, rotate: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="pass-head">
              <span className="airline"><PlaneIcon size={18} /> My Cutesy Janemann Airlines</span>
              <span>Boarding pass</span>
            </div>
            <div className="pass-route">
              <div><b>{C.FLIGHT.from.code}</b><small>{C.FLIGHT.from.city}</small></div>
              <div className="route-mid" aria-hidden="true"><i /><PlaneIcon size={22} /><i /></div>
              <div><b>{C.FLIGHT.to.code}</b><small>{C.FLIGHT.to.city}</small></div>
            </div>
            <dl className="pass-fields">
              <div className="wide"><dt>Passenger</dt><dd className="caps">{C.HER_NAME}</dd></div>
              <div><dt>Flight</dt><dd>{C.FLIGHT.number}</dd></div>
              <div><dt>Gate</dt><dd>{C.FLIGHT.gate}</dd></div>
              <div><dt>Seat</dt><dd>{C.FLIGHT.seat}</dd></div>
            </dl>
            <form className="code-form" onSubmit={submit} noValidate>
              <label htmlFor="boarding-code">Boarding code</label>
              <div className="code-input">
                <input id="boarding-code" type={show ? "text" : "password"} value={val}
                  onChange={(e) => setVal(e.target.value)} autoComplete="off" autoCapitalize="off"
                  autoCorrect="off" spellCheck={false} enterKeyHint="go" placeholder="Enter your code" />
                <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide code" : "Show code"}>
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="gate-msg" role="status" aria-live="polite">{msg}</p>
              <button type="submit" className="btn-gold" disabled={torn}>Board the flight</button>
            </form>
          </motion.section>

          <div className="perf" aria-hidden="true"><span className="notch n1" /><span className="notch n2" /><hr /></div>

          <motion.aside className="pass-stub" aria-hidden="true"
            animate={torn ? { rotate: [0, 5, 16], x: [0, 8, 46], y: [0, 14, 160], opacity: [1, 1, 0] } : { rotate: 0, x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeIn" }}>
            <p className="stub-label">Seat</p>
            <p className="stub-big">{C.FLIGHT.seat}</p>
            <p className="stub-label">{C.FLIGHT.from.code} → {C.FLIGHT.to.code}</p>
            <div className="barcode">{bars.map((w, i) => <i key={i} style={{ "--w": w }} />)}</div>
            <p className="stub-label">{C.FLIGHT.number}</p>
          </motion.aside>
        </motion.div>
      </motion.div>

      {stage === "takeoff" && !reduce && (
        <motion.div className="takeoff" initial={{ x: "-18vw", y: "8vh", rotate: -6, opacity: 0 }}
          animate={{ x: "112vw", y: "-62vh", rotate: -24, opacity: 1 }} transition={{ duration: 1.5, ease: [0.5, 0, 0.9, 0.5] }}>
          <span className="trail" /><PlaneIcon size={64} />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ================================ 2. HERO ================================ */
const PATH_D = "M 36 176 C 110 18, 292 18, 364 146";
function FlightPath({ onPlaneTap }) {
  const pathRef = useRef(null);
  const planeRef = useRef(null);
  const reduce = useReducedMotion();
  const progress = useMotionValue(reduce ? 1 : 0);

  const place = useCallback((p) => {
    const path = pathRef.current, g = planeRef.current;
    if (!path || !g) return;
    const len = path.getTotalLength(), l = p * len;
    const a = path.getPointAtLength(Math.max(0, l - 2)), b = path.getPointAtLength(Math.min(len, l + 2));
    const pt = path.getPointAtLength(l);
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    g.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${ang})`);
  }, []);
  useMotionValueEvent(progress, "change", place);
  useEffect(() => {
    place(progress.get());
    if (reduce) return;
    const c = animate(progress, 1, { duration: 7, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 });
    return () => c.stop();
  }, [reduce, place, progress]);

  return (
    <div className="flightpath">
      <svg viewBox="0 0 400 230" role="img" aria-label={`Flight path from ${C.FLIGHT.from.city} to ${C.FLIGHT.to.city}`}>
        <path ref={pathRef} d={PATH_D} className="fp-base" />
        <motion.path d={PATH_D} className="fp-glow" style={{ pathLength: progress }} />
        <g>
          <circle cx="36" cy="176" r="7" className="fp-dot" />
          <text x="36" y="205" className="fp-code">{C.FLIGHT.from.code}</text>
          <text x="36" y="221" className="fp-city">{C.FLIGHT.from.city}</text>
        </g>
        <g>
          <circle cx="364" cy="146" r="11" className="fp-pulse" />
          <circle cx="364" cy="146" r="7" className="fp-dot gold" />
          <text x="364" y="175" className="fp-code">{C.FLIGHT.to.code}</text>
          <text x="364" y="191" className="fp-city">{C.FLIGHT.to.city}</text>
        </g>
        <g ref={planeRef} onClick={onPlaneTap} style={{ cursor: "pointer" }}>
          <circle r="26" fill="transparent" />
          <path d={PLANE_D} transform="translate(-15 -15) scale(1.25)" className="fp-plane" />
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  const days = daysSince(C.ANNIVERSARY_DATE);
  const [taps, setTaps] = useState(0);
  const [egg, setEgg] = useState(false);
  const last = useRef(0);

  const onPlaneTap = () => {
    const t = Date.now();
    const n = t - last.current > 2500 ? 1 : taps + 1; // taps must be quick-ish
    last.current = t;
    setTaps(n);
    if (n >= 5) { setEgg(true); setTaps(0); heartBurst(); }
  };
  const words = C.HERO.headline.split(" ");

  return (
    <section id="home" className="hero">
      <div className="clouds" aria-hidden="true">
        <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" /><span className="cloud c4" />
      </div>
      <div className="hero-inner">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>{C.HERO.eyebrow}</motion.p>
        <h1 className="hero-title" aria-label={C.HERO.headline}>
          {words.map((w, i) => (
            <motion.span key={i} aria-hidden="true" initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              {w}&nbsp;
            </motion.span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.2 }}>
          <FlightPath onPlaneTap={onPlaneTap} />
        </motion.div>
        <motion.div className="days-chip glass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.9, duration: 0.8 }}>
          <Heart size={18} fill="currentColor" />
          <span><strong><CountUp value={days} /></strong> days together</span>
        </motion.div>
        <motion.p className="hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}>{C.HERO.subline}</motion.p>
      </div>
      <ChevronDown className="scroll-cue" size={28} aria-hidden="true" />

      <AnimatePresence>
        {egg && (
          <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEgg(false)}>
            <motion.div className="egg glass" initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <PlaneIcon size={34} className="egg-plane" />
              <h3>{C.SECRET_MESSAGE.title}</h3>
              <p>{C.SECRET_MESSAGE.text}</p>
              <button className="btn-gold" onClick={() => setEgg(false)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ======================== 3. FLIGHT COUNTER / STATS ======================== */
function FlapChar({ target, run, delay }) {
  const reduce = useReducedMotion();
  const [c, setC] = useState(" ");
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduce || !/\d/.test(target)) { setC(target); return; }
    let i = 0, t;
    const steps = 8 + Math.floor(Math.random() * 7);
    const tick = () => {
      i += 1;
      setC(i >= steps ? target : String(Math.floor(Math.random() * 10)));
      setN((v) => v + 1);
      if (i < steps) t = setTimeout(tick, 75);
    };
    t = setTimeout(tick, delay);
    return () => clearTimeout(t);
  }, [run, target, delay, reduce]);
  return (
    <span className="flap">
      <motion.span key={n} className="flap-ch" initial={n ? { rotateX: -90, opacity: 0.3 } : false} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.08 }}>
        {c === " " ? "\u00A0" : c}
      </motion.span>
    </span>
  );
}
function SplitFlap({ value, run, delay = 0, width = 7 }) {
  const chars = String(value).padStart(width, " ").split("");
  return (
    <div className="flaps" aria-label={String(value)} role="text">
      {chars.map((ch, i) => <FlapChar key={i} target={ch} run={run} delay={delay + i * 90} />)}
    </div>
  );
}
const timeFmt = (tz) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const dateFmt = (tz) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" });
function Clock({ cfg, now }) {
  const tf = useMemo(() => timeFmt(cfg.zone), [cfg.zone]);
  const df = useMemo(() => dateFmt(cfg.zone), [cfg.zone]);
  const t = tf.format(now);
  return (
    <div className="clock glass">
      <p className="clock-label">{cfg.label}</p>
      <p className="clock-time" aria-label={`${cfg.city} time ${t}`}>{t}</p>
      <p className="clock-city">{cfg.city} · {df.format(now)}</p>
    </div>
  );
}
function FlightCounter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const now = useNow(1000);
  const fmt = (n) => Number(n).toLocaleString("en-US");
  const rows = [
    ["Flights to see me", fmt(C.STATS.flights)],
    ["Kilometres flown for love", fmt(C.STATS.kilometres)],
    ["Days since we met", fmt(daysSince(C.ANNIVERSARY_DATE))],
  ];
  return (
    <section id="stats" className="section">
      <SectionHead eyebrow="Departures" title="The love board" />
      <Reveal>
        <div className="board glass" ref={ref}>
          <div className="board-head"><span>Departures</span><span>{C.FLIGHT.from.code} → {C.FLIGHT.to.code}</span></div>
          {rows.map(([label, v], i) => (
            <div className="board-row" key={label}>
              <p className="board-label">{label}</p>
              <SplitFlap value={v} run={inView} delay={i * 450} />
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.1} className="clocks">
        <Clock cfg={C.TIMEZONES.her} now={now} />
        <Clock cfg={C.TIMEZONES.me} now={now} />
      </Reveal>
    </section>
  );
}

/* ============================ 4. MEMORIES ============================ */

const TILTS = [-3, 2.5, -2, 3, -3.5, 2, -1.5, 3.5];

function Lightbox({ item, index, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", k);
    };
  }, [onClose]);

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        className="icon-btn lb-close"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X size={22} />
      </button>

      <motion.figure
        className="lb-card"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (Math.abs(info.offset.y) > 90 || Math.abs(info.velocity.y) > 600) {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.88, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Photo item={item} index={index} className="lb-img" />

        <figcaption className="lb-caption-content">
          <h3 className="lb-title">{item.title}</h3>
          <span className="lb-meta">
            {item.date} · {item.location}
          </span>
          <span className="lb-cap">{item.caption}</span>
        </figcaption>
      </motion.figure>

      <p className="lb-hint">Swipe up or down to close</p>
    </motion.div>
  );
}

function MemoriesCarousel() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="memories" className="section wide-section">
      <SectionHead
        eyebrow="Postcards"
        title="Little moments, big luggage"
        sub="Swipe through. Tap a photo to see it bigger."
      />

      <Reveal>
        <Swiper
          className="mem-swiper"
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          slideToClickedSlide
          rewind
          coverflowEffect={{
            rotate: 26,
            stretch: 0,
            depth: 110,
            modifier: 1,
            slideShadows: false
          }}
          autoplay={
            reduce
              ? false
              : {
                  delay: 3800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }
          }
          pagination={{ clickable: true }}
          onSlideChange={(s) => setActive(s.activeIndex)}
        >
          {C.MEMORIES.map((m, i) => (
            <SwiperSlide key={i} className="mem-slide">
              <figure
                className="polaroid"
                style={{
                  "--tilt": `${TILTS[i % TILTS.length]}deg`
                }}
              >
                <div className="mem-heading">
                  <h3 className="mem-title">{m.title}</h3>
                  <p className="mem-meta">
                    {m.date} · {m.location}
                  </p>
                </div>

                <button
                  className="mem-photo"
                  onClick={() => i === active && setOpen(i)}
                  aria-label={`Open photo: ${m.title}`}
                >
                  <Photo item={m} index={i} />
                </button>

                <figcaption className="mem-caption">
                  {m.caption}
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            key="lb"
            item={C.MEMORIES[open]}
            index={open}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  );
}


/* =========================== 5. FLIGHT LOG TIMELINE =========================== */
function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const reduce = useReducedMotion();
  return (
    <section id="log" className="section">
      <SectionHead eyebrow="Flight log" title="Every landing, written down" />
      <div className="timeline" ref={ref}>
        <div className="tl-line" aria-hidden="true"><motion.span className="tl-fill" style={{ scaleY }} /></div>
        {C.TIMELINE.map((t, i) => (
          <motion.article key={i} className={`tl-item ${i % 2 ? "right" : "left"}`}
            initial={{ opacity: 0, x: reduce ? 0 : i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="tl-dot" aria-hidden="true"><PlaneIcon size={14} /></span>
            <div className="tl-card glass">
              <p className="tl-meta">Flight #{t.flight} · {t.route} · {t.date}</p>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ============================ 6. WHY I LOVE YOU ============================ */
function AnimatedHeading({ text }) {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };
  const letter = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  return (
    <motion.h2 className="big-heading" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} aria-label={text}>
      {text.split(" ").map((w, wi) => (
        <span className="word" key={wi} aria-hidden="true">
          {w.split("").map((ch, ci) => <motion.span key={ci} variants={letter} style={{ display: "inline-block" }}>{ch}</motion.span>)}
          {"\u00A0"}
        </span>
      ))}
    </motion.h2>
  );
}
function FlipCard({ i, text, flipped, onFlip }) {
  return (
    <div className="flip" role="button" tabIndex={0} aria-pressed={flipped} aria-label={flipped ? `Reason ${i + 1}: ${text}` : `Open reason ${i + 1}`}
      onClick={() => onFlip(i)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onFlip(i))}>
      <motion.div className="flip-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
        <div className="face front"><span className="face-no">No. {pad2(i + 1)}</span><Heart size={30} fill="currentColor" /><span className="tap">tap to open</span></div>
        <div className="face back"><p>{text}</p></div>
      </motion.div>
    </div>
  );
}
function StackCard({ i, text, onSeen, onDone }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  const [flipped, setFlipped] = useState(false);
  const fling = (dir) => { onSeen(i); animate(x, dir * 560, { duration: 0.28, ease: "easeIn", onComplete: () => onDone(i) }); };
  return (
    <motion.div className="stack-card top" style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
      onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) fling(info.offset.x > 0 ? 1 : -1); }}
      onTap={() => { setFlipped((f) => !f); onSeen(i); }} initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }}>
      <motion.div className="flip-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
        <div className="face front"><span className="face-no">No. {pad2(i + 1)}</span><Heart size={34} fill="currentColor" /><span className="tap">tap to open · swipe away</span></div>
        <div className="face back"><p>{text}</p></div>
      </motion.div>
    </motion.div>
  );
}
function WhyILoveYou({ complete, onComplete, onContinue }) {
  const total = C.REASONS.length;
  const [seen, setSeen] = useState(() => new Set());
  const [mode, setMode] = useState(() => (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches ? "stack" : "grid"));
  const [idx, setIdx] = useState(0);
  const mark = useCallback((i) => setSeen((p) => { if (p.has(i)) return p; const n = new Set(p); n.add(i); return n; }), []);
  useEffect(() => {
    if (total && seen.size === total && !complete) { heartBurst(); onComplete(); }
  }, [seen, total, complete, onComplete]);

  return (
    <section id="reasons" className="section">
      <div className="sec-head">
        <p className="eyebrow">Reasons</p>
        <AnimatedHeading text="Why I love you" />
        <p className="sec-sub">Open them all. I’m not done yet.</p>
      </div>

      <div className="mode-toggle" role="group" aria-label="View as">
        <button className={mode === "grid" ? "on" : ""} onClick={() => setMode("grid")}><LayoutGrid size={18} /> Grid</button>
        <button className={mode === "stack" ? "on" : ""} onClick={() => setMode("stack")}><Layers size={18} /> Swipe</button>
      </div>

      {mode === "grid" ? (
        <div className="flip-grid">
          {C.REASONS.map((r, i) => <FlipCard key={i} i={i} text={r} flipped={seen.has(i)} onFlip={mark} />)}
        </div>
      ) : (
        <div className="stack-wrap">
          <div className="stack">
            {idx >= total ? (
              <div className="stack-end glass">
                <Heart size={32} fill="currentColor" />
                <p>That’s every reason… for now.</p>
                <button className="btn-ghost" onClick={() => setIdx(0)}>Read them again</button>
              </div>
            ) : (
              <>
                {[2, 1].map((k) => idx + k < total && (
                  <div key={idx + k} className="stack-card under" style={{ transform: `translateY(${k * 14}px) scale(${1 - k * 0.05})`, zIndex: 3 - k }}>
                    <div className="face front"><span className="face-no">No. {pad2(idx + k + 1)}</span><Heart size={34} fill="currentColor" /></div>
                  </div>
                ))}
                <StackCard key={idx} i={idx} text={C.REASONS[idx]} onSeen={mark} onDone={() => setIdx((n) => n + 1)} />
              </>
            )}
          </div>
          <p className="stack-hint">Tap to flip · swipe left or right to see the next</p>
        </div>
      )}

      <p className="progress" aria-live="polite">{seen.size} of {total} opened</p>
      <AnimatePresence>
        {complete && (
          <motion.button className="btn-gold big" onClick={onContinue} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 }}>
            There’s one more thing… <Mail size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================================ 7. THE LETTER ================================ */
const Para = memo(function Para({ words, on, setRef }) {
  return (
    <p className="lp" ref={setRef}>
      {words.map((w, i) => <span key={i} className={`w${i < on ? " on" : ""}`}>{w} </span>)}
    </p>
  );
});

function LetterPaper({ onClose }) {
  const L = C.LETTER;
  const reduce = useReducedMotion();
  const paras = useMemo(() => L.paragraphs.map((p) => p.split(/\s+/)), [L.paragraphs]);
  const starts = useMemo(() => { let s = 0; return paras.map((p) => { const a = s; s += p.length; return a; }); }, [paras]);
  const total = starts.length ? starts[starts.length - 1] + paras[paras.length - 1].length : 0;
  const [shown, setShown] = useState(reduce ? total : 0);
  const refs = useRef([]);
  const userScrolled = useRef(false);
  const done = shown >= total;

  useEffect(() => {
    if (reduce) return;
    let iv;
    const start = setTimeout(() => {
      iv = setInterval(() => setShown((s) => { if (s + 1 >= total) clearInterval(iv); return Math.min(total, s + 1); }), L.speedMs || 85);
    }, 1100);
    return () => { clearTimeout(start); clearInterval(iv); };
  }, [reduce, total, L.speedMs]);

  const cur = Math.max(0, starts.findIndex((s, i) => shown >= s && shown < s + paras[i].length));
  useEffect(() => {
    if (!shown || userScrolled.current || done) return;
    refs.current[cur]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [cur, shown, done]);

  return (
    <motion.div className="paper-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} role="dialog" aria-modal="true" aria-label="Your letter">
      <button className="icon-btn paper-close" onClick={onClose} aria-label="Fold the letter back"><X size={22} /></button>
      {!done && (
        <button className="skip" onClick={() => setShown(total)}><FastForward size={18} /> Skip animation</button>
      )}
      <div className="paper-scroll" onWheel={() => (userScrolled.current = true)} onTouchMove={() => (userScrolled.current = true)}>
        <motion.article className="paper" initial={{ scale: 0.55, y: "28%", rotateX: 35, opacity: 0 }} animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
          exit={{ scale: 0.55, y: "30%", rotateX: 40, opacity: 0, transition: { duration: 0.55, ease: "easeIn" } }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
          <motion.h3 className="lp-greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>{L.greeting}</motion.h3>
          {paras.map((w, i) => (
            <Para key={i} words={w} on={Math.max(0, Math.min(w.length, shown - starts[i]))} setRef={(el) => (refs.current[i] = el)} />
          ))}
          <motion.div className="lp-sign" initial={{ opacity: 0, y: 10 }} animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 1 }}>
            <p>{L.signOff}</p>
            <p className="sig">{L.signature} <Heart size={22} fill="currentColor" /></p>
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  );
}

function Letter() {
  const [stage, setStage] = useState("closed"); // closed | opening | peek | reading | opened
  const [behind, setBehind] = useState(false);
  const up = stage === "peek" || stage === "reading" || stage === "opened";

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    heartBurst(false);
    setTimeout(() => setBehind(true), 380);
    setTimeout(() => setStage("peek"), 900);
    setTimeout(() => setStage("reading"), 2100);
  };

  return (
    <section id="letter" className="section letter-sec">
      <SectionHead eyebrow="Air mail" title={`For ${C.HER_NAME}`} sub={stage === "closed" ? "Tap the wax seal." : ""} />
      <motion.div className="env-wrap" initial={{ opacity: 0, y: 60, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <div className="env">
          <div className="env-back" />
          <motion.button className="env-paper" aria-label="Read the letter" tabIndex={stage === "opened" ? 0 : -1}
            onClick={() => stage === "opened" && setStage("reading")} initial={false}
            animate={{ y: up ? "-46%" : "0%" }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <span className="env-paper-text">{C.LETTER.greeting}</span>
            <span className="env-paper-lines" />
          </motion.button>
          <div className="env-front">
            <svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 200 L150 112 L300 200 M0 0 L150 112 L300 0" fill="none" stroke="rgba(120,85,50,.28)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="env-address"><span>To</span><b>{C.HER_NAME}</b><em>{C.FLIGHT.to.city} ↔ {C.FLIGHT.from.city}</em></div>
          </div>
          <motion.div className="env-flap" style={{ zIndex: behind ? 1 : 4 }} initial={false}
            animate={{ rotateX: stage === "closed" ? 0 : -180 }} transition={{ duration: 0.85, ease: "easeInOut" }}>
            <div className="flap-face out" /><div className="flap-face in" />
          </motion.div>
          <div className="stamp" aria-hidden="true">
            <div className="stamp-in"><PlaneIcon size={18} /><b>{C.FLIGHT.from.code} → {C.FLIGHT.to.code}</b><small>Air mail</small></div>
            <span className="postmark">{C.FLIGHT.from.code} · {C.FLIGHT.to.code}</span>
          </div>
          <AnimatePresence>
            {stage === "closed" && (
              <div className="seal-pos">
                <motion.button className="seal" onClick={open} aria-label="Break the wax seal and open the letter"
                  exit={{ scale: 1.6, opacity: 0, rotate: 25 }} transition={{ duration: 0.4 }} whileTap={{ scale: 0.9 }}>
                  <Heart size={26} fill="currentColor" />
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {stage === "opened" && <button className="btn-ghost" onClick={() => setStage("reading")}>Read it again</button>}
      <AnimatePresence>{stage === "reading" && <LetterPaper key="paper" onClose={() => setStage("opened")} />}</AnimatePresence>
    </section>
  );
}

/* ============================ 8. FINALE / FOOTER ============================ */
function Footer() {
  const now = useNow(1000);
  const target = new Date(C.NEXT_VISIT_DATE).getTime();
  const diff = target - now;
  const landed = diff <= 0;
  const parts = [
    ["Days", Math.floor(diff / DAY)],
    ["Hours", Math.floor((diff % DAY) / 3600000)],
    ["Minutes", Math.floor((diff % 3600000) / 60000)],
    ["Seconds", Math.floor((diff % 60000) / 1000)],
  ];
  const label = useMemo(() => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", dateStyle: "full" }).format(target), [target]);
  return (
    <footer id="finale" className="finale">
      <div className="floaters" aria-hidden="true">
        {FLOATERS.map((h, i) => (
          <span key={i} className={h.gold ? "gold" : ""} style={{ left: `${h.x}%`, fontSize: h.s, animationDelay: `${h.d}s`, animationDuration: `${h.t}s` }}>♥</span>
        ))}
      </div>
      <Reveal className="finale-inner">
        <p className="eyebrow">Next flight</p>
        <h2>{landed ? C.LANDED_MESSAGE : label}</h2>
        {!landed && (
          <div className="countdown" role="timer" aria-label="Countdown to the next visit">
            {parts.map(([l, v]) => (
              <div key={l} className="cd glass"><strong>{pad2(v)}</strong><span>{l}</span></div>
            ))}
          </div>
        )}
        <p className="finale-line">{C.FLIGHT.from.code} → {C.FLIGHT.to.code} · {C.FLIGHT.number}</p>
        <button className="btn-gold" onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" })}>
          <PlaneIcon size={18} style={{ transform: "rotate(-90deg)" }} /> Replay the journey
        </button>
        <p className="made">Made with love by {C.MY_NAME}</p>
      </Reveal>
    </footer>
  );
}

/* ================================ NAV & MUSIC ================================ */
const NAV = [
  { id: "home", label: "Home", Icon: Home },
  { id: "memories", label: "Memories", Icon: Images },
  { id: "log", label: "Flight log", Icon: Route },
  { id: "reasons", label: "Reasons", Icon: Heart },
  { id: "letter", label: "Letter", Icon: Mail },
];
function Nav({ letterReady }) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [letterReady]);
  return (
    <motion.nav className="nav glass" aria-label="Sections" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {NAV.map(({ id, label, Icon }) => (
        <button key={id} className={active === id ? "on" : ""} aria-label={label} title={label} aria-current={active === id ? "true" : undefined}
          onClick={() => scrollToId(id === "letter" && !letterReady ? "reasons" : id)}>
          <Icon size={21} />
        </button>
      ))}
    </motion.nav>
  );
}
function MusicButton({ playing, onToggle }) {
  return (
    <motion.button className={`music-btn glass${playing ? " playing" : ""}`} onClick={onToggle} aria-label={playing ? "Pause music" : "Play music"}
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}>
      {playing ? <Pause size={20} /> : <Music size={20} />}
    </motion.button>
  );
}

/* ================================== APP ================================== */
export default function App() {
  const [unlocked, setUnlocked] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; } });
  const [complete, setComplete] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [musicOk, setMusicOk] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Apply palette from config to CSS variables
  useEffect(() => {
    const r = document.documentElement.style;
    Object.entries(C.COLORS).forEach(([k, v]) => r.setProperty(`--${k}`, v));
  }, []);

  // Only show the music button if the mp3 really exists
  useEffect(() => {
    if (!C.MUSIC_FILE) return;
    let cancelled = false;
    fetch(C.MUSIC_FILE, { method: "HEAD" })
      .then((r) => { const t = r.headers.get("content-type") || ""; if (!cancelled) setMusicOk(r.ok && !/html|text/i.test(t)); })
      .catch(() => !cancelled && setMusicOk(false));
    return () => { cancelled = true; };
  }, []);

  // Called synchronously inside the password submit (a user gesture) so iOS Safari allows playback
  const startMusic = () => {
    const a = audioRef.current;
    if (!a || !C.MUSIC_FILE) return;
    a.volume = 0.6;
    const p = a.play();
    if (p && p.then) p.then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  const finishGate = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage blocked: fine */ }
    setUnlocked(true);
  };
  const onComplete = useCallback(() => setComplete(true), []);
  const onContinue = () => { setShowLetter(true); setTimeout(() => scrollToId("letter"), 150); };

  return (
    <div className="app">
      <Sky />
      {C.MUSIC_FILE && <audio ref={audioRef} src={C.MUSIC_FILE} loop preload="none" playsInline />}
      <AnimatePresence>
        {!unlocked && <PasswordGate key="gate" onSuccess={startMusic} onDone={finishGate} />}
      </AnimatePresence>

      {/* Main content is NOT in the DOM until the password is correct */}
      {unlocked && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
          <Hero />
          <FlightCounter />
          <MemoriesCarousel />
          <Timeline />
          <WhyILoveYou complete={complete} onComplete={onComplete} onContinue={onContinue} />
          {showLetter && <Letter />}
          <Footer />
          <Nav letterReady={showLetter} />
          {musicOk && <MusicButton playing={playing} onToggle={toggleMusic} />}
        </motion.main>
      )}
    </div>
  );
}