import { NextResponse } from 'next/server';
import { generateChallenge } from '@/services/gemini';

// Allowed values to prevent injection via enum
const VALID_LEVELS = ['SD', 'SMP', 'SMA/SMK', 'Universitas'];
const VALID_GRADES: Record<string, string[]> = {
  'SD': ['1', '2', '3', '4', '5', '6'],
  'SMP': ['VII', 'VIII', 'IX'],
  'SMA/SMK': ['X', 'XI', 'XII'],
  'Universitas': ['Semester 1', 'Semester 3', 'Semester 5', 'Semester 7'],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, level, grade, winner, lang } = body;

    // Validate required fields
    if (!topic || !level || !grade || !winner) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate field types
    if (
      typeof topic !== 'string' ||
      typeof level !== 'string' ||
      typeof grade !== 'string' ||
      typeof winner !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid parameter types' }, { status: 400 });
    }

    // Validate enum values to prevent injection attacks
    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }
    if (!VALID_GRADES[level]?.includes(grade)) {
      return NextResponse.json({ error: 'Invalid grade for this level' }, { status: 400 });
    }

    // Sanitize: limit string lengths
    if (topic.length > 100 || winner.length > 100) {
      return NextResponse.json({ error: 'Input terlalu panjang' }, { status: 400 });
    }

    const challenge = await generateChallenge(topic, level, grade, winner, lang || 'id');
    return NextResponse.json(challenge);
  } catch (error: unknown) {
    console.error('Error generating challenge in API Route:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate challenge';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
