---
name: arabic-seo-performance
description: استخدم هذه المهارة عند إضافة صفحة جديدة أو قبل نشر أي موقع من مواقع anasnet.com — تغطي RTL، Schema.org، sitemap، robots.txt، تحسين الصور، وCore Web Vitals لضمان تحميل أقل من 3 ثوانٍ.
---

# أداء وSEO تقني عربي

## متى تُستدعى
عند إضافة صفحة/نوع محتوى جديد، أو قبل أي نشر لموقع كامل لأول مرة.

## نقاط الفحص
1. **RTL**: `dir="rtl"` و`lang="ar"` على `<html>`، لا نص مختلط الاتجاه بلا `dir` صريح.
2. **Schema.org**: JSON-LD مناسب لنوع المحتوى (Article لمقال، Product/LocalBusiness لـ Directory، إلخ).
3. **sitemap.xml**: يُولَّد تلقائيًا وقت البناء، يشمل كل صفحة منشورة (`approved` فقط).
4. **robots.txt**: يسمح بفهرسة الصفحات العامة، يمنع فهرسة لوحات Admin (Directory تحديدًا).
5. **الصور**: `alt` عربي وصفي لكل صورة، صيغة WebP، Lazy Loading لكل صورة أسفل الطية (Below the Fold).
6. **Core Web Vitals**: LCP < 2.5s، CLS < 0.1، INP جيد — قِس فعليًا عبر Lighthouse، لا افتراضًا.

## Expected Output
تقرير Pass/Fail لكل نقطة، مع رقم Lighthouse الفعلي قبل الموافقة على النشر.
