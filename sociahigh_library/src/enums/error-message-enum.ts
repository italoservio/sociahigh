import {ErrorCodeEnum} from './error-code-enum';

export const ErrorMessageEnum = {
  [ErrorCodeEnum.ERR_VALIDATION]: 'Bad validation',
  [ErrorCodeEnum.ERR_NO_PARAMS]: 'The necessary params were not provided',
  [ErrorCodeEnum.ERR_INTERNAL]: 'Internal and unexpected error',
  [ErrorCodeEnum.ERR_NOT_FOUND]: 'No registers were found with informed params',
  [ErrorCodeEnum.ERR_CONFLICT]: 'This register conflicts with an existing one',
};
