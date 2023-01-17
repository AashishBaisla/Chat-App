SHOW DATABASES ;
CREATE DATABASE ashish_chatapp ;
USE ashish_chatapp ;

/*USERS TABLE (PRIMARY TABLE)*/
CREATE TABLE app_users (
  userID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(20),
  username VARCHAR(30) UNIQUE NOT NULL,
  user_pass varchar(100)
) ;
SELECT * FROM app_users ;
INSERT INTO app_users (full_name, username, user_pass) VALUES ("Aashish", "ashu", 123);
INSERT INTO app_users (full_name, username, user_pass) VALUES ("Nikhil", "nikhil", 123);

CREATE TABLE conversations (
  conversation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id_1 BIGINT UNSIGNED NOT NULL,
  user_id_2 BIGINT UNSIGNED NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  UNIQUE (user_id_1, user_id_2, start_time),
  FOREIGN KEY (user_id_1) REFERENCES app_users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES app_users(userID) ON DELETE CASCADE ON UPDATE CASCADE
);
SELECT * FROM conversations ;

CREATE TABLE messages (
  message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  msg VARCHAR(255),
  sender_user_id BIGINT UNSIGNED NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES app_users(userID) ON DELETE CASCADE ON UPDATE CASCADE
);
SELECT * FROM messages ;