export const REPOSITORY_ERRORS = {
  CONNECTION_FAILED: 'Failed to connect to the database',
  RECORD_NOT_FOUND: (field: string) => `Requested ${field} not found`,
  DUPLICATE_RECORD: (field: string) => `Duplicate ${field}: The provided ${field} already exists.`,
  QUERY_EXECUTION_FAILED: 'Database query execution failed',
  RECORD_ALEADY_EXISTS: (field: string) => `Record ${field} already exists`,
};

  export const SERVICE_ERRORS = {
    RESOURCE_EXISTS: 'The resource already exists',
    RESOURCE_NOT_FOUND: 'The requested resource was not found',
    INVALID_INPUT: 'Invalid input provided',
    PROCESSING_ERROR: 'An error occurred while processing the request',
    DEPENDENCY_FAILURE: 'A dependent service or repository failed',
  };
  
  export const CONTROLLER_ERRORS = {
    MISSING_PARAMETERS: 'Required parameters are missing from the request',
    INVALID_REQUEST_BODY: 'The request body is invalid or malformed',
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this resource',
    RESOURCE_NOT_FOUND: 'The requested endpoint does not exist',
    INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  };
  

  export const GENERIC_ERROR_MESSAGE = "Something went wrong"