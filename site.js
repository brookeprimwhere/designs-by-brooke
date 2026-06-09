async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json");

    if (!response.ok) {
      throw new Error("Could not load site content.");
    }

    const siteContent = await response.json();

    if (document.getElementById("portfolio-grid")) {
      loadHomePage(siteContent);
    }

    if (document.getElementById("journal-detail")) {
      loadJournalDetail(siteContent);
    }
  } catch (error) {
    console.error(error);
  }
}

function loadHomePage(siteContent) {
  updateText("brand-title", siteContent.heroHeadline);
  updateText("hero-kicker", siteContent.heroKicker);
  updateText("hero-text", siteContent.heroText);
  updateText("about-heading", siteContent.aboutHeading);
  updateText("about-text", siteContent.aboutText);
  updateText("portfolio-intro", siteContent.portfolioIntro);
  updateText("journal-heading", siteContent.journalHeading);
  updateText("journal-intro", siteContent.journalIntro);
  updateText("contact-heading", siteContent.contactHeading);
  updateText("contact-text", siteContent.contactText);

  updateEmail(siteContent.contactEmail);
  renderPortfolio(siteContent.portfolioItems || []);
  renderJournal(siteContent.journalPosts || []);
  updateText("footer-text", "© 2026 Designs by Brooke. All rights reserved.");
}

function loadJournalDetail(siteContent) {
  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get("post");
  const posts = siteContent.journalPosts || [];
  const post = posts.find((item) => item.slug === requestedSlug);

  if (!post) {
    updateText("journal-detail-title", "Journal entry not found");
    updateText("journal-detail-meta", "Designs by Brooke");

    const body = document.getElementById("journal-detail-body");
    if (body) {
      body.innerHTML = "<p>The journal entry you are looking for could not be found.</p>";
    }

    return;
  }

  document.title = `${post.title} | Designs by Brooke`;

  updateText("journal-detail-title", post.title);
  updateText("journal-detail-meta", post.date || post.label || "Journal");

  const imageContainer = document.getElementById("journal-detail-image");

  if (imageContainer && post.image) {
    imageContainer.className = "journal-detail-image";
    imageContainer.innerHTML = `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">`;
  }

  const body = document.getElementById("journal-detail-body");

  if (body) {
    body.innerHTML = markdownToHtml(post.body || post.excerpt || "");
  }
}

function updateText(elementId, value) {
  const element = document.getElementById(elementId);

  if (element && value) {
    element.textContent = value;
  }
}

function updateEmail(email) {
  const emailLink = document.getElementById("email-link");

  if (!emailLink) {
    return;
  }

  if (email && email !== "add-email-here") {
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
  } else {
    emailLink.textContent = "Contact email coming soon";
    emailLink.href = "#contact";
  }
}

function renderPortfolio(items) {
  const portfolioGrid = document.getElementById("portfolio-grid");

  if (!portfolioGrid) {
    return;
  }

  portfolioGrid.innerHTML = "";

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "portfolio-card";

    if (item.image) {
      const image = document.createElement("img");
      image.className = "portfolio-image";
      image.src = item.image;
      image.alt = item.title || "Portfolio image";
      article.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = `image-placeholder ${item.styleClass || "texture-card"}`;

      const label = document.createElement("span");
      label.textContent = item.label || item.title || "Portfolio";

      placeholder.appendChild(label);
      article.appendChild(placeholder);
    }

    const title = document.createElement("h3");
    title.textContent = item.title || "Untitled Project";
    article.appendChild(title);

    const description = document.createElement("p");
    description.textContent = item.description || "";
    article.appendChild(description);

    portfolioGrid.appendChild(article);
  });
}

function renderJournal(posts) {
  const journalGrid = document.getElementById("journal-grid");

  if (!journalGrid) {
    return;
  }

  journalGrid.innerHTML = "";

  posts.forEach((post) => {
    const link = document.createElement("a");
    link.className = "journal-card";
    link.href = `journal.html?post=${encodeURIComponent(post.slug || "")}`;
    link.setAttribute("aria-label", `Read journal entry: ${post.title || "Untitled Journal Entry"}`);

    if (post.image) {
      const image = document.createElement("img");
      image.className = "journal-image";
      image.src = post.image;
      image.alt = post.title || "Journal image";
      link.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = `image-placeholder ${post.styleClass || "material-card-preview"}`;

      const label = document.createElement("span");
      label.textContent = post.label || "Journal";

      placeholder.appendChild(label);
      link.appendChild(placeholder);
    }

    if (post.date) {
      const meta = document.createElement("span");
      meta.className = "journal-meta";
      meta.textContent = post.date;
      link.appendChild(meta);
    }

    const title = document.createElement("h3");
    title.textContent = post.title || "Untitled Journal Entry";
    link.appendChild(title);

    const excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt || "";
    link.appendChild(excerpt);

    journalGrid.appendChild(link);
  });
}

function markdownToHtml(markdown) {
  if (!markdown) {
    return "";
  }

  const lines = markdown.split("\n");
  let html = "";
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      return;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${escapeHtml(trimmed.replace("### ", ""))}</h3>`;
      return;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${escapeHtml(trimmed.replace("## ", ""))}</h2>`;
      return;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${escapeHtml(trimmed.replace("- ", ""))}</li>`;
      return;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    html += `<p>${escapeHtml(trimmed)}</p>`;
  });

  if (inList) {
    html += "</ul>";
  }

  return html;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadSiteContent();
