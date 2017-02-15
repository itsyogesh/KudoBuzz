exports.setUserInfo = (request) => {
  const userInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email
  }

  return userInfo
}
