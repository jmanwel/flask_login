# Flak Login App 

This app is a mock to test hashing store password.


## Libraries

bcrypt
datetime
dotenv
json
mysql.connector
os
requests


## Usage

First, create a .env file at top level in your directory.
This file, should contain the following keys:

DATABASE=
SERVER=
USER=
PASSWORD=
PORT=
APP_KEY=

DATABASE_MOCK=
USER_MOCK=
PASSWORD_MOCK=

Now, you can run the project: python app.py


## Testing

python ./tests/test.py

## DB

### CREDENTIAL IN MOCK DB FOR TESTING:
CREATE USER 'root_mock'@'%' IDENTIFIED BY 'p4ssw0rd_mock';
GRANT ALL ON test_db.* TO 'root_mock'@'%';
FLUSH PRIVILEGES;

### TABLES 
#### USERS
CREATE TABLE users 
(
    userId integer NOT NULL PRIMARY KEY auto_increment,
    username char(100) NOT NULL,
    password char(200) NOT NULL,
    createdAt timestamp NOT NULL,
    lastLogin timestamp,
    enabled tinyint(1) 
);

#### LOGIN_AUDIT
CREATE TABLE login_audit 
(
    loginId integer NOT NULL PRIMARY KEY auto_increment,
    date_time timestamp NOT NULL,
    username char(100) NOT NULL,
    result tinyint(1) 
);

### TRIGGER
CREATE TRIGGER track_users_insert AFTER INSERT ON users
FOR EACH ROW
INSERT INTO login_audit (date_time, username, result)
VALUES (NOW(), NEW.username, 0);


