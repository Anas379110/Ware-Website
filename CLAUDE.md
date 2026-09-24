# PROJECT BRAIN — اقرأ هذا أولاً

## 1. ملخص المشروع
نبني: موقع محتوى عربي ثابت (أحد مواقع برنامج anasnet.com — Track A).
النوع: Static Site (Astro) — بلا Backend، بلا قاعدة بيانات.
المستخدم: زائر عربي يقرأ/يبحث عن محتوى — لا حسابات مستخدمين.

اقرأ قبل أي تعديل:
- `PROJECT.md` (على مستوى هذا الموقع تحديدًا) — الهوية، الجمهور، لوحة الألوان.
- `SRS.md` و`SCOPE.md` الخاصين بهذا الموقع — لا تنفّذ ميزة خارج Must/Should المعتمدة.
- `../DECISIONS.md` (مستوى البرنامج) قبل أي تغيير معماري.
- `../ARCHITECTURE.md` — Track A تحديدًا (لا قاعدة بيانات، لا استدعاء LLM لحظي).

## 2. أوامر التشغيل (لا تسألني عنها)
build: npm run build
dev:   npm run dev
test:  npm run test        (Vitest)
e2e:   npm run test:e2e    (Playwright — فحص تحميل الصفحات الأساسية فقط)
lint:  npm run lint

## 3. قواعد الأسلوب (لا تخالفها)
- TypeScript Strict Mode — لا `any` أبداً.
- Tailwind CSS فقط — لا CSS Modules، لا Styled Components.
- `dir="rtl"` على `<html>` دائمًا — هذا موقع عربي بالكامل.
- خط Google Fonts: IBM Plex Sans Arabic (ما لم يُحدَّد غيره بـ PROJECT.md الخاص بالموقع).
- كل مكوّن UI مبني حسب Design System المشترك (`docs/design/UI-UX.md` بمستوى البرنامج) — لا اختراع مكونات جديدة دون داعٍ.

## 4. هيكلية الملفات
src/
  components/     ← مكونات UI فقط (Header, ArticleCard, SearchBar, Pagination...)
  content/        ← Content Collections (Markdown/MDX) — كل مقال/عنصر ملف مستقل
  content/config.ts ← Zod Schema — راجع SRS.md لحقول هذا الموقع تحديدًا
  layouts/        ← Layouts عامة (RTL مضمّن)
  pages/          ← مسارات Astro

## 5. قواعد لا تتفاوض عليها
- لا Secrets أو API keys بالكود أبداً.
- كل محتوى منشور يحمل `sources` و`reviewedBy` و`reviewedAt` بالـ Frontmatter — لا استثناء (D4).
- لا نشر محتوى بحالة `aiGenerated: true` بلا `reviewedBy` مملوء فعليًا.
- مواضع الإعلانات حسب `ads-policy-review` skill — لا تجاور نصًا دينيًا مباشرة إن كان الموقع دار القرآن/دار السنة.
- Lighthouse Score يجب ألا ينخفض عن 90 بأي تعديل — افحص قبل أي Commit يمس الأداء.

## 6. السياق الخاص بهذا الموقع
[يُملأ يدويًا هنا عند استنساخ القالب لموقع محدد: اسم الموقع، فئات المحتوى، حقول Frontmatter الإضافية من SRS.md الخاص به]
