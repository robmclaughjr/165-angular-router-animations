import { Component } from '@angular/core';

interface GuessResult {
  guess: string[];
  exact: number;
  partial: number;
  attempt: number;
  message: string;
}

interface ColorSwatch {
  name: string;
  value: string;
}

@Component({
  selector: 'app-mastermind',
  templateUrl: './mastermind.component.html',
  styleUrls: ['./mastermind.component.scss']
})
export class MastermindComponent {
  readonly colors: ColorSwatch[] = [
    { name: 'Sapphire', value: '#2e5aac' },
    { name: 'Amethyst', value: '#7c3aed' },
    { name: 'Gold', value: '#f5b400' },
    { name: 'Coral', value: '#ff6f61' },
    { name: 'Emerald', value: '#30b180' },
    { name: 'Ivory', value: '#f4ede4' }
  ];

  readonly codeLength = 4;
  readonly maxAttempts = 10;

  secretCode: string[] = [];
  currentGuess: (string | null)[] = Array(this.codeLength).fill(null);
  guessHistory: GuessResult[] = [];
  activeColor = this.colors[0].name;
  attempts = 0;
  statusMessage = 'Select a color, paint the slots, and submit your first guess.';
  gameOver = false;

  constructor() {
    this.resetGame();
  }

  selectColor(color: string): void {
    if (this.gameOver) { return; }
    this.activeColor = color;
  }

  paintSlot(index: number): void {
    if (this.gameOver) { return; }
    this.currentGuess[index] = this.activeColor;
  }

  clearSlot(index: number): void {
    if (this.gameOver) { return; }
    this.currentGuess[index] = null;
  }

  resetGuess(): void {
    this.currentGuess = Array(this.codeLength).fill(null);
  }

  submitGuess(): void {
    if (this.gameOver) { return; }
    if (this.currentGuess.some(slot => slot === null)) {
      this.statusMessage = 'Fill every slot with a color before submitting.';
      return;
    }

    const guess = this.currentGuess as string[];
    const { exact, partial } = this.evaluateGuess(guess);
    this.attempts += 1;

    const result: GuessResult = {
      guess: [...guess],
      exact,
      partial,
      attempt: this.attempts,
      message: this.feedbackMessage(exact, partial)
    };

    this.guessHistory.unshift(result);

    if (exact === this.codeLength) {
      this.statusMessage = 'Brilliant! You cracked the code.';
      this.gameOver = true;
    } else if (this.attempts >= this.maxAttempts) {
      this.statusMessage = `Out of attempts! The hidden pattern was ${this.secretCode.join(', ')}.`;
      this.gameOver = true;
    } else {
      const remaining = this.maxAttempts - this.attempts;
      this.statusMessage = `Refine your pattern. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`;
    }

    this.resetGuess();
  }

  resetGame(): void {
    this.secretCode = this.generateSecret();
    this.currentGuess = Array(this.codeLength).fill(null);
    this.guessHistory = [];
    this.attempts = 0;
    this.gameOver = false;
    this.activeColor = this.colors[0].name;
    this.statusMessage = 'Select a color, paint the slots, and submit your first guess.';
  }

  private generateSecret(): string[] {
    const secret: string[] = [];
    for (let i = 0; i < this.codeLength; i++) {
      const choice = this.colors[Math.floor(Math.random() * this.colors.length)].name;
      secret.push(choice);
    }
    return secret;
  }

  private evaluateGuess(guess: string[]): { exact: number; partial: number } {
    let exact = 0;
    const secretCopy = [...this.secretCode];
    const guessCopy = [...guess];

    // Exact matches
    for (let i = 0; i < this.codeLength; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++;
        secretCopy[i] = '';
        guessCopy[i] = '';
      }
    }

    // Partial matches
    let partial = 0;
    for (let i = 0; i < this.codeLength; i++) {
      const guessColor = guessCopy[i];
      if (!guessColor) { continue; }
      const matchIndex = secretCopy.indexOf(guessColor);
      if (matchIndex !== -1) {
        partial++;
        secretCopy[matchIndex] = '';
      }
    }

    return { exact, partial };
  }

  private feedbackMessage(exact: number, partial: number): string {
    if (exact === 0 && partial === 0) {
      return 'No matches — time to rethink your palette.';
    }
    if (exact === this.codeLength) {
      return 'A perfect match!';
    }
    const parts = [];
    if (exact > 0) {
      parts.push(`${exact} exact`);
    }
    if (partial > 0) {
      parts.push(`${partial} color${partial === 1 ? '' : 's'} misplaced`);
    }
    return parts.join(' • ');
  }
}
