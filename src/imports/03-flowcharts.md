# TOMS - System Flowcharts

## 1. OVERALL SYSTEM WORKFLOW

```mermaid
graph TD
    A[User Login] --> B{Role?}
    B -->|Sales| C[Sales Dashboard]
    B -->|Reservations| D[Reservations Dashboard]
    B -->|Operations| E[Operations Dashboard]
    B -->|Accounting| F[Accounting Dashboard]
    B -->|Admin| G[Admin Dashboard]
    
    C --> H[Create/Manage Proposals]
    D --> H
    E --> H
    
    H --> I[Generate Quotation PDF]
    I --> J{Client Decision}
    
    J -->|Approved| K[Confirm Proposal]
    J -->|Rejected| L[Cancel/Archive]
    J -->|Revise| H
    
    K --> M[Generate Vouchers]
    M --> N[Send to Suppliers]
    N --> O[Track Execution]
    
    O --> P[Financial Processing]
    P --> Q[Generate Reports]
    
    Q --> R[Dashboard Analytics]
```

---

## 2. PROPOSAL CREATION WORKFLOW

```mermaid
graph TD
    Start[Start New Proposal] --> A{Duplicate from existing?}
    
    A -->|Yes| B[Select Existing Proposal]
    A -->|No| C[Enter Basic Info]
    B --> C
    
    C --> D[Select Source/Channel]
    D --> E{Source Type?}
    
    E -->|B2B| F[Select Agency]
    E -->|B2C/Other| G[Skip Agency]
    
    F --> H[Select Sales Person]
    G --> H
    
    H --> I[Select Destination]
    I --> J[Enter Estimated Nights]
    
    J --> K[Save Basic Info]
    K --> L[Open Itinerary Builder]
    
    L --> M{Add Services}
    M --> N[Add Hotels]
    M --> O[Add Transportation]
    M --> P[Add Flights]
    M --> Q[Add Rent a Car]
    M --> R[Add Additional Services]
    
    N --> S[Calculate Totals]
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S --> T[Review Summary]
    T --> U{Action?}
    
    U -->|Save Draft| V[Save as NEW]
    U -->|Generate Quote| W[Generate PDF]
    U -->|Modify| M
    
    W --> X[Send to Client]
    X --> End[End]
    V --> End
```

---

## 3. QUOTATION BUILDER DETAILED FLOW

```mermaid
graph TD
    A[Quotation Builder] --> B{Select Input Method}
    
    B -->|Nested Forms| C[Form-based Entry]
    B -->|Table View| D[Excel-like Entry]
    
    C --> E[Add Service Item]
    D --> E
    
    E --> F{Service Type?}
    
    F -->|Hotel| G[Hotel Form]
    F -->|Transport| H[Transport Form]
    F -->|Flight| I[Flight Form]
    F -->|Car Rental| J[Car Rental Form]
    F -->|Additional| K[Additional Service Form]
    
    G --> L[Enter Details]
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[Auto-calculate: Total Price]
    M --> N[Enter Price Margin %]
    N --> O[Calculate Sale Price]
    
    O --> P{Add More Services?}
    P -->|Yes| E
    P -->|No| Q[Navigate to Summary Tab]
    
    Q --> R[Calculate Total Cost]
    R --> S[Calculate Total Margin]
    S --> T[Apply Commission %]
    T --> U[Display Total Sale Price]
    
    U --> V{Action?}
    V -->|Edit Service| E
    V -->|Delete Service| W[Remove Item] --> Q
    V -->|Continue| X[Complete]
```

---

## 4. CONFIRMATION & VOUCHER GENERATION WORKFLOW

```mermaid
graph TD
    A[Proposal Status: NEW] --> B{User Action}
    
    B -->|Change to CONFIRMED| C{Authorization?}
    B -->|Keep as NEW| Z[Continue Editing]
    B -->|CANCEL| Y[Mark as CANCELLED]
    
    C -->|Creator/Admin| D[Open Confirmation Review]
    C -->|Other User| E[Access Denied]
    
    D --> F[Display All Services]
    F --> G[User Reviews Services]
    
    G --> H{Select Services}
    H --> I[Check/Uncheck Services]
    I --> J[Update Total]
    
    J --> K{Confirm?}
    K -->|Yes| L[Change Status to CONFIRMED]
    K -->|No| M[Go Back]
    
    L --> N[Process Confirmed Services]
    
    N --> O{For Each Service}
    O -->|Hotel| P[Generate Hotel Voucher]
    O -->|Transport| Q[Generate Transport Voucher]
    O -->|Flight| R[Generate Flight Voucher]
    O -->|Car Rental| S[Generate Car Rental Voucher]
    O -->|Additional| T[Generate Service Voucher]
    
    P --> U[Assign Voucher ID]
    Q --> U
    R --> U
    S --> U
    T --> U
    
    U --> V[Set Voucher Status: NEW]
    V --> W[Store Voucher Data]
    
    W --> X{All Services Processed?}
    X -->|No| O
    X -->|Yes| AA[Display Vouchers List]
    
    AA --> AB{User Action}
    AB -->|Edit Voucher| AC[Open Voucher Editor]
    AB -->|Add Guest Names| AD[Guest Information Form]
    AB -->|Generate PDF| AE[Create PDF Document]
    AB -->|Email| AF[Send Email]
    
    AC --> AG[Update Voucher]
    AD --> AG
    
    AG --> AA
    AE --> AA
    AF --> AA
```

---

## 5. VOUCHER MANAGEMENT WORKFLOW

```mermaid
graph TD
    A[Voucher Created] --> B[Status: NEW]
    
    B --> C{User Action}
    
    C -->|Edit Details| D[Open Voucher Form]
    C -->|Add Guests| E[Guest Names Entry]
    C -->|Add Notes| F[Notes Field]
    
    D --> G[Update Voucher Info]
    E --> G
    F --> G
    
    G --> H{Save Changes}
    H -->|Save| I[Update Database]
    H -->|Cancel| B
    
    I --> J{Generate Output?}
    
    J -->|PDF| K[Select Language]
    K --> L{Language?}
    L -->|English| M[Generate EN PDF]
    L -->|Arabic| N[Generate AR PDF]
    L -->|Turkish| O[Generate TR PDF]
    
    M --> P[Download/View PDF]
    N --> P
    O --> P
    
    J -->|Excel| Q[Generate Excel Report]
    Q --> P
    
    J -->|Email| R[Open Email Dialog]
    R --> S[Enter Recipient]
    S --> T[Select Template]
    T --> U[Attach Voucher PDF]
    U --> V[Send Email]
    
    V --> W{Email Sent?}
    W -->|Yes| X[Log Email Sent]
    W -->|No| Y[Show Error]
    
    X --> Z[Update Voucher Status]
    Y --> R
    
    Z --> AA{Status Change?}
    AA -->|SENT| AB[Status: SENT]
    AA -->|CONFIRMED| AC[Status: CONFIRMED]
    AA -->|COMPLETED| AD[Status: COMPLETED]
    
    AB --> AE[End]
    AC --> AE
    AD --> AE
```

---

## 6. PRICING CALCULATION FLOW

```mermaid
graph TD
    A[Service Item Created] --> B[Enter Base Price]
    B --> C[Enter Quantity/Nights/Days]
    
    C --> D[Calculate: Item Total]
    D --> E[Item Total = Base Price × Quantity]
    
    E --> F{Margin Input Method?}
    F -->|Percentage| G[Enter Margin %]
    F -->|Fixed Amount| H[Enter Fixed Margin $]
    
    G --> I[Calculate: Sale Price with %]
    I --> J[Sale Price = Item Total × 1 + Margin%]
    
    H --> K[Calculate: Sale Price with Fixed]
    K --> L[Sale Price = Item Total + Fixed Margin]
    
    J --> M[Store Item Sale Price]
    L --> M
    
    M --> N{All Items Entered?}
    N -->|No| A
    N -->|Yes| O[Aggregate All Items]
    
    O --> P[Calculate: Total Cost]
    P --> Q[Sum all Item Totals]
    
    Q --> R[Calculate: Total Margin]
    R --> S{Margin Method?}
    S -->|Individual| T[Sum Individual Margins]
    S -->|Override| U[Apply Override Margin %]
    
    T --> V[Total Margin = Sum]
    U --> W[Total Margin = Total Cost × Override %]
    
    V --> X[Calculate: Subtotal]
    W --> X
    
    X --> Y[Subtotal = Total Cost + Total Margin]
    
    Y --> Z[Apply Commission %]
    Z --> AA[Commission = Subtotal × Commission %]
    
    AA --> AB[Calculate: Final Total]
    AB --> AC[Final Total = Subtotal + Commission]
    
    AC --> AD[Display Breakdown]
    AD --> AE[End]
```

---

## 7. USER AUTHENTICATION & AUTHORIZATION FLOW

```mermaid
graph TD
    A[User Access System] --> B[Login Page]
    
    B --> C[Enter Credentials]
    C --> D{Validate Credentials}
    
    D -->|Invalid| E[Show Error]
    E --> B
    
    D -->|Valid| F[Check User Status]
    F --> G{User Active?}
    
    G -->|No| H[Access Denied]
    G -->|Yes| I[Retrieve User Role]
    
    I --> J[Load Role Permissions]
    J --> K[Create User Session]
    
    K --> L{User Role?}
    L -->|Sales| M[Load Sales Dashboard]
    L -->|Reservations| N[Load Reservations Dashboard]
    L -->|Operations| O[Load Operations Dashboard]
    L -->|Accounting| P[Load Accounting Dashboard]
    L -->|Admin| Q[Load Admin Dashboard]
    
    M --> R[Display Authorized Menus]
    N --> R
    O --> R
    P --> R
    Q --> R
    
    R --> S{User Action}
    
    S --> T{Check Permission}
    T -->|Authorized| U[Execute Action]
    T -->|Not Authorized| V[Access Denied Message]
    
    U --> W{Continue?}
    V --> W
    
    W -->|Yes| S
    W -->|Logout| X[End Session]
```

---

## 8. MASTER DATA MANAGEMENT FLOW

```mermaid
graph TD
    A[Master Data Module] --> B{Select Data Type}
    
    B -->|Agencies| C[Agencies Management]
    B -->|Destinations| D[Destinations Management]
    B -->|Hotels| E[Hotels Management]
    B -->|Suppliers| F[Suppliers Management]
    
    C --> G{Action?}
    D --> G
    E --> G
    F --> G
    
    G -->|View List| H[Display Data Table]
    G -->|Add New| I[Open Create Form]
    G -->|Import Excel| J[Upload Excel File]
    
    H --> K{User Action on Row}
    K -->|Edit| L[Open Edit Form]
    K -->|Delete| M{Confirm Delete?}
    K -->|View Details| N[Show Detail View]
    
    M -->|Yes| O{Check Dependencies}
    M -->|No| H
    
    O -->|Has Dependencies| P[Cannot Delete - Show Warning]
    O -->|No Dependencies| Q[Delete Record]
    
    Q --> H
    P --> H
    
    I --> R[Enter Data]
    L --> R
    
    R --> S{Validate Data}
    S -->|Invalid| T[Show Validation Errors]
    T --> R
    
    S -->|Valid| U[Save to Database]
    U --> V{Success?}
    
    V -->|Yes| W[Show Success Message]
    V -->|No| X[Show Error Message]
    
    W --> H
    X --> R
    
    J --> Y[Validate File Format]
    Y --> Z{Valid Excel?}
    
    Z -->|No| AA[Show Format Error]
    Z -->|Yes| AB[Parse Excel Data]
    
    AB --> AC[Validate Each Row]
    AC --> AD{All Rows Valid?}
    
    AD -->|No| AE[Show Validation Report]
    AD -->|Yes| AF[Import All Records]
    
    AE --> AG{User Action}
    AG -->|Fix & Retry| J
    AG -->|Import Valid Only| AF
    
    AF --> AH[Show Import Summary]
    AH --> H
```

---

## 9. REPORTING & ANALYTICS FLOW

```mermaid
graph TD
    A[Reports Module] --> B[Select Report Type]
    
    B --> C{Report Type?}
    
    C -->|Sales Report| D[Sales Parameters]
    C -->|Performance| E[Performance Parameters]
    C -->|Financial| F[Financial Parameters]
    C -->|Custom| G[Custom Parameters]
    
    D --> H[Set Date Range]
    E --> H
    F --> H
    G --> H
    
    H --> I{Additional Filters?}
    
    I -->|Yes| J[Apply Filters]
    J --> K[Filter by Employee]
    J --> L[Filter by Source]
    J --> M[Filter by Destination]
    J --> N[Filter by Status]
    
    K --> O[Build Query]
    L --> O
    M --> O
    N --> O
    
    I -->|No| O
    
    O --> P[Execute Database Query]
    P --> Q[Retrieve Data]
    
    Q --> R[Process Data]
    R --> S[Calculate Metrics]
    S --> T[Calculate Aggregations]
    T --> U[Calculate Trends]
    
    U --> V{Display Format?}
    
    V -->|Dashboard View| W[Generate Charts]
    V -->|Table View| X[Generate Data Table]
    V -->|Export| Y{Export Format?}
    
    W --> Z[Display Visual Report]
    X --> Z
    
    Y -->|PDF| AA[Generate PDF Report]
    Y -->|Excel| AB[Generate Excel Report]
    Y -->|CSV| AC[Generate CSV File]
    
    AA --> AD[Download File]
    AB --> AD
    AC --> AD
    
    Z --> AE{User Action}
    AE -->|Drill Down| AF[Filter to Detail Level]
    AE -->|Change Params| B
    AE -->|Export| Y
    AE -->|Close| AG[End]
    
    AF --> P
    AD --> AG
```

---

## 10. EMAIL NOTIFICATION FLOW

```mermaid
graph TD
    A[Trigger Event] --> B{Event Type?}
    
    B -->|Quote Generated| C[Prepare Quote Email]
    B -->|Proposal Confirmed| D[Prepare Confirmation Email]
    B -->|Voucher Ready| E[Prepare Voucher Email]
    B -->|Status Changed| F[Prepare Status Update Email]
    
    C --> G[Load Email Template]
    D --> G
    E --> G
    F --> G
    
    G --> H[Populate Template Variables]
    H --> I[Get Recipient Email]
    
    I --> J{Recipient Source?}
    J -->|Client| K[Get Client Email from Proposal]
    J -->|Supplier| L[Get Supplier Email from Master Data]
    J -->|Internal| M[Get User Email from User Table]
    
    K --> N[Validate Email Address]
    L --> N
    M --> N
    
    N --> O{Valid Email?}
    O -->|No| P[Log Error]
    O -->|Yes| Q[Attach Documents]
    
    Q --> R{Documents?}
    R -->|PDF| S[Attach PDF File]
    R -->|Excel| T[Attach Excel File]
    R -->|None| U[No Attachments]
    
    S --> V[Compose Email]
    T --> V
    U --> V
    
    V --> W[Send via Email Service]
    W --> X{Send Success?}
    
    X -->|Yes| Y[Log Email Sent]
    X -->|No| Z[Log Email Failed]
    
    Y --> AA[Update Record Status]
    Z --> AB[Queue for Retry]
    
    AA --> AC[Notify User: Success]
    AB --> AD[Notify User: Failed]
    
    AC --> AE[End]
    AD --> AE
    P --> AE
```

---

## KEY DECISION POINTS IN SYSTEM

### 1. **Proposal Creation**
- Duplicate existing vs Create new
- B2B (requires agency) vs B2C/Other
- Input method: Nested forms vs Table view

### 2. **Pricing Strategy**
- Individual item margins vs Overall margin override
- Percentage-based vs Fixed amount margins
- Commission application (optional)

### 3. **Confirmation Process**
- Only creator/admin can confirm
- Selective service inclusion (not all services must be confirmed)
- Automatic voucher generation upon confirmation

### 4. **Voucher Language**
- Multi-language support (EN/AR/TR)
- Language selection per voucher
- Language affects PDF template

### 5. **User Permissions**
- Role-based access control
- Own data vs All data access
- Read-only vs Edit permissions

### 6. **Data Management**
- Manual entry vs Excel import
- Hierarchical location selection
- Dependency checks before deletion

### 7. **Reporting Scope**
- Time period selection
- Filter granularity
- Export format preference

---

## NOTES

These flowcharts represent the core business logic and decision points in the TOMS system. Each workflow:

1. **Shows clear entry and exit points**
2. **Includes decision diamonds for branching logic**
3. **Demonstrates data validation steps**
4. **Indicates error handling paths**
5. **Shows integration points between modules**

The flowcharts can be implemented using:
- **Mermaid.js** for live rendering in documentation
- **Lucidchart** or **Draw.io** for detailed design
- **BPMN notation** for business process mapping
