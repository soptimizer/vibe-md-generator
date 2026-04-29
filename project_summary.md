# VibeMD Generator — Project Summary

## Ana Amaç
Vibe coders için proje bağlamı dosyaları üreten, tamamen client-side çalışan statik bir web uygulaması.
Kullanıcı 4 adımlı bir wizard'dan geçer, uygulama projesine özel MD dosyalarını otomatik üretir ve ZIP olarak indirir. Amacı doğru ve verimli vibe coding süreçlerini sağlamaktır.


## Ne Üretir?
Kullanıcının seçtiği stack ve özelliklere göre şu dosyaları üretir:

| Dosya | Koşul |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | Her zaman (aiTool'a göre) |
| `PRD.md`, `README.md`, `ARCHITECTURE.md`, `PROGRESS.md` | Her zaman |
| `.gitignore` | Her zaman (stack'e göre içerik) |
| `.cursorignore` | aiTool === 'cursor' |
| `.windsurfignore` | aiTool === 'windsurf' |
| `.cursor/rules/project.mdc` | aiTool === 'cursor' |
| `TASKS.md` | scale !== 'solo' |
| `IMPLEMENTATION_PLAN.md`, `TECH_STACK.md` | tokenEfficiency === 'comprehensive' |
| `DATABASE_SCHEMA.md` | database !== 'none' |
| `SECURITY.md` | hasAuth || hasPayments |
| `API_SPEC.md` | type === 'api' || backend !== 'none' |
| `TESTING_STRATEGY.md` | hasTesting |

## Wizard Adımları
1. **Basics** — name, description, type, scale, aiTool
2. **Stack** — frontend, backend, database, packageManager
3. **Features** — auth, payments, testing, deployment, tokenEfficiency
4. **Review** — config özeti + dosya listesi + üret

## Teknik Yığın
- React 18 + Vite + TypeScript (strict)
- Tailwind CSS, Zustand, JSZip, react-markdown

## Kritik Dosyalar
- `src/types/index.ts` — tüm tipler (ProjectConfig, MDFileKey, vb.)
- `src/logic/fileSelector.ts` — hangi dosyaların üretileceğine karar verir
- `src/logic/generator.ts` — template'leri çalıştırır
- `src/templates/index.ts` — template registry
- `src/store/projectStore.ts` — Zustand store

## Template Kuralı
Her template: `(config: ProjectConfig) => string` — saf fonksiyon, yan etki yok.

## Mevcut Durum
Phase 4 — Deploy: Vercel deploy + OG meta tags kaldı.
