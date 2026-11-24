import { NextResponse } from "next/server";

// Proxies the portfolio chatbot to OpenAI so the API key stays on the server.
export const dynamic = "force-dynamic";

const RESUME = `
Machine Learning Project
- Technologies: Python, NumPy

JourneyGenie Web App
- Technologies: Spring Boot, JavaScript, PostgreSQL, Bootstrap, MockMvc, JUnit, Docker

Collision-Resistant Hashmap for FriendsBook - Social Networking Platform
- Technologies: C++, Object-Oriented Programming, Data Structures

Personal Portfolio Web App
- Technologies: Next.js, React, TypeScript, Tailwind CSS
`;

const SYSTEM_PROMPT = `You are a chatbot assisting users with questions about the person described in this resume.
Always respond in 3 lines or less. Use this resume:

${RESUME}

If asked "Who are you?" reply "I am Fardin's personal assistant."
For questions about technologies, confirm if they were used in a listed project`;

const MAX_MESSAGE_LENGTH = 500;

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  let message = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
  } catch {
    /* fall through to the empty-message check */
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo-0125",
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || "OpenAI request failed" }, { status: 502 });
    }
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "Could not reach OpenAI" }, { status: 502 });
  }
}
