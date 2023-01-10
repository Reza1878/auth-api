const LoggedInUser = require('../LoggedInUser');

describe('a LoggedInUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      accessToken: 'access_token',
    };

    expect(() => new LoggedInUser(payload)).toThrowError(
      'LOGGED_IN_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      accessToken: {},
      refreshToken: 'test',
    };

    expect(() => new LoggedInUser(payload)).toThrowError(
      'LOGGED_IN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create loggedInUser object correctly', () => {
    const payload = {
      accessToken: 'accesstoken',
      refreshToken: 'refreshToken',
    };

    const { accessToken, refreshToken } = new LoggedInUser(payload);

    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
