/* =============================================================
   SCALEFACTORYBG — CONTENT FILE
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
   The agency name shown in the header logo, browser tab title,
   meta description and footer. (The plan names below are separate
   product names and are intentionally left as-is.) */
export const site = {
  brandName: "ScaleFactoryBG",   // full name in the header + footer
  logoMark: "SF",                // 2–3 chars inside the little gradient square
  logoLead: "ScaleFactory",      // first part of the wordmark (normal colour)
  logoAccent: "BG",              // second part of the wordmark (violet colour)
  // <title> tag + meta description (used for SEO / social previews)
  pageTitle: "ScaleFactoryBG — Creative Partner за вашия eCommerce бранд",
  metaDescription:
    "ScaleFactoryBG — вашият външен Creative Team за eCommerce растеж. UGC, AI UGC, VSL и статични реклами всяка седмица.",
  // top navigation links (label + the section id they scroll to)
  nav: [
    { label: "Планове", href: "#pricing" },
    { label: "Сметка", href: "#calc" },
    { label: "Работа", href: "#work" },
    { label: "Резултати", href: "#proof" },
    { label: "Контакт", href: "#contact" },
  ],
  navCta: "Безплатна консултация",
  // footer
  footerLinks: [
    { label: "Планове", href: "#pricing" },
    { label: "Работа", href: "#work" },
    { label: "Резултати", href: "#proof" },
    { label: "Контакт", href: "#contact" },
  ],
  footerCopyright: "© 2026 ScaleFactoryBG · Creative Partner за eCommerce брандове",
};

/* ---------- HERO ---------- */
export const hero = {
  eyebrow: "Creative Operating System",
  title: "Вашият външен Creative Team за eCommerce растеж",
  highlight: "Creative Team", // this part gets the gradient
  lead:
    "Независимо дали тепърва започвате да аутсорсвате creative процеса, или искате напълно да го поемем — имаме решение за всеки етап от растежа ви.",
  primaryCta: "Запази безплатна консултация",
  secondaryCta: "Разгледай процеса",
  // the small trust line under the hero buttons:
  trust: [
    "<b>50–90ч</b> спестено време / месец",
    '<span class="mono">≈5</span> нови теста седмично',
    "UGC · AI UGC · VSL · Статични",
  ],
  // the 4 steps in the animated hero pipeline (title + small sub-label):
  pipeline: [
    { icon: "🔍", title: "Проучване", sub: "hooks · angles · конкуренти" },
    { icon: "✎", title: "Концепция", sub: "scripts · brief · сториборд" },
    { icon: "▶", title: "Продукция", sub: "UGC · AI UGC · VSL · монтаж" },
    { icon: "📈", title: "Тест", sub: "launch · измерване · winners" },
  ],
  // running labels shown at the bottom of the pipeline while it animates:
  pipelineLabels: [
    "проучване на hooks & angles",
    "писане на scripts & brief",
    "продукция на UGC / AI / VSL",
    "launch & измерване на winners",
  ],
  pipelineBadge: "CreativeOS™", // product badge inside the pipeline panel
};

/* ---------- TRIAL OFFER (shown on the CreativeOS™ card) ---------- */
export const trial = {
  tag: "Пробен",
  text: "Първи месец 399€",
  strikethrough: "вместо 999€",
};

/* ---------- PRICING PLANS ---------- */
export const plans = [
  {
    name: "Starter",
    featured: false,
    desc: "Идеален за брандове, които тепърва започват да аутсорсват creative процеса си.",
    price: "399€",
    per: "/месец",
    meta: [
      ["Creative Assets", "до 8 / мес"],
      ["Рекламни тестове", "≈2 / седм."],
      ["Спестено време", "20–35ч / мес"],
    ],
    cta: "Запази консултация",
    features: [
      "1 реално UGC видео",
      "AI UGC до 15 секунди",
      "Монтаж на съществуващи видеа",
      "Статични банери",
      "Основен research + hooks",
    ],
  },
  {
    name: "CreativeOS™",
    featured: true, // highlighted card + trial ribbon
    badge: "★ Най-предпочитан",
    desc: "Вашият външен Creative Team — готов процес, който всяка седмица доставя нови реклами за тестване.",
    price: "999€",
    per: "/месец",
    meta: [
      ["Creative Assets", "до 20 / мес"],
      ["Рекламни тестове", "≈5 / седм."],
      ["Спестено време", "50–90ч / мес"],
    ],
    cta: "Започни с пробен месец",
    features: [
      "3 реални UGC + 3 AI UGC (до 30с) + 5 AI UGC (до 15с)",
      "2 VSL видеа до 2 мин (всяко с 3 hooks)",
      "Вариации на Winner Creatives",
      "Research на hooks, angles + Meta Ads Library",
      "Анализ на конкуренти + Creative Strategy",
      "Creative Dashboard + Brief System",
    ],
  },
  {
    name: "CreativeOS Elite™",
    featured: false,
    desc: "За брандове, които искат максимална скорост и dedicated creative партньор.",
    price: "1999€",
    per: "/месец",
    meta: [
      ["Creative Assets", "до 40 / мес"],
      ["Рекламни тестове", "≈10 / седм."],
      ["Спестено време", "100+ч / мес"],
    ],
    cta: "Запази консултация",
    features: [
      "Всичко от CreativeOS™",
      "Dedicated Creative Strategist",
      "Приоритетна изработка + ревизии",
      "Седмична стратегия среща",
      "Анализ на Landing Page + оферти",
      "Creative Roadmap + Emergency Requests",
    ],
  },
];

/* ---------- COST COMPARISON TABLE ---------- */
export const costTable = {
  // the little header labels above the three columns
  colService: "Услуга",
  colMarket: "Пазарна цена",
  colOurs: "CreativeOS™",
  includedLabel: "включено",
  rows: [
    ["AI UGC видео", "60€"],
    ["Реално UGC видео", "100€"],
    ["VSL до 2 минути", "180€"],
    ["Editing", "30€"],
    ["Статичен банер", "25€"],
    ["Research (hooks · angles · Meta Ads)", "—"],
    ["Competitor research + Strategy", "—"],
    ["Creative Dashboard", "—"],
  ],
  separateLabel: "// ако поръчвате поотделно",
  separateTotal: "≈ 1 400€ – 1 700€ / месец",
  ourLabel: "// с CreativeOS™",
  ourPrice: "999€",
  ourPer: "/ месец",
  saveNote: "↓ Спестявате стотици евро + десетки часове всеки месец",
};

/* ---------- WITH / WITHOUT ---------- */
export const withWithout = {
  withoutTitle: "Без CreativeOS",
  withTitle: "С CreativeOS",
  without: [
    "Търсите UGC създатели и координирате монтажисти",
    "Пишете сценарии и правите AI реклами",
    "Следите конкуренти и Meta Ads Library",
    "Организирате файлове и измисляте hooks и angles",
    "Губите между 50–90 часа всеки месец",
  ],
  with: [
    "Един бриф, един екип, един процес",
    "Ние правим research и измисляме концепциите",
    "Ние създаваме рекламите — UGC, AI и монтаж",
    "Всяка седмица получавате готови реклами за тестване",
    "Вие се концентрирате върху растежа на бизнеса",
  ],
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
export const reel: VideoItem[] = [
  { id: "v1", kind: "AI UGC · 0:15", title: "Contour Pillow — Hook A", format: "vertical", videoUrl: "PASTE_R2_MP4_URL_HERE" },
  { id: "v2", kind: "VSL · 1:40", title: "FlexiKnee — Problem/Solution", format: "wide", videoUrl: "PASTE_R2_MP4_URL_HERE" },
  { id: "v3", kind: "Реално UGC · 0:22", title: "Skincare — Testimonial", format: "vertical", videoUrl: "PASTE_R2_MP4_URL_HERE" },
  { id: "v4", kind: "AI UGC · 0:30", title: "Supplements — Unboxing", format: "vertical", videoUrl: "PASTE_R2_MP4_URL_HERE" },
  { id: "v5", kind: "Статичен · банер", title: "Honey — Promo set", format: "vertical", videoUrl: "PASTE_R2_MP4_URL_HERE" },
  { id: "v6", kind: "VSL · 2:00", title: "Pet care — Founder story", format: "wide", videoUrl: "PASTE_R2_MP4_URL_HERE" },
];
// Small caption under the reel (change or clear once you add real videos):
export const reelTagline = "// заместващи видеа — сменете videoUrl с вашите Cloudflare R2 / YouTube линкове";

/* ---------- PROOF CAROUSEL ----------
   Replace these sample results with real client data + before/after images. */
export const proof: ProofItem[] = [
  {
    brand: "NervoFix — FlexiKnee", role: "Компресивен наколенник · DTC",
    metricLabel: "ROAS · Meta Ads · 30 дни", from: "1.4", to: "3.2", avatar: "Н",
    quote: "За месец сменихме статичните реклами с UGC ъгли от CreativeOS. Тестовете се утроиха, а cost per purchase падна с 41%.",
  },
  {
    brand: "Contour Sleep", role: "Мемори възглавници · eCommerce",
    metricLabel: "CPA · 6 седмици", from: "18.90лв", to: "9.40лв", avatar: "К",
    quote: "Всяка седмица идваха нови hooks за тестване. Най-сетне имаме процес, а не хаос от файлове и фрийлансъри.",
  },
  {
    brand: "BioGlow Cosmetics", role: "Натурална козметика · DTC",
    metricLabel: "CTR · winning creative", from: "0.9%", to: "2.7%", avatar: "B",
    quote: "AI UGC на български звучи естествено и се произвежда бързо. Мащабираме тестовете, без да наемаме екип.",
  },
];
// Small caption under the carousel:
export const proofTagline = "// примерни резултати — заменете с реални данни и before/after кадри";

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
        { id: "brand", label: "Име на бранда", hint: "Veloura", type: "text", required: true },
        { id: "reference_images", label: "Лого и/или референтни снимки на продукта/опаковката (файлове или линкове)", hint: "Google Drive / Dropbox линк с достъп за преглед", type: "textarea", required: true },
        { id: "colors_primary", label: "Основни цветове на бранда (HEX кодове, ако имате — иначе снимка на опаковка/лого е достатъчна)", hint: "#F4D7C3, #2E2A26 — или „вижте снимките в папката“", type: "text", required: false },
        { id: "tone_adjectives", label: "С три до пет думи — какъв е тонът на бранда и как искате да звучи? (напр. „топъл“, „директен“, „научно обоснован“, „забавен“, „луксозен“)", hint: "Топъл · директен · научно обоснован", type: "text", required: false },
        { id: "website", label: "Официален уебсайт", hint: "https://veloura.bg", type: "text", required: true },
      ],
    },
    {
      title: "За продукта",
      desc: "Какво продавате и при какви условия.",
      fields: [
        { id: "products", label: "Какво точно продавате? (продукт, кратко описание)", hint: "Крем против стрии 150мл — видим резултат за 30 дни", type: "textarea", required: true },
        { id: "category", label: "В коя категория попада продуктът?", hint: "Козметика / хранителни добавки / аксесоари за сън…", type: "text", required: true },
        { id: "problem_solved", label: "Какъв проблем решава продуктът за клиента?", hint: "Видимо намалява стрии след бременност без скъпи процедури", type: "textarea", required: true },
        { id: "core_offer", label: "Какви основни оферти има продуктът в момента? (количество, бонус артикул, безплатна доставка и т.н.)", hint: "49лв · пакет 2+1 · безплатна доставка над 60лв", type: "textarea", required: true },
        { id: "guarantee", label: "Предлагате ли гаранция за връщане на парите? Ако да — точните условия (брой дни, пълна/частична, какво трябва да направи клиентът)", hint: "30 дни, пълна сума, клиентът връща опаковката с еконт за наша сметка", type: "textarea", required: false },
      ],
    },
    {
      title: "Аудитории",
      desc: "Кой купува — колкото по-конкретно, толкова по-добре.",
      fields: [
        { id: "persona_who", label: "Основна персона — кой е основният ви клиент? (възраст, пол, житейска ситуация — колкото по-конкретно, толкова по-добре)", hint: "Жени 28–45, майки след бременност, работещи, купуват от Instagram", type: "textarea", required: true },
        { id: "persona_fears", label: "Основна персона — от какво се страхува/притеснява във връзка с проблема, който решавате?", hint: "Че пак ще даде пари за нещо, което не работи · че е „химия“", type: "textarea", required: false },
        { id: "persona_wants", label: "Основна персона — какво тайно иска, какъв е крайният резултат, за който мечтае?", hint: "Да се чувства уверена по бански, без да крие корема си", type: "textarea", required: false },
        { id: "persona_attention", label: "Основна персона — къде прекарва времето си онлайн? (Facebook, Instagram, TikTok)", hint: "Instagram Reels · TikTok · Facebook групи", type: "textarea", required: false },
        { id: "persona_secondary", label: "Вторична персона (ако има) — същите въпроси: кой е, от какво се страхува, какво иска, къде прекарва внимание", hint: "Фитнес дами 20–30 след отслабване — страх от отпусната кожа — TikTok", type: "textarea", required: false },
        { id: "persona_tried", label: "Какво вече е пробвала аудиторията, преди да стигне до вас, и защо не е проработило?", hint: "Bio Oil и домашни масла — бавен/никакъв ефект · процедури — твърде скъпи", type: "textarea", required: false },
      ],
    },
    {
      title: "Реални отзиви от клиенти",
      desc: "Истинските думи на клиентите — най-ценният материал за рекламите.",
      fields: [
        { id: "reviews_raw", label: "Можете ли да ни изпратите всички реални отзиви от клиенти, описващи техния опит с вашия продукт? (export на всички отзиви за продукта в csv. Прикачете линк към файл в Google Drive/Dropbox)", hint: "drive.google.com/... — reviews.csv", type: "textarea", required: false },
        { id: "complaints", label: "Какви оплаквания получавате най-често след покупка?", hint: "„Мирише силно“ · „Искам по-голяма разфасовка“ · бавна доставка", type: "textarea", required: false },
        { id: "outcomes_quotes", label: "Какви са 2-3-те най-чести неща, които клиентите казват след успешна употреба? („най-накрая мога да...“, „вече не се налага да...“)", hint: "„Най-накрая се снимах по бански“ · „Вече не крия корема си“", type: "textarea", required: false },
        { id: "success_definition", label: "Как изглежда „успехът“ от гледна точка на клиента, с негови думи?", hint: "„Гладка кожа без следи — все едно не съм раждала“", type: "textarea", required: false },
        { id: "stats", label: "Имате ли обобщени данни — брой клиенти, среден рейтинг, брой продадени бройки? Посочете точните цифри.", hint: "2400 клиентки · 4.8★ от 512 отзива", type: "textarea", required: false },
        { id: "clinical", label: "Има ли клинично/научно обосноваване на продукта? Ако да — какво точно е?", hint: "Дерматологичен тест 2024 — 87% видим ефект", type: "textarea", required: false },
        { id: "authority", label: "Има ли експертна/авторитетна подкрепа (лекар, специалист, институция)?", hint: "Д-р Иванова, дерматолог с 15г опит", type: "textarea", required: false },
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
        { id: "winning_hooks", label: "Има ли конкретни хукове/ъгли/съобщения, които вече знаете, че работят?", hint: "„3-те грешки при стриите“ · отзивът на Деси като hook", type: "textarea", required: false },
      ],
    },
  ],
};

/* ---------- CONTACT / FOOTER ---------- */
export const contact = {
  title: "Спрете да управлявате creative процеса. Започнете да растете.",
  text: "Оставете данните си и ще се свържем за безплатна консултация — ще ви покажем как изглежда първата седмица с CreativeOS и как работи пробният месец от 399€.",
  namePlaceholder: "Име",
  brandPlaceholder: "Бранд / уебсайт",
  emailPlaceholder: "Имейл",
  messagePlaceholder: "Разкажете накратко за продукта си",
  submit: "Запази безплатна консултация",
  sending: "Изпращане…",
  formNote: "// данните се изпращат сигурно и се съхраняват само за да се свържем с вас",
  successMsg: "✓ Благодарим! Ще се свържем с вас възможно най-скоро.",
  errorMsg: "Нещо се обърка. Опитайте пак или ни пишете директно.",
};
