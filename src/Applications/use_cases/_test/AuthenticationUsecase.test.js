const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LoggedInUser = require('../../../Domains/users/entities/LoggedInUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const TokenManager = require('../../security/TokenManager');
const AuthenticationUseCase = require('../AuthenticationUseCase');

describe('AuthenticationUseCase', () => {
  describe('getAuthentication function', () => {
    it('should orchestrating the verify credential action correctly', async () => {
      const useCasePayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const expectedLoggedInUser = new LoggedInUser({
        accessToken: 'token',
        refreshToken: 'token',
      });

      // Mocking needed function
      const mockAuthenticationRepository = new AuthenticationRepository();
      const mockTokenManager = new TokenManager();
      const mockUserRepository = new UserRepository();

      mockAuthenticationRepository.getAuthentication = jest
        .fn()
        .mockImplementation(
          () =>
            // eslint-disable-next-line implicit-arrow-linebreak
            Promise.resolve({
              accessToken: 'token',
              refreshToken: 'token',
            }),
          // eslint-disable-next-line function-paren-newline
        );
      mockTokenManager.generateAccessToken = jest
        .fn()
        .mockImplementation(() => 'token');
      mockTokenManager.generateRefreshToken = jest
        .fn()
        .mockImplementation(() => 'token');
      mockUserRepository.verifyUserCredentials = jest
        .fn()
        .mockImplementation(() => Promise.resolve(1));
      mockAuthenticationRepository.addToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve('token'));

      const authenticationUseCase = new AuthenticationUseCase({
        userRepository: mockUserRepository,
        authenticationRepository: mockAuthenticationRepository,
        tokenManager: mockTokenManager,
      });

      const loggedInUser = await authenticationUseCase.getAuthentication(
        useCasePayload,
      );

      expect(loggedInUser).toStrictEqual(expectedLoggedInUser);
      expect(mockTokenManager.generateAccessToken).toBeCalledWith({
        userId: 1,
      });
      expect(mockTokenManager.generateRefreshToken).toBeCalledWith({
        userId: 1,
      });
    });
  });
  describe('deleteAuthentication function', () => {
    it('should orchestrating delete authentication correctly', async () => {
      const refreshToken = 'token';

      const mockAuthenticationRepository = new AuthenticationRepository();
      const mockTokenManager = new TokenManager();
      const mockUserRepository = new UserRepository();

      mockAuthenticationRepository.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockTokenManager.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockAuthenticationRepository.deleteRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const authenticationUseCase = new AuthenticationUseCase({
        userRepository: mockUserRepository,
        authenticationRepository: mockAuthenticationRepository,
        tokenManager: mockTokenManager,
      });

      await authenticationUseCase.deleteAuthentication(refreshToken);
      expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(refreshToken);
      expect(mockAuthenticationRepository.verifyRefreshToken).toBeCalledWith(
        refreshToken,
      );
      expect(mockAuthenticationRepository.deleteRefreshToken).toBeCalledWith(
        refreshToken,
      );
    });
  });
});
