-- Seed more buses for existing operators and schedule them for a week

DO $$
DECLARE
    op_record RECORD;
    route_record RECORD;
    current_bus_id INT;
    trip_id INT;
    d INT;
    dep_time TIMESTAMP;
    arr_time TIMESTAMP;
    current_bus_idx INT;
    layout VARCHAR;
    capacity INT;
    bus_type VARCHAR;
    base_fare NUMERIC;
    
    -- Seat generation vars
    i INT;
    row_idx INT;
    col_idx INT;
    seat_label VARCHAR;
    seat_type VARCHAR;
BEGIN
    -- We will add 2 new buses for EACH operator in the system
    FOR op_record IN SELECT id, name FROM users WHERE role = 'operator' LOOP
        
        FOR current_bus_idx IN 1..2 LOOP
            -- Determine randomish properties
            IF (op_record.id + current_bus_idx) % 3 = 0 THEN
                layout := '2x1'; capacity := 30; bus_type := 'AC Sleeper';
            ELSIF (op_record.id + current_bus_idx) % 3 = 1 THEN
                layout := '2x2'; capacity := 40; bus_type := 'Non-AC Seater';
            ELSE
                layout := '2x2'; capacity := 44; bus_type := 'AC Semi-Sleeper';
            END IF;

            -- Create Bus
            INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, capacity, seat_layout, is_active, created_at)
            VALUES (
                op_record.id, 
                op_record.name || ' Fleet ' || (current_bus_idx * 100 + op_record.id),
                'XX-' || (10 + op_record.id) || '-' || (1000 + current_bus_idx * 100 + op_record.id),
                bus_type, capacity, layout, true, NOW()
            )
            ON CONFLICT (bus_number) DO NOTHING
            RETURNING id INTO current_bus_id;

            -- If bus created successfully, generate seats
            IF current_bus_id IS NOT NULL THEN
                FOR i IN 1..capacity LOOP
                    IF layout = '2x1' THEN
                        row_idx := (i - 1) / 3;
                        col_idx := ((i - 1) % 3) + 1;
                        seat_label := chr(65 + row_idx) || col_idx::varchar;
                        IF col_idx = 1 THEN seat_type := 'window';
                        ELSIF col_idx = 2 THEN seat_type := 'aisle';
                        ELSE seat_type := 'window'; END IF;
                    ELSE -- 2x2
                        row_idx := (i - 1) / 4;
                        col_idx := ((i - 1) % 4) + 1;
                        seat_label := chr(65 + row_idx) || col_idx::varchar;
                        IF col_idx = 1 OR col_idx = 4 THEN seat_type := 'window';
                        ELSE seat_type := 'aisle'; END IF;
                    END IF;
                    
                    INSERT INTO seats (bus_id, seat_number, seat_type, is_active) 
                    VALUES (current_bus_id, seat_label, seat_type, true);
                END LOOP;
                
                -- Assign a random route to this bus
                SELECT id, distance_km INTO route_record FROM routes 
                ORDER BY id OFFSET ((current_bus_id * 7) % (SELECT count(*) FROM routes)) LIMIT 1;
                
                -- Base fare calculation
                base_fare := COALESCE(route_record.distance_km, 300) * 2.5 + (current_bus_idx * 100);

                -- Schedule trips for the next 7 days
                FOR d IN 0..7 LOOP
                    dep_time := date_trunc('day', NOW()) + (d || ' days')::INTERVAL + '19:00:00'::INTERVAL;
                    arr_time := dep_time + '12:00:00'::INTERVAL; -- Assumed 12 hr journey
                    
                    INSERT INTO trips (bus_id, route_id, departure_time, arrival_time, base_fare, tax_percent, status, created_at)
                    VALUES (current_bus_id, route_record.id, dep_time, arr_time, base_fare, 5.0, 'scheduled', NOW())
                    RETURNING id INTO trip_id;
                    
                    -- Insert Trip Seat Statuses
                    INSERT INTO trip_seat_statuses (trip_id, seat_id, status)
                    SELECT trip_id, id, 'available' FROM seats WHERE bus_id = current_bus_id;
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
    
    -- Additionally, for existing buses, let's schedule them for the next 7 days as well
    -- if they don't already have trips for those days
    FOR current_bus_id IN SELECT id FROM buses LOOP
        SELECT id, distance_km INTO route_record FROM routes 
        ORDER BY id OFFSET ((current_bus_id * 3) % (SELECT count(*) FROM routes)) LIMIT 1;
        
        base_fare := COALESCE(route_record.distance_km, 300) * 2.5 + 200;

        FOR d IN 0..7 LOOP
            dep_time := date_trunc('day', NOW()) + (d || ' days')::INTERVAL + '21:30:00'::INTERVAL;
            arr_time := dep_time + '10:00:00'::INTERVAL;
            
            -- Only insert if a trip for this bus on this day doesn't exist
            IF NOT EXISTS (SELECT 1 FROM trips WHERE bus_id = current_bus_id AND DATE(departure_time) = DATE(dep_time)) THEN
                INSERT INTO trips (bus_id, route_id, departure_time, arrival_time, base_fare, tax_percent, status, created_at)
                VALUES (current_bus_id, route_record.id, dep_time, arr_time, base_fare, 5.0, 'scheduled', NOW())
                RETURNING id INTO trip_id;
                
                -- Insert Trip Seat Statuses
                INSERT INTO trip_seat_statuses (trip_id, seat_id, status)
                SELECT trip_id, id, 'available' FROM seats WHERE bus_id = current_bus_id;
            END IF;
        END LOOP;
    END LOOP;
END $$;
