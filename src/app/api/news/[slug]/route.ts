import { NextRequest, NextResponse } from 'next/server';
import { loadNewsData } from '@/lib/data-loader';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articles = await loadNewsData();
    const article = articles.find(a => a.slug === slug);

    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article not found',
          data: null
        },
        { status: 404 }
      );
    }

    // Get related articles (same tags, excluding current article)
    const relatedArticles = articles
      .filter(a => 
        a.id !== article.id && 
        a.tags.some(tag => article.tags.includes(tag))
      )
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch article',
        data: null
      },
      { status: 500 }
    );
  }
}