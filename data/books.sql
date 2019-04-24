DROP TABLE IF EXISTS saved_books;

CREATE TABLE saved_books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description TEXT,
  image_url VARCHAR(511),
  isbn VARCHAR(255),
  bookshelf VARCHAR(255)
);

INSERT INTO saved_books (title, author, description, image_url, isbn, bookshelf) VALUES ('I am a Book', 'Anon', 'Best book ever', 'https://cdn.discover-the-world.com/app/uploads/2018/05/antarctica-wildlife-adelie-penguins-icehopping-istock-800x600-c-default.jpg', '1234567891234', 'Coool Boooks');

INSERT INTO saved_books (title, author, description, image_url, isbn, bookshelf) VALUES ('I am a Book', 'Anon', 'Best book ever', 'https://cdn.discover-the-world.com/app/uploads/2018/05/antarctica-wildlife-adelie-penguins-icehopping-istock-800x600-c-default.jpg', '1234567891234', 'Coool Boooks');