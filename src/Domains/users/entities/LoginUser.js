class LoginUser {
  constructor({ username, password }) {
    if (!username || !password) {
      throw new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (!username.match(/^[\w]+$/)) {
      throw new Error('LOGIN_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }

    this.username = username;
    this.password = password;
  }
}

module.exports = LoginUser;
