# راه‌اندازی نسخه آنلاین شارژ ساختمان شاهان

این پروژه روی GitHub Pages اجرا می‌شود و برای دیتابیس/احراز هویت/رسیدها از Supabase استفاده می‌کند.

## 1) ساخت پروژه
در Supabase یک Project بسازید.

## 2) اجرای دیتابیس
از SQL Editor، کل محتوای `supabase-schema.sql` را اجرا کنید.

## 3) ساخت حساب مدیر
از بخش Authentication > Users یک کاربر Email/Password بسازید. این ایمیل و رمز، ورود مدیر برنامه است.

## 4) قرار دادن کلیدها
از Project Settings > API مقدار Project URL و anon public key را بردارید و در `supabase-config.js` قرار دهید:

```js
window.SHAHAN_SUPABASE = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};
```

فقط `anon public key` را استفاده کنید؛ `service_role` را هرگز داخل GitHub قرار ندهید.

## 5) انتشار در GitHub Pages
کل فایل‌های این پوشه را جایگزین فایل‌های قبلی repository کنید و Commit/Push بزنید.

## نکته
اگر `supabase-config.js` هنوز با مقادیر نمونه باشد، برنامه به حالت محلی برمی‌گردد و مثل نسخه قبلی کار می‌کند.
