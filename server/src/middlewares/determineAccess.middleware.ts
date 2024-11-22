// Middlewares/determineAccess.middleware.ts
export const determineAccessType = (isInternal: boolean) => {
  return (req: any, res: any, next: any) => {
    // If it's an internal route, check the API key first
    if (isInternal) {
      const apiKey = req.headers['x-api-key']; // Custom header for API key

      // Check if the API key is missing or invalid
      if (!apiKey || apiKey !== 'your-expected-api-key') {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid or missing API Key for internal route' });
      }
    }

    // After API key check (for internal routes), set the isInternal flag
    req.isInternal = isInternal;

    // Proceed to the next middleware or route handler
    next();
  };
};
