-- Generate Seats for Buses that don't have them
DO $$
DECLARE
    bus RECORD;
    i INT;
    row_idx INT;
    col_idx INT;
    seat_label VARCHAR;
    seat_type VARCHAR;
BEGIN
    FOR bus IN SELECT id, capacity, seat_layout FROM buses WHERE id NOT IN (SELECT DISTINCT bus_id FROM seats) LOOP
        FOR i IN 1..bus.capacity LOOP
            -- Determine layout specifics
            IF bus.seat_layout = '2x1' THEN
                row_idx := (i - 1) / 3;
                col_idx := ((i - 1) % 3) + 1;
                seat_label := chr(65 + row_idx) || col_idx::varchar;
                IF col_idx = 1 THEN seat_type := 'window';
                ELSIF col_idx = 2 THEN seat_type := 'aisle';
                ELSE seat_type := 'window'; END IF;
            ELSIF bus.seat_layout = '1x1' THEN
                row_idx := (i - 1) / 2;
                col_idx := ((i - 1) % 2) + 1;
                seat_label := chr(65 + row_idx) || col_idx::varchar;
                seat_type := 'window';
            ELSE -- Default 2x2
                row_idx := (i - 1) / 4;
                col_idx := ((i - 1) % 4) + 1;
                seat_label := chr(65 + row_idx) || col_idx::varchar;
                IF col_idx = 1 OR col_idx = 4 THEN seat_type := 'window';
                ELSE seat_type := 'aisle'; END IF;
            END IF;
            
            INSERT INTO seats (bus_id, seat_number, seat_type, is_active) 
            VALUES (bus.id, seat_label, seat_type, true);
        END LOOP;
    END LOOP;
END $$;

-- Schedule Trips for the next few days
DO $$
DECLARE
    bus RECORD;
    route_id INT;
    trip_id INT;
    dep_time TIMESTAMP;
    arr_time TIMESTAMP;
    d INT;
BEGIN
    -- For each bus, assign a random route and schedule trips
    FOR bus IN SELECT id FROM buses LOOP
        -- Assign route based on bus id (pseudo-random)
        SELECT id INTO route_id FROM routes ORDER BY id OFFSET (bus.id % (SELECT count(*) FROM routes)) LIMIT 1;
        
        FOR d IN 1..3 LOOP
            dep_time := date_trunc('day', NOW()) + (d || ' days')::INTERVAL + '20:00:00'::INTERVAL;
            arr_time := dep_time + '10:00:00'::INTERVAL;
            
            -- Insert Trip
            INSERT INTO trips (bus_id, route_id, departure_time, arrival_time, base_fare, tax_percent, status, created_at)
            VALUES (bus.id, route_id, dep_time, arr_time, 1200.00 + (bus.id * 50), 5.0, 'scheduled', NOW())
            RETURNING id INTO trip_id;
            
            -- Insert Trip Seat Statuses
            INSERT INTO trip_seat_statuses (trip_id, seat_id, status)
            SELECT trip_id, id, 'available' FROM seats WHERE bus_id = bus.id;
        END LOOP;
    END LOOP;
END $$;
