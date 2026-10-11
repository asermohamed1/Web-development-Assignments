# Study Guide — Lab 1: Dynamic User Directory & Live Clock

This guide walks through the lab one task at a time. For each task it covers:

1. **Requirement**: what the PDF asks for.
2. **Solution**: the code from this folder.
3. **Explanation**: how the code works and why it was written that way.
4. **Key concepts / common mistakes**: what to remember for quizzes and exams.

---

## Table of Contents

- [0. The Big Picture](#0-the-big-picture)
- [1. Workspace & File Structure](#1-workspace--file-structure)
- [2. Task 1 — HTML Structure](#2-task-1--html-structure-indexhtml)
- [3. Task 2 — Interface Styling](#3-task-2--interface-styling-stylecss)
- [4. Task 3 — Real-Time Clock](#4-task-3--real-time-clock-with-setinterval-appjs)
- [5. Task 4 — ES6 Class `User`](#5-task-4--object-oriented-modeling-with-es6-classes-appjs)
- [6. Task 5 — Simulated Async Service](#6-task-5--simulated-asynchronous-service-appjs)
- [7. Task 6 — Event Handling & async/await](#7-task-6--event-handling--asyncawait-integration-appjs)
- [8. Full Execution Timeline](#8-full-execution-timeline)
- [9. How to Run & Test](#9-how-to-run--test)
- [10. Common Mistakes Checklist](#10-common-mistakes-checklist)
- [11. Self-Test Questions (with answers)](#11-self-test-questions-with-answers)

---

## 0. The Big Picture

The goal is a small **User Management Dashboard** with:

- a **live digital clock** that ticks every second
- a **registration form** (name, email, role)
- a **fake "server"** that takes 1.5 seconds to save a user and can reject bad data
- a **table** that fills with registered users
- a **status message** that says "saving…", "success" or "error"

Each part practises a different skill:

| Feature | Skill practised |
|---|---|
| Page layout, form, table | HTML5 structure, semantic tables |
| Colors, clock style, table borders | External CSS, ID/class selectors |
| Live clock | `Date` object, `setInterval`, DOM injection |
| User data | ES6 `class`, `constructor`, instance methods, template strings |
| Fake server | `Promise`, `resolve`/`reject`, `setTimeout` |
| Form submit | Events, `preventDefault`, `async`/`await`, `try...catch` |

The three files do separate jobs:

```
index.html  → STRUCTURE  (what is on the page)
style.css   → PRESENTATION (how it looks)
app.js      → BEHAVIOUR  (what it does)
```

Keeping these three concerns apart (*separation of concerns*) is the main idea behind the file structure.

---

## 1. Workspace & File Structure

### Requirement
One folder with exactly three files: `index.html`, `style.css` and `app.js`.

### Solution
```
Lab-1/
├── index.html
├── style.css
└── app.js
```

### Explanation
- The browser opens `index.html`.
- The HTML loads `style.css` through a `<link>` tag in the `<head>`.
- The HTML loads `app.js` through a `<script>` tag at the **bottom** of the `<body>`.

Section 2 explains why the CSS goes at the top and the script at the bottom.

---

## 2. Task 1 — HTML Structure (`index.html`)

### Requirement
- Link `style.css` inside `<head>`; include `app.js` right before `</body>`.
- A clock container holding `<h2 id="clock">`.
- A form `id="user-form"` with:
  - a text input `name="fullName"` with a label
  - a text input `name="email"` with a label
  - `<select name="role">` with Admin, Editor, Viewer
  - a submit button
- An empty `<p id="status-message"></p>`.
- A table `id="user-table"` with a `<thead>` (Name, Email, Role, Registered At) and an empty `<tbody id="user-table-body">`.

### Solution (key parts)

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
```

```html
<div class="clock-container">
    <h2 id="clock">00:00:00</h2>
</div>
```

```html
<form id="user-form">
    <div class="form-group">
        <label for="fullName">Full Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="e.g. Jane Doe">
    </div>

    <div class="form-group">
        <label for="email">Email Address</label>
        <input type="text" id="email" name="email" placeholder="e.g. jane@example.com">
    </div>

    <div class="form-group">
        <label for="role">Role</label>
        <select id="role" name="role">
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
        </select>
    </div>

    <input type="submit" value="Add User">
</form>

<p id="status-message"></p>
```

```html
<table id="user-table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registered At</th>
        </tr>
    </thead>
    <tbody id="user-table-body"></tbody>
</table>
```

```html
    <script src="app.js"></script>
</body>
```

### Explanation

**Why `<link>` goes in `<head>`:** the browser reads HTML from top to bottom. Loading CSS first means the page is already styled when it first appears, so the user never sees an unstyled flash.

**Why `<script>` goes at the end of `<body>`:** `app.js` runs `document.getElementById("clock")` straight away. If the script were in the `<head>`, it would run **before** the `<h2 id="clock">` exists, so `getElementById` would return `null` and the code would crash. At the bottom of the body, every element above it already exists.
> Alternative you may see: `<script src="app.js" defer></script>` in the `<head>`. `defer` tells the browser to run the script after the HTML is parsed.

**`id` vs `name`:** the two attributes have different jobs.
| Attribute | Used by | Purpose |
|---|---|---|
| `id="fullName"` | CSS (`#fullName`), JS (`getElementById`), `<label for>` | Unique identifier on the page |
| `name="fullName"` | Form submission, and JS `form.fullName` | The field's key in the form data |

The PDF requires `name`. The `id` is added so that `<label for="fullName">` can be linked to its input.

**Associated labels:** `<label for="X">` connects to the element with `id="X"`. Clicking the label focuses the input, and screen readers read the label aloud. This is what "associated label" means in the spec.

**`<select>` and `<option>`:** each option's `value` is what JavaScript reads, and the text between the tags is what the user sees. Here they are the same.

**Semantic tables:**
- `<thead>`: the header section. It contains `<tr>` rows of `<th>` (header cells, bold and centred by default).
- `<tbody>`: the data section. It contains `<tr>` rows of `<td>` (data cells).
- `<tbody>` starts empty and gets an `id` because JavaScript adds rows **into it**. Putting rows only in the body keeps the header from being touched.

**Empty `<p id="status-message">`:** a placeholder that JavaScript fills in later.

---

## 3. Task 2 — Interface Styling (`style.css`)

### Requirement
- Body: clean font (Arial, sans-serif), centred main container, clean background.
- `#clock`: bold, large (about 24px), centred, distinct color.
- Table: width 80%, `border-collapse: collapse`, borders on cells.
- `<th>`: dark background, bold white text.
- `.success` (green, bold) and `.error` (red, bold).

### Solution (key parts)

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f6f9;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;          /* centres the block horizontally */
    background-color: #ffffff;
    padding: 24px;
    text-align: center;
}

#clock {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: #1e6fd9;
}

table {
    width: 80%;
    border-collapse: collapse;
    margin: 20px auto;       /* centres the table */
}

th, td {
    border: 1px solid #999;
    padding: 8px 12px;
}

th {
    background-color: #1f3a5f;
    color: #ffffff;
    font-weight: bold;
}

.success { color: green; font-weight: bold; }
.error   { color: red;   font-weight: bold; }
```

### Explanation

**Selector types used:**
| Selector | Example | Matches |
|---|---|---|
| Element / type | `body`, `table`, `th` | Every element of that tag |
| ID | `#clock` | The **one** element with `id="clock"` |
| Class | `.success`, `.container` | Every element with that class (reusable) |
| Group | `th, td` | Both selectors get the same rules |
| Attribute | `input[type="submit"]` | Inputs whose `type` is `submit` |

**Centring with `margin: 0 auto`:** a block element with a set width (or `max-width`) gets equal automatic left and right margins, which centres it. That is how both `.container` and the 80%-wide table are centred.

**`font-family: Arial, sans-serif`:** a *font stack*. If Arial is not installed, the browser uses its default sans-serif font.

**`border-collapse: collapse`:** without it, each cell draws its own border, so you get **double lines** with gaps between cells. `collapse` merges neighbouring borders into one line.

```
separate (default):  ‖ A ‖ B ‖      collapse:  | A | B |
```

**Why `.success` and `.error` are classes, not IDs:** they are **utility classes**, reusable styles that JavaScript switches on and off with `classList.add()` and `classList.remove()`. The same `<p>` turns green or red depending on which class it has at that moment.

**Extras that go beyond the spec:** `.form-group` spacing, rounded corners, box shadow, and button hover color. They are only there to make the page look nicer.

---

## 4. Task 3 — Real-Time Clock with `setInterval` (`app.js`)

### Requirement
- `updateClock()` creates `new Date()` and reads `getHours()`, `getMinutes()` and `getSeconds()`.
- Format as `HH:MM:SS` with leading zeros.
- Put the text into `#clock`.
- Call `updateClock` every 1000 ms.

### Solution

```js
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerHTML = `${hours}:${minutes}:${seconds}`;
}

updateClock(); // show the time immediately instead of waiting 1 second
setInterval(updateClock, 1000);
```

### Explanation, line by line

1. **`new Date()`** creates a Date object holding the current date and time **at that instant**. It is called inside the function so every tick gets a fresh time. A `Date` created once outside the function would never change.
2. **`getHours()`** returns 0–23, **`getMinutes()`** 0–59 and **`getSeconds()`** 0–59. They return **numbers**, so 9 o'clock is `9`, not `"09"`.
3. **Padding with zeros:**
   - `String(9)` gives `"9"`.
   - `"9".padStart(2, "0")` gives `"09"`. If the string is shorter than 2 characters, `"0"` is added at the start until it is 2 long.
   - `"45".padStart(2, "0")` stays `"45"`.
   - An older way that also works: `(n < 10 ? "0" + n : n)`.
4. **Template literal** `` `${hours}:${minutes}:${seconds}` ``: backticks let you place variables inside a string with `${...}`. This gives a string like `"14:05:09"`.
5. **DOM injection:** `getElementById("clock")` finds the `<h2>`, and `.innerHTML = ...` replaces its content. (`textContent` would also work, because no HTML is inserted.)
6. **`setInterval(updateClock, 1000)`** tells the browser to call `updateClock` every 1000 ms (1 second), forever.
   - ⚠️ Pass the function **itself**: `updateClock`, **not** `updateClock()`. Adding `()` calls the function once right away and passes its return value (`undefined`) to `setInterval`, so the clock never ticks.
7. **The extra `updateClock();` call:** `setInterval` waits a full second before its **first** call. Without this line the clock would show `00:00:00` for one second after the page loads.

### Key concept: `setInterval` vs `setTimeout`
| Function | Runs | Used in this lab for |
|---|---|---|
| `setInterval(fn, ms)` | **Repeatedly**, every `ms` | The clock |
| `setTimeout(fn, ms)` | **Once**, after `ms` | Fake server delay (Task 5) |

Both return an ID that can be used to cancel them (`clearInterval(id)` or `clearTimeout(id)`).

---

## 5. Task 4 — Object-Oriented Modeling with ES6 Classes (`app.js`)

### Requirement
- An ES6 class `User`.
- A constructor `(name, email, role)` that sets `this.name`, `this.email`, `this.role` and `this.createdAt = new Date()`.
- A method `toTableRow()` that returns a `<tr><td>...</td></tr>` string including `this.createdAt.toLocaleTimeString()`.

### Solution

```js
class User {
    constructor(name, email, role) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = new Date();
    }

    toTableRow() {
        return `<tr>
            <td>${this.name}</td>
            <td>${this.email}</td>
            <td>${this.role}</td>
            <td>${this.createdAt.toLocaleTimeString()}</td>
        </tr>`;
    }
}
```

### Explanation

**What a class is:** a **blueprint** for making objects. `User` describes what every user has (properties) and what every user can do (methods).

**The `constructor`:** runs automatically when you write `new User(...)`.
```js
const u = new User("Jane Doe", "jane@x.com", "Admin");
// u.name      → "Jane Doe"
// u.email     → "jane@x.com"
// u.role      → "Admin"
// u.createdAt → Date object for the moment it was created
```

**`this`:** inside the constructor and methods, `this` refers to **the specific object being created or used**. `this.name = name` means "store the `name` argument as a property on this object."

**Why `createdAt` is not a parameter:** the object records its own creation time. Every new user automatically gets the current date and time.

**Instance method `toTableRow()`:**
- It is defined once in the class and shared by every `User` object (through the prototype).
- It turns the object's data into an HTML string for one table row.
- It uses a **multi-line template literal**: backticks allow line breaks inside the string.

**`toLocaleTimeString()`:** formats the time part of a Date in the user's local style, for example `"7:58:12 PM"` (US) or `"19:58:12"` (UK and Europe).

**How the cells line up with the headers:**
```
<thead>: Name       | Email      | Role  | Registered At
<tr>:    this.name  | this.email | this.role | createdAt.toLocaleTimeString()
```

> ⚠️ **Security note (worth knowing):** `toTableRow()` puts user input straight into HTML. If someone types `<b>Hi</b>` as their name, the browser renders it as bold HTML. With harmful HTML this becomes an attack called **XSS (Cross-Site Scripting)**. The lab spec asks for a template string, so the solution follows it. In real projects you would either escape the text (replace `<` with `&lt;` and so on) or build cells with `document.createElement("td")` and set `td.textContent = this.name`.

---

## 6. Task 5 — Simulated Asynchronous Service (`app.js`)

### Requirement
- `saveUserAsync(user)` returns `new Promise((resolve, reject) => { ... })`.
- It waits 1500 ms using `setTimeout`.
- If `user.name.trim().length < 3`, it rejects with `"Error: Name must be at least 3 characters long."`.
- Otherwise it resolves with `{ success: true, data: user }`.

### Solution

```js
function saveUserAsync(user) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (user.name.trim().length < 3) {
                reject("Error: Name must be at least 3 characters long.");
            } else {
                resolve({ success: true, data: user });
            }
        }, 1500);
    });
}
```

### Explanation

**Why simulate a server?** Real apps send data over the network to a server, which takes time. This function **pretends** to be that network call so you can practise handling slow, possibly failing operations without building a backend.

**What a Promise is:** an object representing a value that is **not ready yet**. Think of a restaurant buzzer: you get it right away, and later it either tells you your food is ready or tells you something went wrong.

A Promise is always in one of three states:
```
            ┌──────────► FULFILLED (resolve was called) → gives a value
PENDING ────┤
            └──────────► REJECTED  (reject was called)  → gives an error
```
Once it is fulfilled or rejected, it is **settled** and can never change again.

**The executor function `(resolve, reject) => { ... }`:**
- JavaScript passes you two functions, `resolve` and `reject`.
- You call **`resolve(value)`** when the work succeeds and **`reject(reason)`** when it fails.
- The executor runs **immediately**. Only the code inside `setTimeout` is delayed.

**Step by step:**
1. `saveUserAsync(user)` is called, and a Promise is created and returned **right away** in the *pending* state.
2. `setTimeout` schedules the check for 1.5 seconds later. The browser stays responsive: the clock keeps ticking and you can still click.
3. After 1500 ms the callback runs:
   - `user.name.trim()` removes spaces from both ends, so `"  Al  "` becomes `"Al"`.
   - `.length < 3` checks the real character count. `"Al"` has length 2, which is less than 3, so the Promise is **rejected**.
   - `"Jane Doe"` has length 8, so the Promise is **resolved** with `{ success: true, data: user }`.

**Why `trim()` matters:** without it, `"   A"` (3 spaces plus `A`) has length 4 and would pass. `trim()` stops people from getting past validation with spaces.

---

## 7. Task 6 — Event Handling & async/await Integration (`app.js`)

### Requirement
- Listen for `submit` on `#user-form`.
- Call `event.preventDefault()` so the page does not reload.
- An `async` handler that:
  1. reads `fullName`, `email` and `role`
  2. creates a `User`
  3. shows "Saving user to server..." with neutral styling
  4. uses `try...catch` around `await saveUserAsync(newUser)`
  5. on success: adds the row, clears the form, shows "User registered successfully!" and adds `.success`
  6. on error: shows the error and adds `.error`

### Solution

```js
const userForm = document.getElementById("user-form");
const statusMessage = document.getElementById("status-message");
const tableBody = document.getElementById("user-table-body");

async function handleSubmit(event) {
    event.preventDefault();

    // Read form values
    const fullName = userForm.fullName.value;
    const email = userForm.email.value;
    const role = userForm.role.value;

    // Create a new User object
    const newUser = new User(fullName, email, role);

    // Neutral "saving" state
    statusMessage.classList.remove("success", "error");
    statusMessage.textContent = "Saving user to server...";

    try {
        await saveUserAsync(newUser);

        tableBody.innerHTML += newUser.toTableRow();
        userForm.reset();

        statusMessage.textContent = "User registered successfully!";
        statusMessage.classList.add("success");
    } catch (err) {
        statusMessage.textContent = err;
        statusMessage.classList.add("error");
    }
}

userForm.addEventListener("submit", handleSubmit);
```

### Explanation

**1. Caching DOM elements:** the three `getElementById` calls run once, at the top. The results are stored in `const` variables so the code doesn't search the page on every submit.

**2. `addEventListener("submit", handleSubmit)`:**
- This tells the browser: "when this form is submitted, call `handleSubmit` and give it an `event` object."
- A form is submitted when you click the submit button **or press Enter** in a field. That is why we listen for `submit` on the **form** rather than `click` on the button: `submit` covers both cases.
- Again, pass `handleSubmit` and **not** `handleSubmit()`.

**3. `event.preventDefault()`:**
- By default, submitting a form sends the data to a URL and **reloads the page**. A reload would wipe the table, the status message and everything else.
- `preventDefault()` cancels that default behaviour so JavaScript can handle the data instead.

**4. Reading values: `userForm.fullName.value`:**
- A form element gives you access to its fields **by their `name` attribute**. So `userForm.fullName` is the `<input name="fullName">`, and `.value` is the text inside it.
- The same works for the `<select>`: `userForm.role.value` is the `value` of the selected `<option>`.
- Other ways to get the same values: `document.querySelector('[name="fullName"]').value` or `new FormData(userForm).get("fullName")`.

**5. Neutral styling:**
- `classList.remove("success", "error")` takes away any green or red left over from a previous attempt, so "Saving…" appears in the normal text color.
- `textContent` sets plain text. It is safer than `innerHTML` for messages because it never treats the text as HTML.

**6. `async` and `await`, the core idea:**
- Marking a function **`async`** lets it use `await` inside, and makes the function itself return a Promise.
- **`await somePromise`** **pauses this function** until the Promise settles:
  - if it is **fulfilled**, `await` gives back the value and the code continues to the next line
  - if it is **rejected**, `await` **throws** the reason as an error, and execution jumps to `catch`
- ⚠️ "Pauses" means only **this function** pauses. The rest of the page keeps running: the clock keeps ticking during the 1.5 seconds. JavaScript does not freeze; it sets this function aside and comes back to it later.

**7. `try...catch`:** this is how async/await handles errors.
```
try {
    await saveUserAsync(newUser);   ← if this rejects…
    ...success code...              ← …this is SKIPPED
} catch (err) {
    ...error code...                ← …and this runs, with err = the reject reason
}
```
- On **success**:
  - `tableBody.innerHTML += newUser.toTableRow()` adds the new row's HTML to the end of the table body.
  - `userForm.reset()` sets every field back to its starting value: inputs become empty and the select goes back to "Admin".
  - The message is set and `.success` is added, which turns the text green.
- On **failure**:
  - `err` is the string passed to `reject(...)`, which is `"Error: Name must be at least 3 characters long."`.
  - The message is shown and `.error` is added, which turns the text red.
  - The form is **not** cleared, so the user can fix the name and try again.

**Comparison: the same logic with `.then()` / `.catch()`:**
```js
saveUserAsync(newUser)
    .then(() => {
        tableBody.innerHTML += newUser.toTableRow();
        userForm.reset();
        statusMessage.textContent = "User registered successfully!";
        statusMessage.classList.add("success");
    })
    .catch(err => {
        statusMessage.textContent = err;
        statusMessage.classList.add("error");
    });
```
Both versions do exactly the same thing. `async`/`await` simply reads like normal top-to-bottom code, and that is why the lab asks for it.

> 💡 **Note on `innerHTML +=`:** this rebuilds the whole `<tbody>` every time a row is added. It is fine for a small lab. For big tables, `tableBody.insertAdjacentHTML("beforeend", row)` is more efficient because it only adds the new part.

---

## 8. Full Execution Timeline

What happens from page load to a user being saved:

```
PAGE LOAD
 ├─ HTML parsed top → bottom
 ├─ style.css applied (page is styled)
 └─ app.js runs:
      ├─ updateClock() defined and called once → clock shows the current time
      ├─ setInterval registered → clock updates every 1s from now on
      ├─ class User and saveUserAsync defined (nothing runs yet)
      └─ submit listener attached to the form

USER TYPES "Jane Doe", "jane@x.com", picks "Editor", clicks Add User
 t = 0 ms
 ├─ "submit" event fires → handleSubmit(event)
 ├─ preventDefault()  → no page reload
 ├─ read values, newUser = new User(...)   (createdAt = now)
 ├─ status: "Saving user to server..." (neutral)
 └─ await saveUserAsync(newUser)
       ├─ Promise created (PENDING), setTimeout(1500) scheduled
       └─ handleSubmit PAUSES here … (clock keeps ticking!)

 t = 1500 ms
 ├─ setTimeout callback: "Jane Doe".trim().length = 8 ≥ 3 → resolve(...)
 └─ handleSubmit RESUMES after await
       ├─ row added to the table
       ├─ form reset
       └─ status: "User registered successfully!" (green)

IF THE NAME WERE "Al":
 t = 1500 ms → reject("Error: Name must be...") → await throws
            → catch(err) → status shows the error (red), form kept
```

---

## 9. How to Run & Test

1. Double-click `index.html`, or right-click it and choose *Open with* and your browser. In VS Code you can also use the **Live Server** extension.
2. Check the following:

| Test | Expected result |
|---|---|
| Page opens | Clock shows the current time and changes every second |
| Name `Jane Doe`, any email, role `Editor`, click **Add User** | "Saving user to server..." for about 1.5 s, then a green "User registered successfully!", a new row in the table, and a cleared form |
| Name `Al` | "Saving…" then the red error "Error: Name must be at least 3 characters long."; no row added |
| Name `"   Al   "` (spaces around it) | Still the error, because `trim()` removes the spaces |
| Press **Enter** in a field instead of clicking | Same as clicking: the `submit` event fires |
| Add several users | Rows pile up and each one shows its own registration time |
| Open DevTools (F12), then Console | No red errors |

---

## 10. Common Mistakes Checklist

- [ ] Script placed in `<head>` without `defer`, so `getElementById` returns `null` and you get **"Cannot read properties of null"**.
- [ ] `setInterval(updateClock(), 1000)`: the extra `()` means the clock updates only once.
- [ ] Forgetting `padStart` / leading zeros, which gives `9:5:3` instead of `09:05:03`.
- [ ] Creating `new Date()` **outside** `updateClock`, so the time never changes.
- [ ] Forgetting `event.preventDefault()`, so the page reloads and the table empties.
- [ ] Using `await` in a function **not** marked `async`, which is a **SyntaxError**.
- [ ] Not wrapping `await` in `try...catch`, which leaves an "Uncaught (in promise)" error and no red message.
- [ ] Not removing old `.success` / `.error` classes, so the text can carry both classes and show the wrong color.
- [ ] Setting `innerHTML =` instead of `+=` on the table body, so each new user **replaces** the last one.
- [ ] Mismatched `name` attributes, for example `name="fullname"` vs `userForm.fullName` (names are **case-sensitive**).
- [ ] Forgetting `border-collapse: collapse`, which leaves double borders.
- [ ] Forgetting `new` (`User("a","b","c")` without `new` throws: *Class constructor User cannot be invoked without 'new'*).

---

## 11. Self-Test Questions (with answers)

<details>
<summary><b>Q1. Why is the &lt;script&gt; tag placed just before &lt;/body&gt;?</b></summary>

So the HTML elements exist before the JavaScript tries to select them. If the script ran earlier, `getElementById` would return `null`.
</details>

<details>
<summary><b>Q2. What is the difference between <code>id</code> and <code>name</code> on an input?</b></summary>

`id` uniquely identifies the element on the page (for CSS, `getElementById` and `<label for>`). `name` is the field's key when the form is submitted and lets you write `form.fieldName`.
</details>

<details>
<summary><b>Q3. What does <code>border-collapse: collapse</code> do?</b></summary>

It merges the borders of neighbouring table cells into one line, instead of drawing separate double borders.
</details>

<details>
<summary><b>Q4. What does <code>"7".padStart(2, "0")</code> return?</b></summary>

`"07"`.
</details>

<details>
<summary><b>Q5. Difference between <code>setInterval</code> and <code>setTimeout</code>?</b></summary>

`setInterval` runs a function repeatedly at a fixed gap. `setTimeout` runs it once after a delay.
</details>

<details>
<summary><b>Q6. What does the <code>constructor</code> do, and when does it run?</b></summary>

It sets up a new object's properties. It runs automatically each time you write `new User(...)`.
</details>

<details>
<summary><b>Q7. What does <code>this</code> refer to inside <code>toTableRow()</code>?</b></summary>

The specific `User` object the method was called on. For example, in `newUser.toTableRow()`, `this` is `newUser`.
</details>

<details>
<summary><b>Q8. What are the three states of a Promise?</b></summary>

Pending, fulfilled (resolved) and rejected.
</details>

<details>
<summary><b>Q9. What happens at <code>await</code> if the Promise rejects?</b></summary>

`await` throws the rejection reason as an error. Execution jumps to the nearest `catch` block, and `err` is the value passed to `reject()`.
</details>

<details>
<summary><b>Q10. Does <code>await</code> freeze the whole page for 1.5 seconds?</b></summary>

No. Only the `async` function pauses. The browser stays responsive and the clock keeps ticking, because JavaScript resumes the function when the Promise settles.
</details>

<details>
<summary><b>Q11. Why use <code>event.preventDefault()</code>?</b></summary>

A form submit normally reloads or redirects the page. `preventDefault()` stops that so JavaScript can handle the data without losing the page's current state.
</details>

<details>
<summary><b>Q12. Why use <code>trim()</code> in the validation?</b></summary>

To remove spaces at the start and end, so a name like `"  A  "` can't pass the 3-character rule using spaces.
</details>

<details>
<summary><b>Q13. Why listen for <code>submit</code> on the form instead of <code>click</code> on the button?</b></summary>

`submit` fires both when the button is clicked and when Enter is pressed in a field, so it catches every way of submitting.
</details>

<details>
<summary><b>Q14. What is a security risk of <code>toTableRow()</code> + <code>innerHTML</code>, and how would you fix it?</b></summary>

User input is treated as HTML, so malicious input could run scripts (XSS). Fix it by escaping the text or by creating `<td>` elements and setting their `textContent`.
</details>

<details>
<summary><b>Q15. Rewrite the try/catch using <code>.then()</code>/<code>.catch()</code>.</b></summary>

```js
saveUserAsync(newUser)
    .then(() => { /* add row, reset, success */ })
    .catch(err => { /* show err, add .error */ });
```
</details>
