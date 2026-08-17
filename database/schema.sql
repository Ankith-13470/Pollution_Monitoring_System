USE pollution_monitoring;

-- Create Location table
CREATE TABLE IF NOT EXISTS Location (
  LocID INT AUTO_INCREMENT PRIMARY KEY,
  LocationName VARCHAR(255) NOT NULL,
  Latitude DECIMAL(10, 8) NOT NULL,
  Longitude DECIMAL(11, 8) NOT NULL,
  City VARCHAR(100) NOT NULL,
  Area VARCHAR(100) NOT NULL
);

-- Create Source table
CREATE TABLE IF NOT EXISTS Source (
  SourceID INT AUTO_INCREMENT PRIMARY KEY,
  SourceName VARCHAR(255) NOT NULL,
  SourceType VARCHAR(100) NOT NULL,
  Description TEXT,
  LocID INT NOT NULL,
  FOREIGN KEY (LocID) REFERENCES Location(LocID)
);

-- Create Pollutant table
CREATE TABLE IF NOT EXISTS Pollutant (
  PollutantID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL UNIQUE,
  SafeLimit DECIMAL(10, 2) NOT NULL,
  Description TEXT
);

-- Create Authority table
CREATE TABLE IF NOT EXISTS Authority (
  AuthID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Dept VARCHAR(100) NOT NULL,
  Contact VARCHAR(255),
  Email VARCHAR(255)
);

-- Create Measurement table
CREATE TABLE IF NOT EXISTS Measurement (
  MeasID INT AUTO_INCREMENT PRIMARY KEY,
  Value DECIMAL(10, 2) NOT NULL,
  Type VARCHAR(100) NOT NULL,
  DateTime DATETIME NOT NULL,
  LocID INT NOT NULL,
  PollutantID INT NOT NULL,
  SourceID INT NOT NULL,
  FOREIGN KEY (LocID) REFERENCES Location(LocID),
  FOREIGN KEY (PollutantID) REFERENCES Pollutant(PollutantID),
  FOREIGN KEY (SourceID) REFERENCES Source(SourceID)
);

-- Create Actions table
CREATE TABLE IF NOT EXISTS Actions (
  ActionID INT AUTO_INCREMENT PRIMARY KEY,
  Type VARCHAR(100) NOT NULL,
  Description TEXT,
  ActionDate DATE NOT NULL,
  AuthID INT NOT NULL,
  MeasID INT NOT NULL,
  FOREIGN KEY (AuthID) REFERENCES Authority(AuthID),
  FOREIGN KEY (MeasID) REFERENCES Measurement(MeasID)
);

-- Create SimpleUsers table
CREATE TABLE IF NOT EXISTS SimpleUsers (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Indian Locations
INSERT IGNORE INTO Location (LocationName, Latitude, Longitude, City, Area) VALUES
('Anand Vihar', 28.6504, 77.3022, 'Delhi', 'East Delhi'),
('RK Puram', 28.5621, 77.1766, 'Delhi', 'South West Delhi'),
('Bandra Kurla Complex', 19.0633, 72.8443, 'Mumbai', 'Western Suburbs'),
('Powai Lake Area', 19.1176, 72.9060, 'Mumbai', 'North East Mumbai'),
('Whitefield', 12.9698, 77.7500, 'Bengaluru', 'East Bengaluru'),
('Electronic City', 12.8456, 77.6603, 'Bengaluru', 'South Bengaluru'),
('Alipore', 22.5306, 88.3347, 'Kolkata', 'South Kolkata'),
('Salt Lake City', 22.5833, 88.4167, 'Kolkata', 'East Kolkata'),
('Maninagar', 22.9931, 72.6150, 'Ahmedabad', 'East Ahmedabad'),
('Navrangpura', 23.0430, 72.5670, 'Ahmedabad', 'Central Ahmedabad'),
('Adyar', 13.0067, 80.2206, 'Chennai', 'South Chennai'),
('Anna Nagar', 13.0850, 80.2101, 'Chennai', 'North West Chennai'),
('Hitec City', 17.4401, 78.3489, 'Hyderabad', 'West Hyderabad'),
('Charminar', 17.3616, 78.4747, 'Hyderabad', 'Old City'),
('Gomti Nagar', 26.8467, 80.9462, 'Lucknow', 'Central Lucknow'),
('Hazratganj', 26.8500, 80.9500, 'Lucknow', 'Central Lucknow');

-- Disable foreign key checks for data insertion
SET FOREIGN_KEY_CHECKS = 0;

-- Insert Indian Pollution Sources
INSERT INTO Source (SourceName, SourceType, Description, LocID) VALUES
('Delhi Vehicle Emissions', 'Transportation', 'Heavy traffic and vehicle emissions in Delhi', 1),
('Badarpur Thermal Plant', 'Industrial', 'Coal-based thermal power plant', 2),
('Mumbai Coastal Road Construction', 'Construction', 'Major infrastructure construction project', 3),
('Powai Industrial Area', 'Industrial', 'Industrial zone with manufacturing units', 4),
('IT Corridor Traffic', 'Transportation', 'Heavy IT corridor vehicle traffic', 5),
('Electronic City Industries', 'Industrial', 'Electronics manufacturing industries', 6),
('Kolkata Industrial Belt', 'Industrial', 'Traditional industrial area', 7),
('Salt Lake IT Sector', 'Commercial', 'IT companies and commercial establishments', 8),
('Naroda GIDC', 'Industrial', 'Gujarat Industrial Development Corporation area', 9),
('Ahmedabad BRTS Corridor', 'Transportation', 'Bus Rapid Transit System traffic', 10),
('Chennai Port Area', 'Industrial', 'Port and shipping activities', 11),
('Anna Nagar Commercial Zone', 'Commercial', 'Commercial and residential mix', 12),
('IT Companies Cluster', 'Commercial', 'IT park and company offices', 13),
('Old City Traffic', 'Transportation', 'Dense traffic in old city areas', 14),
('Lucknow Metro Construction', 'Construction', 'Metro rail construction project', 15),
('Hazratganj Commercial Area', 'Commercial', 'Major commercial and shopping area', 16);

-- Insert Pollutants with Indian safe limits (as per CPCB)
INSERT IGNORE INTO Pollutant (Name, SafeLimit, Description) VALUES
('PM2.5', 60.0, 'Fine particulate matter - 24hr safe limit'),
('PM10', 100.0, 'Coarse particulate matter - 24hr safe limit'),
('NO2', 80.0, 'Nitrogen Dioxide - 24hr safe limit'),
('SO2', 80.0, 'Sulfur Dioxide - 24hr safe limit'),
('CO', 2.0, 'Carbon Monoxide - 8hr safe limit'),
('O3', 100.0, 'Ozone - 8hr safe limit'),
('NH3', 400.0, 'Ammonia - 24hr safe limit'),
('Pb', 0.5, 'Lead - annual safe limit'),
('Benzene', 5.0, 'Benzene - annual safe limit');

-- Insert Indian Authorities
INSERT IGNORE INTO Authority (Name, Dept, Contact, Email) VALUES
('Central Pollution Control Board', 'National Monitoring', 'Dr. Prashant Gargava', 'cpcb@gov.in'),
('Delhi Pollution Control Committee', 'State Level', 'Ms. Anumita Roy', 'dpcc@delhi.gov.in'),
('Maharashtra Pollution Control Board', 'State Level', 'Dr. Sudhir Srivastava', 'mpcb@maharashtra.gov.in'),
('Karnataka State Pollution Control Board', 'State Level', 'Mr. Srinivasulu', 'kspcb@karnataka.gov.in'),
('West Bengal Pollution Control Board', 'State Level', 'Dr. Kalyan Rudra', 'wbpcb@wb.gov.in'),
('Gujarat Pollution Control Board', 'State Level', 'Mr. R. B. Trivedi', 'gpcb@gujarat.gov.in'),
('Tamil Nadu Pollution Control Board', 'State Level', 'Mr. Sudhakar', 'tnpcb@tn.gov.in'),
('Telangana Pollution Control Board', 'State Level', 'Mr. Satyanarayana', 'tspcb@telangana.gov.in'),
('Uttar Pradesh Pollution Control Board', 'State Level', 'Mr. Ashok Kumar', 'uppcb@up.gov.in');

-- Insert Realistic Indian Measurement Data
INSERT INTO Measurement (Value, Type, DateTime, LocID, PollutantID, SourceID) VALUES
-- Delhi measurements (High pollution)
(185.5, 'Air Quality', '2024-01-15 08:00:00', 1, 1, 1),  -- PM2.5 at Anand Vihar from vehicles
(210.3, 'Air Quality', '2024-01-15 09:00:00', 1, 2, 1),  -- PM10 at Anand Vihar
(95.6, 'Air Quality', '2024-01-15 10:00:00', 2, 3, 2),   -- NO2 at RK Puram from thermal plant
(78.2, 'Air Quality', '2024-01-15 11:00:00', 2, 4, 2),   -- SO2 at RK Puram

-- Mumbai measurements
(65.8, 'Air Quality', '2024-01-15 12:00:00', 3, 1, 3),   -- PM2.5 at BKC from construction
(120.5, 'Air Quality', '2024-01-15 13:00:00', 3, 2, 3),  -- PM10 at BKC
(45.3, 'Air Quality', '2024-01-15 14:00:00', 4, 3, 4),   -- NO2 at Powai from industries

-- Bengaluru measurements
(42.1, 'Air Quality', '2024-01-15 15:00:00', 5, 1, 5),   -- PM2.5 at Whitefield from traffic
(88.7, 'Air Quality', '2024-01-15 16:00:00', 5, 2, 5),   -- PM10 at Whitefield
(35.6, 'Air Quality', '2024-01-15 17:00:00', 6, 4, 6),   -- SO2 at Electronic City

-- Kolkata measurements
(78.9, 'Air Quality', '2024-01-15 18:00:00', 7, 1, 7),   -- PM2.5 at Alipore
(145.2, 'Air Quality', '2024-01-15 19:00:00', 7, 2, 7),  -- PM10 at Alipore
(62.3, 'Air Quality', '2024-01-15 20:00:00', 8, 3, 8),   -- NO2 at Salt Lake

-- Ahmedabad measurements
(68.4, 'Air Quality', '2024-01-16 08:00:00', 9, 1, 9),   -- PM2.5 at Maninagar
(132.7, 'Air Quality', '2024-01-16 09:00:00', 9, 2, 9),  -- PM10 at Maninagar
(58.9, 'Air Quality', '2024-01-16 10:00:00', 10, 3, 10), -- NO2 at Navrangpura

-- Chennai measurements
(55.6, 'Air Quality', '2024-01-16 11:00:00', 11, 1, 11), -- PM2.5 at Adyar
(98.3, 'Air Quality', '2024-01-16 12:00:00', 11, 2, 11), -- PM10 at Adyar
(48.7, 'Air Quality', '2024-01-16 13:00:00', 12, 4, 12), -- SO2 at Anna Nagar

-- Hyderabad measurements
(38.9, 'Air Quality', '2024-01-16 14:00:00', 13, 1, 13), -- PM2.5 at Hitec City
(76.5, 'Air Quality', '2024-01-16 15:00:00', 13, 2, 13), -- PM10 at Hitec City
(42.1, 'Air Quality', '2024-01-16 16:00:00', 14, 3, 14), -- NO2 at Charminar

-- Lucknow measurements
(72.3, 'Air Quality', '2024-01-16 17:00:00', 15, 1, 15), -- PM2.5 at Gomti Nagar
(128.9, 'Air Quality', '2024-01-16 18:00:00', 15, 2, 15), -- PM10 at Gomti Nagar
(56.4, 'Air Quality', '2024-01-16 19:00:00', 16, 3, 16); -- NO2 at Hazratganj

-- Insert Actions taken by Indian authorities
INSERT INTO Actions (Type, Description, ActionDate, AuthID, MeasID) VALUES
('GRAP Implementation', 'Graded Response Action Plan implemented in Delhi due to severe air quality', '2024-01-16', 2, 1),
('Construction Ban', 'Temporary ban on construction activities in Mumbai due to high PM levels', '2024-01-16', 3, 5),
('Industrial Regulation', 'Stricter emissions control enforced in Bengaluru industrial areas', '2024-01-17', 4, 8),
('Vehicle Restrictions', 'Odd-even scheme implemented in Kolkata to reduce vehicular pollution', '2024-01-17', 5, 10),
('Emission Standards', 'Strict enforcement of BS-VI norms in Ahmedabad', '2024-01-18', 6, 13),
('Port Activity Regulation', 'Reduced shipping activities at Chennai Port to control emissions', '2024-01-18', 7, 16),
('Public Transport Boost', 'Increased metro and bus services in Hyderabad to reduce traffic', '2024-01-19', 8, 19),
('Dust Control Measures', 'Enhanced anti-smog guns and water sprinklers in Lucknow', '2024-01-19', 9, 22);

-- Insert a demo user (password: demo123)
INSERT IGNORE INTO SimpleUsers (username, email, password_hash, full_name) VALUES 
('demo', 'demo@pollution.gov.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo User');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;