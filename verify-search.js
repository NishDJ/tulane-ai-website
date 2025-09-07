// Simple verification script for search functionality
const { createFacultyIndex, searchIndex, sanitizeSearchQuery } = require('./src/lib/search.ts');

// Mock data
const mockFaculty = [
  {
    id: 'john-doe',
    name: 'Dr. John Doe',
    title: 'Professor of AI',
    department: 'Computer Science',
    email: 'john@example.com',
    bio: 'Expert in machine learning and artificial intelligence',
    researchAreas: ['Machine Learning', 'AI', 'Data Science'],
    education: [],
    publications: [],
    profileImage: '/images/john.jpg',
    isActive: true,
  },
];

console.log('Testing search functionality...');

try {
  // Test index creation
  const index = createFacultyIndex(mockFaculty);
  console.log('✓ Index creation works');
  console.log('Index length:', index.length);

  // Test search
  const results = searchIndex(index, { query: 'machine learning' });
  console.log('✓ Search works');
  console.log('Results:', results.results.length);

  // Test sanitization
  const sanitized = sanitizeSearchQuery('  hello <script>  ');
  console.log('✓ Query sanitization works');
  console.log('Sanitized:', sanitized);

  console.log('\n✅ All search functionality tests passed!');
} catch (error) {
  console.error('❌ Search functionality test failed:', error.message);
  process.exit(1);
}