import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Pool } from 'pg'

const app = express()
app.use(cors())
app.use(bodyParser.json())

// 🧠 Connect to Supabase PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres:malatani1234@db.rmdxhnhenedrwatqwbfj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
})

// 🧾 Register
app.post('/register', async (req, res) => {
  const { name, password, telephone } = req.body
  try {
    const checkUser = await pool.query('SELECT * FROM academies WHERE name=$1', [name])
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists!' })
    }

    await pool.query(
      'INSERT INTO academies (name, password, telephone) VALUES ($1, $2, $3)',
      [name, password, telephone]
    )
    res.json({ success: true, message: '✅ Registered successfully!' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 🔑 Login
app.post('/login', async (req, res) => {
  const { name, password } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM academies WHERE name=$1 AND password=$2',
      [name, password]
    )
    if (result.rows.length > 0) {
      res.json({ success: true, message: '✅ Login successful!', user: result.rows[0].name })
    } else {
      res.status(401).json({ success: false, message: '❌ Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 🚀 Run server
app.listen(3000, () => console.log('Server running on http://localhost:3000'))
