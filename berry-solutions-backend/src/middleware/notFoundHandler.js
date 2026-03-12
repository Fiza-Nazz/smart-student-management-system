// ============================================================
// NOT FOUND HANDLER
// ============================================================

const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    error.statusCode = 404;
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`,
    });
};

module.exports = notFoundHandler;
