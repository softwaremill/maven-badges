import { expect } from 'chai';
import { validateFormat } from '../validation';

describe('validation', () => {
  it('validateFormat should return true if format is correct', () => {
    expect(validateFormat('png')).to.be.true;
    expect(validateFormat('svg')).to.be.true;
  });

  it('validateFormat should return false if format is incorrect', () => {
    expect(validateFormat('mov')).to.be.false;
  });
});
