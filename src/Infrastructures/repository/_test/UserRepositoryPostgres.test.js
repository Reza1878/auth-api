const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const PasswordHash = require('../../../Applications/security/PasswordHash');
const LoginUser = require('../../../Domains/users/entities/LoginUser');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding'),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist regsiter user', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user corertly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'dicoding',
          fullname: 'Dicoding Indonesia',
        }),
      );
    });
  });

  describe('verifyUserCredential function', () => {
    it('should throw InvariantError when username is invalid', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const mockPasswordHash = new PasswordHash();
      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        () => '123',
        mockPasswordHash,
      );

      await userRepositoryPostgres.addUser(registerUser);
      const loginUser = new LoginUser({
        username: 'dicoc',
        password: 'secret_password',
      });

      await expect(
        userRepositoryPostgres.verifyUserCredentials(loginUser),
      ).rejects.toThrowError(InvariantError);
    });

    it('should throw Authentication error when password is invalid', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const mockPasswordHash = new PasswordHash();
      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false));
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        () => '123',
        mockPasswordHash,
      );

      await userRepositoryPostgres.addUser(registerUser);
      const loginUser = new LoginUser({
        username: 'dicoding',
        password: 'secret_passwords',
      });

      await expect(
        userRepositoryPostgres.verifyUserCredentials(loginUser),
      ).rejects.toThrowError(AuthenticationError);
    });

    it('should return user id when credential is valid', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const mockPasswordHash = new PasswordHash();
      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        () => '123',
        mockPasswordHash,
      );

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const loginUser = new LoginUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const userId = await userRepositoryPostgres.verifyUserCredentials(
        loginUser,
      );

      expect(userId).toEqual(registeredUser.id);
    });
  });
});
