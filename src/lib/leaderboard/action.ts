interface LeaderboardEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  total_points: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
