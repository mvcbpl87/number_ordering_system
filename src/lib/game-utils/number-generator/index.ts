/**
 * Number Generator for lucky pick
 * Note: This is a basic random generator, and will further improve
 * along time to provide robust and better number generator
 *
 * Devlog: 27/6/2024 (Starter)
 **
 */

export default class LuckyPick {
  private maxNumLen: number = 4;
  constructor() {}

  GenerateRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /**
   * GetLuckyPick
   * @returns string (lott number in string format since dealing with 0001, ... n +1 )
   */
  GetLuckyPick(): string {
    const numArray = Array.from({ length: this.maxNumLen }, (_) =>
      this.GenerateRandomIntInclusive(1, 9)
    );

    return numArray.join('');
  }
}
