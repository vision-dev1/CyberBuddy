from groq import AsyncGroq
from config import GROQ_API_KEY

# Initialize the Groq client
client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

SYSTEM_PROMPT = """You are CyberBuddy, a professional AI cybersecurity assistant. Explain vulnerabilities clearly, provide examples, and recommend security best practices. Only discuss hacking techniques for educational and defensive purposes. Handle topics like:
- Vulnerabilities
- Pentesting commands
- Code security analysis
- Cybersecurity quizzes"""

async def get_ai_response(user_message: str) -> str:
    if not client:
        return "Error: GROQ_API_KEY is not set. Please set it in the .env file."
        
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": user_message,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.7,
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"An error occurred while communicating with the AI provider: {str(e)}"
