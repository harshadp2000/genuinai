# GenuinAI: AI-Powered Text Analysis

GenuinAI is a web application designed to analyze text for hidden biases, provide summaries, and offer deeper insights. It addresses the growing need for tools that can critically evaluate content, helping users identify potential issues like gender, racial, or political bias in their writing before publication. By leveraging generative AI, the application provides a user-friendly interface for in-depth text analysis, making complex AI capabilities accessible to writers, editors, and content creators.

## How It Works

The application is built with a modern web stack and uses Google's Gemini AI model for its analysis capabilities.

-   **Frontend:** The user interface is a Next.js (with App Router) and React application. It uses UI components from **ShadCN** and is styled with **Tailwind CSS**.

-   **Backend AI Logic:** We use **Genkit** to manage and structure our interactions with the Gemini Pro model. This involves:
    1.  **Specialized Flows:** We've defined three distinct AI analysis flows in `src/ai/flows/`:
        -   `bias-detection-from-prompt.ts`: Analyzes text specifically for various biases. The prompt is engineered to make the AI act as an expert and return structured data.
        -   `summarize-text.ts`: Generates a concise summary.
        -   `real-time-analysis.ts`: Provides deeper, more general insights into the text.
    2.  **Structured Output:** Each flow uses Zod schemas to enforce a strict JSON output format. This ensures the data sent back to the frontend is predictable and reliable.

-   **End-to-End Workflow:**
    1.  A user enters text into the textarea on the homepage (`src/app/page.tsx`).
    2.  When the "Analyze" button is clicked, the frontend makes three parallel API calls to the Genkit flows.
    3.  Each flow processes the text using a specialized prompt sent to the Gemini model.
    4.  The AI returns a structured JSON response for each analysis type.
    5.  The frontend receives the data and displays the summary, bias analysis, and insights in their respective tabs.
