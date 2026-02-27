Tourism Operations Management System (TOMS) 
1.	System Overview
Web-based software system (multi-tenant and admin-like but beautiful forms)
Designed to manage an incoming tourism company operating in Turkey
Full management of the process from request → quotation → confirmation → execution → reporting
Multi-user system with different roles and permission levels
2.	User Roles & Permissions
Sales Employee
Reservations Officer
Operations Officer
Accounting Officer
For each user:
Defined permissions
Ability to link and track requests
3.	Request / Lead Management (PROPOSALS, remember that proposals can be reused (duplicated from another proposal). Make two options of the CRUD capability, using nested-forms or nested table-like forms (with copiable rows like excel))
Create a new request: 
Specify request source or channel (Dropdown):
Direct Client (B2C)
Travel Agency (B2B)
Sales Employee
Manager
Other
Specify Agency (ex: Istanbul & Sapanca. we will need to have an agency separate section by which will the source of the agencies data, CRUD and able to do excel import, multi select list with (+) and combining the options from choosing the dropdown of Country -> Region/Province/State -> City, by each has their own section and databases. )
Specify Sales (From lists of sales users or free text)
Specify Proposal Ref (Free text)
Specify Destination (We will need to have an separate section by which will the source of Destinations Data, CRUD and able to do excel import)
Specify Nights (Free text, optional but will be overrided b the nights accumulated from the quotation builder)
4. Quotation Builder (or Itinerary Builder, let’s say that it’s polymorphic, maybe?)
4.1 Hotels & Accommodation  (1 quotation can have many hotels and accommodation)
Select city
Select hotel
Check-in / Check-out dates
Room type (Single / Double / Triple / Quad)
Board type (BB / HB / FB / RO)
Nights
Currency
Price per Night
Total Price
Price Margin (Internal use and optional, percentage or offset, etc.)
4.2 Transportation (1 quotation can have multiple transporation service, Parts of Itinerary)
Define:
City
Date
Service (EX: FLORYA TOUR, AIRPORT TRANSFER, SAPANCA TOUR + TRANSFER TO BUNGALOW, 212 MALL TOUR, etc.)
Vehicle type (BUS, etc.)
Number of days
Price
Total Price
Currency
Price Margin (Internal use and optional, percentage or offset, etc.)
4.3 Additional Services (1 quotation can have multiple additional service, Parts of Itinerary)
City
Date
Service (ex: VIP TRANSFER, SIM CARD, etc.)
Number of days
Price
Total Price
Price Margin (Internal use and optional, percentage or offset, etc.)
Currency
4.4 Flights (1 quotation can have multiple flight service, Parts of Itinerary)
City
Date
Departure (ANKARA)
Arrival (ISTANBUL)
Hour (00:00)
Type (ex: Domestic, International)
PAX
Price
Price Margin (Internal use and optional, percentage or offset, etc.)
Total Price
Currency
4.5 RENT A CAR (1 quotation can have multiple RENT A CAR, Parts of Itinerary)
City
Date
Car Type
Number of days
Price
Price Margin (Internal use and optional, percentage or offset, etc.)
Total Price
Currency
4.6 TOTAL BREAKDOWN (AUTO-generated)
total price breakdown from the itineraries and hotels prices mentioned above (price, itinerary type (HOTELS, TRANSPORTATION, RENT A CAR, ADDITIONAL SERVICES, etc.),  TOTAL COST (NET TOTAL COST FROM ABOVE), MARGIN OR NET AMOUNT(needs to be filled by percenteage or auto-filled and calculated from all of the price margin listed above) to alter the total sales price later, Commission (optional), TOTAL SALES PRICE (based on total cost + %margin + %commission))
5. Pricing & Commissions
Prices stored in the system
Manual price adjustment capability
Calculation of:
Total quotation amount
Sales employee commission
6. Quotation Output
Quotation generated as PDF invoice
Language: Arabic
Unique quotation reference number
Status: NEW (Possible status: new, confirmed, cancelled)
7. Confirmation Workflow (CONFIRMED PROPOSALS,
When the status is about to be changed to Confirmed:
User (only the one who created the proposal or super admin) can review the proposals, can modify which itinerary that are going to be cancelled or added from the initial proposal)
Each service is converted into a separate voucher (AUTO-Generated Voucher ID, 
Separate voucher for each hotel and transportation service (based on the itinerary that we previously mentioned)
Voucher Details:
Based on itinerary type, but the main one should be by the hotel itinerary. data from proposals like: channel, agency, sales, hotel, check-in, check-out, nights, number of room, room, room-type, board, status (still new at the moment), adults, children, total pax, cost, total cost, sale price (only internal usage), total sale (only internal usage), note, names (to be filled by the acting user, and can be multiple guests and using first name, last name, etc.))
Language: English, Arabic, Turkish
Output format: new section, PDF, excel 
Direct email sending from the system once confirmed
8. Financial Module
Invoices
Tracking of:
Costs
Revenues
Profit
Employee commissions
9. Reports & Dashboard
Sales reports
Performance per employee
Source-based sales (B2C / B2B)
Financial reports
Statistics dashboard

