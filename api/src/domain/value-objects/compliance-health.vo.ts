import { Severity } from '../entities/alert.entity';

export interface SeverityCounts {
  [Severity.INFO]: number;
  [Severity.WARNING]: number;
  [Severity.CRITICAL]: number;
}

export class ComplianceHealthVO {
  readonly score: number;
  readonly counts: SeverityCounts;

  constructor(counts: SeverityCounts) {
    this.counts = counts;
    this.score = ComplianceHealthVO.calculateScore(counts);
  }

  static calculateScore(counts: SeverityCounts): number {
    // Example: CRITICAL = -40, WARNING = -20, INFO = -5, base 100, min 0, max 100
    let score = 100;
    score -= counts[Severity.CRITICAL] * 40;
    score -= counts[Severity.WARNING] * 20;
    score -= counts[Severity.INFO] * 5;
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    return Math.round(score);
  }
}