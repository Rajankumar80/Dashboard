import sqlite3
import random
import hashlib
import os
from datetime import datetime, timedelta

DB_FILE = "/home/rajan/store_pulse/database/analytics.db"

# Start fresh every run
if os.path.exists(DB_FILE):
    os.remove(DB_FILE)

conn = sqlite3.connect(DB_FILE)
cur = conn.cursor()

# ==========================
# TABLES
# ==========================

cur.execute("""
CREATE TABLE stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT
)
""")

cur.execute("""
CREATE TABLE cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    webrtc_url TEXT,
    location TEXT NOT NULL,
    reid INTEGER DEFAULT 0,
    gender_age INTEGER DEFAULT 0,
    activate INTEGER DEFAULT 1,
    tested INTEGER DEFAULT 0,
    connection_status TEXT DEFAULT 'unknown',
    last_tested_at TEXT DEFAULT NULL
)
""")

cur.execute("""
CREATE TABLE counting_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    cam_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    points TEXT NOT NULL,
    reid INTEGER DEFAULT 0,
    gender_age INTEGER DEFAULT 0
)
""")

cur.execute("""
CREATE TABLE detection_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    cam_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    points TEXT NOT NULL,
    reid INTEGER DEFAULT 0,
    gender_age INTEGER DEFAULT 0,
    closed INTEGER DEFAULT 1,
    detection_mode TEXT DEFAULT 'visit',
    role_type TEXT DEFAULT NULL
)
""")

cur.execute("""
CREATE TABLE visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    timestamp TEXT NOT NULL,
    gender TEXT,
    age_group TEXT,
    event TEXT
)
""")

cur.execute("""
CREATE TABLE footfall (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    timestamp TEXT,
    cam_id TEXT,
    track_id INTEGER,
    type TEXT
)
""")

cur.execute("""
CREATE TABLE zone_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    timestamp TEXT NOT NULL,
    cam_id INTEGER,
    zone_name TEXT,
    track_id INTEGER,
    event TEXT,
    direction TEXT,
    zone TEXT
)
""")

cur.execute("""
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    camera_id INTEGER,
    zone_name TEXT,
    alert_label TEXT,
    triggered_at TEXT,
    resolved_at TEXT,
    duration_min REAL
)
""")

conn.commit()

# ==========================
# DUMMY DATA
# ==========================

stores = ["Admin", "Store_A", "Store_B"]

for store in stores:
    cur.execute("""
    INSERT INTO stores
    (store_name,email,password,created_at)
    VALUES (?,?,?,?)
    """, (
        store,
        f"{store.lower()}@test.com",
        hashlib.sha256("password".encode()).hexdigest(),
        datetime.now().isoformat()
    ))

conn.commit()

# Cameras
for store in stores:
    for i in range(3):
        cur.execute("""
        INSERT INTO cameras(
            store_name,name,url,webrtc_url,location,
            reid,gender_age,activate,tested,
            connection_status,last_tested_at
        )
        VALUES(?,?,?,?,?,?,?,?,?,?,?)
        """, (
            store,
            f"Camera_{i+1}",
            f"rtsp://camera{i+1}",
            f"webrtc://camera{i+1}",
            f"Location_{i+1}",
            1,
            1,
            1,
            1,
            "online",
            datetime.now().isoformat()
        ))

conn.commit()

camera_rows = cur.execute(
    "SELECT id,store_name FROM cameras"
).fetchall()

# Counting Lines
for cam_id, store_name in camera_rows:
    cur.execute("""
    INSERT INTO counting_lines
    (store_name,cam_id,name,points,reid,gender_age)
    VALUES(?,?,?,?,?,?)
    """, (
        store_name,
        cam_id,
        f"Line_{cam_id}",
        "[[100,100],[500,100]]",
        1,
        1
    ))

# Detection Zones
for cam_id, store_name in camera_rows:
    cur.execute("""
    INSERT INTO detection_zones
    (store_name,cam_id,name,points,reid,
     gender_age,closed,detection_mode,role_type)
    VALUES(?,?,?,?,?,?,?,?,?)
    """, (
        store_name,
        cam_id,
        f"Zone_{cam_id}",
        "[[100,100],[500,100],[500,500],[100,500]]",
        1,
        1,
        1,
        "visit",
        "admin"
    ))

# Visits
genders = ["Male", "Female"]
ages = ["18-25", "26-35", "36-45", "46-60"]
events = ["entry", "exit"]

for _ in range(100):
    cur.execute("""
    INSERT INTO visits
    (store_name,timestamp,gender,age_group,event)
    VALUES(?,?,?,?,?)
    """, (
        random.choice(stores),
        (datetime.now() -
         timedelta(minutes=random.randint(1,5000))).isoformat(),
        random.choice(genders),
        random.choice(ages),
        random.choice(events)
    ))

# Footfall
for _ in range(100):
    cur.execute("""
    INSERT INTO footfall
    (store_name,timestamp,cam_id,track_id,type)
    VALUES(?,?,?,?,?)
    """, (
        random.choice(stores),
        datetime.now().isoformat(),
        f"Cam_{random.randint(1,3)}",
        random.randint(1000,9999),
        random.choice(["entered","exited","detected"])
    ))

# Zone Events
for _ in range(100):
    cam_id, store_name = random.choice(camera_rows)

    cur.execute("""
    INSERT INTO zone_events
    (store_name,timestamp,cam_id,
     zone_name,track_id,event,direction,zone)
    VALUES(?,?,?,?,?,?,?,?)
    """, (
        store_name,
        datetime.now().isoformat(),
        cam_id,
        f"Zone_{cam_id}",
        random.randint(1000,9999),
        "visit",
        random.choice(["IN","OUT"]),
        f"Zone_{cam_id}"
    ))

# Alerts
for _ in range(20):
    cam_id, store_name = random.choice(camera_rows)

    start = datetime.now() - timedelta(
        minutes=random.randint(10,300)
    )

    duration = random.randint(5,60)

    cur.execute("""
    INSERT INTO alerts
    (store_name,camera_id,zone_name,
     alert_label,triggered_at,resolved_at,duration_min)
    VALUES(?,?,?,?,?,?,?)
    """, (
        store_name,
        cam_id,
        f"Zone_{cam_id}",
        random.choice([
            "Loitering",
            "Crowding",
            "Queue Alert"
        ]),
        start.isoformat(),
        (start + timedelta(minutes=duration)).isoformat(),
        duration
    ))

conn.commit()

# ==========================
# VERIFY
# ==========================

tables = [
    "stores",
    "cameras",
    "counting_lines",
    "detection_zones",
    "visits",
    "footfall",
    "zone_events",
    "alerts"
]

print("\nRow Counts:\n")

for table in tables:
    count = cur.execute(
        f"SELECT COUNT(*) FROM {table}"
    ).fetchone()[0]
    print(f"{table}: {count}")

conn.close()

print("\nDummy database created successfully!")