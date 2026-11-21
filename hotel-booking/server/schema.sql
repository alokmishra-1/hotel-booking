CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(100) DEFAULT 'users' CHECK(role in('users','admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hotels(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms(
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCEs hotels(id) ON DELETE CASCADE,
    price_per_night NUMERIC(10,2) NOT NULL,
    room_type INT NOT NULL,
    total_room INT NOT NULL DEFAULT 1,
    capacity INT NOT NULL
);

CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    user_id INT REFERNCEs users(id) ON DELETE CASCADE,
    room_id INT REFERNCEs rooms(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    CHECK(check_out>check_in)
)