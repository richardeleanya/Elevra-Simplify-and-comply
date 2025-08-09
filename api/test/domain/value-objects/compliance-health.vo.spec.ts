import { ComplianceHealthVO } from '../../../src/domain/value-objects/compliance-health.vo';
import { Severity } from '../../../src/domain/entities/alert.entity';

describe('ComplianceHealthVO', () => {
  it('computes 100 with zero alerts', () => {
    const vo = new ComplianceHealthVO({ INFO: 0, WARNING: 0, CRITICAL: 0 });
    expect(vo.score).toBe(100);
  });

  it('deducts for severity', () => {
    const vo = new ComplianceHealthVO({ INFO: 2, WARNING: 1, CRITICAL: 1 });
    // 100 - 2*5 - 1*20 - 1*40 = 100 - 10 - 20 - 40 = 30
    expect(vo.score).toBe(30);
  });

  it('score never negative', () => {
    const vo = new ComplianceHealthVO({ INFO: 0, WARNING: 0, CRITICAL: 5 });
    expect(vo.score).toBe(0);
  });

  it('score never exceeds 100', () => {
    const vo = new ComplianceHealthVO({ INFO: 0, WARNING: 0, CRITICAL: 0 });
    expect(vo.score).toBeLessThanOrEqual(100);
  });
});