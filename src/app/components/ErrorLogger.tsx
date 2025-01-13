const ErrorLogger = {
  logError: (error: any) => {
    if (!error) {
      console.error('No error provided to log.');
      return;
    }

    if (error.isAxiosError) {
      // Logging Axios error details
      console.error('Axios Error Details:\n' + JSON.stringify({
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack,
        config: error.config,
        response: error.response ? {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        } : null,
      }, null, 2)); // Two-space indentation
    } else {
      // Logging generic error
      console.error('Error Details:\n' + JSON.stringify({
        message: error.message,
        name: error.name,
        stack: error.stack,
        ...error, // Spread any additional properties
      }, null, 2)); // Two-space indentation
    }
  },
};

export default ErrorLogger;
