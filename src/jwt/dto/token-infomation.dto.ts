export class TokenInformation {
  adminId: string;
  expiresIn: number;

  constructor(data: any) {
    this.adminId = data.adminId;
    this.expiresIn = data.expiresIn;
  }
}
