import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Pool } from 'pg'

const app = express()

// ✅ Middleware
app.use(cors({
  origin: '*', // Allow all origins (you can restrict later to your frontend domain)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))
app.use(bodyParser.json())

// 🧠 Connect to Supabase PostgreSQL database
const pool = new Pool({
  connectionString: 'postgresql://postgres:malatani1234@db.rmdxhnhenedrwatqwbfj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

// 🧩 Route: Register new user
app.post('/register', async (req, res) => {
  const { name, password, telephone } = req.body

  try {
    await pool.query(
      'INSERT INTO "Academy\'s" (Name, Password, Telephone) VALUES ($1, $2, $3)',
      [name, password, telephone]
    )
    res.json({ success: true, message: '✅ Registration successful!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: '❌ ' + error.message })
  }
})

// 🧩 Route: Login existing user
app.post('/login', async (req, res) => {
  const { name, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM "Academy\'s" WHERE Name=$1 AND Password=$2',
      [name, password]
    )

    if (result.rows.length > 0) {
      res.json({ success: true, message: '✅ Login successful!' })
    } else {
      res.status(401).json({ success: false, message: '❌ Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: '❌ ' + error.message })
  }
})

// 🚀 Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
