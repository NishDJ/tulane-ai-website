import { NextRequest, NextResponse } from 'next/server';
import { loadPrograms } from '@/lib/data-loader';
import { ProgramSchema } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programs = await loadPrograms();
    
    const program = programs.find(p => p.id === id);
    
    if (!program) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          error: 'Program not found',
        },
        { status: 404 }
      );
    }
    
    // Validate data
    const validatedProgram = ProgramSchema.parse(program);
    
    return NextResponse.json({
      data: validatedProgram,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch program',
      },
      { status: 500 }
    );
  }
}