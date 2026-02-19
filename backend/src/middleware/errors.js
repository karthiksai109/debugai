export function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}
