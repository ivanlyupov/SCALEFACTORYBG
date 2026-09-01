/* =============================================================
   MOTIONCRAFTBG — CONTENT FILE
   This is the ONLY file you edit to change what's on the site.
   No coding needed: change the text inside the quotes,
   add/remove items in the [ ... ] lists.
   After editing, the site rebuilds automatically on Vercel.
   ============================================================= */

export type VideoFormat = "vertical" | "wide"; // 9:16 or 16:9

export interface VideoItem {
  id: string;
  kind: string;        // small label, e.g. "AI UGC · 0:15"
  title: string;       // shown on the tile
  format: VideoFormat;
  videoUrl: string;    // Cloudflare R2 public .mp4 URL  OR  YouTube/Vimeo embed URL
  poster?: string;     // optional image URL; if empty, a gradient is used
}

export interface ProofItem {
  brand: string;
  role: string;        // e.g. "Компресивен наколенник · DTC"
  metricLabel: string; // e.g. "ROAS · Meta Ads · 30 дни"
  from: string;        // "1.4"
  to: string;          // "3.2"
  quote: string;
  avatar: string;      // one letter for the avatar badge
  beforeImg?: string;  // optional image URL for the "before" card
  afterImg?: string;   // optional image URL for the "after" card
}

/* ---------- SITE / BRAND ----------
   The studio name shown in the header logo, browser tab title,
   meta description and footer. */
export const site = {
  brandName: "MotionCraftBG",    // full name in the header + footer
  logoMark: "MC",                // 2–3 chars inside the little gradient square
  logoLead: "MotionCraft",       // first part of the wordmark (normal colour)
  logoAccent: "BG",              // second part of the wordmark (violet colour)
  // <title> tag + meta description (used for SEO / social previews)
  pageTitle: "MotionCraftBG — AI анимационни реклами за вашия бранд",
  metaDescription:
    "MotionCraftBG — AI анимационно студио. Правим анимационни реклами за eCommerce брандове: 3D карикатура, claymation, аниме, motion graphics. Готови за дни.",
  // top navigation links (label + the section id they scroll to)
  nav: [
    { label: "Стилове", href: "#services" },
    { label: "Работа", href: "#work" },
    { label: "Резултати", href: "#results" },
    { label: "Отзиви", href: "#proof" },
    { label: "Контакт", href: "#contact" },
  ],
  navCta: "Запази среща",
  // footer  (the money page /plans is linked here, away from the main funnel)
  footerLinks: [
    { label: "Стилове", href: "#services" },
    { label: "Работа", href: "#work" },
    { label: "Резултати", href: "#results" },
    { label: "Планове и цени", href: "/plans" },
    { label: "Контакт", href: "#contact" },
  ],
  footerCopyright: "© 2026 MotionCraftBG · AI анимационни реклами за eCommerce брандове",
};

/* TOGGLE: клиентският портал (/client) е изключен засега. Кодът стои непокътнат —
   сменете на true, когато решите да го пуснете за клиенти. */
export const enableClientPortal = false;

/* ---------- HERO ---------- */
export const hero = {
  eyebrow: "AI Animation Studio",
  title: "Анимации, които спират скрола и продават",
  highlight: "спират скрола", // this part gets the gradient
  lead:
    "Правим AI анимационни реклами за eCommerce брандове — от 3D карикатура до claymation. Без снимачен екип, без актьори, без чакане с месеци.",
  primaryCta: "Запази среща + безплатна анимация",
  secondaryCta: "Виж работата ни",
  // the small trust line under the hero buttons:
  trust: [
    "<b>3–5 дни</b> до готова реклама",
    '<span class="mono">9+</span> анимационни стила',
    "Без снимки · без актьори · без студио",
  ],
  // the 4 steps in the animated hero pipeline (title + small sub-label):
  pipeline: [
    { icon: "💡", title: "Идея", sub: "бриф · ъгъл · референции" },
    { icon: "✎", title: "Сценарий", sub: "hook · сториборд · кадри" },
    { icon: "🎬", title: "Анимация", sub: "стил · герои · движение" },
    { icon: "🚀", title: "Готова реклама", sub: "звук · субтитри · експорт" },
  ],
  // running labels shown at the bottom of the pipeline while it animates:
  pipelineLabels: [
    "бриф и избор на стил",
    "сценарий и сториборд",
    "генериране на анимацията",
    "звук, субтитри и експорт",
  ],
  pipelineBadge: "MotionCraft™", // product badge inside the pipeline panel
};

/* ---------- TRIAL OFFER (shown on the MotionCraft™ card) ---------- */
export const trial = {
  tag: "Пробен",
  text: "Първи месец 399€",
  strikethrough: "вместо 999€",
};

/* ---------- PRICING PLANS ----------
   ⚠ Прегледайте цените и обемите преди да пуснете реклами — това са
   стартови стойности, сменете ги с вашите реални условия. */
export const plans = [
  {
    name: "Starter",
    featured: false,
    desc: "За брандове, които искат първо да тестват дали анимацията работи за тях.",
    price: "399€",
    per: "/месец",
    meta: [
      ["Анимации", "до 4 / мес"],
      ["Стилове", "1 избран"],
      ["Срок за готова анимация", "5–7 дни"],
    ],
    cta: "Запази среща",
    features: [
      "4 анимации до 15 секунди",
      "1 анимационен стил по избор",
      "Сценарий и сториборд включени",
      "Вертикален формат (9:16) за Reels и TikTok",
      "1 кръг ревизии на анимация",
    ],
  },
  {
    name: "MotionCraft™",
    featured: true, // highlighted card + trial ribbon
    badge: "★ Най-предпочитан",
    desc: "Постоянен поток от анимации — достатъчно, за да тествате стилове и ъгли всяка седмица.",
    price: "999€",
    per: "/месец",
    meta: [
      ["Анимации", "до 12 / мес"],
      ["Стилове", "неограничени"],
      ["Срок за готова анимация", "3–5 дни"],
    ],
    cta: "Започни с пробен месец",
    features: [
      "12 анимации (микс от 15с и 30с)",
      "Всички стилове — 3D, claymation, аниме, motion graphics",
      "Вариации на печелившите анимации",
      "Hook варианти за всяка анимация",
      "Вертикален + хоризонтален формат",
      "2 кръга ревизии на анимация",
    ],
  },
  {
    name: "MotionCraft Elite™",
    featured: false,
    desc: "За брандове с активни кампании, които искат максимална скорост и обем.",
    price: "1999€",
    per: "/месец",
    meta: [
      ["Анимации", "до 25 / мес"],
      ["Стилове", "неограничени"],
      ["Срок за готова анимация", "48–72 часа"],
    ],
    cta: "Запази среща",
    features: [
      "Всичко от MotionCraft™",
      "Dedicated аниматор за вашия бранд",
      "Приоритетна изработка + бързи ревизии",
      "Дълги формати (VSL до 2 минути)",
      "Консистентни герои и свят на бранда",
      "Седмична среща и creative roadmap",
    ],
  },
];

/* ---------- COST COMPARISON TABLE ---------- */
export const costTable = {
  // the little header labels above the three columns
  colService: "Услуга",
  colMarket: "Пазарна цена",
  colOurs: "MotionCraft™",
  includedLabel: "включено",
  rows: [
    ["Анимация до 15 секунди", "150€"],
    ["Анимация до 30 секунди", "250€"],
    ["Анимиран VSL до 2 минути", "600€"],
    ["Сценарий и сториборд", "80€"],
    ["Дизайн на герои", "120€"],
    ["Озвучаване и субтитри", "50€"],
    ["Ревизии и вариации", "—"],
    ["Консултация за стил", "—"],
  ],
  separateLabel: "// ако поръчвате поотделно",
  separateTotal: "≈ 1 800€ – 2 400€ / месец",
  ourLabel: "// с MotionCraft™",
  ourPrice: "999€",
  ourPer: "/ месец",
  saveNote: "↓ Спестявате стотици евро + седмици чакане всеки месец",
};

/* ---------- WITH / WITHOUT ---------- */
export const withWithout = {
  withoutTitle: "Класическа продукция",
  withTitle: "С MotionCraft",
  without: [
    "Плащате за студио, оператор, актьори и локация",
    "Чакате седмици за едно единствено видео",
    "Всяка малка промяна значи ново снимане",
    "Ограничени сте до това, което може да се заснеме",
    "Твърде скъпо е да тествате повече от 1–2 идеи",
  ],
  with: [
    "Един бриф — готова анимация, без снимачен ден",
    "Първите кадри за дни, не за месеци",
    "Промените са бързи и не струват ново производство",
    "Всичко е възможно — герои, светове, невъзможни кадри",
    "Тествате много различни стилове и ъгли с малък бюджет",
  ],
};

/* ---------- ANIMATION STYLES ----------
   The cards in the "Стилове" section on the landing page.
   icon = a short symbol shown in the card (emoji or 1–2 chars).
   To add a style: copy one { ... } line and edit it. */
export const services = {
  eyebrow: "Стилове",
  title: "Всеки стил. Един екип.",
  text: "Избирате визията — ние я произвеждаме. Един бранд може да тества няколко стила, докато намери своя.",
  items: [
    { icon: "🧸", title: "3D карикатура (Pixar-стил)", desc: "Топли, симпатични герои с кинематографично осветление — стилът, който разтапя аудиторията и работи за всяка възраст." },
    { icon: "🎨", title: "Claymation", desc: "Пластилинова естетика с ръчна, тактилна текстура — изпъква мигновено между стандартните реклами във фийда." },
    { icon: "⛩", title: "Аниме / Manga", desc: "Динамични кадри, изразителни герои и силни емоции — идеален за млада аудитория и продукти с характер." },
    { icon: "▶", title: "2D Motion Graphics", desc: "Чисти форми, текст и икони в движение — най-бързият начин да обясните продукт или оферта за 15 секунди." },
    { icon: "🎞", title: "Stop-motion", desc: "Кадър по кадър усещане, което изглежда ръчно направено — премиум и занаятчийско излъчване." },
    { icon: "✂", title: "Papercut / хартия", desc: "Изрязани хартиени слоеве и меки сенки — топъл, разказвачески стил за история на бранда." },
    { icon: "💎", title: "Реалистично 3D / CGI", desc: "Фотореалистичен продукт от всеки ъгъл — без фотограф, без студио, без ограничения на локацията." },
    { icon: "✏", title: "Whiteboard / скици", desc: "Рисувано обяснение стъпка по стъпка — работи силно за услуги, сложни продукти и образователни ъгли." },
    { icon: "👾", title: "Retro / Pixel art", desc: "Носталгична 8-bit естетика — рязък pattern interrupt, който спира палеца незабавно." },
  ],
};

/* ---------- REAL RESULTS (Meta Ads screenshots) ----------
   The "Реални резултати" section. Each shot = one screenshot from
   Meta Ads Manager with real numbers.
   HOW TO ADD A SCREENSHOT:
   1. Upload the image to Cloudflare R2 (same as videos) or put it in
      the project's /public folder (e.g. public/results/roas1.png).
   2. Paste the URL into img: "https://pub-XXXX.r2.dev/roas1.png"
      (or "/results/roas1.png" if it's in /public).
   Until img is filled, the card shows a placeholder gradient. */
export const results = {
  eyebrow: "Реални резултати",
  title: "Числата от Meta Ads — без филтри",
  text: "Скрийншоти директно от рекламните акаунти, с които работим.",
  shots: [
    // paste the R2 image URL into img: for each. IMPORTANT: metric/caption are
    // separate text — keep them matching what the screenshot actually shows.
    { id: "r1", img: "https://pub-2f13cd1103c147fb8dd6e3b3bf4c614b.r2.dev/results%20for%20motioncraft.png", metric: "ROAS 5.70", caption: "Purchase ROAS · от една реклама" },
    { id: "r2", img: "https://pub-2f13cd1103c147fb8dd6e3b3bf4c614b.r2.dev/results%202%20motioncraft.png", metric: "$11 522", caption: "Приход от една реклама · 350 покупки" },
    { id: "r3", img: "https://pub-2f13cd1103c147fb8dd6e3b3bf4c614b.r2.dev/results%203%20motioncr.png", metric: "299 покупки", caption: "От една реклама · $6.84 на покупка" },
  ],
  tagline: "",
};

/* ---------- VIDEO REEL ----------
   To add a video: copy one { ... } block, paste a Cloudflare R2
   .mp4 link (or YouTube/Vimeo embed link) into videoUrl, and edit
   the labels. Delete a block to remove a video.

   videoUrl accepts EITHER:
     • a public Cloudflare R2 .mp4 URL, e.g.
       "https://pub-xxxxxxxx.r2.dev/contour-hook-a.mp4"   ← paste yours here
     • a YouTube/Vimeo EMBED URL, e.g.
       "https://www.youtube.com/embed/ScMzIvxBSi4"
   format: "vertical" = 9:16 tile,  "wide" = 16:9 tile (spans 2 columns). */
const R2 = "https://pub-2f13cd1103c147fb8dd6e3b3bf4c614b.r2.dev";
export const reel: VideoItem[] = [
  // kind = the small label shown on the tile. To swap a video, upload the new
  // file to R2 and paste its public URL into videoUrl below.
  { id: "v1", kind: "Claymation", title: "", format: "vertical", videoUrl: `${R2}/momiche%20baba%20bez%20subs%20claymation.mp4` },
  { id: "v2", kind: "Pixar стил", title: "", format: "vertical", videoUrl: `${R2}/serum%20interview%20gotow%20creative.mp4` },
  { id: "v3", kind: "AI анимация", title: "", format: "vertical", videoUrl: `${R2}/pletenichko%20animation%20creative.mp4` },
  { id: "v4", kind: "Scroll stopper", title: "", format: "vertical", videoUrl: `${R2}/bikini%20zpna%20za%20porfolio.mp4` },
];
// Small caption under the reel (leave empty for none):
export const reelTagline = "";

/* ---------- PROOF CAROUSEL ----------
   Replace these sample results with real client data + before/after images.
   TOGGLE: set showProof to false to temporarily HIDE the "Творчество, което
   движи числата" section on the landing page (nothing is deleted — flip back
   to true to show it again). */
export const showProof = false;

/* ⚠ Това са ПРИМЕРНИ отзиви от шаблона — заменете ги с реални, преди да
   покажете секцията (showProof = true). Не публикувайте измислени отзиви. */
export const proof: ProofItem[] = [
  {
    brand: "Примерен бранд 1", role: "Категория · DTC",
    metricLabel: "ROAS · Meta Ads · 30 дни", from: "1.4", to: "3.2", avatar: "П",
    quote: "Заменете с реален отзив от клиент.",
  },
  {
    brand: "Примерен бранд 2", role: "Категория · eCommerce",
    metricLabel: "CPA · 6 седмици", from: "18.90лв", to: "9.40лв", avatar: "П",
    quote: "Заменете с реален отзив от клиент.",
  },
  {
    brand: "Примерен бранд 3", role: "Категория · DTC",
    metricLabel: "CTR · winning creative", from: "0.9%", to: "2.7%", avatar: "П",
    quote: "Заменете с реален отзив от клиент.",
  },
];
// Small caption under the carousel (leave empty for none):
export const proofTagline = "";

/* ---------- ONBOARDING (/onboarding) ----------
   The questionnaire new clients fill in ONCE so the team can start
   production. The steps map 1:1 to the internal brand_identity.md
   file — in /admin every submission can be copied out as a ready
   brand identity markdown with one click.
   Edit freely: change wording, add/remove questions, reorder steps.
   Each field: id (unique, don't reuse — the md export depends on it),
   label (the question), hint (placeholder example),
   type ("text" or "textarea"), required (true/false). */
export const onboarding = {
  title: "Да започваме!",
  intro:
    "Попълвате този въпросник само веднъж — и екипът ни получава всичко необходимо, за да произвежда рекламите от вашия пакет без безкрайни въпроси напред-назад. Отнема 15–20 минути. Ако не знаете отговор, напишете „нямаме още“ или пропуснете — никога не си измисляйте.",
  submitLabel: "Изпрати и стартирай процеса",
  successTitle: "Готово! Получихме информацията.",
  successText:
    "Екипът ни ще я прегледа и ще се свържем с вас до 1 работен ден с първите стъпки и творческата посока.",
  steps: [
    {
      title: "За бранда",
      desc: "Кои сте вие и как изглежда/звучи брандът.",
      fields: [
        { id: "contact_name", label: "Вашето име (контакт по проекта)", hint: "Иван Петров", type: "text", required: true },
        { id: "email", label: "Имейл за връзка", hint: "ivan@brand.com", type: "text", required: true },
        { id: "brand", label: "Име на бранда", hint: "Име на вашата марка", type: "text", required: true },
        { id: "reference_images", label: "Лого и/или референтни снимки на продукта/опаковката (файлове или линкове)", hint: "Google Drive / Dropbox линк с достъп за преглед", type: "textarea", required: true },
        { id: "colors_primary", label: "Основни цветове на бранда (HEX кодове, ако имате — иначе снимка на опаковка/лого е достатъчна)", hint: "#F4D7C3, #2E2A26 — или „вижте снимките в папката“", type: "text", required: false },
        { id: "tone_adjectives", label: "С три до пет думи — какъв е тонът на бранда и как искате да звучи? (напр. „топъл“, „директен“, „научно обоснован“, „забавен“, „луксозен“)", hint: "Топъл · директен · научно обоснован", type: "text", required: false },
        { id: "website", label: "Официален уебсайт", hint: "https://вашата-марка.bg", type: "text", required: true },
      ],
    },
    {
      title: "За продукта",
      desc: "Какво продавате и при какви условия.",
      fields: [
        { id: "products", label: "Какво точно продавате? (продукт, кратко описание)", hint: "Кратко: какво е и за какво служи", type: "textarea", required: true },
        { id: "category", label: "В коя категория попада продуктът?", hint: "Козметика / хранителни добавки / аксесоари / дом / мода…", type: "text", required: true },
        { id: "problem_solved", label: "Какъв проблем решава продуктът за клиента?", hint: "Кой конкретен проблем изчезва, когато клиентът го използва", type: "textarea", required: true },
        { id: "core_offer", label: "Какви основни оферти има продуктът в момента? (количество, бонус артикул, безплатна доставка и т.н.)", hint: "Напр. пакет 2+1 · безплатна доставка над определена сума", type: "textarea", required: true },
        { id: "guarantee", label: "Предлагате ли гаранция за връщане на парите? Ако да — точните условия (брой дни, пълна/частична, какво трябва да направи клиентът)", hint: "Напр. 30 дни, пълна сума, какво трябва да направи клиентът", type: "textarea", required: false },
      ],
    },
    {
      title: "Аудитории",
      desc: "Кой купува — колкото по-конкретно, толкова по-добре.",
      fields: [
        { id: "persona_who", label: "Основна персона — кой е основният ви клиент? (възраст, пол, житейска ситуация — колкото по-конкретно, толкова по-добре)", hint: "Напр. жени 30–50, работещи, купуват онлайн от телефона си", type: "textarea", required: true },
        { id: "persona_fears", label: "Основна персона — от какво се страхува/притеснява във връзка с проблема, който решавате?", hint: "Че пак ще похарчи пари за нещо, което няма да свърши работа", type: "textarea", required: false },
        { id: "persona_wants", label: "Основна персона — какво тайно иска, какъв е крайният резултат, за който мечтае?", hint: "Крайният резултат, за който наистина плаща — не самия продукт", type: "textarea", required: false },
        { id: "persona_attention", label: "Основна персона — къде прекарва времето си онлайн? (Facebook, Instagram, TikTok)", hint: "Instagram Reels · TikTok · Facebook групи", type: "textarea", required: false },
        { id: "persona_secondary", label: "Вторична персона (ако има) — същите въпроси: кой е, от какво се страхува, какво иска, къде прекарва внимание", hint: "Ако има втора група купувачи — опишете я накратко по същите точки", type: "textarea", required: false },
        { id: "persona_tried", label: "Какво вече е пробвала аудиторията, преди да стигне до вас, и защо не е проработило?", hint: "Какви други решения е пробвал(а) и защо не са свършили работа", type: "textarea", required: false },
      ],
    },
    {
      title: "Реални отзиви от клиенти",
      desc: "Истинските думи на клиентите — най-ценният материал за рекламите.",
      fields: [
        { id: "reviews_raw", label: "Можете ли да ни изпратите всички реални отзиви от клиенти, описващи техния опит с вашия продукт? (export на всички отзиви за продукта в csv. Прикачете линк към файл в Google Drive/Dropbox)", hint: "drive.google.com/... — reviews.csv", type: "textarea", required: false },
        { id: "complaints", label: "Какви оплаквания получавате най-често след покупка?", hint: "Напр. „бавна доставка“ · „исках по-голям размер“ · въпрос за употреба", type: "textarea", required: false },
        { id: "outcomes_quotes", label: "Какви са 2-3-те най-чести неща, които клиентите казват след успешна употреба? („най-накрая мога да...“, „вече не се налага да...“)", hint: "„Най-накрая мога да…“ · „Вече не се налага да…“", type: "textarea", required: false },
        { id: "success_definition", label: "Как изглежда „успехът“ от гледна точка на клиента, с негови думи?", hint: "Опишете „успеха“ с думите на клиента", type: "textarea", required: false },
        { id: "stats", label: "Имате ли обобщени данни — брой клиенти, среден рейтинг, брой продадени бройки? Посочете точните цифри.", hint: "Напр. 2400 клиенти · 4.8★ от 512 отзива", type: "textarea", required: false },
        { id: "clinical", label: "Има ли клинично/научно обосноваване на продукта? Ако да — какво точно е?", hint: "Напр. независим тест — X% забелязват резултат (само ако наистина съществува)", type: "textarea", required: false },
        { id: "authority", label: "Има ли експертна/авторитетна подкрепа (лекар, специалист, институция)?", hint: "Напр. препоръчван от специалист/институция — кой точно", type: "textarea", required: false },
      ],
    },
    {
      title: "Guardrails / compliance",
      desc: "Критично важно — какво никога не бива да се казва в рекламите ви.",
      fields: [
        { id: "forbidden_words", label: "Има ли думи/фрази, които никога не искате да се използват във вашата реклама?", hint: "Без „евтино“ · без „чудо“ · не съкращаваме името на бранда", type: "textarea", required: false },
        { id: "disclaimers", label: "Има ли задължителен дисклеймър, който трябва да присъства във всяка реклама? (напр. „Хранителна добавка. Не е лекарство.“)", hint: "„Резултатите варират при различните хора“", type: "textarea", required: false },
        { id: "banned_claims", label: "Има ли твърдения, които НИКОГА не трябва да се правят за продукта ви (напр. „лекува“, „гарантирано“, „помага при“)? Особено важно за здравни продукти — моля бъдете максимално изчерпателни.", hint: "Не може: „лекува“, „премахва завинаги“, „гарантиран резултат“, медицински претенции", type: "textarea", required: false },
        { id: "tone_rules", label: "Има ли тон или стил, който категорично не искате? (напр. прекалено агресивен, прекалено сензационен, прекалено неформален)", hint: "Без страх-маркетинг · без засрамване · без крещящи главни букви", type: "textarea", required: false },
      ],
    },
    {
      title: "Реклами",
      desc: "Последна стъпка — кое е работило досега, за да го надградим.",
      fields: [
        { id: "winning_formats", label: "Какви формати реклами са работили най-добре за вас досега? (статични изображения, UGC видео, VSL, advertorial и т.н. — изредете всички релевантни)", hint: "UGC видео с реален отзив · карусел преди/след", type: "textarea", required: false },
        { id: "winning_format_links", label: "За най-успешните реклами — линк/файл с креатива и резултатите му (CTR, CPA, ROAS, брой продажби — каквито метрики имате). Може да го направите в Docs.", hint: "docs.google.com/... — UGC видео, ROAS 2.9, CPA 18лв", type: "textarea", required: false },
        { id: "past_winning_ads", label: "Имате ли реклами от миналото, които са работили особено добре извън изредените по-горе формати? Можете ли да ги споделите (линк)?", hint: "Реклама от 2024 с основателката — линк към Meta Ads Library", type: "textarea", required: false },
        { id: "winning_hooks", label: "Има ли конкретни хукове/ъгли/съобщения, които вече знаете, че работят?", hint: "Напр. конкретен hook или ъгъл, който вече е носил продажби", type: "textarea", required: false },
      ],
    },
  ],
};

/* ---------- CONTACT / FOOTER ----------
   The main landing CTA: book a meeting + get a free animation.
   "highlight" is the part of the title that gets the gradient. */
export const contact = {
  title: "Запази среща и получи безплатна анимация за твоя бранд",
  highlight: "безплатна анимация",
  text: "30-минутен разговор, в който разглеждаме продукта ви и избираме стила, който би му паснал. Преди срещата правим една анимация с вашия продукт — без ангажимент, оставате с нея така или иначе.",
  bullets: [
    "1 готова анимация с вашия продукт — ваша е, каквото и да решите",
    "Препоръка кой стил пасва на бранда и аудиторията ви",
    "Ясен план какво бихме пуснали първо и колко бързо",
  ],
  namePlaceholder: "Име",
  brandPlaceholder: "Бранд / уебсайт",
  emailPlaceholder: "Имейл",
  messagePlaceholder: "Разкажете накратко за продукта си",
  submit: "Запази среща + безплатна анимация",
  sending: "Изпращане…",
  formNote: "// без ангажимент · отговаряме до 1 работен ден",
  successMsg: "✓ Готово! Ще се свържем до 1 работен ден, за да насрочим срещата и да започнем анимацията ви.",
  errorMsg: "Нещо се обърка. Опитайте пак или ни пишете директно.",
};

/* ---------- PLANS PAGE (/plans) ----------
   The separate money page: pricing tiers + cost table live there.
   This is only the page's header copy — plans/trial/costTable above
   are rendered on it unchanged. */
export const plansPage = {
  eyebrow: "Планове и цени",
  title: "Изберете правилния пакет анимации",
  text: "Три пакета за всеки етап — от първи тест до постоянен поток от анимации всяка седмица.",
  ctaTitle: "Не сте сигурни кой пакет е за вас?",
  ctaText: "Запазете среща — ще ви покажем кой стил пасва на бранда ви и ще получите безплатна анимация.",
  ctaButton: "Запази среща + безплатна анимация",
};
