require('dotenv').config();
const Theme = require('./models/themeModel');
const { sequelize } = require('./config/database');

const initialThemes = [
  {
    name: 'Science',
    icon: '🔬',
    description: 'Biology, Chemistry, Physics',
    color: 'purple'
  },
  {
    name: 'Mathematics',
    icon: '🔢',
    description: 'Algebra, Geometry, Calculus',
    color: 'blue'
  },
  {
    name: 'Technology',
    icon: '💻',
    description: 'Programming, IT, Web Dev',
    color: 'green'
  },
  {
    name: 'Languages',
    icon: '🗣️',
    description: 'English, French, Spanish',
    color: 'orange'
  },
  {
    name: 'History',
    icon: '📜',
    description: 'Ancient, Modern, Geography',
    color: 'yellow'
  },
  {
    name: 'Arts',
    icon: '🎨',
    description: 'Music, Painting, Design',
    color: 'pink'
  },
  {
    name: 'Sports',
    icon: '⚽',
    description: 'Football, Basketball, Tennis',
    color: 'red'
  },
  {
    name: 'General',
    icon: '🌍',
    description: 'Mixed topics, Trivia',
    color: 'cyan'
  }
];

async function seedThemes() {
  try {
    await sequelize.sync();
    
    // Check if themes already exist
    const count = await Theme.count();
    
    if (count > 0) {
      console.log('✅ Themes already exist in database');
      console.log(`   Found ${count} theme(s)`);
      process.exit(0);
    }
    
    // Create themes
    await Theme.bulkCreate(initialThemes);
    
    console.log('✅ Successfully seeded themes!');
    console.log(`   Created ${initialThemes.length} themes`);
    
    // Display created themes
    const themes = await Theme.findAll();
    console.log('\nCreated themes:');
    themes.forEach(theme => {
      console.log(`  ${theme.icon} ${theme.name} - ${theme.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    process.exit(1);
  }
}

seedThemes();
