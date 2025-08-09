/* global device, expect, element, by */
describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true });
  });

  it('should login and show Home screen', async () => {
    await expect(element(by.text('Sign In'))).toBeVisible();
    await element(by.label('Email')).typeText('test@user.com');
    await element(by.label('Password')).typeText('password1234');
    await element(by.text('Sign In')).tap();

    await expect(element(by.text('Compliance Health Score'))).toBeVisible();
    await expect(element(by.text('--'))).toBeVisible();
  });
});