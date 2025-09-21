import { IResponsePagination } from '../response/success.interface';

export class Pager<T> {
  public static of<T>(
    statusCode: number,
    message: string,
    data: Array<T>,
    totalElements: number,
    pageSize: number,
    currentPage: number,
  ): IResponsePagination {
    const from = (currentPage - 1) * pageSize + 1;
    const to = currentPage * pageSize;
    return new Pager(
      statusCode,
      message,
      data,
      totalElements,
      Math.ceil(totalElements / pageSize),
      pageSize,
      currentPage,
      from,
      to,
    ).toPage();
  }

  private constructor(
    private statusCode: number,
    private message: string,
    private data: Array<T>,
    private totalElements: number,
    private totalPages: number,
    private pageSize: number,
    private currentPage: number,
    private from: number,
    private to: number,
  ) {}

  public toPage(): IResponsePagination {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      totalElements: this.totalElements,
      totalPages: this.totalPages,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      from: this.from > this.totalElements ? this.totalElements : this.from,
      to: this.to > this.totalElements ? this.totalElements : this.to,
    };
  }
}
