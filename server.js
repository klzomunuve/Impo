import cors from "cors";
app.use(cors());
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://acad_db_user:uciynPbQSU2xxKTLmVDarPrXh9Gx80L5@dpg-d3iop8t6ubrc739es0ug-a.oregon-postgres.render.com/acad_db",
  ssl: { rejectUnauthorized: false } // Required for Supabase SSL
});

// ✅ Register new user
app.post("/register", async (req, res) => {
  try {
    const { name, password, telephone } = req.body;

    if (!name || !password || !telephone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkUser = await pool.query("SELECT * FROM public.\"Academy's\" WHERE telephone = $1", [telephone]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    await pool.query(
      "INSERT INTO public.\"Academy's\" (name, password, telephone) VALUES ($1, $2, $3)",
      [name, password, telephone]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { telephone, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM public.\"Academy's\" WHERE telephone = $1 AND password = $2",
      [telephone, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user: result.rows[0] });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Supabase Backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
