/**
 * ====================================================================
 * PROJECTS DATA REPOSITORY
 * ====================================================================
 * Edit this file to add, modify, or remove projects displayed on your site.
 * 
 * Instructions to replace placeholder projects:
 * 1. Update `title`, `description`, `category`, and `tags`
 * 2. Set `liveUrl` to your deployed application URL (e.g. Vercel, Netlify)
 * 3. Set `githubUrl` to your repository on GitHub
 * 4. Replace `image` with a link to your screenshot, or place an image in
 *    the assets folder and set `image: "./assets/your-screenshot.png"`
 * ====================================================================
 */

export const projects = [
  {
    id: 1,
    title: "DevFlow – Developer Task Board",
    category: "Web Application",
    description:
      "A sleek, responsive Kanban-style task management application. Features intuitive drag-and-drop workflow, task filtering by priority, persistent local storage, and dark mode support.",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1000&q=80",
    tags: ["React", "Tailwind CSS", "JavaScript", "LocalStorage"],
    liveUrl: "https://example.com/demo-devflow",
    githubUrl: "https://github.com/robert-asamoah/devflow",
    featured: true,
  },
  {
    id: 2,
    title: "ShopNest – Modern E-Commerce Storefront",
    category: "E-Commerce",
    description:
      "A fast, responsive product catalog and shopping cart experience. Includes dynamic product filtering, price sorting, interactive cart drawer, mock checkout flow, and fluid micro-interactions.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1000&q=80",
    tags: ["React", "Tailwind CSS", "REST API", "Responsive Design"],
    liveUrl: "https://example.com/demo-shopnest",
    githubUrl: "https://github.com/robert-asamoah/shopnest",
    featured: true,
  },
  {
    id: 3,
    title: "WeatherSphere – Real-Time Weather Tracker",
    category: "Utility & APIs",
    description:
      "An interactive weather dashboard delivering 5-day forecasts, location-based weather detection, air quality indexes, and temperature metric toggle. Built with clean semantic HTML5, modern vanilla JavaScript, and Tailwind CSS.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1000&q=80",
    tags: ["JavaScript", "Tailwind CSS", "Fetch API", "Weather API"],
    liveUrl: "https://example.com/demo-weathersphere",
    githubUrl: "https://github.com/robert-asamoah/weathersphere",
    featured: false,
  },
];
