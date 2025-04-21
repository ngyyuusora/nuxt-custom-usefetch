export class responseResult {
  message: string;
  status: string;
  code: number;
  data: any;
  constructor(message: string, status: string, code: number, data: any) {
    this.message = message;
    this.status = status;
    this.code = code;
    this.data = data;
  }
  static Success(msg: string, data: any) {
    return new responseResult(msg, 'SUCCESS', 200, data);
  }
}
