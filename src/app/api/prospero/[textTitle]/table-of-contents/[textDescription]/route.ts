import type { NextRequest } from 'next/server';

import connectToMongoDB from '@/utils/connect-to-mongodb.function';
import { ProsperoTableOfContentsModel } from '@/orm/prospero/table-of-contents.model';

interface RouteContext {
  params: Promise<{ textTitle: string; textDescription: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { textTitle, textDescription } = await context.params;

  await connectToMongoDB();

  const result = await ProsperoTableOfContentsModel.findOne({
    textTitle,
    textDescription,
  }).orFail();

  return Response.json(result);
}
