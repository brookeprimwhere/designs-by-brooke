async function loadSiteContent() {
  try {
    const response = await fetch("content/site.json");

    if (!response.ok) {
      throw new Error("Could not load site content.");
    }

    const siteContent = await response.json();

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
  } catch (error) {
    console.error(error);
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
    const article = document.createElement("article");
    article.className = "journal-card";

    if (post.image) {
      const image = document.createElement("img");
      image.className = "journal-image";
      image.src = post.image;
      image.alt = post.title || "Journal image";
      article.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = `image-placeholder ${post.styleClass || "material-card-preview"}`;

      const label = document.createElement("span");
      label.textContent = post.label || "Journal";

      placeholder.appendChild(label);
      article.appendChild(placeholder);
    }

    if (post.date) {
      const meta = document.createElement("span");
      meta.className = "journal-meta";
      meta.textContent = post.date;
      article.appendChild(meta);
    }

    const title = document.createElement("h3");
    title.textContent = post.title || "Untitled Journal Entry";
    article.appendChild(title);

    const excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt || "";
    article.appendChild(excerpt);

    journalGrid.appendChild(article);
  });
}

loadSiteContent();
