#!/bin/bash
# .claude/hooks/pre-commit-secrets-check.sh
# يُستدعى تلقائياً قبل أي عملية Commit ويمنعها عند اكتشاف أسرار أو محتوى غير مراجَع.

if git diff --cached --name-only | grep -qE '\.env$|\.pem$|\.key$'; then
  echo "❌ رُفض الـ Commit: ملف حساس ضمن التغييرات"
  exit 1
fi

if git diff --cached | grep -qiE 'api[_-]?key\s*=\s*["\047][A-Za-z0-9]{20,}'; then
  echo "❌ رُفض الـ Commit: يبدو أن هناك مفتاح API صريح بالكود"
  exit 1
fi

# فحص إضافي خاص ببرنامج anasnet.com: منع دمج محتوى AI غير مراجَع
if git diff --cached | grep -qE 'aiGenerated:\s*true' && ! git diff --cached | grep -qE 'reviewedBy:\s*["\047].+["\047]'; then
  echo "❌ رُفض الـ Commit: محتوى aiGenerated:true بلا reviewedBy مملوء — يخالف D4"
  exit 1
fi

exit 0
