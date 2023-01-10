const LoginUser = require('../LoginUser');

describe('a LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
    };

    expect(() => new LoginUser(payload)).toThrowError(
      'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: '0',
      password: {},
    };
    expect(() => new LoginUser(payload)).toThrowError(
      'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when username contain restricted character', () => {
    const payload = {
      username: 'dico ding',
      password: 'secret',
    };

    expect(() => new LoginUser(payload)).toThrowError(
      'LOGIN_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('should create loginUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const { username, password } = new LoginUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
