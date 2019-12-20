const User = require('./User');

describe('User model', () => {
  it('requires an email', async() => {
    const user = await new User();
    const { errors } = user.validateSync();

    expect(errors.email.message).toEqual('Path `email` is required.');
  });

  it('requires an passwordHash', async() => {
    const user = await new User();
    const { errors } = user.validateSync();

    expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.');
  });
});
