const AuthenticationUseCase = require('../../../../Applications/use_cases/AuthenticationUseCase');

class AuthenticationHandlers {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authenticationUsecase = this._container.getInstance(
      AuthenticationUseCase.name,
    );
    const loggedInUser = await authenticationUsecase.getAuthentication(
      request.payload,
    );

    const response = h.response({
      status: 'success',
      data: loggedInUser,
    });
    response.code(201);

    return response;
  }

  async putAuthenticationHandler(request) {
    const authenticationUsecase = this._container.getInstance(
      AuthenticationUseCase.name,
    );

    const accessToken = await authenticationUsecase.refreshAuthentication(
      request.payload,
    );

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const authenticationUsecase = this._container.getInstance(
      AuthenticationUseCase.name,
    );
    const { refreshToken } = request.payload;

    await authenticationUsecase.deleteAuthentication(refreshToken);

    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationHandlers;
