# Robert Asamoah – Personal Developer Portfolio

A modern, fast, accessible, and responsive personal developer portfolio website designed for **Robert Asamoah** (Junior Web Developer / Frontend Developer). Built with semantic HTML5, modern Tailwind CSS, and modular vanilla JavaScript. Ready to deploy directly to [Vercel](https://vercel.com).

Live Preview Target: [robert-asamoah.vercel.app](https://robert-asamoah.vercel.app)

---

## 🚀 Key Highlights & Features

- **Single-Page Smooth Scrolling**: Sticky glassmorphism header with active section tracking (`#hero`, `#about`, `#skills`, `#projects`, `#contact`).
- **Dark & Light Mode**: Seamless theme toggle with system preference detection and `localStorage` persistence (anti-flicker pre-hydration).
- **Interactive Projects Gallery**: Driven entirely by a single data repository in `js/projects.js` with category filtering, tech badges, live demo, and GitHub links.
- **Accessible Contact Form**: Real-time client-side input validation, accessible error notifications, and zero-config integration with Formspree or Web3Forms.
- **WCAG 2.1 AA Compliant**: High-contrast ratios, visible focus indicators (`:focus-visible`), keyboard navigable drawer and links, semantic landmark tags, and `prefers-reduced-motion` support.
- **100/100 SEO & Social Sharing**: Pre-configured Open Graph tags, Twitter summary card, XML sitemap, `robots.txt`, and vector SVG favicon.
- **Zero Build Friction**: No heavy `node_modules` or complex build pipelines required. Opens in any web browser and deploys to Vercel in seconds.

---

## 📁 Project Structure

```text
ROBERT WEBSITES/
├── index.html              # Main single-page semantic HTML5 structure with complete SEO & Meta tags
├── vercel.json             # Vercel configuration for clean URLs and security headers
├── robots.txt              # Search engine crawler instructions
├── sitemap.xml             # XML sitemap for SEO indexing
├── css/
│   └── styles.css          # Custom styling, smooth scroll, reduced motion, theme transitions, animations
├── js/
│   ├── projects.js         # Single data array for all featured projects (easy to edit/add)
│   ├── theme.js            # Dark/light mode manager with localStorage persistence & system preference
│   └── main.js             # Mobile menu, dynamic project card renderer, contact form validation & submission
├── assets/
│   ├── favicon.svg         # Modern vector favicon with code icon
│   ├── og-image.svg        # Open Graph / Twitter social sharing preview graphic
│   └── resume.pdf          # Resume document placeholder (replace with your real CV PDF)
└── README.md               # Documentation and personalization guide
```

---

## 💻 Local Development & Preview

Because this project is built with standard web technologies, there are no complicated installation steps!

### Option 1: Direct Browser Preview
Double-click `index.html` in your file explorer to open it directly in Chrome, Edge, Safari, or Firefox.

### Option 2: Using VS Code Live Server (Recommended)
1. Open this folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.

### Option 3: Using Node.js or Python (Built-in Server)
```bash
# Using Node.js (npx serve):
npx serve .

# Or using Python 3:
python -m http.server 3000
```
Then visit `http://localhost:3000`.

---

## 🛠️ Personalization & Customization Guide

### 1. Updating Featured Projects (`js/projects.js`)
All projects displayed in the portfolio are defined in `js/projects.js`. To add or edit a project, simply update the `projects` array:

```javascript
{
  id: 1,
  title: "Your Project Title",
  category: "Web Application", // Category used for filtering
  description: "A short, engaging summary of what you built and the problem it solves.",
  image: "https://images.unsplash.com/... or ./assets/my-project.png",
  tags: ["React", "Tailwind CSS", "JavaScript"],
  liveUrl: "https://your-project.vercel.app",
  githubUrl: "https://github.com/robert-asamoah/your-repo",
  featured: true, // Shows a "Featured" badge on the card
}
```

### 2. Updating Profile Information (`index.html`)
Open `index.html` and search for the following sections to customize:
- **Hero Section (`#hero`)**: Update tagline or availability status.
- **Social & Contact Links (`#contact`)**:
  - Replace `robert.asamoah.dev@example.com` with your real email.
  - Replace `https://github.com/robert-asamoah` with your actual GitHub profile.
  - Replace `https://linkedin.com/in/robert-asamoah` with your LinkedIn URL.
- **Profile Photo**: Replace the Unsplash placeholder in the About Me section with your actual photo (or drop your photo in `assets/profile.jpg` and set `src="./assets/profile.jpg"`).
- **Resume**: Replace `assets/resume.pdf` with your actual resume PDF.

### 3. Setting Up the Contact Form (Formspree or Web3Forms)
By default, the contact form operates in **interactive demo mode** (validating input and displaying a friendly simulated success response).

To connect real email delivery:

#### Using Formspree (Free):
1. Go to [https://formspree.io](https://formspree.io) and create a free account.
2. Click **"+ New Form"** and name it "Portfolio Contact Form".
3. Copy your unique form endpoint URL (e.g., `https://formspree.io/f/mqkvywza`).
4. Open `js/main.js` and paste your endpoint into `CONFIG.formEndpoint`:
   ```javascript
   const CONFIG = {
     formEndpoint: "https://formspree.io/f/mqkvywza",
   };
   ```

#### Or Using Web3Forms (No Registration Required):
1. Go to [https://web3forms.com](https://web3forms.com) and enter your email to receive a free Access Key.
2. In `js/main.js`, set `CONFIG.formEndpoint = "https://api.web3forms.com/submit"` and pass your key in the form body.

---

## 🚢 Deploying to Vercel via GitHub

Follow these steps to deploy your portfolio with a free `.vercel.app` domain and automatic SSL:

### Step 1: Initialize Git and Push to GitHub
1. Create a new repository on [GitHub](https://github.com) called `robert-asamoah-portfolio`.
2. Open your terminal in this project directory and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Robert Asamoah portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/robert-asamoah-portfolio.git
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your `robert-asamoah-portfolio` repository.
4. In the Project Configuration screen:
   - **Framework Preset**: Select `Other` (or leave default static).
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (no build step needed!).
   - **Output Directory**: Leave empty.
5. Click **"Deploy"**.

Your website will be live worldwide in under 15 seconds at a URL such as `https://robert-asamoah.vercel.app`! Every subsequent push to `main` on GitHub will automatically trigger an instant preview and production redeployment.

---

## ✅ Personalization Checklist

Before sharing your portfolio with hiring managers, run through this quick checklist:

- [ ] **Profile Photo**: Add your headshot to `assets/` and link it in the About Me section.
- [ ] **Resume PDF**: Replace `assets/resume.pdf` with your up-to-date resume.
- [ ] **Projects Data**: Open `js/projects.js` and update the titles, descriptions, live demo URLs, and GitHub repository links for your 3 projects.
- [ ] **Contact Form**: Create a free form at [formspree.io](https://formspree.io) and paste your endpoint into `js/main.js`.
- [ ] **Direct Social Links**: Ensure your GitHub, LinkedIn, and email address in `index.html` point to your real accounts.
- [ ] **Canonical URL & SEO**: Update the domain in `index.html`, `sitemap.xml`, and `robots.txt` if you connect a custom domain (e.g. `robertasamoah.dev`).
