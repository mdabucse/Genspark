# Day 52: Angular Weather Forecast Dashboard

A lightweight, premium weather forecast dashboard built using Angular (standalone component structure, Observables, and Angular HttpClient) and deployed via GitHub Actions to GitHub Pages.

## Features
- **Angular Services & Observables**: Fetches weather forecasts cleanly on page load using an Angular HttpClient service (`WeatherService`).
- **Interactive UI & Loader**: Standard Angular `*ngIf` structural directives manage active loading spinner states and elegant error panels.
- **Refresh Control**: Leverages event binding (`(click)`) to trigger weather service updates with a rotating refresh icon (**Bonus 3**).
- **Forecast Count**: Displays total weather dashboard entries in a custom status card (**Bonus 1**).
- **Row Highlighting**: Utilizes Angular `[class.hot-row]` to identify and highlight scorching days above 30°C (**Bonus 2**).
- **Fully Responsive**: Crafted with modern Glassmorphic CSS selectors matching both mobile and desktop viewports.

## Project Details
- **Angular Version**: Angular 19+ (with standalone architectures)
- **API Endpoint**: `https://sampleapi20260706g3-bvdacte9b0dvhudv.canadacentral-01.azurewebsites.net/Weatherforecast`
- **Deployment URL**: [https://mdabucse.github.io/Genspark/](https://mdabucse.github.io/Genspark/)

## Installation & Local Execution
1. Clone this repository:
   ```bash
   git clone https://github.com/mdabucse/Genspark.git
   ```
2. Navigate to the task directory:
   ```bash
   cd Genspark/Day-52/Task-1
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run start
   ```
5. Open your browser to `http://localhost:4200/`.
