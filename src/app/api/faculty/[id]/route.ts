import { NextResponse } from 'next/server';
import { getFacultyMemberById } from '@/lib/data-loader';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const response = await getFacultyMemberById(params.id);
    
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in faculty member API route:', error);
    return NextResponse.json(
      { 
        data: null, 
        success: false, 
        error: 'Failed to load faculty member' 
      },
      { status: 500 }
    );
  }
}