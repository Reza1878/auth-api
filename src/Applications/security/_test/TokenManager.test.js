const TokenManager = require('../TokenManager');

describe('TokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const tokenManager = new TokenManager();

    expect(() => tokenManager.generateAccessToken({})).toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
    expect(() => tokenManager.generateRefreshToken({})).toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
    expect(() => tokenManager.verifyRefreshToken('')).toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
  });
});
