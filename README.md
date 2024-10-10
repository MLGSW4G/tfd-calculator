# The First Descendant Calculator

Welcome to the **TFD Calculator**! This React JS web app allows you to calculate skill stats for _The First Descendant_ game.

# Usage

To start using the web app, simply follow the link to the deployed web application: [**TFD Calculator**](https://mlgsw4g.github.io/tfd-calculator).

# Pages Breakdown

- **Overview**: Select a skill and set reactor stats to view detailed information about the selected skill stats.
- **Skills List**: Compare different skill stats in a table view.
- **Descendants List**: Choose a descendant and adjust its level with a slider to see its stats.
- **Modules**: Equip and manage your modules with drag-and-drop functionality. Return to the **Overview** page to see how the equipped modules affect skills.
- **Settings**: Customize the appearance of the app. (_Currently only includes language settings._)

# Work in Progress

- [ ] Rethink the translation algorithm.
- [ ] Complete translations for all languages.
- [ ] Finalize translation to Russian.
- [ ] Improve the structure of skill stats.
- [ ] Rework the **Overview** page:
  - [ ] Replace the skill selector with a descendant selector that specifies which skills are displayed.
  - [ ] Display the skills (4 active skills + 1 passive skill) conveniently — either as an accordion view or a simple grid with 5 columns.
  - [ ] Implement additional reactor settings, such as substats and dropdowns for skill element and skill type bonus selection.
  - [ ] Add a reactor logo window with live preview.
  - [ ] Enhance the visualization of applied module effects.
  - [ ] Address display of effects that require special conditions (e.g., when using a skill or while running).
  - [ ] Include tooltips for each skill stat TextField explaining how the value is calculated (e.g., Skill damage 2: `264295 = 18759.39325 * 1.2 * 1.2 * (1.487 + 0.13 + 0.19)`).
- [ ] Populate the **Descendant List** with useful data and various images.
- [ ] Complete the **Modules** page functionality:
  - [ ] Add a module capacity indicator with a logo and a graph visualizing module capacity.
  - [ ] Implement changes to equipped modules capacity based on slot socket type.
  - [ ] Introduce a mode for selecting slot socket types.
  - [ ] Fix search functionality to search by displayed names and values, not just English names.
  - [ ] Make the **module-zone** box height adjustable.
- [ ] Fix 404 error issues:
  - [ ] Allow users to navigate to any page, not just the root page.
  - [ ] Resolve 404 errors on page refresh.
  - [ ] Ensure redirects maintain proper view of NavTabs on reload.
- [ ] Adjust scaling of the entire web app and modules.
- [ ] Ensure mobile device compatibility:
  - [ ] Develop a mobile version of the web app that users are redirected to on mobile devices.
  - [ ] Create a progressive web app version specifically for mobile.
- [ ] Implement weapon stats calculation with a separate modules page.
- [ ] Add dark theme or multiple themes.
- [ ] Switch from importing CSS files to using `styled` components and themes.
- [ ] Create a web app logo.

# Disclaimer

This project is an independent web application inspired by [_The First Descendant_](https://tfd.nexon.com) game.

- The images and data used in this application are sourced from _The First Descendant_ and are the property of the game's developers - [_NEXON Games Co., Ltd_](https://nexon.com).
- This web application is not affiliated with or endorsed by NEXON Games Co., Ltd.
- Code development has been aided by _ChatGPT-3.5 turbo_ and [_BLACKBOX.AI_](https://blackbox.ai) for writing and problem-solving.

Please support the original game and its developers.
