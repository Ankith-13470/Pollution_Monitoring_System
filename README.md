# Pollution Monitoring System

## Overview

The Pollution Monitoring System is a web-based application designed to monitor, manage, and analyze environmental pollution data. It enables users and authorities to track pollution measurements, view pollution trends, and take corrective actions to ensure environmental compliance.

## Features

* User registration and authentication
* Secure login and access control
* Pollution data recording and management
* Monitoring of pollution measurements
* Authority dashboard for data analysis
* Tracking of corrective and preventive actions
* Database-driven storage and retrieval of records
* Responsive and user-friendly interface

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

## Project Structure

```text
pollution-monitoring-system/
│
├── frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
├── backend/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
└── README.md
```

## Installation

### Prerequisites

* Node.js
* MySQL
* Git

### Clone the Repository

```bash
git clone https://github.com/your-username/pollution-monitoring-system.git
cd pollution-monitoring-system
```

### Install Dependencies

```bash
npm install
```

### Configure Database

1. Create a MySQL database.
2. Import the `schema.sql` file.
3. Update database credentials in your configuration file or `.env` file.

### Run the Application

```bash
npm start
```

The application will be available at:

```text
http://localhost:5000
```

## Modules

### Authentication Module

* User registration
* User login
* Session management

### Pollution Monitoring Module

* Record pollution measurements
* View pollution statistics
* Track pollution levels

### Authority Module

* Monitor reported pollution data
* Review compliance status
* Manage corrective actions

### Action Management Module

* Record corrective actions
* Track implementation status
* Monitor effectiveness

## Future Enhancements

* Real-time pollution monitoring using IoT sensors
* Data visualization dashboards
* Predictive analytics using Machine Learning
* Alert and notification system
* Mobile application support


## License

This project is part of DBMS Mini project.
