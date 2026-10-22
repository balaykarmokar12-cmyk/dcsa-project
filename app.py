from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
DB = 'royal_food.db'

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT, customer TEXT, phone TEXT, address TEXT,
        payment TEXT, items TEXT, total INTEGER, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT,
        badge TEXT, img TEXT, description TEXT, ingredients TEXT)''')
    conn.commit()
    conn.close()

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('INSERT INTO orders (order_id, customer, phone, address, payment, items, total, date) VALUES (?,?,?,?,?,?,?,?)',
              (data['orderId'], data['customer'], data['phone'], data['address'], data['payment'], str(data['items']), data['total'], datetime.now().strftime("%d/%m/%Y %I:%M %p")))
    conn.commit()
    conn.close()
    return jsonify({"status":"success", "orderId": data['orderId']})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('SELECT * FROM orders ORDER BY id DESC')
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/api/stats', methods=['GET'])
def stats():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('SELECT COUNT(*), SUM(total) FROM orders')
    count, revenue = c.fetchone()
    conn.close()
    return jsonify({"total_orders": count or 0, "total_revenue": revenue or 0})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
