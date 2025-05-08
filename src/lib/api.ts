interface Question {
  question_id: number;
  content: string;
}

interface Test {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  questions_count: number;
  category: string;
  is_new: boolean;
  questions: Question[];
}

interface UserPoints {
  user_id: string;
  test_id: string;
  points: number;
  is_done: boolean;
}

interface TestsResponse {
  tests: Test[];
}

interface PointsResponse {
  points: UserPoints[];
}

export async function getTests(): Promise<Test[]> {
  try {
    const response = await fetch('/api/tests-list', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tests: ${response.statusText}`);
    }

    const data: TestsResponse = await response.json();
    console.log('Fetched tests:', data); // Debug log
    return data.tests || [];
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

export async function getUserPoints(): Promise<UserPoints[]> {
  try {
    const response = await fetch('/api/user-points', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user points: ${response.statusText}`);
    }

    const data: PointsResponse = await response.json();
    console.log('Fetched user points:', data); // Debug log
    return data.points || [];
  } catch (error) {
    console.error('Error fetching user points:', error);
    return [];
  }
}

export type { Test, UserPoints, Question }; 