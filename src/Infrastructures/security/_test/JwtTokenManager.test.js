const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');
require('dotenv').config();

describe('JwtTokenManager', () => {
  describe('generateAccessToken function', () => {
    it('should generate access token correctly', () => {
      const spyGenerateAccessToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt);

      const accessToken = jwtTokenManager.generateAccessToken({ userId: 1 });

      expect(typeof accessToken).toEqual('string');
      expect(spyGenerateAccessToken).toBeCalledWith(
        { userId: 1 },
        process.env.ACCESS_TOKEN_KEY,
      );
    });
  });
  describe('generateRefreshToken', () => {
    const spyGenerateRefreshToken = jest.spyOn(Jwt.token, 'generate');
    const jwtTokenManager = new JwtTokenManager(Jwt);

    const refreshToken = jwtTokenManager.generateRefreshToken({ userId: 1 });

    expect(typeof refreshToken).toEqual('string');
    expect(spyGenerateRefreshToken).toBeCalledWith(
      { userId: 1 },
      process.env.REFRESH_TOKEN_KEY,
    );
  });
  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when token is Invalid', () => {
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const jwtTokenManager = new JwtTokenManager(Jwt);

      expect(() => {
        jwtTokenManager.verifyRefreshToken('invalidtoken');
      }).toThrow(InvariantError);
      expect(spyDecode).toBeCalledWith('invalidtoken');
    });
    it('should not throw InvariantError when token is valid', () => {
      const jwtTokenManager = new JwtTokenManager(Jwt);

      const refreshToken = jwtTokenManager.generateRefreshToken({ userId: 1 });
      expect(() => {
        jwtTokenManager.verifyRefreshToken(refreshToken);
      }).not.toThrowError();
    });
  });
});
