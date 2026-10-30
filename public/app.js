const grid = document.querySelector("#course-grid");
const errorMessage = document.querySelector("#course-error");
const dialog = document.querySelector("#course-dialog");
const filters = document.querySelectorAll("[data-filter]");

const symbols = {
  "cloud-foundations": { symbol: "☁", theme: "cloud" },
  "network-security": { symbol: "✳", theme: "security" },
  "devops-practices": { symbol: "↗", theme: "devops" },
  "software-architecture": { symbol: "⌘", theme: "engineering" },
};

let courses = [];

function createCourseCard(course) {
  const art = symbols[course.id] || { symbol: "✦", theme: "cloud" };
  const card = document.createElement("article");
  card.className = "course-card";

  const image = document.createElement("div");
  image.className = `course-art ${art.theme}`;
  image.setAttribute("aria-hidden", "true");
  image.textContent = art.symbol;

  const body = document.createElement("div");
  body.className = "course-body";

  const category = document.createElement("span");
  category.className = "course-category";
  category.textContent = course.category;

  const title = document.createElement("h3");
  title.textContent = course.title;

  const description = document.createElement("p");
  description.className = "course-description";
  description.textContent = course.description;

  const meta = document.createElement("div");
  meta.className = "course-meta";
  meta.textContent = `${course.level} · ${course.duration}`;

  const button = document.createElement("button");
  button.className = "course-link";
  button.type = "button";
  button.textContent = "View course →";
  button.addEventListener("click", () => openCourse(course.id));

  body.append(category, title, description, meta, button);
  card.append(image, body);
  return card;
}

function renderCourses(category = "All") {
  const visible = category === "All"
    ? courses
    : courses.filter((course) => course.category === category);

  grid.replaceChildren(...visible.map(createCourseCard));
}

async function openCourse(id) {
  try {
    const response = await fetch(`/api/courses/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error("Unable to load course");

    const course = await response.json();

    document.querySelector("#dialog-category").textContent = course.category;
    document.querySelector("#dialog-title").textContent = course.title;
    document.querySelector("#dialog-description").textContent = course.description;
    document.querySelector("#dialog-meta").textContent =
      `${course.level} · ${course.duration}`;

    dialog.showModal();
  } catch {
    errorMessage.textContent = "Course details are temporarily unavailable.";
    errorMessage.hidden = false;
  }
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCourses(button.dataset.filter);
  });
});

document.querySelector("#dialog-close").addEventListener("click", () => {
  dialog.close();
});

document.querySelector("#year").textContent = new Date().getFullYear();

async function initialize() {
  try {
    const response = await fetch("/api/courses");
    if (!response.ok) throw new Error("Unable to load courses");

    const data = await response.json();
    courses = data.courses;
    renderCourses();
  } catch {
    grid.replaceChildren();
    errorMessage.textContent = "Courses are temporarily unavailable. Please try again later.";
    errorMessage.hidden = false;
  }
}

initialize();
