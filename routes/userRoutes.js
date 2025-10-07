const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { sequelize } = require('../config/database');

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// Get all students with their quiz stats
router.get("/students", async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role_id: 1 }, // role_id 1 = regular user (student)
            attributes: [
                'id',
                'name',
                'email',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Get quiz stats for each student
        const studentsWithStats = await Promise.all(students.map(async (student) => {
            // TODO: Add actual quiz completion stats when quiz attempts table is created
            // For now, return mock data structure
            return {
                id: student.id,
                username: student.name,
                email: student.email,
                class: 'N/A', // Add class field to user model if needed
                quizzesTaken: 0, // Will be calculated from quiz_attempts table
                averageScore: 0, // Will be calculated from quiz_attempts table
                lastActive: student.updatedAt,
                joinedDate: student.createdAt
            };
        }));

        return res.status(200).json({ 
            success: true, 
            students: studentsWithStats,
            total: studentsWithStats.length
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch students',
            error: error.message 
        });
    }
});

module.exports = router;