const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator, passwordHash) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._passwordHash = passwordHash;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VAlUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyUserCredentials({ username, password }) {
    const query = {
      text: 'SELECT id, username, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    const { rows } = result;

    if (!rows[0]) {
      throw new InvariantError('username tidak ditemukan');
    }

    const match = await this._passwordHash.compare(password, rows[0].password);

    if (!match) {
      throw new AuthenticationError('password tidak sama');
    }

    return rows[0].id;
  }
}

module.exports = UserRepositoryPostgres;
