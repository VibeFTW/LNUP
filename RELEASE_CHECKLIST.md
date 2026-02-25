# LNUP Release Checklist

Everything you need to do before publishing the app to the App Store, Google Play, and Vercel.

---

## 1. Supabase Backend

- [ ] Create a Supabase project at [supabase.com](https://supabase.com)
- [ ] Run `supabase/migration.sql` in the Supabase SQL Editor
- [ ] Verify all tables were created (profiles, venues, events, event_photos, event_saves, event_confirmations, event_reports, scrape_sources, cities, push_tokens, notification_preferences)
- [ ] Enable **Email Auth** in Authentication > Providers
- [ ] Configure email templates (confirmation, password reset) in Authentication > Email Templates
- [ ] Set the **Site URL** in Authentication > URL Configuration (e.g. `https://lnup-demo.vercel.app` or your custom domain)
- [ ] Add redirect URLs for password reset (e.g. `lnup://reset-password`)
- [ ] Verify Storage bucket `event-photos` exists and is public
- [ ] Test RLS policies: create a test user and verify they can only see/edit their own data

## 2. Environment Variables

### Local (.env)
- [ ] `EXPO_PUBLIC_SUPABASE_URL` -- your Supabase project URL
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` -- your Supabase anon/public key
- [ ] `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` -- Google Maps API key (needs billing account)
- [ ] `EXPO_GEMINI_API_KEY` -- Google Gemini API key (optional, for AI pipeline)
- [ ] `EXPO_PUBLIC_TICKETMASTER_API_KEY` -- Ticketmaster API key (optional)

### Vercel (for web deployment)
- [ ] Set all `EXPO_PUBLIC_*` variables in Vercel > Settings > Environment Variables
- [ ] Set `EXPO_GEMINI_API_KEY` if using AI features

## 3. Google Maps

- [ ] Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Enable "Maps SDK for Android"
- [ ] Enable "Maps SDK for iOS"
- [ ] Enable "Maps JavaScript API" (for web)
- [ ] Create an API key and restrict it to your app's bundle ID / package name
- [ ] Add the key to `.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Test the map tab on Android, iOS, and web

## 4. App Identity (app.config.ts)

- [ ] `name`: "LNUP" (or your final app name)
- [ ] `slug`: "lnup"
- [ ] `version`: Update to your release version (e.g. "1.0.0")
- [ ] `ios.bundleIdentifier`: Change from `com.lnup.app` to your own (e.g. `com.yourcompany.lnup`)
- [ ] `android.package`: Same as above
- [ ] `scheme`: "lnup" (for deep links)

## 5. App Assets

- [ ] `assets/icon.png` -- 1024x1024 app icon (no transparency for iOS)
- [ ] `assets/adaptive-icon.png` -- Android adaptive icon foreground
- [ ] `assets/splash-icon.png` -- Splash screen logo
- [ ] `assets/favicon.png` -- Web favicon

## 6. Legal Pages (German law requires these for public apps)

- [ ] **Impressum** (`app/imprint.tsx`) -- Must include:
  - Full legal name / company name
  - Address
  - Contact (email, optionally phone)
  - Responsible person (Verantwortlich i.S.d. § 55 Abs. 2 RStV)
  - If applicable: Handelsregister, USt-IdNr
- [ ] **Datenschutzerklarung** (`app/privacy.tsx`) -- Must cover:
  - What data is collected (email, location, photos, push tokens)
  - Supabase as data processor (servers in EU/US)
  - Google Maps usage and data transfer
  - Push notification data
  - User rights (access, deletion, export)
  - Contact for data protection inquiries
- [ ] **Nutzungsbedingungen** (`app/terms.tsx`) -- Should cover:
  - Account creation and responsibilities
  - Content guidelines (no spam, no fake events)
  - Moderation and account suspension
  - Intellectual property
  - Liability limitations

## 7. Google Play Store

- [ ] Create a Google Play Developer account ($25 one-time fee)
- [ ] Generate an upload key: `keytool -genkey -v -keystore lnup-upload.keystore -alias lnup -keyalg RSA -keysize 2048 -validity 10000`
- [ ] Build the Android app: `eas build --platform android --profile production`
- [ ] Create the app listing in Google Play Console:
  - App name, short description, full description (German + English)
  - Screenshots (phone + tablet if applicable)
  - Feature graphic (1024x500)
  - App icon (512x512)
  - Privacy policy URL (link to your hosted privacy page)
  - Content rating questionnaire
  - Target audience and content
- [ ] Upload the AAB file
- [ ] Submit for review

## 8. Apple App Store

- [ ] Enroll in the Apple Developer Program ($99/year)
- [ ] Create an App ID in Apple Developer portal with bundle ID matching `app.config.ts`
- [ ] Create provisioning profiles (development + distribution)
- [ ] Build the iOS app: `eas build --platform ios --profile production`
- [ ] Create the app in App Store Connect:
  - App name, subtitle, description (German + English)
  - Screenshots for required device sizes (6.7", 6.1", optionally iPad)
  - App icon (provided automatically from build)
  - Privacy policy URL
  - App privacy details (data types collected)
  - Age rating
  - Categories: "Social Networking" or "Entertainment"
- [ ] Upload the IPA via Transporter or EAS Submit
- [ ] Submit for review

## 9. Vercel Web Deployment

- [ ] Connect the `Ma4rs/lnup-demo` repo to Vercel
- [ ] Verify `vercel.json` configuration (build command, output directory, rewrites)
- [ ] Set all environment variables in Vercel dashboard
- [ ] Deploy and test at your Vercel URL
- [ ] Optionally: connect a custom domain

## 10. Pre-Launch Testing

- [ ] Create a real account (register, verify email)
- [ ] Create an event with all fields filled
- [ ] Upload a photo to an event
- [ ] Test save/going/confirm actions
- [ ] Test the map with real Google Maps key
- [ ] Test city filter and search
- [ ] Test event edit and delete
- [ ] Test password reset flow
- [ ] Test profile editing (name, username, avatar, bio)
- [ ] Test push notification registration and reminders
- [ ] Test report flow
- [ ] Test on Android device/emulator
- [ ] Test on iOS device/simulator
- [ ] Test web version in Chrome and Safari
- [ ] Verify no console errors or warnings in production build

## 11. Post-Launch

- [ ] Monitor Supabase dashboard for errors
- [ ] Set up Supabase email alerts for high error rates
- [ ] Monitor Google Play Console and App Store Connect for crash reports
- [ ] Respond to user reviews
- [ ] Seed initial events in your target cities to avoid empty feeds
