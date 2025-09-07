import { NextRequest, NextResponse } from 'next/server';
import { getResearchProjectById } from '@/lib/data-loader';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          error: 'Research project ID is required',
        },
        { status: 400 }
      );
    }

    const response = await getResearchProjectById(id);
    
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in research project API:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to load research project',
      },
      { status: 500 }
    );
  }
}