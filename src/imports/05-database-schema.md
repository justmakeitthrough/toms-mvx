# TOMS - Database Schema

## Database: PostgreSQL

---

## 1. USERS & AUTHENTICATION

### Table: `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('SALES_EMPLOYEE', 'RESERVATIONS_OFFICER', 'OPERATIONS_OFFICER', 'ACCOUNTING_OFFICER', 'SUPER_ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**Description**: Stores user accounts with role-based access control.

---

## 2. LOCATION HIERARCHY

### Table: `countries`
```sql
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_countries_code ON countries(code);
```

### Table: `regions`
```sql
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_country_id ON regions(country_id);
```

### Table: `cities`
```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_id INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_region_id ON cities(region_id);
```

**Description**: Hierarchical location data (Country → Region → City) used throughout the system.

---

## 3. MASTER DATA

### Table: `agencies`
```sql
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agencies_city_id ON agencies(city_id);
CREATE INDEX idx_agencies_is_active ON agencies(is_active);
CREATE INDEX idx_agencies_name ON agencies(name);
```

**Description**: Travel agencies (B2B partners).

---

### Table: `destinations`
```sql
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_destinations_city_id ON destinations(city_id);
CREATE INDEX idx_destinations_is_active ON destinations(is_active);
```

**Description**: Tourism destinations.

---

### Table: `hotels`
```sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hotels_city_id ON hotels(city_id);
CREATE INDEX idx_hotels_is_active ON hotels(is_active);
CREATE INDEX idx_hotels_name ON hotels(name);
```

**Description**: Hotels and accommodation providers.

---

### Table: `suppliers`
```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    supplier_type VARCHAR(50) NOT NULL CHECK (supplier_type IN ('TRANSPORTATION', 'RENT_A_CAR', 'ADDITIONAL_SERVICE', 'FLIGHT')),
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_type ON suppliers(supplier_type);
CREATE INDEX idx_suppliers_city_id ON suppliers(city_id);
CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);
```

**Description**: Service suppliers (transportation, car rental, etc.).

---

## 4. PROPOSALS

### Table: `proposals`
```sql
CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    source VARCHAR(50) NOT NULL CHECK (source IN ('B2C', 'B2B', 'SALES_EMPLOYEE', 'MANAGER', 'OTHER')),
    agency_id INTEGER REFERENCES agencies(id) ON DELETE SET NULL,
    sales_person VARCHAR(255),
    destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
    estimated_nights INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'CANCELLED')),
    total_cost DECIMAL(12, 2) DEFAULT 0.00,
    total_margin DECIMAL(12, 2) DEFAULT 0.00,
    margin_percent DECIMAL(5, 2),
    commission_percent DECIMAL(5, 2) DEFAULT 0.00,
    commission_amount DECIMAL(12, 2) DEFAULT 0.00,
    total_sale DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    confirmed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_proposals_reference ON proposals(reference_number);
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_source ON proposals(source);
CREATE INDEX idx_proposals_agency_id ON proposals(agency_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at);
```

**Description**: Main proposal/quotation records.

---

## 5. ITINERARY ITEMS

### Table: `hotel_itinerary`
```sql
CREATE TABLE hotel_itinerary (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE SET NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    nights INTEGER GENERATED ALWAYS AS (checkout_date - checkin_date) STORED,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD')),
    board_type VARCHAR(50) NOT NULL CHECK (board_type IN ('BB', 'HB', 'FB', 'RO')),
    number_of_rooms INTEGER NOT NULL DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'USD',
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (price_per_night * nights * number_of_rooms) STORED,
    margin_percent DECIMAL(5, 2),
    margin_amount DECIMAL(10, 2),
    sale_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hotel_itinerary_proposal_id ON hotel_itinerary(proposal_id);
CREATE INDEX idx_hotel_itinerary_hotel_id ON hotel_itinerary(hotel_id);
CREATE INDEX idx_hotel_itinerary_checkin ON hotel_itinerary(checkin_date);
```

**Description**: Hotel accommodation items in proposals.

---

### Table: `transportation_itinerary`
```sql
CREATE TABLE transportation_itinerary (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    service_date DATE NOT NULL,
    service_description TEXT NOT NULL,
    vehicle_type VARCHAR(100),
    number_of_days INTEGER NOT NULL DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'USD',
    price_per_day DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (price_per_day * number_of_days) STORED,
    margin_percent DECIMAL(5, 2),
    margin_amount DECIMAL(10, 2),
    sale_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transportation_itinerary_proposal_id ON transportation_itinerary(proposal_id);
CREATE INDEX idx_transportation_itinerary_service_date ON transportation_itinerary(service_date);
```

**Description**: Transportation services in proposals.

---

### Table: `flight_itinerary`
```sql
CREATE TABLE flight_itinerary (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    flight_date DATE NOT NULL,
    departure VARCHAR(255) NOT NULL,
    arrival VARCHAR(255) NOT NULL,
    departure_time TIME,
    flight_type VARCHAR(50) CHECK (flight_type IN ('DOMESTIC', 'INTERNATIONAL')),
    pax INTEGER NOT NULL DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'USD',
    price_per_pax DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (price_per_pax * pax) STORED,
    margin_percent DECIMAL(5, 2),
    margin_amount DECIMAL(10, 2),
    sale_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flight_itinerary_proposal_id ON flight_itinerary(proposal_id);
CREATE INDEX idx_flight_itinerary_flight_date ON flight_itinerary(flight_date);
```

**Description**: Flight bookings in proposals.

---

### Table: `rent_a_car_itinerary`
```sql
CREATE TABLE rent_a_car_itinerary (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    rental_date DATE NOT NULL,
    car_type VARCHAR(100) NOT NULL,
    number_of_days INTEGER NOT NULL DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'USD',
    price_per_day DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (price_per_day * number_of_days) STORED,
    margin_percent DECIMAL(5, 2),
    margin_amount DECIMAL(10, 2),
    sale_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rent_a_car_itinerary_proposal_id ON rent_a_car_itinerary(proposal_id);
CREATE INDEX idx_rent_a_car_itinerary_rental_date ON rent_a_car_itinerary(rental_date);
```

**Description**: Car rental services in proposals.

---

### Table: `additional_service_itinerary`
```sql
CREATE TABLE additional_service_itinerary (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    service_date DATE NOT NULL,
    service_description TEXT NOT NULL,
    number_of_days INTEGER NOT NULL DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'USD',
    price_per_day DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (price_per_day * number_of_days) STORED,
    margin_percent DECIMAL(5, 2),
    margin_amount DECIMAL(10, 2),
    sale_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_additional_service_itinerary_proposal_id ON additional_service_itinerary(proposal_id);
CREATE INDEX idx_additional_service_itinerary_service_date ON additional_service_itinerary(service_date);
```

**Description**: Additional services (SIM cards, VIP transfers, etc.) in proposals.

---

## 6. VOUCHERS

### Table: `vouchers`
```sql
CREATE TABLE vouchers (
    id SERIAL PRIMARY KEY,
    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    voucher_type VARCHAR(50) NOT NULL CHECK (voucher_type IN ('HOTEL', 'TRANSPORTATION', 'FLIGHT', 'RENT_A_CAR', 'ADDITIONAL_SERVICE')),
    itinerary_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    adults INTEGER DEFAULT 0,
    children INTEGER DEFAULT 0,
    total_pax INTEGER GENERATED ALWAYS AS (adults + children) STORED,
    cost DECIMAL(12, 2),
    sale_price DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    confirmed_at TIMESTAMP
);

CREATE INDEX idx_vouchers_voucher_number ON vouchers(voucher_number);
CREATE INDEX idx_vouchers_proposal_id ON vouchers(proposal_id);
CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_vouchers_voucher_type ON vouchers(voucher_type);
```

**Description**: Vouchers generated from confirmed proposals. `itinerary_id` references the corresponding itinerary table based on `voucher_type`.

---

### Table: `voucher_guests`
```sql
CREATE TABLE voucher_guests (
    id SERIAL PRIMARY KEY,
    voucher_id INTEGER NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_voucher_guests_voucher_id ON voucher_guests(voucher_id);
```

**Description**: Guest information for vouchers.

---

## 7. FINANCIAL TRACKING

### Table: `payments`
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('RECEIVED_FROM_CLIENT', 'PAID_TO_SUPPLIER')),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_proposal_id ON payments(proposal_id);
CREATE INDEX idx_payments_payment_type ON payments(payment_type);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
```

**Description**: Payment tracking for proposals (both receivables and payables).

---

### Table: `commissions`
```sql
CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    commission_amount DECIMAL(12, 2) NOT NULL,
    commission_percent DECIMAL(5, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PAID')),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commissions_proposal_id ON commissions(proposal_id);
CREATE INDEX idx_commissions_status ON commissions(status);
```

**Description**: Sales commission tracking for employees.

---

## 8. AUDIT & LOGS

### Table: `activity_logs`
```sql
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

**Description**: Comprehensive audit trail for all system actions.

---

### Table: `email_logs`
```sql
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    voucher_id INTEGER REFERENCES vouchers(id) ON DELETE SET NULL,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    email_type VARCHAR(50) CHECK (email_type IN ('QUOTATION', 'VOUCHER', 'CONFIRMATION', 'NOTIFICATION')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED')),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_voucher_id ON email_logs(voucher_id);
CREATE INDEX idx_email_logs_proposal_id ON email_logs(proposal_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

**Description**: Tracks all emails sent from the system.

---

## 9. SYSTEM CONFIGURATION

### Table: `settings`
```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) CHECK (setting_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(setting_key);
```

**Description**: System-wide configuration settings.

**Example Settings**:
- `company_name`: "ABC Tourism Company"
- `default_currency`: "USD"
- `commission_rate_default`: "5"
- `quotation_validity_days`: "30"
- `email_from_address`: "noreply@toms.com"

---

## 10. CURRENCY & EXCHANGE RATES (Optional)

### Table: `currencies`
```sql
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO currencies (code, name, symbol) VALUES
('USD', 'US Dollar', '$'),
('EUR', 'Euro', '€'),
('TRY', 'Turkish Lira', '₺'),
('GBP', 'British Pound', '£'),
('AED', 'UAE Dirham', 'د.إ');
```

### Table: `exchange_rates`
```sql
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(12, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency, effective_date)
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(effective_date);
```

**Description**: Exchange rates for multi-currency support.

---

## DATABASE VIEWS

### View: `v_proposal_summary`
```sql
CREATE VIEW v_proposal_summary AS
SELECT 
    p.id,
    p.reference_number,
    p.status,
    p.source,
    u.first_name || ' ' || u.last_name AS sales_person_name,
    a.name AS agency_name,
    d.name AS destination_name,
    p.total_cost,
    p.total_sale,
    p.total_sale - p.total_cost AS profit,
    (SELECT COUNT(*) FROM hotel_itinerary WHERE proposal_id = p.id) AS hotel_count,
    (SELECT COUNT(*) FROM transportation_itinerary WHERE proposal_id = p.id) AS transport_count,
    (SELECT COUNT(*) FROM flight_itinerary WHERE proposal_id = p.id) AS flight_count,
    p.created_at,
    p.confirmed_at
FROM proposals p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN agencies a ON p.agency_id = a.id
LEFT JOIN destinations d ON p.destination_id = d.id;
```

### View: `v_voucher_details`
```sql
CREATE VIEW v_voucher_details AS
SELECT 
    v.id,
    v.voucher_number,
    v.voucher_type,
    v.status,
    p.reference_number AS proposal_reference,
    a.name AS agency_name,
    u.first_name || ' ' || u.last_name AS sales_person,
    v.adults,
    v.children,
    v.total_pax,
    (SELECT COUNT(*) FROM voucher_guests WHERE voucher_id = v.id) AS guest_count,
    v.cost,
    v.sale_price,
    v.currency,
    v.created_at
FROM vouchers v
LEFT JOIN proposals p ON v.proposal_id = p.id
LEFT JOIN agencies a ON p.agency_id = a.id
LEFT JOIN users u ON p.user_id = u.id;
```

### View: `v_financial_summary`
```sql
CREATE VIEW v_financial_summary AS
SELECT 
    p.id AS proposal_id,
    p.reference_number,
    p.status,
    p.total_cost,
    p.total_sale,
    p.total_sale - p.total_cost AS gross_profit,
    COALESCE(SUM(CASE WHEN pm.payment_type = 'RECEIVED_FROM_CLIENT' THEN pm.amount ELSE 0 END), 0) AS total_received,
    COALESCE(SUM(CASE WHEN pm.payment_type = 'PAID_TO_SUPPLIER' THEN pm.amount ELSE 0 END), 0) AS total_paid,
    COALESCE(SUM(c.commission_amount), 0) AS total_commission,
    p.created_at,
    p.confirmed_at
FROM proposals p
LEFT JOIN payments pm ON p.id = pm.proposal_id AND pm.status = 'COMPLETED'
LEFT JOIN commissions c ON p.id = c.proposal_id
GROUP BY p.id, p.reference_number, p.status, p.total_cost, p.total_sale, p.created_at, p.confirmed_at;
```

---

## STORED PROCEDURES / FUNCTIONS

### Function: Generate Proposal Reference Number
```sql
CREATE OR REPLACE FUNCTION generate_proposal_reference()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_ref VARCHAR(50);
    year_part VARCHAR(4);
    sequence_part VARCHAR(6);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    SELECT LPAD((COUNT(*) + 1)::TEXT, 4, '0')
    INTO sequence_part
    FROM proposals
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
    
    new_ref := 'TOMS-' || year_part || '-' || sequence_part;
    
    RETURN new_ref;
END;
$$ LANGUAGE plpgsql;
```

### Function: Generate Voucher Number
```sql
CREATE OR REPLACE FUNCTION generate_voucher_number(voucher_type_param VARCHAR)
RETURNS VARCHAR(50) AS $$
DECLARE
    new_voucher VARCHAR(50);
    prefix VARCHAR(5);
    year_part VARCHAR(4);
    sequence_part VARCHAR(6);
BEGIN
    -- Determine prefix based on voucher type
    CASE voucher_type_param
        WHEN 'HOTEL' THEN prefix := 'HT';
        WHEN 'TRANSPORTATION' THEN prefix := 'TR';
        WHEN 'FLIGHT' THEN prefix := 'FL';
        WHEN 'RENT_A_CAR' THEN prefix := 'RC';
        WHEN 'ADDITIONAL_SERVICE' THEN prefix := 'AS';
        ELSE prefix := 'VO';
    END CASE;
    
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    SELECT LPAD((COUNT(*) + 1)::TEXT, 4, '0')
    INTO sequence_part
    FROM vouchers
    WHERE voucher_type = voucher_type_param
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
    
    new_voucher := prefix || '-' || year_part || '-' || sequence_part;
    
    RETURN new_voucher;
END;
$$ LANGUAGE plpgsql;
```

### Trigger: Update Proposal Totals
```sql
CREATE OR REPLACE FUNCTION update_proposal_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE proposals SET
        total_cost = (
            COALESCE((SELECT SUM(total_price) FROM hotel_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(total_price) FROM transportation_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(total_price) FROM flight_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(total_price) FROM rent_a_car_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(total_price) FROM additional_service_itinerary WHERE proposal_id = NEW.proposal_id), 0)
        ),
        total_margin = (
            COALESCE((SELECT SUM(COALESCE(margin_amount, 0)) FROM hotel_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(COALESCE(margin_amount, 0)) FROM transportation_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(COALESCE(margin_amount, 0)) FROM flight_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(COALESCE(margin_amount, 0)) FROM rent_a_car_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(COALESCE(margin_amount, 0)) FROM additional_service_itinerary WHERE proposal_id = NEW.proposal_id), 0)
        ),
        total_sale = (
            COALESCE((SELECT SUM(sale_price) FROM hotel_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(sale_price) FROM transportation_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(sale_price) FROM flight_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(sale_price) FROM rent_a_car_itinerary WHERE proposal_id = NEW.proposal_id), 0) +
            COALESCE((SELECT SUM(sale_price) FROM additional_service_itinerary WHERE proposal_id = NEW.proposal_id), 0)
        ) + commission_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.proposal_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all itinerary tables
CREATE TRIGGER trg_update_totals_hotel
AFTER INSERT OR UPDATE OR DELETE ON hotel_itinerary
FOR EACH ROW EXECUTE FUNCTION update_proposal_totals();

CREATE TRIGGER trg_update_totals_transport
AFTER INSERT OR UPDATE OR DELETE ON transportation_itinerary
FOR EACH ROW EXECUTE FUNCTION update_proposal_totals();

CREATE TRIGGER trg_update_totals_flight
AFTER INSERT OR UPDATE OR DELETE ON flight_itinerary
FOR EACH ROW EXECUTE FUNCTION update_proposal_totals();

CREATE TRIGGER trg_update_totals_car
AFTER INSERT OR UPDATE OR DELETE ON rent_a_car_itinerary
FOR EACH ROW EXECUTE FUNCTION update_proposal_totals();

CREATE TRIGGER trg_update_totals_additional
AFTER INSERT OR UPDATE OR DELETE ON additional_service_itinerary
FOR EACH ROW EXECUTE FUNCTION update_proposal_totals();
```

---

## SAMPLE DATA QUERIES

### Get all proposals with summary
```sql
SELECT * FROM v_proposal_summary
WHERE status = 'NEW'
ORDER BY created_at DESC;
```

### Get proposal with all itinerary details
```sql
SELECT 
    p.*,
    json_agg(DISTINCT jsonb_build_object('type', 'hotel', 'data', h.*)) FILTER (WHERE h.id IS NOT NULL) AS hotels,
    json_agg(DISTINCT jsonb_build_object('type', 'transport', 'data', t.*)) FILTER (WHERE t.id IS NOT NULL) AS transportation,
    json_agg(DISTINCT jsonb_build_object('type', 'flight', 'data', f.*)) FILTER (WHERE f.id IS NOT NULL) AS flights
FROM proposals p
LEFT JOIN hotel_itinerary h ON p.id = h.proposal_id
LEFT JOIN transportation_itinerary t ON p.id = t.proposal_id
LEFT JOIN flight_itinerary f ON p.id = f.proposal_id
WHERE p.id = 1
GROUP BY p.id;
```

### Sales performance by employee
```sql
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name AS employee_name,
    COUNT(DISTINCT p.id) AS total_proposals,
    COUNT(DISTINCT CASE WHEN p.status = 'CONFIRMED' THEN p.id END) AS confirmed_proposals,
    ROUND(COUNT(DISTINCT CASE WHEN p.status = 'CONFIRMED' THEN p.id END)::NUMERIC / NULLIF(COUNT(DISTINCT p.id), 0) * 100, 2) AS conversion_rate,
    COALESCE(SUM(CASE WHEN p.status = 'CONFIRMED' THEN p.total_sale ELSE 0 END), 0) AS total_sales,
    COALESCE(SUM(c.commission_amount), 0) AS total_commission
FROM users u
LEFT JOIN proposals p ON u.id = p.user_id
LEFT JOIN commissions c ON u.id = c.user_id
WHERE u.role = 'SALES_EMPLOYEE'
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_sales DESC;
```

---

## INDEXES SUMMARY

All critical foreign keys have indexes for optimal query performance:
- User relationships
- Location hierarchies (country → region → city)
- Proposal relationships (user, agency, destination)
- All itinerary → proposal relationships
- Voucher relationships
- Date-based queries (created_at, service dates)
- Status fields for filtering
- Email and reference number lookups

---

## DATABASE BACKUP STRATEGY

1. **Daily automated backups** at midnight
2. **Transaction logs** backed up every hour
3. **Weekly full backups** retained for 3 months
4. **Monthly archives** retained for 1 year
5. **Point-in-time recovery** capability

---

## SECURITY CONSIDERATIONS

1. **Row-Level Security (RLS)**: Implement based on user roles
2. **Encrypted columns**: Sensitive financial data
3. **Password hashing**: Use bcrypt or Argon2
4. **Audit trail**: All modifications logged in activity_logs
5. **Database user roles**: Separate read/write permissions
6. **Connection pooling**: Limit concurrent connections
7. **SQL injection prevention**: Use parameterized queries

---

## PERFORMANCE OPTIMIZATION

1. **Partitioning**: Partition proposals and activity_logs by date
2. **Materialized views**: For complex reporting queries
3. **Query optimization**: Regularly analyze and vacuum tables
4. **Connection pooling**: Use pgBouncer or similar
5. **Caching layer**: Redis for frequently accessed data
6. **Read replicas**: For reporting queries

---

## MIGRATION CONSIDERATIONS

1. Use migration tools (e.g., Flyway, Liquibase)
2. Version control all schema changes
3. Test migrations on staging before production
4. Always have rollback scripts
5. Maintain backward compatibility during transitions

