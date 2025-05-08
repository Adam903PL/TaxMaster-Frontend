import { NextResponse } from 'next/server';

// GET handler for fetching user points
export async function GET() {
  try {
    // For now, return mock data
    return NextResponse.json({
      points: [
        {
          user_id: "1",
          test_id: "1",
          points: 0,
          is_done: false
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching user points:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user points' },
      { status: 500 }
    );
  }
}

// POST handler for submitting test results
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { test_id, points, is_done } = body;

    // Validate required fields
    if (!test_id || points === undefined || is_done === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, just return success
    // In a real application, you would save this to a database
    return NextResponse.json({
      success: true,
      message: 'Test results saved successfully'
    });
  } catch (error) {
    console.error('Error saving test results:', error);
    return NextResponse.json(
      { error: 'Failed to save test results' },
      { status: 500 }
    );
  }
} 