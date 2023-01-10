/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
class RegisteredUser {
  constructor({ id, fullname, username }) {
    this._verifyPayload({ id, username, fullname });

    this.id = id;
    this.fullname = fullname;
    this.username = username;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ id, username, fullname }) {
    if (!id || !fullname || !username) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof fullname !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
