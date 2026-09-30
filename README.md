<img width="1920" height="1080" alt="EcoStep" src="https://github.com/user-attachments/assets/7e587212-4353-483a-99c7-ae5262903861" />


# 🌿 EcoStep — Client

> **Come together, make greener.**<br/>
> A React Native app that turns everyday eco-friendly actions into a virtual tree-growing simulation.
> HultPrize On-Campus 2024–2025

<br/>

## 📖 About the Project

**EcoStep** makes environmental action simple, rewarding, and visible for university students.

```
1. Perform simple eco-friendly actions
2. Get rewards for their efforts
3. Grow a virtual tree
```

Students complete daily missions — using a tumbler, taking public transport, zero-waste meals — earn campus mileage, and watch their tree grow through four stages as the impact accumulates.

This repository is the **mobile client**, built with React Native and Expo.

<br/>

## 🛠️ Tech Stack

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EAS Build](https://img.shields.io/badge/EAS_Build-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

<br/>

## 🏗️ Architecture

<img width="869" height="547" alt="Group 1707482376" src="https://github.com/user-attachments/assets/a8e42506-8987-45c7-aff6-3e799b283ed4" />

The client renders app state served by the backend and delivers mission-verification images into the AI pipeline through backend APIs.

<br/>

## 📱 Screens

| Screen | Description |
| :--- | :--- |
| **Home** | Tree growth across four stages, driven by water and fertilizer earned from missions |
| **Campus Forest** | Daily check-in, quizzes, step-count missions, building-specific challenges |
| **Ranking** | College-level leaderboard |
| **Activity** | Mission history and monthly statistics |

<br/>

## 🎨 Design System

Implemented from the team's Figma design system.

<table>
<tr><td><b>Typeface</b></td><td>Inter — Bold · SemiBold · Medium · Regular · Light</td></tr>
<tr><td><b>Main</b></td><td><code>#32B9B4</code></td></tr>
<tr><td><b>Primary</b></td><td><code>#36C597</code></td></tr>
<tr><td><b>Sub</b></td><td><code>#77F3C2</code> · <code>#B9F1EF</code></td></tr>
<tr><td><b>Character</b></td><td>Four tree growth stages, each with its own illustration</td></tr>
</table>

<br/>

## 🗂️ Structure

```
├── App.js            Entry point · navigation
├── app.json          Expo config
├── eas.json          EAS build profiles
├── assets/           Images · fonts
├── components/       Shared UI components
└── pages/            Screen-level components
```

<br/>

## ✨ My Role

I was responsible for the **frontend client**, including:

- Cross-platform Android / iOS app with React Native and Expo
- Tree-growing gamification UI — four growth stages driven by server state
- Step-count tracking and mission completion logic
- REST API integration with the backend, including the mission-verification flow handled by the AI service
- Behavior-log event design applied across the app — screen views, button taps, dwell time. **3,326 events collected**, which surfaced a usage spike right after the weekly eco-mission release
- Design system implementation from Figma

<br/>

## 👥 Team

<img width="1080" height="1350" alt="dd" src="https://github.com/user-attachments/assets/6d82835f-5e4f-46a4-8236-64d7841ac372" />

<br/>

## 🚀 Getting Started

```bash
yarn install
npx expo start
```

```bash
eas build --platform android
```
