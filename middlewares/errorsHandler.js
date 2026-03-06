function errorsHandler(err, req, res, next) {
  console.log("[ERROR]: " + err.message);
  res.status(500).json({
    message: "Internal server error",
    success: false,
  });
}

module.exports = errorsHandler;
