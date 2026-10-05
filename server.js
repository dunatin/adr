const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'adr_quest_jwt_secret_token_key_2026';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Helper: Get IST Date String (YYYY-MM-DD)
function getISTDateString() {
    const now = new Date();
    // Offset by +5.5 hours for IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
}

// Seeder check for daily lessons
async function checkAndSeedDailyLessons() {
    const todayStr = getISTDateString();
    
    // Yesterday
    const yesterdayObj = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = new Date(yesterdayObj.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Tomorrow (remains locked)
    const tomorrowObj = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = new Date(tomorrowObj.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];

    const users = await db.getUsers();
    
    // Read current database to add lessons if empty
    const dbFileContent = require('./database');
    const modules = await db.getModules();
    
    // Let's check if the db has lessons. If not, seed them.
    const rawDb = require('./data/db.json');
    if (!rawDb.lessons) {
        rawDb.lessons = [
            {
                id: "less-1",
                date: yesterdayStr,
                title: "Introduction to Indian Pharmacovigilance Systems",
                description: "Understand the PvPI (Pharmacovigilance Programme of India) framework and how ADRs are tracked nationally.",
                content: "The Pharmacovigilance Programme of India (PvPI) was launched in 2010 to monitor drug safety across the country. Headquartered at the Indian Pharmacopoeia Commission (IPC) in Ghaziabad, it collects reports from over 250 Adverse Drug Reaction Monitoring Centres (AMCs) in medical colleges. Clinicians use PvPI tools to report toxicities, which are analyzed and uploaded into VigiBase. Active participation in reporting helps identify specific ethnic and demographic drug safety signals unique to the Indian population.",
                videoId: "vid-1",
                additionalResources: "IPC PvPI Official Guidelines PDF, CDSCO Drug Alerts Bulletin 2026."
            },
            {
                id: "less-2",
                date: todayStr,
                title: "Active Surveillance of High-Alert Meds in Indian Wards",
                description: "Clinical guidelines on monitoring narrow therapeutic index drugs at the bedside in Indian hospitals.",
                content: "In busy Indian public and private hospital wards, active surveillance is key to avoiding medication errors. High-alert drugs like Heparin, insulin infusions, and aminoglycosides (e.g. Amikacin or Gentamicin) require structured bedside charts. Nurses and pharmacists must perform independent double-checks of calculations, verify patient vitals (heart rate, blood pressure) prior to administration, and ensure serum drug concentrations are ordered at appropriate intervals (TDM). Recording pre-dose trough levels is critical to prevent acute tubular necrosis or ototoxicity.",
                videoId: "vid-4",
                additionalResources: "National Patient Safety Implementation Framework (NPSIF) 2018-2025 India."
            },
            {
                id: "less-3",
                date: tomorrowStr,
                title: "Future Checkpoint: Advanced Signal Detection Systems",
                description: "A look at AI, Natural Language Processing, and database mining techniques in modern safety reporting.",
                content: "Future pharmacovigilance will automate the analysis of patient files. Large language models (LLMs) and active database queries scan EHR records for indicators of drug injury, e.g. acute liver enzymes elevation after starting a new chemical entity. Students will learn the math of reporting odds ratios (ROR) and safety trigger alerts.",
                videoId: "vid-9",
                additionalResources: "WHO Guidelines on Digital Informatics Tools for Safety Surveillance."
            }
        ];
        
        // Save back to db.json
        const fs = require('fs').promises;
        await fs.writeFile(path.join(__dirname, 'data', 'db.json'), JSON.stringify(rawDb, null, 2), 'utf8');
        console.log("Seeded daily lessons in db.json successfully!");
    }
}

// Initialize database before starting server
db.initDb().then(async () => {
    await checkAndSeedDailyLessons();
    app.listen(PORT, () => {
        console.log(`ADR Quest Full-Stack server is active at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database initialization failed:", err);
});

// ==========================================
// MIDDLEWARES
// ==========================================

// Authenticate JWT Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access token missing" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token is invalid or expired" });
        req.user = user;
        next();
    });
}

// Require Admin Role
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ error: "Access Denied: Admin privileges required" });
    }
    next();
}

// ==========================================
// API ROUTES
// ==========================================

// --- AUTHENTICATION ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, role, college, password } = req.body;

    if (!name || !email || !role || !password) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    try {
        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ error: "This email is already registered" });
        }

        const isStudent = role.toLowerCase().includes("student");
        if (isStudent && !college) {
            return res.status(400).json({ error: "College / Institution is required for students" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            role,
            college: college || "N/A",
            passwordHash,
            level: 1,
            xp: 0,
            streak: 1,
            avatar: "👨‍⚕️",
            badges: [],
            completedModules: [],
            submittedReports: 0,
            lastLoginDate: new Date().toDateString()
        };

        await db.saveUser(newUser);

        // Sign JWT
        const token = jwt.sign({ email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
        
        // Remove hash from return body
        delete newUser.passwordHash;

        res.status(201).json({ token, user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Server registration error: " + err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Sign JWT
        const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        // Update login date
        user.lastLoginDate = new Date().toDateString();
        await db.saveUser(user);

        const returnUser = { ...user };
        delete returnUser.passwordHash;

        res.json({ token, user: returnUser });
    } catch (err) {
        res.status(500).json({ error: "Server login error: " + err.message });
    }
});

// Get Current User Profile (Me)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.user.email);
        if (!user) return res.status(404).json({ error: "User profile not found" });

        const returnUser = { ...user };
        delete returnUser.passwordHash;
        res.json(returnUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to load session profile" });
    }
});

// Update Profile
app.post('/api/auth/profile', authenticateToken, async (req, res) => {
    const { name, avatar, password, xp, level, streak, badges, completedModules, submittedReports, completedDailyLessons } = req.body;

    try {
        const user = await db.getUserByEmail(req.user.email);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (password && password.length >= 6) {
            user.passwordHash = await bcrypt.hash(password, 10);
        }
        
        if (xp !== undefined) user.xp = Number(xp);
        if (level !== undefined) user.level = Number(level);
        if (streak !== undefined) user.streak = Number(streak);
        if (badges !== undefined) user.badges = badges;
        if (completedModules !== undefined) user.completedModules = completedModules;
        if (submittedReports !== undefined) user.submittedReports = Number(submittedReports);
        if (completedDailyLessons !== undefined) user.completedDailyLessons = completedDailyLessons;

        await db.saveUser(user);

        const returnUser = { ...user };
        delete returnUser.passwordHash;
        res.json({ success: true, user: returnUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile: " + err.message });
    }
});

// --- MODULES & LESSONS ---

// Get Modules
app.get('/api/modules', authenticateToken, async (req, res) => {
    try {
        const modules = await db.getModules();
        res.json(modules);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve modules" });
    }
});

// Get Videos
app.get('/api/videos', authenticateToken, async (req, res) => {
    try {
        const videos = await db.getVideos();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: "Failed to load video assets" });
    }
});

// Get Daily Lessons
app.get('/api/lessons', authenticateToken, async (req, res) => {
    try {
        const fs = require('fs').promises;
        const rawDb = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8'));
        const todayStr = getISTDateString();

        // Lock future lessons for normal students
        let lessons = rawDb.lessons || [];
        if (req.user.role !== 'Admin') {
            lessons = lessons.map(less => {
                const isFuture = less.date > todayStr;
                if (isFuture) {
                    return {
                        id: less.id,
                        date: less.date,
                        title: "Locked Checkpoint",
                        description: "This lesson will be unlocked on " + less.date,
                        content: "Locked content.",
                        locked: true
                    };
                }
                return { ...less, locked: false };
            });
        } else {
            lessons = lessons.map(less => ({ ...less, locked: false }));
        }

        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve daily syllabus" });
    }
});

// Complete Lesson/Module Progress
app.post('/api/progress/complete', authenticateToken, async (req, res) => {
    const { moduleId, isDailyLesson, lessonId } = req.body;

    try {
        const user = await db.getUserByEmail(req.user.email);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (isDailyLesson && lessonId) {
            // Save daily lesson completion to user progress
            if (!user.completedDailyLessons) {
                user.completedDailyLessons = [];
            }
            if (!user.completedDailyLessons.includes(lessonId)) {
                user.completedDailyLessons.push(lessonId);
                user.xp += 20; // Award 20 XP for daily check
            }
        } else if (moduleId) {
            const modIdStr = moduleId.toString();
            if (!user.completedModules.includes(modIdStr)) {
                user.completedModules.push(modIdStr);
                user.xp += 150; // Award 150 XP for module quiz pass
                
                // Unlock safety badges
                if (!user.badges.includes("first-quiz")) {
                    user.badges.push("first-quiz");
                }
                if (user.completedModules.length === 12 && !user.badges.includes("master-cert")) {
                    user.badges.push("master-cert");
                }
            }
        }

        // Recalculate level
        user.level = Math.floor(user.xp / 100) + 1;

        await db.saveUser(user);
        
        const returnUser = { ...user };
        delete returnUser.passwordHash;
        res.json({ success: true, user: returnUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user progress" });
    }
});

// Submit Practice Report
app.post('/api/reports/submit', authenticateToken, async (req, res) => {
    const { initials, age, gender, drugName, dose, reaction, onsetDate, seriousness } = req.body;

    if (!initials || !age || !drugName || !dose || reaction.length < 10 || !onsetDate) {
        return res.status(400).json({ error: "Incomplete report specifications" });
    }

    try {
        const refNum = `ADR-${Math.floor(100000 + Math.random() * 900000)}`;
        const report = {
            refId: refNum,
            patient: `${initials}, ${age} (${gender})`,
            drug: drugName,
            reaction,
            severity: seriousness
        };

        await db.saveReport(report);

        // Update user stats
        const user = await db.getUserByEmail(req.user.email);
        user.submittedReports += 1;
        user.xp += 100;
        
        if (!user.badges.includes("safety-reporter")) {
            user.badges.push("safety-reporter");
        }
        
        await db.saveUser(user);

        const returnUser = { ...user };
        delete returnUser.passwordHash;

        res.status(201).json({ success: true, report, user: returnUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to register safety report: " + err.message });
    }
});

// --- ADMIN API ENDPOINTS ---

// View Registered Students
app.get('/api/admin/students', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await db.getUsers();
        // Return only students / clinical users (exclude admins or return everything clearly marked)
        const clients = users.map(u => {
            const copy = { ...u };
            delete copy.passwordHash;
            return copy;
        });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: "Failed to load student lists" });
    }
});

// View Reported Cases
app.get('/api/admin/reports', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const reports = await db.getReports();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: "Failed to load safety reports" });
    }
});

// Aggregate Platform Metrics & Stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await db.getUsers();
        const reports = await db.getReports();
        const modules = await db.getModules();
        
        const fs = require('fs').promises;
        const rawDb = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8'));
        const totalLessons = (rawDb.lessons || []).length;

        const students = users.filter(u => u.role !== 'Admin');
        const totalStudents = students.length;
        
        // Active students (e.g. have XP > 0 or logged in recently)
        const activeStudents = students.filter(u => u.xp > 0).length;

        // Cumulative lesson completion count
        let totalCompletions = 0;
        students.forEach(s => {
            totalCompletions += (s.completedModules || []).length;
            totalCompletions += (s.completedDailyLessons || []).length;
        });

        // Compute average completion percentage
        const maxExpectedModulesPerStudent = 12;
        let avgCompletionPct = 0;
        if (totalStudents > 0) {
            const sumCompleted = students.reduce((acc, curr) => acc + (curr.completedModules || []).length, 0);
            avgCompletionPct = Math.round((sumCompleted / (totalStudents * maxExpectedModulesPerStudent)) * 100);
        }

        res.json({
            totalStudents,
            activeStudents,
            totalModules: modules.length,
            totalLessons,
            totalReports: reports.length,
            totalCompletions,
            avgCompletionPct,
            // Group distribution of user roles for chart renders
            roleStats: {
                studentCount: users.filter(u => u.role.toLowerCase().includes('student')).length,
                pharmacistCount: users.filter(u => u.role.toLowerCase().includes('pharmacist')).length,
                doctorCount: users.filter(u => u.role.toLowerCase().includes('doctor')).length,
                nurseCount: users.filter(u => u.role.toLowerCase().includes('nurse')).length
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to compile safety statistics: " + err.message });
    }
});

// Add/Update Learning Modules
app.post('/api/admin/modules', authenticateToken, requireAdmin, async (req, res) => {
    const mod = req.body;
    if (!mod.id || !mod.title || !mod.description) {
        return res.status(400).json({ error: "Module ID, Title, and Description are required" });
    }

    try {
        // Ensure structure is clean
        const newMod = {
            id: Number(mod.id),
            title: mod.title,
            description: mod.description,
            lessons: mod.lessons || [
                { title: "Standard Lesson 1", content: "Clinical safety details pending update." }
            ],
            quiz: mod.quiz || [
                {
                    question: "Is this medication safe to administer?",
                    options: ["Yes", "No", "Depends on lab values", "Clinical reassessment required"],
                    correctIndex: 2,
                    explanation: "Bedside parameters dictate strict monitoring checks."
                }
            ]
        };

        await db.saveModule(newMod);
        res.status(201).json({ success: true, module: newMod });
    } catch (err) {
        res.status(500).json({ error: "Failed to publish module: " + err.message });
    }
});

// Delete Module
app.delete('/api/admin/modules/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await db.deleteModule(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete module: " + err.message });
    }
});

// Add Daily Lesson Release
app.post('/api/admin/lessons', authenticateToken, requireAdmin, async (req, res) => {
    const { date, title, description, content, videoId, additionalResources } = req.body;

    if (!date || !title || !content) {
        return res.status(400).json({ error: "Date, Title, and Content are required for daily lessons" });
    }

    try {
        const fs = require('fs').promises;
        const rawDb = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8'));

        if (!rawDb.lessons) rawDb.lessons = [];

        const newLesson = {
            id: `less-${Math.floor(1000 + Math.random() * 9000)}`,
            date,
            title,
            description: description || "",
            content,
            videoId: videoId || "",
            additionalResources: additionalResources || ""
        };

        // Check if lesson exists for this date, overwrite if so, otherwise push
        const idx = rawDb.lessons.findIndex(l => l.date === date);
        if (idx !== -1) {
            rawDb.lessons[idx] = newLesson;
        } else {
            rawDb.lessons.push(newLesson);
        }

        await fs.writeFile(path.join(__dirname, 'data', 'db.json'), JSON.stringify(rawDb, null, 2), 'utf8');
        res.status(201).json({ success: true, lesson: newLesson });
    } catch (err) {
        res.status(500).json({ error: "Failed to release daily lesson: " + err.message });
    }
});

// Delete Daily Lesson
app.delete('/api/admin/lessons/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const fs = require('fs').promises;
        const rawDb = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8'));

        if (rawDb.lessons) {
            rawDb.lessons = rawDb.lessons.filter(l => l.id !== req.params.id);
            await fs.writeFile(path.join(__dirname, 'data', 'db.json'), JSON.stringify(rawDb, null, 2), 'utf8');
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete daily lesson: " + err.message });
    }
});

// Add YouTube Video Registry
app.post('/api/admin/videos', authenticateToken, requireAdmin, async (req, res) => {
    const { moduleId, title, url, desc } = req.body;

    if (!moduleId || !title || !url) {
        return res.status(400).json({ error: "Module ID, Title, and YouTube Link are required" });
    }

    try {
        const newVideo = {
            moduleId: Number(moduleId),
            title,
            url,
            desc: desc || ""
        };

        await db.saveVideo(newVideo);
        res.status(201).json({ success: true, video: newVideo });
    } catch (err) {
        res.status(500).json({ error: "Failed to save video asset: " + err.message });
    }
});

// Delete YouTube Video Registry
app.delete('/api/admin/videos/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await db.deleteVideo(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete video asset: " + err.message });
    }
});

// Delete User Account
app.delete('/api/admin/users/:email', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const fs = require('fs').promises;
        const rawDb = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8'));
        
        // Cannot delete self
        if (req.params.email.toLowerCase() === req.user.email.toLowerCase()) {
            return res.status(400).json({ error: "You cannot delete your own admin account" });
        }

        rawDb.users = rawDb.users.filter(u => u.email.toLowerCase() !== req.params.email.toLowerCase());
        await fs.writeFile(path.join(__dirname, 'data', 'db.json'), JSON.stringify(rawDb, null, 2), 'utf8');
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user account: " + err.message });
    }
});

// Toggle Admin Role promotion
app.post('/api/admin/users/role', authenticateToken, requireAdmin, async (req, res) => {
    const { email, role } = req.body;
    
    if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required" });
    }

    try {
        const user = await db.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (email.toLowerCase() === req.user.email.toLowerCase()) {
            return res.status(400).json({ error: "You cannot change your own admin role" });
        }

        user.role = role;
        await db.saveUser(user);

        res.json({ success: true, role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Failed to toggle role: " + err.message });
    }
});

// Serves the Single Page Application index for default fallback routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
