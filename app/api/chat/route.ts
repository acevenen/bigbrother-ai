import { NextRequest, NextResponse } from "next/server";
import { getBigBrotherResponse } from "@/lib/claude";
import type { Message } from "@/types/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    if (messages[0].role !== "user") {
      return NextResponse.json(
        { error: "Conversation must start with a user message" },
        { status: 400 }
      );
    }

    const content = await getBigBrotherResponse(messages);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Failed to get response from Big Brother" },
      { status: 500 }
    );
  }
}
