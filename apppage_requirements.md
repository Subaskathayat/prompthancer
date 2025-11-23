✅ FULL STRUCTURE DESCRIPTION (HTML + CSS + JS)

Project: Promptbrary — AI-powered Prompt Engineering SaaS
Goal: Build a minimal, modern, clean white App page for our SaaS with soft spacing, large typography, and simple layout.

This document defines the layout, components, and interactions needed to build the basic structure for app.html page

1️⃣ Page Layout Overview

The app layout is divided into three main sections:

A. Left Sidebar

A vertical navigation sidebar.

B. Center Panel

Contains the user input field (raw prompt).

C. Right Panel

Displays the enhanced / optimized prompt output.

The layout is a three-column flexbox, with the sidebar having a fixed width and the other two panels expanding fluidly.

2️⃣ Left Sidebar Structure
Purpose

Navigation and app organization.

Content

 Logo area (top)

Navigation Items , icons are in 'icons/' root folder

icon + Prompt Enhancer

icon Social Media Content

icon+ History

liked icon + Saved

Profile, profile picture images/profile.jpg of user with name "Subas Kathayat" (bottom)

Behavior

Clicking a navigation item switches the center+right panel content.

Active item is highlighted.

Sidebar styling

Fixed width (250px recommended).

Full height (100vh).

Light background (#f7f7f7 or white).

Icons optional.

3️⃣ Center Panel Structure (User Input Panel)
Purpose

User enters their raw text that needs enhancement.

Content

Title: “What would you like to enhance?”

A large textarea for input.

Length select : 

Short
Auto
Medium
Long

Dropdown: “Choose Model” (ChatGPT)

input field for entering API key (has hide and show eye icon)

Button: Enhance Prompt + icons/send_icon_right_arrow (primary action)

Behavior

Clicking Enhance sends the text for processing (handled by JS).

After enhancement, the right panel updates.

Styling

White card/container.

Rounded corners & subtle shadows.

Padding ~ 24px.

Vertical spacing between elements.

4️⃣ Right Panel Structure (Output Panel)
Purpose

Displays the optimized / enhanced prompt.

Content

Title: “Your Enhanced Prompt”

Output area (scrollable)

Buttons with icons :

Copy

Save

Re-Enhance

Behavior

Copy: Copies enhanced prompt to clipboard.

Save: Stores to LocalStorage → appears under “Saved”.

Re-enhance: Sends the enhanced prompt back into the center panel’s textarea for another pass.

Styling

White card.

Scrollable content.

Buttons at top-right.

5️⃣ Navigation Pages

The four pages in sidebar should switch only the content inside the center and right panels.

Page 1: Prompt Enhancer (default)

Center: input textarea

Right: enhanced output

Page 2: Social Media Content

Center:

Options such as: Instagram caption, X post, LinkedIn post

Input fields based on selection


Title: “write your post idea”

A large textarea for input.

Selection Formality:

Auto 

Casual

Neutral

Formal

Selection of Tone:

Auto
Enthusiastic
Concerned
Sincere
sarcasm
Empathetic
Candid
Humorous
Optimistic
Humble

input field for entering API key (has hide and show eye icon)

Button: Generate Post + icons/send_icon_right_arrow (primary action)

Behavior

Clicking Generate Post sends the post idea for processing (handled by JS).

After enhancement, the right panel updates.

Styling

White card/container.

Rounded corners & subtle shadows.

Padding ~ 24px.

Vertical spacing between elements.


Right:

Generated social content

Page 3: History

Shows a list of previously generated content
(stored in LocalStorage)

Page 4: Saved

Shows saved enhanced prompts
(stored in LocalStorage)

6️⃣ JavaScript Basic Logic
A. Navigation Switching

Add event listeners to sidebar items.

When clicked → hide other panels, show correct panel content.

B. Prompt Enhancement Logic

For now, dummy function:

function enhancePrompt(rawText) {
   return "Enhanced version: " + rawText;
}


Later you will replace with AI API calls.

C. Copy Function

Use navigator.clipboard.writeText().

D. Save Function

Save enhanced prompt to LocalStorage array named savedPrompts.

E. History System

Every enhancement → save input + output + timestamp to history.

7️⃣ Recommended CSS Structure

Use:

Flexbox for layout

Grid inside cards if needed

CSS variables for theme

Layout Example
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
}

.main {
  flex: 1;
  display: flex;
}

.center-panel {
  flex: 1;
}
.right-panel {
  flex: 1;
}

You must produce:

Clean, minimal HTML structure

Modern white-themed CSS styling

Light animations optional (fade-in)

Fully responsive layout

No external frameworks unless necessary (pure HTML/CSS/JS is ok)

⭐ 10. Tone of the App Page

Professional

Clean and modern

Easy to read

Friendly for SaaS