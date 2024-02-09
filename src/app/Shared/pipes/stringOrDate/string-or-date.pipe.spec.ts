import { StringOrDatePipe } from './string-or-date.pipe';

describe('StringOrDatePipe', () => {
  it('create an instance', () => {
    const pipe = new StringOrDatePipe();
    expect(pipe).toBeTruthy();
  });
});
