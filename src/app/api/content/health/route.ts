import { NextResponse } from 'next/server';
import { performContentHealthCheck } from '@/lib/content-parser';
import path from 'path';

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'data');
    const healthCheck = await performContentHealthCheck(dataDirectory);
    
    return NextResponse.json({
      success: true,
      data: healthCheck,
      message: 'Content health check completed',
    });
  } catch (error) {
    console.error('Content health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform content health check',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}