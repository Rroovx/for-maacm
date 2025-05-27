document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const heartsContainer = document.getElementById("hearts-container");

  // Dropdown Toggle
  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu?.classList.toggle("show");
  });

  document.querySelectorAll(".preview-box").forEach(link =>
    link.addEventListener("click", () => dropdownMenu?.classList.remove("show"))
  );

  document.querySelectorAll(".btndropdown").forEach(link =>
  link.addEventListener("click", () => dropdownMenu?.classList.remove("show"))
);


  document.addEventListener("click", (e) => {
    if (!dropdownMenu?.contains(e.target) && !menuToggle?.contains(e.target)) {
      dropdownMenu?.classList.remove("show");
    }
  });

  // Theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    dropdownMenu?.classList.remove("show");
  });

  // Floating Hearts
  function createHeart() {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.classList.add("floating-heart");
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 3 + Math.random() * 2 + "s";
    heartsContainer?.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
  }
  setInterval(createHeart, 500);

  // Live Counter
   function updateLiveCounter() {
    const counterEl = document.getElementById("live-counter");
    const startDate = new Date("2023-11-22T00:00:00");
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (counterEl) {
      counterEl.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds together`;
    }
  }
  updateLiveCounter();
  setInterval(updateLiveCounter, 1000);

  // Notes
  loadNotes();

  // Birthday Countdown
  startBirthdayCountdown();
});

// Scroll to top on load
window.addEventListener("load", () => window.scrollTo(0, 0));
window.history.replaceState(null, "", window.location.pathname);

// Birthday Countdown
function startBirthdayCountdown() {
  const birthday = new Date("2025-07-26T00:00:00");
  const timerEl = document.getElementById("bday-timer");
  const buttonEl = document.getElementById("birthday-button");
  const musicEl = document.getElementById("surprise-music");

  buttonEl?.addEventListener("click", () => {
    if (!buttonEl.disabled) {
      document.getElementById("click-sound")?.play();
      launchConfetti();
      musicEl?.play();
      setTimeout(() => window.location.href = "lamdingpage.html", 3000);
    }
  });

  function updateCountdown() {
    const now = new Date();
    const diff = birthday - now;
    if (diff <= 0) {
      timerEl.textContent = "🎉 It's the big day!";
      buttonEl.disabled = false;
      buttonEl.textContent = "🎁 Open Your Surprise!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

// Notes
function openNoteModal() {
  document.getElementById("note-modal").classList.remove("hidden");
}

function closeNoteModal() {
  document.getElementById("note-modal").classList.add("hidden");
}

function saveNote() {
  const text = document.getElementById("note-text").value.trim();
  if (text) {
    const id = Date.now();
    addNoteToDOM(text, id);
    saveNoteToLocalStorage({ text, id });
    document.getElementById("note-text").value = "";
    closeNoteModal();
  }
}

function addNoteToDOM(text, id) {
  const newNote = document.createElement("div");
  newNote.className = "note";
  newNote.dataset.id = id;

  const noteContent = document.createElement("div");
  noteContent.className = "note-text";
  noteContent.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn hidden";

  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    newNote.remove();
    deleteNoteFromLocalStorage(id);
  };

  newNote.appendChild(noteContent);
  newNote.appendChild(deleteBtn);

  newNote.addEventListener("click", () => {
    newNote.classList.toggle("expanded");
    deleteBtn.classList.toggle("hidden");
  });

  document.getElementById("notes").insertBefore(newNote, document.querySelector("#notes .btn"));
}

function saveNoteToLocalStorage(note) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNoteFromLocalStorage(id) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  savedNotes.forEach(note => addNoteToDOM(note.text, note.id));
}

// Gallery Toggle
function expandGallery() {
  const wrapper = document.getElementById('gallery-wrapper');
  const btn = document.getElementById('view-more-btn');
  const isCollapsed = wrapper.classList.contains('collapsed');

  wrapper.classList.toggle('collapsed', !isCollapsed);
  wrapper.classList.toggle('expanded', isCollapsed);
  btn.textContent = isCollapsed ? 'Show Less' : 'View More Photos';
  if (!isCollapsed) wrapper.scrollTop = 0;
}

// Wishlist
const wishlistInput = document.getElementById("newWishInput");
const wishlistItems = document.getElementById("wishlistItems");
const showMoreBtn = document.getElementById("showMoreBtn");
const MAX_VISIBLE_ITEMS = 3;
let showAll = false;

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishes) {
  localStorage.setItem("wishlist", JSON.stringify(wishes));
}

function getArchive() {
  return JSON.parse(localStorage.getItem("wishlistArchive")) || [];
}

function saveArchive(archive) {
  localStorage.setItem("wishlistArchive", JSON.stringify(archive));
}

function createWishlistItem(wish, index, wishes) {
  const li = document.createElement("li");
  li.className = "wishlist-item";

  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "wish-checkbox";
  checkbox.checked = wish.checked;

  const span = document.createElement("span");
  span.className = "wish-text";
  span.textContent = wish.text;
  if (wish.checked) span.classList.add("checked");

  checkbox.addEventListener("change", () => {
    wishes[index].checked = checkbox.checked;
    saveWishlist(wishes);
    renderWishlist();
  });

  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);
  return li;
}

function renderWishlist() {
  const wishes = getWishlist();
  wishlistItems.innerHTML = "";

  const visibleWishes = showAll ? wishes : wishes.slice(0, MAX_VISIBLE_ITEMS);
  visibleWishes.forEach((wish, index) => wishlistItems.appendChild(createWishlistItem(wish, index, wishes)));

  showMoreBtn.style.display = wishes.length <= MAX_VISIBLE_ITEMS ? "none" : "inline-block";
  showMoreBtn.textContent = showAll ? "Show Less" : "Show More";
}

window.addWish = function () {
  const wishText = wishlistInput.value.trim();
  if (!wishText) return;

  const wishes = getWishlist();
  wishes.push({ text: wishText, checked: false });
  saveWishlist(wishes);
  wishlistInput.value = "";
  showAll = true;
  renderWishlist();

  setTimeout(() => wishlistItems.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
};

window.archiveChecked = function () {
  let wishes = getWishlist();
  let archive = getArchive();

  const checked = wishes.filter(w => w.checked);
  const remaining = wishes.filter(w => !w.checked);

  saveWishlist(remaining);
  saveArchive(archive.concat(checked));
  renderWishlist();
  renderArchive();
};

function renderArchive() {
  const archivedItems = document.getElementById("archivedItems");
  const archive = getArchive();
  archivedItems.innerHTML = "";

  archive.forEach(wish => {
    const li = document.createElement("li");
    li.className = "archived-item";
    li.textContent = wish.text;
    archivedItems.appendChild(li);
  });
}

document.querySelectorAll('.photo img').forEach(img => {
  img.addEventListener('click', () => {
    // If any other photo is enlarged, close it first
    const currentlyEnlarged = document.querySelector('.photo img.enlarged');
    if (currentlyEnlarged && currentlyEnlarged !== img) {
      currentlyEnlarged.classList.remove('enlarged');
    }

    // Toggle enlarge on clicked image
    img.classList.toggle('enlarged');
  });
});


window.toggleArchive = function () {
  const panel = document.getElementById("archive-panel");
  const isVisible = panel.style.display === "block";
  panel.style.display = isVisible ? "none" : "block";
  if (!isVisible) renderArchive();
};

function clearArchive() {
  if (confirm("Are you sure you want to delete all archived wishes?")) {
    localStorage.removeItem("wishlistArchive");
    renderArchive(); 
  }
}


// Relationship Countdown
const startDate = new Date("2023-11-22T00:00:00");

function getNextMonthsary(baseDate) {
  const next = new Date(baseDate);
  next.setMonth(next.getMonth() + 1);
  return next;
}

function getNextAnniversary(baseDate) {
  const now = new Date();
  const anniv = new Date(baseDate);
  anniv.setFullYear(now.getFullYear());
  if (anniv < now) anniv.setFullYear(now.getFullYear() + 1);
  return anniv;
}

function formatTimeDiff(diff) {
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateCountdowns() {
  const now = new Date();
  const daysTogether = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days-together").textContent = `${daysTogether} days together 💖`;

  let nextMonthsary = new Date(startDate);
  while (nextMonthsary <= now) nextMonthsary = getNextMonthsary(nextMonthsary);
  document.getElementById("monthsary-countdown").textContent =
    "Next Monthsary in: " + formatTimeDiff(nextMonthsary - now);

  const anniv = getNextAnniversary(startDate);
  document.getElementById("anniversary-countdown").textContent =
    "2nd Anniversary in: " + formatTimeDiff(anniv - now);
}
updateCountdowns();
setInterval(updateCountdowns, 1000);

// Initial Load
renderWishlist();
renderArchive();
