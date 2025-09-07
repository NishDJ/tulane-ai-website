import { NextResponse } from 'next/server';

// This endpoint allows manual rebuilding of the search index
// In a production environment, you might want to add authentication
export async function POST() {
  try {
    // Clear the search index cache by making a request to the search endpoint
    // This will force a rebuild of the index on the next search request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Make a dummy search request to trigger index rebuild
    const response = await fetch(`${baseUrl}/api/search?q=rebuild`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to rebuild search index');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Search index rebuild initiated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search index rebuild error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to rebuild search index',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}