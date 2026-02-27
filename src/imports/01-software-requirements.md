# Tourism Operations Management System (TOMS)
## Software Requirements Specification (SRS)

### 1. INTRODUCTION

#### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Tourism Operations Management System (TOMS), a multi-tenant web-based platform designed to manage incoming tourism operations in Turkey.

#### 1.2 Scope
TOMS manages the complete tourism workflow: Request → Quotation → Confirmation → Execution → Reporting, with multi-user role-based access control.

#### 1.3 Definitions and Acronyms
- **B2B**: Business to Business
- **B2C**: Business to Consumer
- **PAX**: Passengers/Guests
- **BB**: Bed & Breakfast
- **HB**: Half Board
- **FB**: Full Board
- **RO**: Room Only
- **CRUD**: Create, Read, Update, Delete

---

### 2. FUNCTIONAL REQUIREMENTS

#### 2.1 User Management & Authentication

**FR-2.1.1: User Roles**
- System SHALL support the following user roles:
  - Sales Employee
  - Reservations Officer
  - Operations Officer
  - Accounting Officer
  - Super Admin

**FR-2.1.2: Role-Based Permissions**
- Each role SHALL have defined permissions for system modules
- Users SHALL only access functions authorized for their role
- Super Admin SHALL have full system access

**FR-2.1.3: User Profile**
- Users SHALL be able to view and update their profile information
- System SHALL track user activity logs

---

#### 2.2 Master Data Management

**FR-2.2.1: Agency Management**
- System SHALL provide CRUD operations for travel agencies
- Agency data SHALL include:
  - Agency Name
  - Country
  - Region/Province/State
  - City
  - Contact Information
  - Agency Type (B2B)
- System SHALL support Excel import for bulk agency data
- Multi-select list with hierarchical location selection (Country → Region → City)

**FR-2.2.2: Destination Management**
- System SHALL provide CRUD operations for destinations
- System SHALL support Excel import for bulk destination data
- Destination data SHALL include:
  - Destination Name
  - City
  - Region
  - Description
  - Status (Active/Inactive)

**FR-2.2.3: Hotel Management**
- System SHALL maintain hotel database with:
  - Hotel Name
  - City
  - Star Rating
  - Address
  - Contact Information
  - Available Room Types
  - Board Types
- System SHALL support CRUD and Excel import

**FR-2.2.4: Service Providers Management**
- System SHALL maintain database for:
  - Transportation providers
  - Car rental companies
  - Additional service providers
- CRUD and Excel import capability

---

#### 2.3 Request/Lead Management (Proposals)

**FR-2.3.1: Create New Request**
- Users with appropriate permissions SHALL create new requests
- System SHALL generate unique Proposal Reference Number
- System SHALL timestamp all requests

**FR-2.3.2: Request Source/Channel**
- System SHALL capture request source via dropdown:
  - Direct Client (B2C)
  - Travel Agency (B2B)
  - Sales Employee
  - Manager
  - Other
- If B2B, system SHALL require Agency selection from master data

**FR-2.3.3: Request Details**
- System SHALL capture:
  - Agency (if B2B) - from master data
  - Sales Person - from user list or free text
  - Proposal Reference - free text, unique
  - Destination - from master data
  - Estimated Nights - optional, auto-calculated from itinerary

**FR-2.3.4: Proposal Duplication**
- System SHALL allow users to duplicate existing proposals
- Duplicated proposals SHALL receive new unique reference numbers
- All itinerary items SHALL be copied to new proposal

**FR-2.3.5: Proposal Status**
- System SHALL track proposal status:
  - NEW (default)
  - CONFIRMED
  - CANCELLED
- Status changes SHALL be logged with timestamp and user

---

#### 2.4 Quotation Builder (Itinerary Builder)

**FR-2.4.1: Form Input Options**
- System SHALL provide TWO input methods:
  1. Nested Forms - individual form for each item
  2. Table-like Forms - Excel-style rows with copy capability

**FR-2.4.2: Hotels & Accommodation**
- One quotation SHALL support multiple hotel entries
- Each hotel entry SHALL capture:
  - City (dropdown from master data)
  - Hotel (dropdown from master data)
  - Check-in Date
  - Check-out Date
  - Room Type (Single/Double/Triple/Quad)
  - Board Type (BB/HB/FB/RO)
  - Number of Nights (auto-calculated from dates)
  - Currency (dropdown: USD, EUR, TRY, etc.)
  - Price per Night
  - Total Price (auto-calculated: nights × price per night)
  - Price Margin (%) or Fixed Amount - internal only
  - Number of Rooms

**FR-2.4.3: Transportation Services**
- One quotation SHALL support multiple transportation entries
- Each transportation entry SHALL capture:
  - City
  - Date
  - Service Description (e.g., "Airport Transfer", "City Tour")
  - Vehicle Type (Bus, Van, Car)
  - Number of Days
  - Currency
  - Price per Day
  - Total Price (auto-calculated)
  - Price Margin (%) or Fixed Amount - internal only

**FR-2.4.4: Additional Services**
- One quotation SHALL support multiple additional service entries
- Each entry SHALL capture:
  - City
  - Date
  - Service Description (e.g., "VIP Transfer", "SIM Card")
  - Number of Days
  - Currency
  - Price per Day
  - Total Price (auto-calculated)
  - Price Margin (%) or Fixed Amount - internal only

**FR-2.4.5: Flight Services**
- One quotation SHALL support multiple flight entries
- Each flight entry SHALL capture:
  - City
  - Date
  - Departure Location
  - Arrival Location
  - Departure Time (HH:MM)
  - Flight Type (Domestic/International)
  - PAX (number of passengers)
  - Currency
  - Price per PAX
  - Total Price (auto-calculated: PAX × price)
  - Price Margin (%) or Fixed Amount - internal only

**FR-2.4.6: Rent a Car Services**
- One quotation SHALL support multiple car rental entries
- Each entry SHALL capture:
  - City
  - Date
  - Car Type
  - Number of Days
  - Currency
  - Price per Day
  - Total Price (auto-calculated)
  - Price Margin (%) or Fixed Amount - internal only

**FR-2.4.7: Total Breakdown (Auto-generated)**
- System SHALL calculate and display:
  - Subtotal by Service Type (Hotels, Transportation, Flights, Additional Services, Rent a Car)
  - Total Cost (Net) - sum of all service costs
  - Total Margin - calculated from individual margins or entered as overall %
  - Commission (%) - optional
  - Total Sales Price = Total Cost + Margin + Commission
- Breakdown SHALL be dynamically updated when itinerary changes

---

#### 2.5 Pricing & Financial Calculations

**FR-2.5.1: Price Management**
- System SHALL store prices in multiple currencies
- System SHALL support manual price adjustments
- Price changes SHALL be logged with user and timestamp

**FR-2.5.2: Margin Calculation**
- System SHALL support two margin types:
  - Percentage-based margin
  - Fixed amount offset
- Margins SHALL be tracked per service item
- System SHALL calculate overall margin from individual margins

**FR-2.5.3: Commission Calculation**
- System SHALL calculate sales employee commission based on configurable rules
- Commission SHALL be based on net profit or total sales

---

#### 2.6 Quotation Output

**FR-2.6.1: PDF Generation**
- System SHALL generate quotation as PDF invoice
- PDF language: Arabic
- PDF SHALL include:
  - Unique quotation reference number
  - Client/Agency information
  - Detailed itinerary with prices
  - Total breakdown
  - Terms and conditions
  - Company branding

**FR-2.6.2: Quotation Status Display**
- System SHALL display current status (NEW/CONFIRMED/CANCELLED)
- Status SHALL be prominently displayed on quotation

---

#### 2.7 Confirmation Workflow

**FR-2.7.1: Proposal Review**
- When status changes to CONFIRMED:
  - Only proposal creator or Super Admin SHALL modify
  - User SHALL review all itinerary items
  - User SHALL select which items to include/exclude

**FR-2.7.2: Voucher Generation**
- System SHALL auto-generate separate vouchers for each service
- Each voucher SHALL receive unique Voucher ID
- Vouchers SHALL be generated for:
  - Each hotel booking
  - Each transportation service
  - Each flight
  - Each car rental
  - Each additional service

**FR-2.7.3: Hotel Voucher Details**
- Hotel vouchers SHALL include:
  - Channel
  - Agency
  - Sales Person
  - Hotel Name
  - Check-in Date
  - Check-out Date
  - Number of Nights
  - Number of Rooms
  - Room Type
  - Board Type
  - Status (initially NEW)
  - Adults count
  - Children count
  - Total PAX
  - Cost (internal only)
  - Total Cost (internal only)
  - Sale Price (internal only)
  - Total Sale (internal only)
  - Notes
  - Guest Names (First Name, Last Name) - multiple guests

**FR-2.7.4: Voucher Output**
- Vouchers SHALL be available in: English, Arabic, Turkish
- Output formats: PDF, Excel, Web View
- System SHALL support direct email sending

**FR-2.7.5: Guest Information**
- Users SHALL input guest names for confirmed bookings
- Multiple guests per voucher with First Name, Last Name

---

#### 2.8 Financial Module

**FR-2.8.1: Invoice Management**
- System SHALL generate invoices for confirmed proposals
- Invoices SHALL track payment status

**FR-2.8.2: Financial Tracking**
- System SHALL track per proposal:
  - Total Costs
  - Total Revenue
  - Gross Profit
  - Net Profit
  - Employee Commissions
- Financial data SHALL be internal only

**FR-2.8.3: Payment Tracking**
- System SHALL track payments received
- System SHALL track payments to suppliers
- Payment status SHALL be visible on vouchers and proposals

---

#### 2.9 Reports & Dashboard

**FR-2.9.1: Sales Reports**
- System SHALL generate reports for:
  - Total sales by period
  - Sales by employee
  - Sales by source (B2C/B2B)
  - Sales by destination
  - Sales by agency

**FR-2.9.2: Performance Reports**
- System SHALL track employee performance metrics:
  - Number of proposals
  - Conversion rate (confirmed/total)
  - Total revenue generated
  - Commission earned

**FR-2.9.3: Financial Reports**
- System SHALL generate:
  - Profit & Loss statements
  - Cost breakdown by service type
  - Revenue trends
  - Outstanding payments

**FR-2.9.4: Dashboard**
- System SHALL provide visual dashboard with:
  - Key performance indicators (KPIs)
  - Charts and graphs
  - Recent activity feed
  - Pending actions/tasks

---

### 3. NON-FUNCTIONAL REQUIREMENTS

#### 3.1 Performance
- **NFR-3.1.1**: System SHALL load pages within 2 seconds under normal load
- **NFR-3.1.2**: System SHALL support at least 100 concurrent users
- **NFR-3.1.3**: PDF generation SHALL complete within 5 seconds

#### 3.2 Security
- **NFR-3.2.1**: System SHALL use secure authentication (password hashing)
- **NFR-3.2.2**: System SHALL implement role-based access control
- **NFR-3.2.3**: System SHALL log all data modifications with user and timestamp
- **NFR-3.2.4**: Sensitive financial data SHALL be visible only to authorized roles

#### 3.3 Usability
- **NFR-3.3.1**: System SHALL have intuitive, user-friendly interface
- **NFR-3.3.2**: System SHALL support multiple languages (English, Arabic, Turkish)
- **NFR-3.3.3**: Forms SHALL provide inline validation and error messages
- **NFR-3.3.4**: System SHALL be responsive (desktop, tablet)

#### 3.4 Reliability
- **NFR-3.4.1**: System SHALL have 99% uptime
- **NFR-3.4.2**: System SHALL implement automatic data backup
- **NFR-3.4.3**: System SHALL handle errors gracefully with user-friendly messages

#### 3.5 Scalability
- **NFR-3.5.1**: Database SHALL support growth to 100,000+ proposals
- **NFR-3.5.2**: System architecture SHALL support horizontal scaling

#### 3.6 Data Integrity
- **NFR-3.6.1**: System SHALL maintain referential integrity
- **NFR-3.6.2**: Financial calculations SHALL be accurate to 2 decimal places
- **NFR-3.6.3**: System SHALL prevent data loss during operations

#### 3.7 Browser Compatibility
- **NFR-3.7.1**: System SHALL work on modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-3.7.2**: System SHALL support browsers from last 2 years

---

### 4. USER STORIES

#### 4.1 Sales Employee
- As a Sales Employee, I want to create new proposals quickly so I can respond to customer inquiries faster
- As a Sales Employee, I want to duplicate existing proposals so I can reuse common itineraries
- As a Sales Employee, I want to see my commission calculations so I can track my earnings

#### 4.2 Reservations Officer
- As a Reservations Officer, I want to confirm proposals and generate vouchers so I can communicate bookings to suppliers
- As a Reservations Officer, I want to add guest names to vouchers so suppliers have complete information
- As a Reservations Officer, I want to email vouchers directly from the system to save time

#### 4.3 Operations Officer
- As an Operations Officer, I want to track the status of all confirmed bookings so I can manage operations effectively
- As an Operations Officer, I want to add notes to vouchers so I can communicate special requirements

#### 4.4 Accounting Officer
- As an Accounting Officer, I want to see financial reports so I can track profitability
- As an Accounting Officer, I want to track payments and outstanding amounts so I can manage cash flow
- As an Accounting Officer, I want to calculate employee commissions accurately

#### 4.5 Super Admin
- As a Super Admin, I want to manage user accounts and permissions so I can control system access
- As a Super Admin, I want to maintain master data (agencies, hotels, destinations) so the system has accurate reference data
- As a Super Admin, I want to view all proposals regardless of creator so I can oversee operations

---

### 5. CONSTRAINTS AND ASSUMPTIONS

#### 5.1 Constraints
- System must be web-based (no mobile app required initially)
- Initial deployment for Turkey tourism market
- PDF generation in specific languages (Arabic for quotations, English/Arabic/Turkish for vouchers)

#### 5.2 Assumptions
- Users have stable internet connection
- Users have modern web browsers
- Basic computer literacy among users
- Email system integration available
- Currency exchange rates will be manually updated or fetched from external API

---

### 6. ACCEPTANCE CRITERIA

#### 6.1 Proposal Management
- [ ] User can create new proposal with all required fields
- [ ] User can duplicate existing proposal
- [ ] System generates unique proposal reference
- [ ] Proposal can be edited before confirmation
- [ ] Proposal status can be changed to Confirmed or Cancelled

#### 6.2 Quotation Builder
- [ ] User can add multiple hotels to one proposal
- [ ] User can add multiple services of each type
- [ ] Prices are automatically calculated
- [ ] Total breakdown shows correct calculations
- [ ] Margin and commission are correctly applied

#### 6.3 Voucher Generation
- [ ] Confirmed proposal generates separate vouchers for each service
- [ ] Vouchers contain all required information
- [ ] Vouchers can be exported to PDF
- [ ] Vouchers can be emailed from system

#### 6.4 Reports
- [ ] Sales reports show accurate data
- [ ] Financial reports calculate profit correctly
- [ ] Dashboard displays real-time statistics

