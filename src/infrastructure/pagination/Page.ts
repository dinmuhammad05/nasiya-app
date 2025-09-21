export interface Page<T> {
  data: Array<T>;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}

type customQueryOptionsDetails = {
  query: string;
  parameters: any[];
};

export interface findAllCustomQueryOptions {
  data: customQueryOptionsDetails;
  count: customQueryOptionsDetails;
  take: number | undefined;
}
