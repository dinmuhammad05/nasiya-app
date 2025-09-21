import { IResponse } from '../interface/response.interface';

export function getSuccessRes(
  data: object,
  statusCode: number = 200,
  message: string = 'success',
): IResponse {
  return {
    statusCode,
    message,
    data,
  };
}
