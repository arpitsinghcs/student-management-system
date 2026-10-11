// ========================================
// STUDENT MANAGEMENT SYSTEM
// Frontend connected to Express API
// ========================================

const API_URL = "http://localhost:5000/api/students";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");

// Store students retrieved from the API
let students = [];


// ========================================
// 1. FETCH STUDENTS FROM BACKEND
// ========================================

async function fetchStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        students = await response.json();

        displayStudents();

    } catch (error) {
        console.error("Error fetching students:", error);

        studentList.textContent =
            "Unable to load students. Check whether the backend is running.";
    }
}


// ========================================
// 2. DISPLAY STUDENTS
// ========================================
function displayStudents(records = students) {
    studentList.replaceChildren();

    totalStudents.textContent = students.length;

    if (records.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No students found.";

        studentList.appendChild(message);
        return;
    }

    records.forEach((student) => {
        const card = document.createElement("article");
        card.className = "student-card";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = student.name;

        const roll = document.createElement("p");
        roll.textContent = `Roll Number: ${student.roll_number}`;

        const email = document.createElement("p");
        email.textContent = `Email: ${student.email}`;

        const department = document.createElement("p");
        department.textContent = `Department: ${student.department}`;

        details.append(name, roll, email, department);

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editStudent(student);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteStudent(student.id);
        });

        const actions = document.createElement("div");
        actions.append(editButton, deleteButton);

        card.append(details, actions);

        studentList.appendChild(card);
    });
}
// ========================================
// 2. EDIT A STUDENT
// ========================================
async function editStudent(student) {
    const name = prompt("Enter student name:", student.name);

    if (name === null) return;

    const rollNumber = prompt(
        "Enter roll number:",
        student.roll_number
    );

    if (rollNumber === null) return;

    const email = prompt("Enter email:", student.email);

    if (email === null) return;

    const department = prompt(
        "Enter department:",
        student.department
    );

    if (department === null) return;

    const studentData = {
        name,
        rollNumber,
        email,
        department
    };

    try {
        const response = await fetch(
            `${API_URL}/${student.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to update student."
            );
        }

        alert("Student updated successfully!");

        await fetchStudents();

    } catch (error) {
        console.error("Update error:", error);

        alert(error.message);
    }
}


// ========================================
// 3. ADD A NEW STUDENT
// ========================================

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();

    const studentData = {
        name,
        rollNumber,
        email,
        department
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to add student"
            );
        }

        alert("Student added successfully!");

        studentForm.reset();

        // Fetch updated records from MySQL
        await fetchStudents();

    } catch (error) {
        console.error("Error adding student:", error);

        alert(error.message);
    }
});
// ========================================
// 4. DELETE A STUDENT
// ========================================
async function deleteStudent(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to delete student."
            );
        }

        alert("Student deleted successfully!");

        await fetchStudents();

    } catch (error) {
        console.error("Delete error:", error);

        alert(error.message);
    }
}


// ========================================
// 4. SEARCH STUDENTS
// ========================================

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    const filteredStudents = students.filter((student) => {
        return (
            student.name.toLowerCase().includes(query) ||
            student.roll_number.toLowerCase().includes(query)
        );
    });

    displayStudents(filteredStudents);
});


// ========================================
// 5. LOAD STUDENTS WHEN PAGE OPENS
// ========================================

fetchStudents();