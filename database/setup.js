const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration - UPDATE PASSWORD IF NEEDED
const config = {
  host: 'localhost',
  user: 'root',
  password: 'Ankith@70134', // Leave empty if no password, or add your MySQL password
  multipleStatements: true // Allow multiple SQL statements
};

console.log('🚀 Starting Pollution Monitoring Database Setup...');
console.log('📋 Configuration:', { ...config, password: '***' });
console.log('📁 Using schema.sql file');

// Create connection
const connection = mysql.createConnection(config);

// Read your existing schema.sql file
const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

let currentStep = 0;
const totalSteps = 3;

const updateProgress = (message) => {
  currentStep++;
  console.log(`\n📦 Step ${currentStep}/${totalSteps}: ${message}`);
};

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection to MySQL failed:', err.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MySQL is running (check XAMPP/WAMP)');
    console.log('2. Check if your MySQL has a password');
    console.log('3. Update the password in setup.js if needed');
    return;
  }
  
  updateProgress('Connected to MySQL server');
  
  // Execute your schema.sql file (contains both CREATE and INSERT)
  connection.query(schemaSQL, (err, results) => {
    if (err) {
      console.error('❌ Database setup failed:', err.message);
      console.log('💡 Check your schema.sql file for SQL syntax errors');
      connection.end();
      return;
    }
    
    updateProgress('Database schema and data created successfully');
    
    // Verify the setup
    const verifyQueries = [
      'SELECT COUNT(*) as locationCount FROM pollution_monitoring.Location',
      'SELECT COUNT(*) as sourceCount FROM pollution_monitoring.Source',
      'SELECT COUNT(*) as pollutantCount FROM pollution_monitoring.Pollutant',
      'SELECT COUNT(*) as measurementCount FROM pollution_monitoring.Measurement',
      'SELECT COUNT(*) as authorityCount FROM pollution_monitoring.Authority',
      'SELECT COUNT(*) as actionCount FROM pollution_monitoring.Actions'
    ];
    
    Promise.all(
      verifyQueries.map(query => 
        new Promise((resolve, reject) => {
          connection.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
          });
        })
      )
    ).then(results => {
      updateProgress('Database verification completed');
      
      console.log('\n✅ DATABASE SETUP COMPLETED SUCCESSFULLY!');
      console.log('=========================================');
      console.log(`📍 Locations: ${results[0].locationCount}`);
      console.log(`🏭 Sources: ${results[1].sourceCount}`);
      console.log(`☁️ Pollutants: ${results[2].pollutantCount}`);
      console.log(`📊 Measurements: ${results[3].measurementCount}`);
      console.log(`🏛️ Authorities: ${results[4].authorityCount}`);
      console.log(`⚡ Actions: ${results[5].actionCount}`);
      console.log('\n🎉 Your database is ready! You can now start the backend and frontend servers.');
      
    }).catch(verifyErr => {
      console.error('❌ Verification failed:', verifyErr.message);
      console.log('💡 But the main setup completed. You can proceed.');
    }).finally(() => {
      connection.end();
    });
  });
});

// Handle connection errors
connection.on('error', (err) => {
  console.error('❌ Database error:', err);
});