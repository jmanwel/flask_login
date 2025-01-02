from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from backend.users import *
from dotenv import load_dotenv

import json
import os

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False


@app.route('/')
def hello():
    return 'Hello, World!'


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        result = validateLogin(cx, json.loads(request.get_data().decode('utf-8')))
        if result["result"] == 0:
            session["name"] = json.loads(request.get_data().decode('utf-8'))["username"]
            return redirect("/index")
    return render_template("/login.html")


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == "POST":
        result = createNewUser(cx, json.loads(request.get_data().decode('utf-8')))
        if result["result"] == 0:
            session["name"] = json.loads(request.get_data().decode('utf-8'))["username"]
            return redirect("/index")
    return render_template("/signup.html")


@app.route('/index', methods=['GET', 'POST'])
def index():
    if not session.get("name"):
        return redirect("/login")
    return render_template("/index.html", name=session["name"])


@app.route("/logout", methods=['GET', 'POST'])
def logout():
	session["name"] = None
	return redirect("/login")


if __name__ == '__main__':
    load_dotenv()
    HOST = os.environ.get("SERVER")
    PORT = os.environ.get("PORT")
    USER = os.environ.get("USER")
    PASSWORD = os.environ.get("PASSWORD")
    DB = os.environ.get("DATABASE")
    cx = MySQLDatabase(host=HOST, user=USER, port=PORT, password=PASSWORD, database=DB)
    app.secret_key = os.environ.get("APP_KEY")
    app.run()