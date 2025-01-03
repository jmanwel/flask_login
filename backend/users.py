import bcrypt
from datetime import datetime
from .Mariadb_class import *


FORMAT = '%Y-%m-%d %H:%M:%S'


def get_hashed_password(plain_text_password: str) -> str:
    salt = bcrypt.gensalt( rounds=15, prefix=b'2a' )
    return bcrypt.hashpw(plain_text_password.encode("UTF-8"), salt).decode("UTF-8")


def check_password(plain_text_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_text_password.encode("UTF-8"), hashed_password.encode("UTF-8"))


def createUserObject(data: dict) ->dict:
    return {
        "username": data["username"],
        "password": get_hashed_password(data["password"]),
        "createdAt": datetime.now().strftime(FORMAT),
        "lastLogin": None,
        "enabled": 1
    }


def createNewUser(cx: MySQLDatabase, data: dict) -> dict:
    newUser = createUserObject(data)
    try:
        userExists = len(cx.execute_query("password", "users", f"username='{ newUser['username'] }'"))
        if userExists == 0:
            result = cx.insert_into_table("users", list(newUser.keys()), list(newUser.values()))
            return result
        return { "result": 1, "msg": "User already exists" }
    except Error as e:
        print("Error:", str(e))
        return { "result": 1, "msg": str(e) }


def validateLogin(cx: MySQLDatabase, data: dict) -> dict:
    username, password = data.values()
    now = datetime.now().strftime(FORMAT)
    try:
        result_query = cx.execute_query("userId, password, enabled", "users", f"username='{ username }'")
        if result_query == []:
            return { "result": 1, "msg": "USER DOESN'T EXIST" }
        userID, stPassword, isEnabled = result_query[0]
        if isEnabled == 0:
            return { "result": 1, "msg": "USER DISABLED" }
        if check_password(password, stPassword):
            audit(cx,{ "username": username,
                    "timestamp": now,
                    "userIdClause": f"userId={ userID }",
                    "resultLogin": 0 })
            return { "result": 0, "msg": "LOGIN SUCCESFULL" }
        audit(cx, { "username": username,
                    "timestamp": now,
                    "userIdClause": f"userId={ userID }",
                    "resultLogin": 1 })
        return { "result": 1, "msg": "USER/PASSWORD INCORRECT" }
    except Error as e:
        print("Error:", str(e))
        return { "result": 1, "msg": str(e) }


def audit(cx: MySQLDatabase, data: dict) -> dict:
    username, TIME, CLAUSE, RESULT = data.values() 
    result_update = cx.update_rows("users", "lastLogin", f"'{ TIME }'", CLAUSE)
    COLS = [ "date_time", "username", "result" ]
    VALUES = [TIME, username, RESULT ]
    result_insert = cx.insert_into_table("login_audit", COLS, VALUES)
    if result_update["result"] == 0 and result_insert["result"] == 0:
        print("AUDIT OK!")
        return 0
    print("AUDIT FAILED!")
    return 1


def checkAudit(cx: MySQLDatabase) -> dict:
    try:
        result_query = cx.execute_query("*", "login_view")
        return { "result": 0, "msg": result_query }
    except Error as e:
        print("Error:", str(e))
        return { "result": 1, "msg": str(e) }