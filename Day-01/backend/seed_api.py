import requests
import datetime

BASE_URL = "http://localhost:5177/api"

# Admin credentials (for creating routes)
# Assuming admin@example.com exists. Wait, I added routes via SQL so I don't need to add routes.

def login(email, password="password"):
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    if res.status_code == 200:
        return res.json()["token"]
    else:
        print(f"Login failed for {email}: {res.text}")
        return None

def add_bus(token, bus_name, bus_number, bus_type, capacity, seat_layout):
    res = requests.post(f"{BASE_URL}/operator/buses", json={
        "busName": bus_name,
        "busNumber": bus_number,
        "busType": bus_type,
        "capacity": capacity,
        "seatLayout": seat_layout
    }, headers={"Authorization": f"Bearer {token}"})
    
    if res.status_code == 200:
        bus = res.json()
        print(f"Added Bus: {bus['busNumber']}")
        return bus['id']
    else:
        print(f"Failed to add bus {bus_number}: {res.text}")
        return None

def schedule_trip(token, bus_id, route_id, dep_time, arr_time, base_fare, tax_percent=5.0):
    res = requests.post(f"{BASE_URL}/operator/trips", json={
        "busId": bus_id,
        "routeId": route_id,
        "departureTime": dep_time.isoformat() + "Z",
        "arrivalTime": arr_time.isoformat() + "Z",
        "baseFare": base_fare,
        "taxPercent": tax_percent
    }, headers={"Authorization": f"Bearer {token}"})
    
    if res.status_code == 200:
        print(f"Scheduled Trip for Bus {bus_id} on Route {route_id}")
    else:
        print(f"Failed to schedule trip: {res.text}")

def main():
    operators = [
        {"email": "srs@travels.com", "buses": [
            {"name": "SRS Volvo Multi-Axle", "number": "KA-01-SR-7777", "type": "AC Sleeper", "cap": 36, "layout": "2x1"},
            {"name": "SRS Express", "number": "KA-01-SR-8888", "type": "Non-AC Seater", "cap": 40, "layout": "2x2"}
        ]},
        {"email": "vrl@travels.com", "buses": [
            {"name": "VRL Gold Class", "number": "KA-25-VR-5555", "type": "AC Sleeper", "cap": 30, "layout": "2x1"}
        ]},
        {"email": "intercity@bus.com", "buses": [
            {"name": "SmartBus Premium", "number": "DL-01-IS-3333", "type": "AC Seater", "cap": 45, "layout": "2x2"}
        ]}
    ]

    # Assume Route IDs from DB
    # We added:
    # Bangalore -> Hyderabad
    # Mumbai -> Goa
    # Chennai -> Madurai
    # Pune -> Mumbai

    # I'll need to fetch routes or just hardcode some common ones. 
    # Let's fetch routes first
    res = requests.get(f"{BASE_URL}/routes")
    routes = res.json() if res.status_code == 200 else []
    
    if not routes:
        print("No routes available. Make sure DB is running.")
        return

    route_map = {f"{r['source']}-{r['destination']}": r['id'] for r in routes}
    
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for op in operators:
        token = login(op["email"])
        if not token:
            continue
            
        for b in op["buses"]:
            bus_id = add_bus(token, b["name"], b["number"], b["type"], b["cap"], b["layout"])
            if bus_id:
                # Schedule trips for next 3 days
                for i in range(1, 4):
                    # Find a random route to assign
                    route_key = list(route_map.keys())[bus_id % len(route_map)]
                    route_id = route_map[route_key]
                    
                    dep = today + datetime.timedelta(days=i, hours=20) # 8 PM
                    arr = dep + datetime.timedelta(hours=10) # 6 AM next day
                    
                    schedule_trip(token, bus_id, route_id, dep, arr, 1500.0)

if __name__ == "__main__":
    main()
