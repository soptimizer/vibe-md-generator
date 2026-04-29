# VibeMD Generator — Enhancement Tasks

Her task kendi içinde bağımsız ve doğrudan uygulanabilir.
Prompt'lar Claude Code'a verilmek üzere yazılmıştır.

---

## Öncelik 1 — Mevcut Template İçerikleri

---

### TASK-01 · Always / Ask First / Never sistemi — CLAUDE.md

**Dosya:** `src/templates/core/CLAUDE_md.ts`

**Prompt:**
```
src/templates/core/CLAUDE_md.ts dosyasına stack ve özelliklere göre dinamik üretilen
bir "## Boundaries" bölümü ekle.

Bölüm üç alt başlık içermeli:
- **Always do** — AI'ın sormadan yapabileceği işlemler
- **Ask first** — Kullanıcıya danışılması gereken işlemler
- **Never do** — Kesinlikle yapılmaması gerekenler

Kurallar config'e göre farklılaşmalı:
- hasAuth veya hasPayments varsa: auth/payment dosyalarına dokunmak "Ask first"
- backend !== 'none' ise: schema migration, env değişkeni ekleme "Ask first"
- scale !== 'solo' ise: main/master'a doğrudan push "Never do"
- hasTesting varsa: test silmek "Never do", test eklemek "Always do"
- Her durumda: secret hardcode "Never do", mevcut dosyayı önce okumak "Always do"

getOffLimits() fonksiyonunu kaldır, yerine getBoundaries() fonksiyonunu yaz.
Template'deki "## Off-Limits" bölümünü "## Boundaries" ile değiştir.
```

---

### TASK-02 · Feature Registry bölümü — CLAUDE.md

**Dosya:** `src/templates/core/CLAUDE_md.ts`

**Prompt:**
```
src/templates/core/CLAUDE_md.ts dosyasına "## Feature Registry" bölümü ekle.

Bu bölüm tamamlanan özelliklerin ve hangi dosyalarda implement edildiğinin
kaydedileceği bir tablo şablonu olmalı. AI'ın oturum başında doldurabileceği format:

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| _example: Auth login_ | ✅ Done | `src/auth/login.ts` | JWT, 15min expiry |

Tablonun altına şu notu ekle:
> Update this table after implementing each feature. AI should read this before
> starting new work to avoid duplicating or breaking existing implementations.

Bu bölümü "## References" bölümünün hemen üstüne yerleştir.
```

---

### TASK-03 · Role-specific guidance — CLAUDE.md

**Dosya:** `src/templates/core/CLAUDE_md.ts`

**Prompt:**
```
src/templates/core/CLAUDE_md.ts dosyasına "## Working Modes" bölümü ekle.

AI'ın farklı görevlerde nasıl davranması gerektiğini tanımlayan üç mod:

### 🏗 Build Mode
Yeni özellik veya dosya eklerken:
- ARCHITECTURE.md klasör yapısını kontrol et
- Mevcut benzer implementasyonları oku, pattern'i tekrar et
- Feature Registry'yi güncelle tamamlayınca

### 🔍 Review Mode
Kod incelerken:
- Sadece Review Checklist maddelerini kontrol et
- Değişiklik öner, direkt düzenleme
- Bulguları listele, önce en kritik olanı

### ♻️ Refactor Mode
Mevcut kodu yeniden yapılandırırken:
- Davranış değişikliği yapma — sadece yapıyı iyileştir
- Tek seferde bir modül
- Refactor öncesi ve sonrası test çalıştır

Bölümü "## Review Checklist"in üstüne ekle.
config'e göre içerik farklılaştırma gerekmiyor, her projede aynı olabilir.
```

---

### TASK-04 · Deprecated patterns bölümü — Cursor Rules

**Dosya:** `src/templates/contextual/CURSOR_RULES_md.ts`

**Prompt:**
```
src/templates/contextual/CURSOR_RULES_md.ts dosyasına stack'e göre dinamik üretilen
bir "## Deprecated Patterns" bölümü ekle.

Her giriş şu formatı izlemeli:
❌ [ne yapılmamalı]
✅ [bunun yerine ne yapılmalı]
Why: [kısa açıklama]

Stack'e göre içerik:

frontend === 'react' veya 'nextjs':
- ❌ class components → ✅ function components + hooks
- ❌ useEffect for derived state → ✅ useMemo
- ❌ prop drilling 3+ level → ✅ context veya store

frontend === 'vue':
- ❌ Options API → ✅ Composition API + <script setup>
- ❌ this.$emit without typing → ✅ defineEmits<{...}>()

backend === 'nodejs':
- ❌ callback hell → ✅ async/await
- ❌ require() → ✅ ES module import
- ❌ string concatenation in SQL → ✅ parameterized queries

backend === 'python':
- ❌ mutable default arguments → ✅ None + body assignment
- ❌ bare except → ✅ except SpecificError

backend === 'go':
- ❌ panic for business errors → ✅ error return values
- ❌ global state → ✅ dependency injection

Bu bölümü template'in sonuna, son --- çizgisinin üstüne ekle.
```

---

### TASK-05 · Canonical example — Cursor Rules

**Dosya:** `src/templates/contextual/CURSOR_RULES_md.ts`

**Prompt:**
```
src/templates/contextual/CURSOR_RULES_md.ts dosyasına stack'e göre gerçek bir kod
örneği içeren "## Canonical Pattern" bölümü ekle.

Bu bölüm teorik açıklama değil, projedeki bir component/fonksiyonun nasıl
görünmesi gerektiğini gösteren minimal ama tam bir örnek olmalı.

frontend === 'react':
- Bir custom hook örneği (useResource tarzı): state, loading, error pattern
- Bir component örneği: props interface + return JSX, max 30 satır

frontend === 'vue':
- <script setup lang="ts"> ile bir composable örneği

frontend === 'svelte':
- Bir store + component entegrasyon örneği

backend === 'nodejs':
- Route → Controller → Service zincirinin 3 dosyalık minimal örneği

backend === 'python':
- Router → Service dependency injection örneği

backend === 'go':
- Handler → Service → Repository interface örneği

Sadece seçili stack için örnek üret. Frontend ve backend ikisi de seçiliyse
her ikisi için birer örnek ekle. Örnekler gerçek proje adını (config.name) kullanmalı.
```

---

### TASK-06 · Rule metadata — Cursor Rules

**Dosya:** `src/templates/contextual/CURSOR_RULES_md.ts`

**Prompt:**
```
src/templates/contextual/CURSOR_RULES_md.ts dosyasının üstüne (başlığın hemen altına)
bir metadata bloğu ekle:

---
framework-versions:
  frontend: [seçili frontend + "latest stable — update this when you upgrade"]
  backend: [seçili backend + "latest stable — update this when you upgrade"]
last-reviewed: [üretim tarihi — YYYY-MM-DD formatında]
next-review: [üretim tarihinden 30 gün sonra — YYYY-MM-DD]
---

Tarih için JavaScript'te new Date() kullan, ISO formatına çevir.
next-review için 30 gün ekle.

Ardından dosyanın sonuna şu notu ekle:
> ⚠️ Review these rules when upgrading framework versions. Stale rules generate
> outdated code patterns.

frontend === 'none' ise frontend satırını metadata'ya dahil etme.
backend === 'none' ise backend satırını dahil etme.
```

---

### TASK-07 · Non-functional requirements — PRD.md

**Dosya:** `src/templates/contextual/PRD_md.ts`

**Prompt:**
```
src/templates/contextual/PRD_md.ts dosyasına stack ve scale'e göre üretilen
"## Non-Functional Requirements" bölümü ekle.

Her madde ölçülebilir bir kriter içermeli. "Hızlı olmalı" değil,
"Initial page load < 3s on 4G" gibi.

Her projede: Performance, Reliability, Security başlıkları
backend !== 'none' ise: API response time hedefi ekle
database !== 'none' ise: Query timeout, connection pool limiti
hasAuth ise: Session timeout, brute-force koruması
scale === 'enterprise' ise: SLA, uptime hedefi, load capacity
hasTesting ise: Minimum test coverage hedefi (örn. %80 unit, %60 integration)

Format:
### Performance
| Metric | Target | Measurement |
|--------|--------|-------------|
| ... | ... | ... |

### Reliability
...

Bölümü "## Constraints" veya varsa "## Out of Scope" bölümünden önce ekle.
Bölüm yoksa "## Success Criteria" bölümünden önce.
```

---

### TASK-08 · Conformance criteria — PRD.md

**Dosya:** `src/templates/contextual/PRD_md.ts`

**Prompt:**
```
src/templates/contextual/PRD_md.ts dosyasına "## Acceptance Criteria" bölümü ekle.

Bu bölüm PRD'nin gerçekleşip gerçekleşmediğini test edecek kabul kriterleri
içermeli. Her madde Given / When / Then formatında olmalı:

- Given [başlangıç durumu], When [kullanıcı eylemi], Then [beklenen sonuç]

config'e göre otomatik kriterler üret:
- hasAuth: login, logout, unauthorized access senaryoları
- hasPayments: başarılı ödeme, başarısız ödeme, refund senaryoları
- type === 'api': rate limiting, invalid input, auth header eksik senaryoları
- hasTesting: tüm acceptance kriterleri için test case yazılmış olma koşulu
- Her projede: happy path + 1 hata senaryosu

Bölümü PRD'nin en sonuna ekle.
```

---

## Öncelik 2 — Yeni Dosyalar

---

### TASK-09 · DECISIONS.md — Yeni template

**Dosya:** `src/templates/contextual/DECISIONS_md.ts` (yeni)
**Type key:** `DECISIONS_MD` — `src/types/index.ts`'e ekle
**Koşul:** `tokenEfficiency === 'comprehensive' || scale !== 'solo'`

**Prompt:**
```
Yeni bir template dosyası oluştur: src/templates/contextual/DECISIONS_md.ts

Export edilen fonksiyon imzası: (config: ProjectConfig) => string

Bu dosya Architectural Decision Record (ADR) formatında bir karar günlüğü üretmeli.

İçerik:
1. "## How to Use" — Her mimari karar için nasıl bir satır ekleneceğini açıkla
2. "## Decision Log" — config'den türetilen ilk kararlar otomatik doldurulsun:
   - Neden [config.frontend] seçildi (boş "reason" ile, doldurulacak şekilde)
   - Neden [config.backend] seçildi
   - Neden [config.database] seçildi
   - Neden [config.packageManager] seçildi
   - hasAuth varsa: Auth stratejisi kararı (boş)
   - hasPayments varsa: Payment provider kararı (boş)

Format her karar için:
### [kısa başlık]
- **Date:** YYYY-MM-DD
- **Status:** Decided | Revisiting | Superseded
- **Decision:** [ne seçildi]
- **Reason:** _fill in_
- **Consequences:** _fill in_

3. Dosyaya şu notu ekle:
> Add a new entry here before implementing any significant architectural change.
> AI should read this file before suggesting structural refactors.

Ardından:
- src/types/index.ts MDFileKey union'ına 'DECISIONS_MD' ekle
- src/logic/fileSelector.ts'e koşul ekle:
  if (config.tokenEfficiency === 'comprehensive' || config.scale !== 'solo') {
    files.push('DECISIONS_MD');
  }
- src/logic/fileSelector.ts getFilename() map'ine ekle: DECISIONS_MD: 'DECISIONS.md'
- src/templates/index.ts'e import et ve templateRegistry'ye ekle
```

---

### TASK-10 · CONTEXT_MAP.md — Yeni template

**Dosya:** `src/templates/contextual/CONTEXT_MAP_md.ts` (yeni)
**Type key:** `CONTEXT_MAP_MD`
**Koşul:** `tokenEfficiency === 'comprehensive'`

**Prompt:**
```
Yeni bir template dosyası oluştur: src/templates/contextual/CONTEXT_MAP_md.ts

Export edilen fonksiyon imzası: (config: ProjectConfig) => string

Bu dosya AI'ın hangi göreve başlamadan önce hangi dosyaları okuyacağını gösteren
bir harita olmalı.

İçerik — config'e göre dinamik tablo üret:

| Task | Read First | Optional |
|------|-----------|----------|
| New feature | PRD.md, ARCHITECTURE.md | TASKS.md |
| Bug fix | CLAUDE.md, PROGRESS.md | ARCHITECTURE.md |
| UI component | DESIGN_SYSTEM.md, ARCHITECTURE.md | PRD.md |  ← sadece frontend varsa
| API endpoint | API_SPEC.md, ARCHITECTURE.md | SECURITY.md |  ← backend varsa
| DB schema change | DATABASE_SCHEMA.md, ARCHITECTURE.md | SECURITY.md |  ← db varsa
| Auth change | SECURITY.md, CLAUDE.md | API_SPEC.md |  ← hasAuth varsa
| Payment change | SECURITY.md, CLAUDE.md | API_SPEC.md |  ← hasPayments varsa
| Refactor | ARCHITECTURE.md, CLAUDE.md | DECISIONS.md |
| Code review | CLAUDE.md | TESTING_STRATEGY.md |  ← hasTesting varsa

Tabloyu config'deki aktif özelliklere göre filtrele — olmayan dosyaları ekleme.

Dosyanın altına şu notu ekle:
> Before starting any task, read the files in the "Read First" column.
> This prevents context gaps that lead to inconsistent implementations.

Ardından:
- src/types/index.ts MDFileKey union'ına 'CONTEXT_MAP_MD' ekle
- src/logic/fileSelector.ts'e koşul ekle (tokenEfficiency === 'comprehensive')
- getFilename() map'ine ekle: CONTEXT_MAP_MD: 'CONTEXT_MAP.md'
- src/templates/index.ts'e import et ve templateRegistry'ye ekle
```

---

### TASK-11 · ERROR_HANDLING.md — Yeni template

**Dosya:** `src/templates/contextual/ERROR_HANDLING_md.ts` (yeni)
**Type key:** `ERROR_HANDLING_MD`
**Koşul:** `backend !== 'none' || frontend !== 'none'`

**Prompt:**
```
Yeni bir template dosyası oluştur: src/templates/contextual/ERROR_HANDLING_md.ts

Export edilen fonksiyon imzası: (config: ProjectConfig) => string

Bu dosya stack'e özgü hata yönetimi kurallarını içermeli.

Bölümler config'e göre dahil edilmeli:

frontend === 'react' veya 'nextjs':
- Error Boundary kullanım kuralları (nerede sarılmalı, ne gösterilmeli)
- async fonksiyonlarda try/catch zorunluluğu
- fetch/axios hatalarında kullanıcıya ne gösterilmeli (toast, inline error, vb.)
- Form validation hata mesajı formatı

frontend === 'vue':
- onErrorCaptured hook kullanımı
- async setup hatalarında pattern
- Pinia action hata yönetimi

frontend === 'svelte':
- {#await} bloğunda hata state'i

backend === 'nodejs':
- Express global error handler middleware zorunluluğu
- Async route handler'larda try/catch veya express-async-errors
- HTTP status code standardı (4xx vs 5xx ne zaman)
- Loglama: ne loglanmalı, ne loglanmamalı (PII)

backend === 'python':
- HTTPException kullanımı
- Exception handler dekoratörleri
- Pydantic validation hata formatı

backend === 'go':
- Error wrapping (fmt.Errorf("...: %w", err))
- Sentinel errors
- HTTP handler'da hata response formatı

hasAuth varsa her stack için: auth hatalarını generic tut (timing attack önlemi)
hasPayments varsa: payment hata loglarında kart bilgisi asla loglama

Dosyanın sonuna şu notu ekle:
> AI must follow these patterns for all error handling. Never swallow errors silently.

Ardından types, fileSelector, getFilename ve templateRegistry'ye ekle.
```

---

## Öncelik 3 — Yapısal İyileştirmeler

---

### TASK-12 · Decision Log — ARCHITECTURE.md

**Dosya:** `src/templates/core/ARCHITECTURE_md.ts`

**Prompt:**
```
src/templates/core/ARCHITECTURE_md.ts dosyasındaki "## Key Decisions" tablosunu
genişlet. Şu an sadece frontend/backend/database/packageManager var.

1. Mevcut tabloyu koru, ama "Reason" sütununu doldurulabilir hale getir:
   boş bırakmak yerine "_fill in_" placeholder kullan.

2. Tablonun altına "## Decision Log" başlığı ekle:
   Timestamp'li kararlar için ADR (Architectural Decision Record) mini formatı:
   
   | Date | Decision | Alternatives Considered | Outcome |
   |------|----------|------------------------|---------|
   | _YYYY-MM-DD_ | _describe decision_ | _what else was considered_ | _result_ |

3. Altına şu notu ekle:
   > Add a row here before any significant architectural change.
   > Keep this in sync with DECISIONS.md if it exists.

Bu eklemeyi mevcut "## Constraints" bölümünden önce yerleştir.
```

---

### TASK-13 · AI Session Log — PROGRESS.md

**Dosya:** `src/templates/core/PROGRESS_md.ts`

**Prompt:**
```
src/templates/core/PROGRESS_md.ts dosyasına "## AI Session Log" bölümü ekle.

Bu bölüm her AI coding oturumundan sonra ne yapıldığını kaydetmek için
yapılandırılmış bir template sunmalı:

### Session Template
```
## Session — YYYY-MM-DD
**Goal:** _what was attempted_
**Completed:** _what was actually done_
**Files changed:** _list key files_
**Decisions made:** _any architectural choices_
**Left for next session:** _unfinished items_
```

Bölümü "## Known Issues" veya "## Decisions Log" varsa onlardan önce,
yoksa dosyanın sonuna ekle.

Altına şu notu ekle:
> Fill this in at the end of each AI session. It prevents context loss
> between sessions and avoids re-explaining completed work.
```

---

### TASK-14 · Quick Context — README.md

**Dosya:** `src/templates/core/README_md.ts`

**Prompt:**
```
src/templates/core/README_md.ts dosyasına "## Quick Context for AI" bölümü ekle.

Bu bölüm README'yi okuyan bir AI'ın projeyi 5 satırda anlaması için tasarlanmış
özet olmalı:

- **Project:** [config.name] — [config.description]
- **Type:** [config.type] | **Scale:** [config.scale]
- **Stack:** [frontend + backend + database kombinasyonu]
- **AI Tool:** [config.aiTool] — read [CLAUDE.md veya AGENTS.md] for full context
- **Current phase:** See PROGRESS.md

Bölümü README'nin en üstüne, proje başlığının hemen altına yerleştir.
Diğer bölümler (Installation, Usage, vb.) bunun altında kalsın.
```

---

### TASK-15 · AI Review Gates — TESTING_STRATEGY.md

**Dosya:** `src/templates/contextual/TESTING_STRATEGY_md.ts`

**Prompt:**
```
src/templates/contextual/TESTING_STRATEGY_md.ts dosyasına
"## AI-Generated Code Review Gates" bölümü ekle.

Bu bölüm AI'ın ürettiği kodun kalite kapılarını tanımlamalı —
AI kodu teslim etmeden önce bu kontrolleri geçmeli:

Her projede:
- [ ] No hardcoded strings that should be constants or env vars
- [ ] No TODO comments left in production code
- [ ] All functions have a single responsibility
- [ ] Error cases are handled, not just happy path

backend varsa:
- [ ] All inputs validated before processing
- [ ] No raw SQL string concatenation
- [ ] Authentication checked before business logic

frontend varsa:
- [ ] No direct DOM manipulation outside designated utilities
- [ ] Loading and error states handled in all async components
- [ ] No inline styles — utility classes or CSS modules only

hasTesting varsa:
- [ ] New feature has at least one happy-path test
- [ ] Error scenarios have corresponding test cases
- [ ] Mock usage justified (real implementations preferred)

hasAuth varsa:
- [ ] Protected routes actually protected (not just hidden)
- [ ] Token expiry handled gracefully

Bölümü dosyanın sonuna ekle.
```

---

## Öncelik 4 — Wizard & Store

---

### TASK-16 · AI Persona wizard sorusu — Step3_Goals.tsx

**Dosyalar:** `src/types/index.ts`, `src/store/projectStore.ts`, `src/components/wizard/Step3_Goals.tsx`, `src/templates/core/CLAUDE_md.ts`

**Prompt:**
```
Wizard'a "AI Role" sorusu ekle. Bu seçim CLAUDE.md'deki talimat tonunu değiştirir.

1. src/types/index.ts'e ekle:
   export type AIRole = 'assistant' | 'pair-programmer' | 'reviewer-only';
   ProjectConfig'e ekle: aiRole: AIRole;

2. src/store/projectStore.ts defaultConfig'e ekle: aiRole: 'assistant'

3. src/components/wizard/Step3_Goals.tsx'e yeni bir seçim alanı ekle:
   "AI Role" başlığı altında 3 seçenek:
   - Assistant — AI önerir, sen karar verirsin
   - Pair Programmer — AI direkt implement eder, sen yönlendirirsin
   - Reviewer Only — AI sadece kod inceler, yeni kod yazmaz

4. src/templates/core/CLAUDE_md.ts'te yeni bir fonksiyon ekle: getAIRole()
   - 'assistant': "Make suggestions and wait for approval before implementing"
   - 'pair-programmer': "Implement directly. Ask only for ambiguous requirements"
   - 'reviewer-only': "Review and comment only. Do not write or modify code unless explicitly asked"
   
   Bu çıktıyı template'de "## Role" başlığı altında Stack bölümünün hemen üstüne ekle.
```

---

### TASK-17 · Instruction count uyarısı — generator.ts veya Step4_Review.tsx

**Dosyalar:** `src/logic/generator.ts` veya `src/components/wizard/Step4_Review.tsx`

**Prompt:**
```
Üretilen CLAUDE.md (veya AGENTS.md) dosyasının satır sayısını hesapla ve
150 satırı geçiyorsa kullanıcıya uyarı göster.

1. src/logic/generator.ts'te generateFiles() sonrasında CLAUDE_MD veya AGENTS_MD
   dosyasının content'ini satırlara böl. 150'yi geçiyorsa GeneratedFile objesine
   bir warning alanı ekle: warning?: string

   GeneratedFile interface'ine src/types/index.ts'te optional warning ekle.

2. src/components/wizard/Step4_Review.tsx'te veya PreviewLayout'ta:
   warning alanı dolu olan dosyalar için dosya adının yanında sarı ⚠ ikonu göster.
   Hover'da tooltip: "This file exceeds 150 lines. AI instruction-following quality
   may decrease. Consider splitting into multiple reference files."

Araştırmalar 150 satır üstünde instruction-following kalitesinin düştüğünü gösteriyor.
```

---

## Uygulama Sırası (Önerilen)

```
Hız kazanımı için önce:
TASK-01 → TASK-02 → TASK-07 → TASK-08 (mevcut dosyalara ekleme, kolay)

Cursor kullanıcıları için yüksek değer:
TASK-04 → TASK-05 → TASK-06

Yeni dosyalar (bağımlılık sırası önemli):
TASK-09 (DECISIONS_MD) → TASK-10 (CONTEXT_MAP_MD) → TASK-11 (ERROR_HANDLING_MD)

Yapısal iyileştirmeler:
TASK-12 → TASK-13 → TASK-14 → TASK-15

Wizard değişiklikleri (en son — type değişikliği tüm templateları etkiler):
TASK-16 → TASK-17
```
