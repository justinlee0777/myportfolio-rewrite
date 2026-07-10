import type { NextRequest } from 'next/server';

import { getProsperoPages } from '@/utils/prospero/get-prospero-pages.function';

interface RouteContext {
  params: Promise<{ textTitle: string; textDescription: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { textTitle, textDescription } = await context.params;

  const searchParams = req.nextUrl.searchParams;

  const pageNumber = searchParams.get('pageNumber'),
    pageSize = searchParams.get('pageSize');

  let finalPageNumber = Number(pageNumber);
  let finalPageSize = Number(pageSize);

  if (!finalPageNumber) {
    finalPageNumber = 1;
  }

  if (!finalPageSize) {
    finalPageSize = 10;
  }

  const result = await getProsperoPages(
    textTitle,
    textDescription,
    finalPageNumber,
    finalPageSize,
  );

  return Response.json(result);
}
