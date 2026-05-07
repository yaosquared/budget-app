import { QueryClient } from "@tanstack/vue-query";

type InfiniteDataShape<T> = {
  pages: { data: T[] }[];
};

export function optimisticUpdateInfinite<T>({
  queryClient,
  queryKey,
  update,
  rollback,
}: {
  queryClient: QueryClient;
  queryKey: unknown[];
  update: (old: InfiniteDataShape<T>) => InfiniteDataShape<T>;
  rollback?: any;
}) {
  const previous = queryClient.getQueryData(queryKey);

  queryClient.setQueryData(queryKey, (old: any) => {
    if (!old) return old;
    return update(old);
  });

  return {
    rollback: () => {
      if (rollback !== undefined) {
        queryClient.setQueryData(queryKey, rollback);
      } else {
        queryClient.setQueryData(queryKey, previous);
      }
    },
  };
}
