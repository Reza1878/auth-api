const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('AuthenticationRepositoryPostgres', () => {
    describe('addRefreshToken function', () => {
      it('should persist the refreshToken', async () => {
        const refreshToken = 'token';

        const authenticationRepositoryPostgres =
          new AuthenticationRepositoryPostgres(pool);

        await authenticationRepositoryPostgres.addToken(refreshToken);

        const tokens = await AuthenticationsTableTestHelper.findToken(
          refreshToken,
        );

        expect(tokens).toHaveLength(1);
      });
    });

    describe('verifyRefreshToken function', () => {
      it('should throw InvariantError when refreshToken is invalid', async () => {
        const refreshToken = 'notfoudntoken';

        const authenticationRepositoryPosgres =
          new AuthenticationRepositoryPostgres(pool);

        await expect(
          authenticationRepositoryPosgres.verifyRefreshToken(refreshToken),
        ).rejects.toThrowError(InvariantError);
      });
      it('should not throw InvariantError when refresh token is valid', async () => {
        const refreshToken = 'token';

        const authenticationRepositoryPostgres =
          new AuthenticationRepositoryPostgres(pool);

        await authenticationRepositoryPostgres.addToken(refreshToken);
        const authenticationRepositoryPosgres =
          new AuthenticationRepositoryPostgres(pool);

        await expect(
          authenticationRepositoryPosgres.verifyRefreshToken(refreshToken),
        ).resolves.not.toThrowError(InvariantError);
      });
    });

    describe('deleteRefreshToken function', () => {
      it('should throw InvariantError when delete invalid token', async () => {
        const authenticationRepositoryPosgres =
          new AuthenticationRepositoryPostgres(pool);
        await expect(
          authenticationRepositoryPosgres.deleteRefreshToken('token'),
        ).rejects.toThrowError(InvariantError);
      });
      it('should not throw InvariantError when delete valid token', async () => {
        await AuthenticationsTableTestHelper.addToken('token');
        const authenticationRepositoryPosgres =
          new AuthenticationRepositoryPostgres(pool);

        await expect(
          authenticationRepositoryPosgres.deleteRefreshToken('token'),
        ).resolves.not.toThrowError(InvariantError);
      });
      it('should delete token correctly', async () => {
        const token = 'token';
        await AuthenticationsTableTestHelper.addToken(token);
        const authenticationRepositoryPosgres =
          new AuthenticationRepositoryPostgres(pool);

        await authenticationRepositoryPosgres.deleteRefreshToken(token);
        const tokens = await AuthenticationsTableTestHelper.findToken(token);
        expect(tokens).toHaveLength(0);
      });
    });
  });
});
