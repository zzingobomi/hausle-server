export class Managers {
  private static s_instance: Managers;
  static get Instance(): Managers {
    this.Init();
    return this.s_instance;
  }

  public Update(delta: number): void {}

  static Init(): void {
    if (!this.s_instance) {
      this.s_instance = new Managers();

      // TODO: 다른 매니저들 초기화
    }
  }

  public static Clear(): void {}
}
