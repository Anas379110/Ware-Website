---
name: cloudflare-arabic-site-deploy
description: استخدم هذه المهارة عند نشر أو تحديث أي من مواقع anasnet.com على Cloudflare Pages/Workers، أو ضبط نطاق فرعي جديد تحت anasnet.com.
---

# نشر مواقع anasnet.com على Cloudflare

## متى تُستدعى
عند "انشر الموقع"، "حدّث النطاق الفرعي"، "أضف نطاقًا جديدًا لـ anasnet.com".

## خطوات التنفيذ
1. تأكد أن Build ناجح محليًا أولًا (`npm run build`) قبل أي محاولة نشر.
2. Track A (Astro): Cloudflare Pages — إخراج ثابت، لا حاجة لإعدادات Functions.
3. Track B (Next.js/Directory): Cloudflare Pages مع Next.js adapter — تحقق من دعم Route Handlers قبل النشر.
4. اربط النطاق الفرعي `<name>.anasnet.com` عبر DNS بلوحة Cloudflare — CNAME لا A Record.
5. تحقق من تفعيل SSL التلقائي (Universal SSL) بعد الربط.
6. لا تنشر مباشرة على Production بدون المرور بـ Preview Deployment أولًا للتحقق البصري.

## Validation
- Lighthouse Score > 90 على رابط الـ Preview قبل الترقية لـ Production.
- فحص RTL يظهر صحيحًا على الرابط الفعلي (لا فقط محليًا).

## Expected Output
رابط Preview + تأكيد نجاح Build + قائمة أي تحذيرات قبل الموافقة على الدمج لـ Production.
