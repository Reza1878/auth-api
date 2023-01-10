const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const authenticationRepository = new AuthenticationRepository();

    await expect(authenticationRepository.addToken({})).rejects.toThrowError(
      'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      authenticationRepository.verifyRefreshToken({}),
    ).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      authenticationRepository.deleteRefreshToken(''),
    ).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
