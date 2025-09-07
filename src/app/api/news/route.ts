import { NextRequest, NextResponse } from 'next/server';
import { loadNewsData } from '@/lib/data-loader';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const tag = searchParams.get('tag');

    let articles = await loadNewsData();

    // Filter by featured status
    if (featured === 'true') {
      articles = articles.filter(article => article.featured);
    } else if (featured === 'false') {
      articles = articles.filter(article => !article.featured);
    }

    // Filter by tag
    if (tag) {
      articles = articles.filter(article => 
        article.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    // Sort by publish date (newest first)
    articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        articles = articles.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news articles',
        data: []
      },
      { status: 500 }
    );
  }
}