// Script to create default roles in database
require('dotenv').config();
const Role = require('./models/roleModel');
const { sequelize } = require('./config/database');

async function seedRoles() {
  try {
    // Sync database
    await sequelize.sync();
    
    // Check if roles exist
    const existingRoles = await Role.findAll();
    
    if (existingRoles.length === 0) {
      console.log('Creating default roles...');
      
      // Create default roles
      await Role.bulkCreate([
        { id: 1, name: 'user' },
        { id: 2, name: 'admin' },
      ]);
      
      console.log('✓ Default roles created successfully!');
    } else {
      console.log('✓ Roles already exist in database');
    }
    
    // Display existing roles
    const roles = await Role.findAll();
    console.log('\nExisting roles:');
    roles.forEach(role => {
      console.log(`  - ID: ${role.id}, Name: ${role.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
