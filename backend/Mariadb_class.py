import mysql.connector as con 
from mysql.connector.errors import Error


class MySQLDatabase:
    def __init__(self, host, user, password, database, port):
        self.connection = con.connect(host=host,user=user,password=password,database=database, port=port)
        self.cursor = self.connection.cursor()
        print("\nConnected to DB!")

    def _verify_table_is_created(self, table_name: str) ->bool:
        self.cursor.execute("SHOW TABLES")
        return True if table_name in [ x[0] for x in self.cursor.fetchall() ] else False

    def create_table(self, table_name: str, columns: str) -> dict:
        query = f"CREATE TABLE { table_name } ({ columns });"
        self.cursor.execute(query)
        self.connection.commit()
        if self._verify_table_is_created(table_name):
            return { "result": 0, "msg": "Table created succesfully" }
        else:
            return { "result": 1, "msg": "Something went wrong" }

    def insert_into_table(self, table_name, columns, values):
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s' for _ in values])})"
        self.cursor.execute(query, values)
        self.connection.commit()
        if self.cursor.rowcount == 1:
            return { "result": 0, "msg": "Row inserted succesfully" }
        else:
            return { "result": 1, "msg": "Something went wrong" }

    def insert_many_into_table(self, table_name, columns, values):
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s' for _ in values[0]])})"
        self.cursor.executemany(query, values)
        self.connection.commit()
        if self.cursor.rowcount == len(values):
            return { "result": 0, "msg": "Rows inserted succesfully" }
        else:
            return { "result": 1, "msg": "Something went wrong" }

    def execute_query(self, cols, table, where):
        if where != "":
            q = f"SELECT { cols } FROM { table } WHERE { where };"
        else:
            q = f"SELECT { cols } FROM { table };"
        self.cursor.execute(q)
        return self.cursor.fetchall()

    def delete_rows(self, table, where):
        if where != "":
            q = f"DELETE FROM { table } WHERE { where }"
            self.cursor.execute(q)
            return { "result": 0, "msg": f"{ self.cursor.rowcount } Rows deleted" }
        else:
            return { "result": 1, "msg":  "Please, add a WHERE clause" }

    def update_rows(self, table, column_to_update, new_value, where):
        if where != "":
            q = f"UPDATE { table } SET { column_to_update } = { new_value } WHERE { where };"
            self.cursor.execute(q)
            self.connection.commit()
            return { "result": 0, "msg": f"{ self.cursor.rowcount } Rows updated" }
        else:
            return { "result": 1, "msg":  "Please, add a WHERE clause" }

    def drop_table(self, table_name):
        try:
            q = f"DROP TABLE { table_name }"
            self.cursor.execute(q)
            return { "result": 0, "msg": "Table deleted succesfully" }
        except:
            return { "result": 1, "msg": "ERROR" }

    def drop_column(self, table_name, column_name):
        q = f"ALTER TABLE { table_name } DROP COLUMN { column_name }"
        self.cursor.execute(q)

    def close_connection(self):
        print("Closing connection...")
        self.cursor.close()
        self.connection.close()
