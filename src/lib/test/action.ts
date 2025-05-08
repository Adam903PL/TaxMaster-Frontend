'use server'

interface EvaluationRequest {
  question: string;
  answer: string;
}

interface EvaluationResponse {
  score: number;
  description: string;
}

export async function evaluateAnswer(data: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    const response = await fetch('http://127.0.0.1:8000/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `'question':'${data.question}','answer':'${data.answer}'`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      score: 0,
      description: 'Failed to evaluate answer. Please try again.'
    };
  }
}