const RefreshToken = require('../RefreshToken');

describe('a RefreshToken entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {};

    expect(() => new RefreshToken(payload)).toThrowError(
      'REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      refreshToken: 123,
    };

    expect(() => new RefreshToken(payload)).toThrowError(
      'REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create RefreshToken object correctly', () => {
    const payload = {
      refreshToken: 'token',
    };

    const refreshToken = new RefreshToken(payload);

    expect(refreshToken.refreshToken).toEqual(payload.refreshToken);
  });
});
