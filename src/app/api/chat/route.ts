import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Here you would typically make a call to your AI service
    // For now, we'll return a mock response
    const mockResponses = {
      investment: "For investment advice, consider diversifying your portfolio across different asset classes like stocks, bonds, and real estate. Always do thorough research and consider consulting with a financial advisor.",
      stocks: "When investing in stocks, it's important to understand both fundamental and technical analysis. Look at company financials, market trends, and industry conditions before making decisions.",
      crypto: "Cryptocurrency is a highly volatile investment. While it offers potential high returns, it also comes with significant risks. Only invest what you can afford to lose.",
      savings: "Building an emergency fund covering 3-6 months of expenses is a good financial practice. Consider high-yield savings accounts for better returns on your emergency fund.",
      budget: "Creating a budget helps track income and expenses. Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
    };

    // Simple keyword matching for demo purposes
    let response = "I'm here to help with financial and economic questions. Could you please be more specific about what you'd like to know?";
    
    const lowercaseMessage = message.toLowerCase();
    for (const [keyword, answer] of Object.entries(mockResponses)) {
      if (lowercaseMessage.includes(keyword)) {
        response = answer;
        break;
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
