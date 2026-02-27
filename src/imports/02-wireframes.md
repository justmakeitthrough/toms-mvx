# TOMS - Wireframes Description

## 1. LOGIN & DASHBOARD

### 1.1 Login Screen
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [TOMS LOGO]                        │
│    Tourism Operations Management System        │
│                                                 │
│     ┌─────────────────────────────────┐        │
│     │  Email: [____________]           │        │
│     │  Password: [____________]        │        │
│     │                                  │        │
│     │  [  Login  ]    [Forgot Pass?]  │        │
│     └─────────────────────────────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 Main Dashboard
```
┌───────────────────────────────────────────────────────────────┐
│ [LOGO] TOMS                     [User: John] [Settings] [Logout]│
├───────────────────────────────────────────────────────────────┤
│ [Dashboard] [Proposals] [Confirmed] [Master Data] [Reports]   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Welcome, John Doe (Sales Employee)                          │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   48     │  │   23     │  │   15     │  │ $45,230  │    │
│  │ Total    │  │ Pending  │  │Confirmed │  │ Revenue  │    │
│  │Proposals │  │ Review   │  │This Month│  │This Month│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                               │
│  Recent Activity                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Date] Proposal #2024-0125 created - Istanbul 7N   │   │
│  │ [Date] Proposal #2024-0124 confirmed               │   │
│  │ [Date] Proposal #2024-0123 sent to client          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Quick Actions                                                │
│  [+ New Proposal] [View Pending] [Generate Report]          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. PROPOSALS LIST

### 2.1 Proposals Table View
```
┌───────────────────────────────────────────────────────────────┐
│ [LOGO] TOMS                                    [User] [Logout] │
├───────────────────────────────────────────────────────────────┤
│ [Dashboard] [Proposals*] [Confirmed] [Master Data] [Reports]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Proposals Management              [+ New Proposal]           │
│                                                               │
│  Filters:                                                     │
│  Status: [All ▼] Source: [All ▼] Sales: [All ▼]             │
│  Date Range: [From: ___] [To: ___]  [Search: _______]       │
│                                                               │
│  ┌────┬─────────┬──────┬────────┬──────────┬──────┬────────┐│
│  │Ref │  Date   │Source│ Agency │Destination│Total │ Status ││
│  ├────┼─────────┼──────┼────────┼──────────┼──────┼────────┤│
│  │2024│05/02/26 │ B2B  │Istanbul│ Istanbul  │$3,450│  NEW   ││
│  │-125│         │      │Travel  │ & Bursa   │      │[View]  ││
│  ├────┼─────────┼──────┼────────┼──────────┼──────┼────────┤│
│  │2024│05/02/25 │ B2C  │   -    │ Cappadocia│$2,800│CONFIRM ││
│  │-124│         │      │        │  3 Nights │      │[View]  ││
│  ├────┼─────────┼──────┼────────┼──────────┼──────┼────────┤│
│  │2024│05/02/24 │ B2B  │Ankara  │ Istanbul  │$1,950│CANCELLED│
│  │-123│         │      │Tours   │ 4 Nights  │      │[View]  ││
│  └────┴─────────┴──────┴────────┴──────────┴──────┴────────┘│
│                                                               │
│  [< Previous]  Page 1 of 10  [Next >]                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. CREATE/EDIT PROPOSAL

### 3.1 Proposal Header Section
```
┌───────────────────────────────────────────────────────────────┐
│ [LOGO] TOMS                                    [User] [Logout] │
├───────────────────────────────────────────────────────────────┤
│ [Dashboard] [Proposals*] [Confirmed] [Master Data] [Reports]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ← Back to Proposals                                          │
│                                                               │
│  New Proposal                        [Duplicate From: ▼]     │
│                                                               │
│  Basic Information                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Proposal Ref: [TOMS-2024-0126]  (auto-generated)     │   │
│  │                                                       │   │
│  │ Source/Channel: [B2B ▼]                              │   │
│  │ Agency: [Istanbul Travel Agency ▼]    [+ Add New]    │   │
│  │                                                       │   │
│  │ Sales Person: [John Doe ▼]                           │   │
│  │                                                       │   │
│  │ Destination: [Istanbul & Bursa ▼]     [+ Add New]    │   │
│  │                                                       │   │
│  │ Estimated Nights: [7]  (auto-calculated from below)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  [Continue to Itinerary Builder]                             │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. ITINERARY BUILDER

### 4.1 Tabbed Interface
```
┌───────────────────────────────────────────────────────────────┐
│  Proposal: TOMS-2024-0126                    Status: [NEW ▼]  │
│                                                               │
│  ┌──────┬──────────┬────────┬────────┬─────────┬──────────┐ │
│  │Hotels│Transport │Flights │Rent Car│Additional│Summary  │ │
│  │  *   │          │        │        │ Services │         │ │
│  └──────┴──────────┴────────┴────────┴─────────┴──────────┘ │
│                                                               │
│  Input Method: ( • ) Nested Forms  ( ) Table View            │
│                                                               │
│  Hotels & Accommodation                      [+ Add Hotel]   │
│                                                               │
│  Hotel Entry #1                              [Delete]         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ City: [Istanbul ▼]                                    │   │
│  │ Hotel: [Hilton Istanbul ▼]                           │   │
│  │                                                       │   │
│  │ Check-in: [02/26/2026]  Check-out: [02/28/2026]     │   │
│  │ Nights: [2] (auto-calculated)                        │   │
│  │                                                       │   │
│  │ Room Type: [Double ▼]  Board: [BB ▼]                │   │
│  │ Number of Rooms: [3]                                  │   │
│  │                                                       │   │
│  │ Currency: [USD ▼]                                     │   │
│  │ Price per Night: [$150.00]                           │   │
│  │ Total Price: [$900.00] (auto)                        │   │
│  │                                                       │   │
│  │ Price Margin: [15%] or [$_____] (Internal Only)     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Hotel Entry #2                              [Delete]         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ City: [Bursa ▼]                                       │   │
│  │ Hotel: [Bursa Grand Hotel ▼]                         │   │
│  │ ... (same fields as above)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  [Save Draft]  [Continue to Transportation →]                │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 4.2 Table View Alternative
```
┌───────────────────────────────────────────────────────────────┐
│  Hotels & Accommodation                                       │
│  Input Method: ( ) Nested Forms  ( • ) Table View            │
│                                                               │
│  [+ Add Row] [Copy Selected] [Delete Selected]                │
│                                                               │
│  ┌───┬──────┬─────────┬─────┬──────┬───────┬────┬────┬───┐  │
│  │☐│City │Hotel    │In   │Out   │Nights │Type│Qty │...│  │
│  ├───┼──────┼─────────┼─────┼──────┼───────┼────┼────┼───┤  │
│  │☐│Istanbul│Hilton  │02/26│02/28│  2   │DBL │ 3  │[→]│  │
│  ├───┼──────┼─────────┼─────┼──────┼───────┼────┼────┼───┤  │
│  │☐│Bursa │Grand   │02/28│03/01│  3   │DBL │ 3  │[→]│  │
│  ├───┼──────┼─────────┼─────┼──────┼───────┼────┼────┼───┤  │
│  │☐│[___]│[_____]│[___]│[___]│[___]│[__]│[_]│[→]│  │
│  └───┴──────┴─────────┴─────┴──────┴───────┴────┴────┴───┘  │
│                                                               │
│  Expandable detail panel for pricing, margin, etc.            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 4.3 Summary Tab
```
┌───────────────────────────────────────────────────────────────┐
│  Proposal: TOMS-2024-0126                                     │
│                                                               │
│  ┌──────┬──────────┬────────┬────────┬─────────┬──────────┐ │
│  │Hotels│Transport │Flights │Rent Car│Additional│Summary* │ │
│  │      │          │        │        │ Services │         │ │
│  └──────┴──────────┴────────┴────────┴─────────┴──────────┘ │
│                                                               │
│  QUOTATION SUMMARY                                            │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Service Type           │  Net Cost  │  Sale Price    │   │
│  ├────────────────────────┼────────────┼────────────────┤   │
│  │ Hotels (5 nights)      │  $1,500.00 │   $1,725.00    │   │
│  │ Transportation (3 svc) │    $450.00 │     $517.50    │   │
│  │ Flights (2 bookings)   │    $800.00 │     $920.00    │   │
│  │ Rent a Car (2 days)    │    $120.00 │     $138.00    │   │
│  │ Additional Services    │    $100.00 │     $115.00    │   │
│  ├────────────────────────┼────────────┼────────────────┤   │
│  │ TOTAL COST (Net)       │  $2,970.00 │                │   │
│  │ Overall Margin (15%)   │    $445.50 │                │   │
│  │ Commission (5%)        │    $148.50 │                │   │
│  ├────────────────────────┼────────────┼────────────────┤   │
│  │ TOTAL SALE PRICE       │            │   $3,564.00    │   │
│  └────────────────────────┴────────────┴────────────────┘   │
│                                                               │
│  Margin Adjustment:                                           │
│  ○ Use calculated margin (from items): 15%                   │
│  ○ Override with: [_____%] or [$_______]                     │
│                                                               │
│  Commission: [5%]                                             │
│                                                               │
│  [Generate PDF Quote] [Save as Draft] [Send to Client]      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 5. CONFIRMATION SCREEN

### 5.1 Review Before Confirmation
```
┌───────────────────────────────────────────────────────────────┐
│  Confirm Proposal: TOMS-2024-0126                             │
│                                                               │
│  Review and select services to confirm:                       │
│                                                               │
│  Hotels & Accommodation                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ☑ Hilton Istanbul - 02/26-02/28 (2 nights)           │   │
│  │   3x Double Room, BB - $900.00                        │   │
│  │                                                       │   │
│  │ ☑ Bursa Grand Hotel - 02/28-03/01 (3 nights)         │   │
│  │   3x Double Room, HB - $1,350.00                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Transportation Services                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ☑ Airport Transfer - Istanbul - 02/26 - $150.00      │   │
│  │ ☑ Istanbul to Bursa Transfer - 02/28 - $200.00       │   │
│  │ ☐ Optional City Tour - 03/01 - $100.00 (EXCLUDED)    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Flights                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ☑ Ankara → Istanbul - 02/26, 10:00 - $400.00         │   │
│  │ ☑ Istanbul → Ankara - 03/01, 18:00 - $400.00         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Revised Total: $3,400.00                                     │
│                                                               │
│  [Cancel] [Go Back] [Confirm & Generate Vouchers]            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 6. VOUCHERS MANAGEMENT

### 6.1 Vouchers List (After Confirmation)
```
┌───────────────────────────────────────────────────────────────┐
│  Confirmed Proposal: TOMS-2024-0126                           │
│                                                               │
│  Generated Vouchers:                                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Voucher #HT-2024-0245 [Hotel]                         │   │
│  │ Hilton Istanbul - 02/26-02/28                         │   │
│  │ Status: PENDING  │  [View] [Edit] [PDF] [Email]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Voucher #HT-2024-0246 [Hotel]                         │   │
│  │ Bursa Grand Hotel - 02/28-03/01                       │   │
│  │ Status: PENDING  │  [View] [Edit] [PDF] [Email]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Voucher #TR-2024-0088 [Transportation]                │   │
│  │ Airport Transfer - 02/26                              │   │
│  │ Status: PENDING  │  [View] [Edit] [PDF] [Email]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  [Email All Vouchers] [Export All to Excel]                  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Hotel Voucher Detail
```
┌───────────────────────────────────────────────────────────────┐
│  Voucher #HT-2024-0245                    Status: [PENDING ▼] │
│                                                               │
│  ← Back to Vouchers                                           │
│                                                               │
│  Hotel Voucher Details                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Source: B2B - Istanbul Travel Agency                  │   │
│  │ Sales Person: John Doe                                │   │
│  │                                                       │   │
│  │ Hotel: Hilton Istanbul                                │   │
│  │ Check-in: 26/02/2026   Check-out: 28/02/2026        │   │
│  │ Nights: 2                                             │   │
│  │                                                       │   │
│  │ Rooms: 3x Double Room                                 │   │
│  │ Board: Bed & Breakfast (BB)                           │   │
│  │                                                       │   │
│  │ Guests:                                               │   │
│  │ Adults: [6]  Children: [2]  Total PAX: 8            │   │
│  │                                                       │   │
│  │ Guest Names:                        [+ Add Guest]     │   │
│  │ 1. First: [Ahmed]     Last: [Mohammed]               │   │
│  │ 2. First: [Fatima]    Last: [Mohammed]               │   │
│  │ 3. First: [________]  Last: [_________]              │   │
│  │ ...                                                   │   │
│  │                                                       │   │
│  │ Internal Information (Not on Voucher PDF):           │   │
│  │ Cost: $900.00                                         │   │
│  │ Sale Price: $1,035.00                                │   │
│  │                                                       │   │
│  │ Notes:                                                │   │
│  │ [_______________________________________________]     │   │
│  │ [_______________________________________________]     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Language: [English ▼] [Arabic] [Turkish]                    │
│                                                               │
│  [Save] [Generate PDF] [Email to Hotel] [Print]              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. MASTER DATA MANAGEMENT

### 7.1 Agencies Management
```
┌───────────────────────────────────────────────────────────────┐
│ [LOGO] TOMS                                    [User] [Logout] │
├───────────────────────────────────────────────────────────────┤
│ [Dashboard] [Proposals] [Confirmed] [Master Data*] [Reports]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Master Data: [Agencies*] [Destinations] [Hotels] [Suppliers] │
│                                                               │
│  Travel Agencies                   [+ Add Agency] [Import XLS]│
│                                                               │
│  Filters:                                                     │
│  Country: [All ▼] Region: [All ▼]  [Search: _______]         │
│                                                               │
│  ┌────┬──────────────┬─────────┬────────┬──────────┬──────┐ │
│  │ ID │ Agency Name  │ Country │ Region │   City    │Action│ │
│  ├────┼──────────────┼─────────┼────────┼──────────┼──────┤ │
│  │001 │Istanbul Trvl │ Turkey  │Marmara │ Istanbul  │[Edit]│ │
│  ├────┼──────────────┼─────────┼────────┼──────────┼──────┤ │
│  │002 │Ankara Tours  │ Turkey  │Central │  Ankara   │[Edit]│ │
│  ├────┼──────────────┼─────────┼────────┼──────────┼──────┤ │
│  │003 │Dubai Express │   UAE   │ Dubai  │  Dubai    │[Edit]│ │
│  └────┴──────────────┴─────────┴────────┴──────────┴──────┘ │
│                                                               │
│  [< Previous]  Page 1 of 5  [Next >]                         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 7.2 Add/Edit Agency Modal
```
┌───────────────────────────────────────────┐
│  Add Travel Agency                  [X]   │
│                                           │
│  Agency Name: [_____________________]    │
│                                           │
│  Location:                                │
│  Country: [Turkey ▼]                      │
│  Region: [Marmara ▼]                      │
│  City: [Istanbul ▼]                       │
│                                           │
│  Contact Information:                     │
│  Contact Person: [_________________]     │
│  Email: [_________________________]      │
│  Phone: [_________________________]      │
│  Address: [_______________________]      │
│           [_______________________]      │
│                                           │
│  Status: [Active ▼]                       │
│                                           │
│  [Cancel]  [Save Agency]                  │
└───────────────────────────────────────────┘
```

---

## 8. REPORTS & ANALYTICS

### 8.1 Reports Dashboard
```
┌───────────────────────────────────────────────────────────────┐
│ [LOGO] TOMS                                    [User] [Logout] │
├───────────────────────────────────────────────────────────────┤
│ [Dashboard] [Proposals] [Confirmed] [Master Data] [Reports*]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Reports & Analytics                                          │
│                                                               │
│  Date Range: [From: 01/01/2026] [To: 02/26/2026] [Apply]    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Sales Overview                                     │     │
│  │  ┌─────────────────────────────────────────────┐   │     │
│  │  │         [Bar Chart]                         │   │     │
│  │  │  Sales by Month                             │   │     │
│  │  │                                              │   │     │
│  │  │  Jan  Feb  Mar  Apr  May  Jun               │   │     │
│  │  └─────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌──────────────────────────┐ ┌──────────────────────────┐  │
│  │ Sales by Source          │ │ Top Performing Employees │  │
│  │  [Pie Chart]             │ │  1. John Doe - $45K      │  │
│  │  B2B: 60%                │ │  2. Jane Smith - $38K    │  │
│  │  B2C: 30%                │ │  3. Ali Hassan - $32K    │  │
│  │  Other: 10%              │ │                          │  │
│  └──────────────────────────┘ └──────────────────────────┘  │
│                                                               │
│  Quick Reports:                                               │
│  [Sales Summary] [Financial P&L] [Employee Performance]      │
│  [Destination Analysis] [Agency Report] [Custom Report]      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 8.2 Detailed Sales Report
```
┌───────────────────────────────────────────────────────────────┐
│  Sales Report - February 2026               [Export] [Print]  │
│                                                               │
│  Total Sales: $128,450.00                                     │
│  Total Proposals: 48 (23 Confirmed, 15 Pending, 10 Cancelled)│
│  Conversion Rate: 47.9%                                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Employee     │ Proposals │ Confirmed │ Sales  │ Comm  │   │
│  ├──────────────┼───────────┼───────────┼────────┼───────┤   │
│  │ John Doe     │    18     │    12     │$45,230 │$2,261 │   │
│  │ Jane Smith   │    15     │     8     │$38,450 │$1,922 │   │
│  │ Ali Hassan   │    15     │     3     │$32,770 │$1,638 │   │
│  └──────────────┴───────────┴───────────┴────────┴───────┘   │
│                                                               │
│  By Destination:                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Destination     │ Bookings │ Total Sales │ Avg Value │   │
│  ├─────────────────┼──────────┼─────────────┼───────────┤   │
│  │ Istanbul        │    15    │  $52,340    │  $3,489   │   │
│  │ Cappadocia      │     8    │  $38,120    │  $4,765   │   │
│  │ Antalya         │     5    │  $25,990    │  $5,198   │   │
│  └─────────────────┴──────────┴─────────────┴───────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 9. USER MANAGEMENT (Admin Only)

### 9.1 Users List
```
┌───────────────────────────────────────────────────────────────┐
│  User Management                            [+ Add User]       │
│                                                               │
│  ┌────┬────────────┬───────────────────┬──────────────┬────┐│
│  │ ID │   Name     │      Email        │     Role     │ Act ││
│  ├────┼────────────┼───────────────────┼──────────────┼────┤│
│  │001 │ John Doe   │john@toms.com      │Sales Employee│Edit││
│  │002 │ Jane Smith │jane@toms.com      │Reservations  │Edit││
│  │003 │ Ali Hassan │ali@toms.com       │Sales Employee│Edit││
│  │004 │ Admin User │admin@toms.com     │Super Admin   │Edit││
│  └────┴────────────┴───────────────────┴──────────────┴────┘│
│                                                               │
│  Role Permissions Matrix:                                     │
│  ┌──────────────┬────────┬────────┬────────┬──────────┐     │
│  │ Feature      │ Sales  │ Reserv │  Ops   │Accounting│     │
│  ├──────────────┼────────┼────────┼────────┼──────────┤     │
│  │Create Proposal│   ✓    │   ✓    │   ✓    │    -     │     │
│  │Confirm       │   -    │   ✓    │   ✓    │    -     │     │
│  │View Financial│   Own  │   Own  │  All   │   All    │     │
│  │Generate Rep. │   Own  │   -    │  All   │   All    │     │
│  └──────────────┴────────┴────────┴────────┴──────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## NOTES ON WIREFRAME DESIGN

### Design Principles:
1. **Clean & Professional**: Business-oriented interface with clear hierarchy
2. **Form-Heavy**: Emphasis on data entry with validation and help text
3. **Table Views**: Data presented in sortable, filterable tables
4. **Progressive Disclosure**: Complex forms broken into tabs/steps
5. **Dual Input Methods**: Both traditional forms and Excel-like table input
6. **Action-Oriented**: Clear CTAs (Call-to-Actions) for primary workflows
7. **Status Indicators**: Visual status badges throughout
8. **Quick Actions**: Common tasks easily accessible

### Responsive Considerations:
- Desktop-first design (primary use case)
- Tablet support for viewing and simple edits
- Mobile: Read-only view with essential actions

### Color Coding (Suggested):
- **NEW**: Blue
- **CONFIRMED**: Green  
- **CANCELLED**: Red
- **PENDING**: Orange
- Primary Actions: Blue buttons
- Destructive Actions: Red buttons
- Secondary Actions: Gray buttons

### Key Interactions:
- Autocomplete dropdowns with search
- Date pickers for all date fields
- Inline editing where appropriate
- Bulk actions (select multiple, copy, delete)
- Real-time calculation updates
- Toast notifications for confirmations/errors
