import unittest
import sys

sys.path.append("../")
from app import *
from backend.users import *
from backend.Mariadb_class import *


class AppTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.ctx = app.app_context()
        self.ctx.push()
        self.client = app.test_client()
        unittest.TestCase.user_mock = { "username": "user_test", "password": "password_mock" }
        COLUMNS ='''userId integer NOT NULL PRIMARY KEY auto_increment,
                    username char(100) NOT NULL, 
                    password char(200) NOT NULL,
                    lastLogin timestamp NOT NULL, 
                    createdAt timestamp, enabled tinyint(1)'''
        cx_mock.create_table("users", COLUMNS)
        COLUMNS2 = '''loginId integer NOT NULL PRIMARY KEY auto_increment,
            date_time timestamp NOT NULL,
            username char(100) NOT NULL,
            result tinyint(1) NOT NULL'''
        cx_mock.create_table("login_audit", COLUMNS2)

    def test_create_new_user(self):
        assert createNewUser(cx_mock, unittest.TestCase.user_mock)["result"] == 0

    def test_health(self):
        response = self.client.get("/")
        assert response.status_code == 200
        assert response.text == "Hello, World!"

    def test_get_hashed_password_return_a_string(self):
        assert type(get_hashed_password("super_secret")) == str

    def test_logout_redirect(self):
        response = self.client.get("/logout", follow_redirects=True)
        assert len(response.history) == 1
        assert response.request.path == "/login"

    def test_validate_login(self):
        assert validateLogin(cx_mock, unittest.TestCase.user_mock)["result"] == 0

    @classmethod
    def tearDownClass(self):
        WHERE = "userId=1"
        cx_mock.delete_rows("users", WHERE)
        cx_mock.drop_table("users")
        cx_mock.drop_table("login_audit")
        cx_mock.close_connection()
        self.ctx.pop()

if __name__ == "__main__":
    load_dotenv()
    app.secret_key = os.environ.get("APP_KEY")
    HOST = os.environ.get("SERVER")
    PORT = os.environ.get("PORT")
    USER = os.environ.get("USER_MOCK")
    PASSWORD = os.environ.get("PASSWORD_MOCK")
    DB = os.environ.get("DATABASE_MOCK")
    cx_mock = MySQLDatabase(host=HOST, user=USER, port=PORT, password=PASSWORD, database=DB)
    unittest.main()