-- Insert Operators
INSERT INTO users (name, email, password_hash, phone, role, is_active, is_verified, created_at) VALUES
('SRS Travels', 'srs@travels.com', '$2a$11$F6UhdLi7spJEF5JK9taDWOX92IWv1oCGUH6jQeY6JUM2yDGThI6Ca', '9876543210', 'operator', true, true, NOW()),
('VRL Travels', 'vrl@travels.com', '$2a$11$F6UhdLi7spJEF5JK9taDWOX92IWv1oCGUH6jQeY6JUM2yDGThI6Ca', '9876543211', 'operator', true, true, NOW()),
('Intercity SmartBus', 'intercity@bus.com', '$2a$11$F6UhdLi7spJEF5JK9taDWOX92IWv1oCGUH6jQeY6JUM2yDGThI6Ca', '9876543212', 'operator', true, true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Routes
INSERT INTO routes (source, destination, distance_km, created_at) VALUES
('Bangalore', 'Hyderabad', 570, NOW()),
('Mumbai', 'Goa', 600, NOW()),
('Chennai', 'Madurai', 450, NOW()),
('Pune', 'Mumbai', 150, NOW())
ON CONFLICT DO NOTHING;

-- Add some Buses for new operators
DO $$
DECLARE
    srs_id INT;
    vrl_id INT;
    intercity_id INT;
BEGIN
    SELECT id INTO srs_id FROM users WHERE email = 'srs@travels.com';
    SELECT id INTO vrl_id FROM users WHERE email = 'vrl@travels.com';
    SELECT id INTO intercity_id FROM users WHERE email = 'intercity@bus.com';

    IF srs_id IS NOT NULL THEN
        INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, capacity, seat_layout, is_active, created_at) VALUES
        (srs_id, 'SRS Volvo Multi-Axle', 'KA-01-SR-1234', 'AC Sleeper', 36, '2x1', true, NOW()),
        (srs_id, 'SRS Express', 'KA-01-SR-5678', 'Non-AC Seater', 40, '2x2', true, NOW())
        ON CONFLICT (bus_number) DO NOTHING;
    END IF;

    IF vrl_id IS NOT NULL THEN
        INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, capacity, seat_layout, is_active, created_at) VALUES
        (vrl_id, 'VRL Travels Gold Class', 'KA-25-VR-9999', 'AC Sleeper', 30, '2x1', true, NOW()),
        (vrl_id, 'VRL Connect', 'KA-25-VR-1111', 'AC Seater', 45, '2x2', true, NOW())
        ON CONFLICT (bus_number) DO NOTHING;
    END IF;

    IF intercity_id IS NOT NULL THEN
        INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, capacity, seat_layout, is_active, created_at) VALUES
        (intercity_id, 'Intercity SmartBus Premium', 'DL-01-IS-4444', 'AC Sleeper', 32, '2x1', true, NOW())
        ON CONFLICT (bus_number) DO NOTHING;
    END IF;
END $$;
