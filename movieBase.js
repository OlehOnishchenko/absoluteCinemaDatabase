import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

const initializeDatabase = async () => {
  console.log('🔄 Створюю таблицю movies...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      director TEXT NOT NULL,
      release_year INTEGER,
      rating NUMERIC
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('✅ Таблиця готова');
  } catch (error) {
    console.error('❌ Помилка створення таблиці:', error.message);
  }
};

async function getMovies() {
   const { rows } = await pool.query("SELECT * FROM movies");
   console.log("Мої фільми => ", rows);
}

async function addMovie() {
   await pool.query("insert into movies (title, director, release_year, rating) values ('Dune: Part Two', 'Denis Villeneuve', 2024, 8.8)");
   console.log("✅ Фільм додано");
}

async function updateMovie() {
   await pool.query("update movies set rating = 9.0 where id = 1");
   console.log("✅ Рейтинг оновлено");
}

// 5. Видалення даних
async function deleteMovie() {
   await pool.query("delete from movies where id = 2");
   console.log("Фільм видалено");
}

async function run() {
    await initializeDatabase();
    
    await getMovies(); 
}

run();
