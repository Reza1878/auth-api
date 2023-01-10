class RefreshToken {
  constructor({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.refreshToken = refreshToken;
  }
}

module.exports = RefreshToken;
