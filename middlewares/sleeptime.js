function sleeptime(req, res, next) {
  const now = new Date();
  const hours = now.getHours();

  if (hours > 22 || hours < 7) {
    return res.status(403).json({
      success: false,
      message: "Vai a dormire, è tardi",
    });
  }

  next();
}

module.exports = sleeptime;
