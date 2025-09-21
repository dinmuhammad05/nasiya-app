import { FindManyOptions } from 'typeorm';

export interface ISuccess {
  statusCode: number;
  message: string;
  data: object;
}

export interface IResponsePagination extends ISuccess {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  from: number;
  to: number;
}

export interface IFindOptions<T> extends FindManyOptions<T> {}
