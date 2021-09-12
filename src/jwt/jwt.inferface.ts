export interface JwtModuleOptions {
  privateKey: string;
}

export interface JwtInterface {
  operate(data: string): any;
}
