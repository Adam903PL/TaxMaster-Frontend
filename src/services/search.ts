// Mock data for pages - replace with your actual content
const pages = [
    {
        path: '/dashboard',
        content: 'Welcome to your financial dashboard. Track your progress and manage your investments.',
        title: 'Dashboard'
    },
    {
        path: '/messages',
        content: 'Your messages and notifications center. Stay connected with your financial advisors.',
        title: 'Messages'
    },
    {
        path: '/shop',
        content: 'Browse and purchase financial courses and resources to improve your knowledge.',
        title: 'Shop'
    },
    // Add more pages as needed
];

export interface SearchResult {
    title: string;
    path: string;
    content: string;
    excerpt: string;
}

export const searchContent = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    pages.forEach(page => {
        const titleMatch = page.title.toLowerCase().includes(searchTerm);
        const contentMatch = page.content.toLowerCase().includes(searchTerm);

        if (titleMatch || contentMatch) {
            // Create excerpt with highlighted search term
            let excerpt = page.content;
            const searchIndex = excerpt.toLowerCase().indexOf(searchTerm);
            if (searchIndex > -1) {
                const start = Math.max(0, searchIndex - 30);
                const end = Math.min(excerpt.length, searchIndex + query.length + 30);
                excerpt = '...' + excerpt.slice(start, end) + '...';
            }

            results.push({
                title: page.title,
                path: page.path,
                content: page.content,
                excerpt
            });
        }
    });

    return results;
};
