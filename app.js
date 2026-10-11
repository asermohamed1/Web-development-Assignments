// ===== Task 3: Real-Time Clock with setInterval =====
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerHTML = `${hours}:${minutes}:${seconds}`;
}

updateClock(); // show the time immediately instead of waiting 1 second
setInterval(updateClock, 1000);

// ===== Task 4: Object-Oriented Modeling with ES6 Classes =====
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

// ===== Task 5: Simulated Asynchronous Service =====
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

// ===== Task 6: Event Handling & Async/Await Integration =====
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
