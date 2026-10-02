# PK Hosting App

Mobile app for PK Hosting (Expo / React Native / Expo Router), built from research of pkhosting.com.

## Features

- Home: PK Hosting branding, domain search, WELCOME10 promo, popular plans
- Plans: Shared, WordPress, Reseller, VPS and Dedicated with monthly/annual billing
  (annual = 10x monthly; VPS annual = 11x monthly, matching pkhosting.com)
- Domains: domain name search with per-TLD pricing (.com, .pk, .com.pk, .net, .org and more)
- Cart: add/remove items, WELCOME10 promo code (10% off Shared and Reseller hosting)
- Checkout: demo checkout with JazzCash, Easypaisa, Debit/Credit Card, PayPal and Bank Transfer
- Order confirmation with order id, amount and payment method
- Account: demo services, orders/invoices, support tickets (open, view, reply), contact info
- About: company details, address, phone, email, support hours, accepted payments

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (Android/iOS).

## Web preview

```bash
npx expo export --platform web
npx serve dist
```

## Notes

- Prices in PKR are taken from pkhosting.com; the checkout price takes precedence.
- Checkout is a demo: no real payment is taken in this build.
- TypeScript: `npx tsc --noEmit` - Lint: `npx expo lint`
