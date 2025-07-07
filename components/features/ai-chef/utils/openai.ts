export async function sendMessageToAIStream(message: string): Promise<ReadableStream<Uint8Array>> {
  try {
    const response = await fetch("/api/chef", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    if (!response.body) {
      throw new Error("No response body received");
    }

    return response.body;
  } catch (error) {
    console.error("Error communicating with AI:", error);
    throw error;
  }
}

// Keep the old function for backward compatibility if needed
export async function sendMessageToAI(message: string): Promise<string> {
  try {
    const stream = await sendMessageToAIStream(message);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    return result;
  } catch (error) {
    console.error("Error communicating with AI:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}
