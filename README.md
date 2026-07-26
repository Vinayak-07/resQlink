# resQlink

A school disaster preparedness app built with React Native and Expo. resQlink helps students and staff learn what to do during earthquakes, fires, and floods through drills, quizzes, and quick reference guides, instead of just reading a PDF nobody opens.

## Background

This was built as a submission for Smart India Hackathon (SIH), the Government of India's nationwide student hackathon under the Ministry of Education. Made it through the internal/institute round and cleared up to the district level before getting knocked out. Keeping the project alive and building on it anyway.

## Why this exists

Most schools have a disaster management plan somewhere in a file, but very few students actually know what to do when something happens. resQlink tries to fix that by turning the standard "drop, cover, hold" style protocols into something people will actually engage with on their phone: short drill walkthroughs, quizzes, a timed go-bag packing game, and a directory of emergency numbers that dial out with one tap.

## Features

- **Drills** - step by step instructions for earthquake, fire, and flood scenarios, based on standard NDMA style protocols
- **Learn** - short modules covering the reasoning behind each drill, not just the steps
- **Quiz** - topic wise quizzes with instant scoring to check what actually stuck
- **Go-Bag Packer** - a timed mini game where you pick the right items for an emergency kit before the clock runs out
- **Alerts** - pulls live disaster alerts from the National Disaster Management Authority's CAP feed
- **Directory** - one tap calling for Police, Fire, Ambulance, National Disaster Helpline, Women's Helpline, and the national emergency number (112)
- **Admin / Stats** - preparedness score, drill completion, and average quiz score, plus a region selector for filtering weather alerts by state
- **Accessibility** - high contrast mode, large text scaling, and reduce motion, all toggleable from settings
- **Bilingual** - full English and Hindi support across the app

## Tech stack

- React Native (0.79) + Expo (SDK 53)
- React Navigation (drawer based navigation)
- Context API for theme, language, accessibility, and stats state
- AsyncStorage for local persistence
- expo-notifications for drill reminders and alert push notifications

## Project structure

```
assets/         app icons and splash screens
components/     shared UI pieces (cards, buttons, drawer content)
constants/      static content: drill steps, quiz questions, translations, styles
contexts/       React context providers (theme, language, accessibility, stats)
navigation/     drawer navigator setup
screens/        one file per screen (Home, Learn, Drills, Quiz, Games, Alerts, Directory, Admin)
services/       alert feed parsing and notification scheduling
utils/          local storage helpers
```

## Running it locally

You'll need Node.js and the Expo CLI.

```bash
git clone https://github.com/Vinayak-07/resQlink.git
cd resQlink
npm install
npm start
```

This opens the Expo dev tools. From there you can scan the QR code with the Expo Go app on your phone, or press `a` / `i` to launch an Android or iOS emulator if you have one set up.

## Status

This started as an Expo Snack project and is still under active development. Some features (like the go-bag packer game) are functional but rough around the edges, and the alert feed relies on a public CORS proxy that may need swapping out later for something more reliable.

## License

0BSD
