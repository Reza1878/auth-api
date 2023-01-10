const RefreshToken = require('../../Domains/authentications/entities/RefreshToken');
const LoggedInUser = require('../../Domains/users/entities/LoggedInUser');
const LoginUser = require('../../Domains/users/entities/LoginUser');

class AuthenticationUseCase {
  constructor({ userRepository, authenticationRepository, tokenManager }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._tokenManager = tokenManager;
  }

  async getAuthentication(useCasePayload) {
    const loginUser = new LoginUser(useCasePayload);
    const userId = await this._userRepository.verifyUserCredentials(loginUser);

    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });
    await this._authenticationRepository.addToken(refreshToken);

    return new LoggedInUser({ accessToken, refreshToken });
  }

  async refreshAuthentication(refreshToken) {
    const refreshAuthenticationPayload = new RefreshToken(refreshToken);
    const { userId } = this._tokenManager.verifyRefreshToken(
      refreshAuthenticationPayload.refreshToken,
    );
    const accessToken = this._tokenManager.generateAccessToken({
      userId,
    });

    return accessToken;
  }

  async deleteAuthentication(token) {
    const refreshToken = new RefreshToken({ refreshToken: token });
    await this._authenticationRepository.verifyRefreshToken(
      refreshToken.refreshToken,
    );
    await this._authenticationRepository.deleteRefreshToken(
      refreshToken.refreshToken,
    );
  }
}
module.exports = AuthenticationUseCase;
