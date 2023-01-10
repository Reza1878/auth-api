class LoggedInUser {
  constructor({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
      throw new Error('LOGGED_IN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('LOGGED_IN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
module.exports = LoggedInUser;
