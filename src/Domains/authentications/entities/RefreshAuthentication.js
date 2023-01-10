class RefreshAuthentication {
  constructor({ refreshToken, userId }) {
    if (!refreshToken || !userId) {
      throw new Error('REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string' || typeof userId !== 'number') {
      throw new Error(
        'REFRESH_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }

    this.refreshToken = refreshToken;
    this.userId = userId;
  }
}

module.exports = RefreshAuthentication;
