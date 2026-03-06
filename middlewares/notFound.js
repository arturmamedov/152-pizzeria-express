function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: "Pagina non trovata",
  });
}

module.exports = notFound;
