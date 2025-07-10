export interface PrimitiveValidatorFunction<Opts = any> {
  /**
   *
   * 각 데코레이터가 받는 옵션 타입
   */
  (opts: Opts): PropertyDecorator;
  __isPrimitiveValidator: true;
}
