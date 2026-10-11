const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET: Retrieve all students
router.get("/", async (req, res) => {
try {
const [students] = await pool.execute(
"SELECT id, name, roll_number, email, department, created_at FROM students ORDER BY id DESC"
);

    res.json(students);
} catch (error) {
    console.error("Error fetching students:", error.message);

    res.status(500).json({
        message: "Unable to retrieve students."
    });
}

});

// POST: Add a new student
router.post("/", async (req, res) => {
const { name, rollNumber, email, department } = req.body;

if (
    typeof name !== "string" ||
    typeof rollNumber !== "string" ||
    typeof email !== "string" ||
    typeof department !== "string" ||
    !name.trim() ||
    !rollNumber.trim() ||
    !email.trim() ||
    !department.trim()
) {
    return res.status(400).json({
        message: "All student fields are required."
    });
}

try {
    const [result] = await pool.execute(
        `INSERT INTO students
         (name, roll_number, email, department)
         VALUES (?, ?, ?, ?)`,
        [
            name.trim(),
            rollNumber.trim(),
            email.trim(),
            department.trim()
        ]
    );

    res.status(201).json({
        message: "Student added successfully.",
        studentId: result.insertId
    });
} catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "This roll number already exists."
        });
    }

    console.error("Error adding student:", error.message);

    res.status(500).json({
        message: "Unable to add student."
    });
}

});

// PUT: Update an existing student
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    const { name, rollNumber, email, department } = req.body;

    // Validate ID
    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid student ID."
        });
    }

    // Validate input
    if (
        typeof name !== "string" ||
        typeof rollNumber !== "string" ||
        typeof email !== "string" ||
        typeof department !== "string" ||
        !name.trim() ||
        !rollNumber.trim() ||
        !email.trim() ||
        !department.trim()
    ) {
        return res.status(400).json({
            message: "All student fields are required."
        });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE students
             SET name = ?,
                 roll_number = ?,
                 email = ?,
                 department = ?
             WHERE id = ?`,
            [
                name.trim(),
                rollNumber.trim(),
                email.trim(),
                department.trim(),
                Number(id)
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json({
            message: "Student updated successfully."
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This roll number already exists."
            });
        }

        console.error("Update error:", error.message);

        res.status(500).json({
            message: "Unable to update student."
        });
    }
});

// DELETE: Remove a student
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid student ID."
        });
    }

    try {
        const [result] = await pool.execute(
            "DELETE FROM students WHERE id = ?",
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json({
            message: "Student deleted successfully."
        });

    } catch (error) {
        console.error("Delete error:", error.message);

        res.status(500).json({
            message: "Unable to delete student."
        });
    }
});
module.exports = router;