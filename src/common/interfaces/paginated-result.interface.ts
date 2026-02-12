export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
