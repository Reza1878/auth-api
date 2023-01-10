const RefreshAuthentication = require('../RefreshAuthentication');

describe('a RefreshAuthentication entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {};

    expect(() => new RefreshAuthentication(payload)).toThrowError(
      'REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      refreshToken: 123,
      userId: 'string',
    };

    expect(() => new RefreshAuthentication(payload)).toThrowError(
      'REFRESH_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create RefreshToken object correctly', () => {
    const payload = {
      refreshToken: 'token',
      userId: 1,
    };

    const refreshToken = new RefreshAuthentication(payload);

    expect(refreshToken.refreshToken).toEqual(payload.refreshToken);
    expect(refreshToken.userId).toEqual(payload.userId);
  });
});
