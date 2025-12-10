import LoadingCircle from "@/components/loading-circle";
import { getQueryClient } from "@/lib/tanstack/query-clients";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import SelectTablePage from "./selectTablePage";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { getTablesByType } from "@/lib/api";

export default async function PanelBottomPage({
  params: paramsPromise,
}: {
  params: Promise<{ mode: string }>;
}) {
  const params = await paramsPromise;
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    const token = session.accessToken;
    await queryClient.prefetchQuery({
      queryKey: ["tables", params.mode],
      queryFn: () => getTablesByType(token, params.mode),
    });
  }
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingCircle />}>
        <SelectTablePage params={params} />
      </Suspense>
    </HydrationBoundary>
  );
}
