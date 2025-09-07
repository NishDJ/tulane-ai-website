import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { ApplicationInfoSchema, type ApplicationInfo } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    const filePath = join(process.cwd(), 'src/data/programs/applications.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const applications = JSON.parse(fileContent);
    
    // Validate data
    const validatedApplications = applications.map((app: unknown) => ApplicationInfoSchema.parse(app));
    
    // Filter by program ID if provided
    let filteredApplications: ApplicationInfo[] = validatedApplications;
    if (programId) {
      filteredApplications = validatedApplications.filter((app: ApplicationInfo) => app.programId === programId);
    }
    
    return NextResponse.json({
      data: filteredApplications,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching application info:', error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: 'Failed to fetch application information',
      },
      { status: 500 }
    );
  }
}