exports.setUserInfo = (request) => {
  const userInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email
  }
  return userInfo
}

exports.getUserInfo = (user) => {
  const userInfo = user.toObject()
  // Deleting properties that might be sensitive
  delete userInfo.password
  delete userInfo.__v
  return userInfo
}
