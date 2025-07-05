export async function sendMessageToAI(message: string): Promise<string> {
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

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error communicating with AI:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}
