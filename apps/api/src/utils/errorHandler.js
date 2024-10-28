export const handleErrorResponse = (res, statusCode, message, error) => {
  if (!error) {
    return res.status(statusCode).json({
      status: statusCode,
      message: message || 'An unexpected error occurred.'
    });
  }

  // If error is an instance of Mongoose ValidationError
  if (error.name && error.name === 'ValidationError') {
    return res.status(statusCode).json({
      status: statusCode,
      message: 'Validation error',
      errors: error.errors
    });
  }

  // Handle duplicate key error
  if (error.code === 11000) {
    const [[field]] = Object.entries(error.keyValue);

    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    const errorMessage = `This ${fieldName} already exists.`;

    return res.status(400).json({
      status: 400,
      message: errorMessage
    });
  }

  // For all other errors
  return res.status(statusCode).json({
    status: statusCode,
    message: message || 'An unexpected error occurred.',
    error: error.message || error
  });
};
