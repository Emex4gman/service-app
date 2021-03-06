const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, vendorService, tokenService, emailService, notificationService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json({ user, tokens });
});

const registerVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  const tokens = await tokenService.generateAuthTokens(vendor);
  res.status(httpStatus.CREATED).json({ vendor, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, fcmToken } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, fcmToken);
  const tokens = await tokenService.generateAuthTokens(user);
  res.json({ user, tokens });
});

const loginVendor = catchAsync(async (req, res) => {
  const { email, password, fcmToken } = req.body;
  const vendor = await authService.loginVendorWithEmailAndPassword(email, password, fcmToken);
  const tokens = await tokenService.generateAuthTokens(vendor);
  // console.log(vendor);
  res.json({ vendor, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.json({ ...tokens });
});

const refreshVendorTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshVendorAuth(req.body.refreshToken);
  res.json({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { code, user } = await authService.resetPassword(req.body);
  await emailService.sendResetPasswordEmail(code, user);
  res.json({ code, user });
});

const forgotVendorPassword = catchAsync(async (req, res) => {
  const { code, user } = await authService.resetVendorPassword(req.body);
  await emailService.sendResetPasswordEmail(code, user);
  res.json({ code, user });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user, req.body);
  res.json({});
});

const changeVendorPassword = catchAsync(async (req, res) => {
  await authService.changeVendorPassword(req.user, req.body);
  res.json({});
});

module.exports = {
  register,
  registerVendor,
  login,
  loginVendor,
  refreshTokens,
  refreshVendorTokens,
  forgotPassword,
  forgotVendorPassword,
  changePassword,
  changeVendorPassword,
};
