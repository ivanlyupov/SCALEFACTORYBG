# ScaleFactoryBG — уебсайт

Production сайт за **ScaleFactoryBG** (creative-as-a-service за eCommerce брандове).
Stack: **Vite + React + TypeScript + Tailwind**, готов за безплатен деплой на **Vercel**.
Контактната форма записва заявките сигурно в **Supabase**. Видеата се пускат от
**Cloudflare R2** (или YouTube/Vimeo).

> **Не сте програмист? Няма проблем.** За да смените текстове, цени, видеа или
> резултати, редактирате **само един файл**: [`src/content.ts`](src/content.ts).
> Всичко е коментирано на български. След промяна сайтът се пресъздава сам на Vercel.

---

## 0) Какво има в проекта

```
scalefactorybg/
├── api/lead.ts              ← сървърна функция: приема формата и пише в Supabase
├── db/supabase_setup.sql    ← създава таблицата "leads" + защитите (RLS)
├── src/
│   ├── content.ts           ← ★ ЕДИНСТВЕНИЯТ файл, който редактирате за съдържание
│   ├── index.css            ← дизайнът (цветове/шрифтове горе в „DESIGN TOKENS")
│   ├── App.tsx, main.tsx
│   └── components/          ← секциите (hero, цени, видеа, резултати, форма…)
├── index.html
├── .env.example             ← списък с тайните променливи (копирайте на ".env")
├── .gitignore               ← пази ".env" да НЕ попадне в GitHub
└── README.md                ← този файл
```

---

## Локален преглед (по избор)

Node.js вече е инсталиран на този компютър. Отворете нов терминал (PowerShell) в
папката `scalefactorybg` и напишете:

```powershell
npm install      # само първия път (сваля библиотеките)
npm run dev      # пуска преглед на http://localhost:5173
```

Отворете **http://localhost:5173** в браузъра.

> **Важно за формата локално:** `npm run dev` пуска само визуалната част.
> Функцията `/api/lead` (записът в Supabase) работи на Vercel. За да тествате и
> формата локално, използвайте `vercel dev` (вижте стъпка 3). При обикновено
> `npm run dev` натискането на бутона ще покаже съобщение за грешка — това е
> нормално, защото няма локален сървър.

---

## Променливи на средата (env vars) — има само 2

И двете са **сървърни тайни** — браузърът НИКОГА не ги вижда. Слагате ги на **две
места**: локално във файл `.env` и в настройките на Vercel.

| Променлива | Откъде идва | За какво служи |
|---|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → **Data API** (полето „Project URL") | Адресът на вашата база |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → **API Keys** → ключът **`service_role`** | Таен ключ; ползва се само от `api/lead.ts` на сървъра |

⚠️ **Никога** не слагайте `service_role` ключа във фронтенд код или в променлива,
която започва с `VITE_`. Файлът `.env` е в `.gitignore`, за да не попадне в GitHub.

Как да ги настроите локално:

```powershell
# в папката scalefactorybg
copy .env.example .env
# после отворете .env и попълнете реалните стойности
```

---

## Стъпка 1 — Supabase проект + таблица за заявки

1. Отидете на **https://supabase.com** → **Sign in** (може с GitHub) → **New project**.
2. Дайте име (напр. `scalefactorybg`), измислете **Database password** (запишете си го),
   изберете регион близо до вас (напр. Frankfurt) → **Create new project**.
   Изчакайте ~1–2 минути да се създаде.
3. От лявото меню отворете **SQL Editor** → бутон **New query**.
4. Отворете файла [`db/supabase_setup.sql`](db/supabase_setup.sql), **копирайте целия текст**,
   поставете го в редактора → натиснете **Run** (долу вдясно).
   Това създава таблицата `leads` и включва защитата (RLS), така че никой отвън не може
   да чете или пише в нея — само вашият сървър.
5. Вземете двете тайни стойности:
   - Горе вляво **⚙ Project Settings** → **Data API** → копирайте **Project URL**
     → това е `SUPABASE_URL`.
   - **Project Settings** → **API Keys** → намерете реда **`service_role`** →
     натиснете **Reveal / Copy** → това е `SUPABASE_SERVICE_ROLE_KEY`.
6. Поставете двете стойности във вашия локален `.env` файл (вижте таблицата по-горе).

📥 Вашите заявки после ще се виждат по всяко време в: **Table Editor → leads**.

---

## Стъпка 2 — Качване в GitHub

1. Направете си акаунт в **https://github.com** (ако нямате).
2. **New repository** → име `scalefactorybg` → **Private** → **Create repository**.
3. Качете кода. Най-лесно с GitHub Desktop, или в PowerShell от папката `scalefactorybg`:

```powershell
git init
git add .
git commit -m "ScaleFactoryBG website"
git branch -M main
git remote add origin https://github.com/ВАШИЯТ-АКАУНТ/scalefactorybg.git
git push -u origin main
```

> `.gitignore` вече пази `.env` и `node_modules` да НЕ се качват. Проверете, че в
> GitHub **няма** файл `.env` — трябва да липсва.

---

## Стъпка 3 — Деплой на Vercel + env vars

1. Отидете на **https://vercel.com** → **Sign up / Log in with GitHub**.
2. **Add New… → Project** → изберете хранилището `scalefactorybg` → **Import**.
3. Vercel сам разпознава Vite (Framework Preset: **Vite**). Оставете настройките по подразбиране.
4. Отворете секцията **Environment Variables** и добавете двете:
   - Name `SUPABASE_URL`  → Value: вашият Project URL
   - Name `SUPABASE_SERVICE_ROLE_KEY` → Value: вашият service_role ключ
   (оставете ги за всички среди — Production, Preview, Development)
5. Натиснете **Deploy**. След ~1 минута сайтът е онлайн на адрес `…vercel.app`.

**Тест на формата:** отворете сайта, попълнете формата, натиснете бутона — трябва да
видите зеленото съобщение за успех. После в Supabase → **Table Editor → leads**
трябва да се появи нов ред.

> 💡 **Тест на формата локално (по избор):** инсталирайте Vercel CLI веднъж с
> `npm i -g vercel`, после в папката пуснете `vercel dev`. Така и `/api/lead`
> работи локално (ползва стойностите от `.env`).

---

## Стъпка 4 — Добавяне на видеа от Cloudflare R2

Видеата НЕ се качват в кода. Качвате ги в Cloudflare R2 и после поставяте линка в
`src/content.ts`.

1. В **https://dash.cloudflare.com** → **R2** → **Create bucket** (напр. `scalefactory-videos`).
2. Отворете bucket-а → **Upload** → качете вашето `.mp4` (напр. `contour-hook-a.mp4`).
3. Направете файловете публични: bucket → **Settings** → **Public access** →
   включете **R2.dev subdomain** (Allow Access). Ще получите адрес от вида
   `https://pub-XXXXXXXX.r2.dev`.
4. Пълният линк на видеото е този адрес + името на файла, напр.:
   `https://pub-XXXXXXXX.r2.dev/contour-hook-a.mp4`
5. Отворете [`src/content.ts`](src/content.ts), намерете секцията `reel` и заменете
   `PASTE_R2_MP4_URL_HERE` с вашия линк:

```ts
// vertical = 9:16 (висок клип), wide = 16:9 (широк клип, заема 2 колони)
{ id: "v1", kind: "AI UGC · 0:15", title: "Contour Pillow — Hook A",
  format: "vertical",
  videoUrl: "https://pub-XXXXXXXX.r2.dev/contour-hook-a.mp4" }, // ← вашият R2 линк
```

> `videoUrl` приема и YouTube/Vimeo **embed** линк
> (напр. `https://www.youtube.com/embed/ScMzIvxBSi4`) — сайтът разпознава автоматично
> дали да пусне `.mp4` файл или вградено видео.
> За да добавите нов клип: копирайте един `{ … }` ред и го поставете отдолу.
> За да махнете клип: изтрийте неговия `{ … }` ред.

6. Запишете, `git add . && git commit -m "add video" && git push` — Vercel пресъздава сайта автоматично.

---

## Стъпка 5 — Свързване на собствен домейн

1. Vercel → вашия проект → **Settings → Domains** → въведете домейна (напр. `scalefactory.bg`) → **Add**.
2. Vercel ще покаже какви DNS записи да добавите при вашия регистратор на домейни:
   - за коренов домейн (`scalefactory.bg`): **A** запис към IP-то, което Vercel посочва;
   - за `www`: **CNAME** към `cname.vercel-dns.com`.
3. Влезте в панела на регистратора на домейна и добавете тези записи.
4. Изчакайте разпространението на DNS (от няколко минути до няколко часа). Vercel
   слага безплатен HTTPS сертификат автоматично. Готово.

---

## Къде да сменя какво (шпаргалка)

| Искам да сменя… | Файл | Къде |
|---|---|---|
| Име на агенцията / лого / title / footer | `src/content.ts` | секция `site` |
| Заглавие и текст на hero | `src/content.ts` | секция `hero` |
| Цени и функции на плановете | `src/content.ts` | секция `plans` |
| Пробната оферта (399€ вместо 999€) | `src/content.ts` | секция `trial` |
| Таблицата „колко струва сами" | `src/content.ts` | секция `costTable` |
| Видеата | `src/content.ts` | секция `reel` |
| Резултатите/отзивите | `src/content.ts` | секция `proof` |
| Текстовете на формата | `src/content.ts` | секция `contact` |
| Цветове и шрифтове | `src/index.css` | горе в „DESIGN TOKENS" |

---

## Дребни проблеми (troubleshooting)

- **`npm run dev` дава грешка за esbuild** → пуснете веднъж
  `node node_modules/esbuild/install.js`, после пак `npm run dev`.
- **Формата дава грешка локално** → нормално при `npm run dev`; ползвайте `vercel dev`
  или тествайте на публикувания сайт (там `/api/lead` работи).
- **Формата дава грешка на Vercel** → проверете, че двете env vars са добавени в
  Vercel и че сте пуснали SQL-а от стъпка 1.
- **Видео не се пуска** → проверете, че R2 файлът е публичен и че линкът завършва на `.mp4`.
```
