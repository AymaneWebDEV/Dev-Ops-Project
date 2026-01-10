import os
import time
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import OperationalError


def _build_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    host = os.getenv("MYSQL_HOST", "localhost")
    port = os.getenv("MYSQL_PORT", "3306")
    user = os.getenv("MYSQL_USER", "app")
    password = os.getenv("MYSQL_PASSWORD", "app")
    db_name = os.getenv("MYSQL_DB", "app")
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}"


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = _build_database_url()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

db = SQLAlchemy(app)


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() + "Z" if self.created_at else None,
            "updated_at": self.updated_at.isoformat() + "Z" if self.updated_at else None,
        }


def _init_db_with_retry(max_attempts: int = 30, sleep_seconds: float = 1.0) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            db.create_all()
            return
        except OperationalError:
            if attempt == max_attempts:
                raise
            time.sleep(sleep_seconds)


def _ensure_db_initialized():
    if not hasattr(app, '_db_initialized'):
        _init_db_with_retry()
        app._db_initialized = True


@app.get("/")
def index():
    return jsonify({"service": "flask-mysql-crud", "status": "running"})


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/items")
def list_items():
    _ensure_db_initialized()
    q = request.args.get("q")
    query = Item.query
    if q:
        query = query.filter(Item.name.ilike(f"%{q}%"))
    items = query.order_by(Item.id.asc()).all()
    return jsonify([i.to_dict() for i in items])


@app.post("/items")
def create_item():
    _ensure_db_initialized()
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    name = data.get("name")
    description = data.get("description")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "'name' is required"}), 400

    item = Item(name=name.strip(), description=description)
    db.session.add(item)
    db.session.commit()

    return jsonify(item.to_dict()), 201


@app.get("/items/<int:item_id>")
def get_item(item_id: int):
    _ensure_db_initialized()
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(item.to_dict())


@app.put("/items/<int:item_id>")
def update_item(item_id: int):
    _ensure_db_initialized()
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    if "name" in data:
        name = data.get("name")
        if not isinstance(name, str) or not name.strip():
            return jsonify({"error": "'name' must be a non-empty string"}), 400
        item.name = name.strip()

    if "description" in data:
        item.description = data.get("description")

    db.session.commit()
    return jsonify(item.to_dict())


@app.delete("/items/<int:item_id>")
def delete_item(item_id: int):
    _ensure_db_initialized()
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return "", 204


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
