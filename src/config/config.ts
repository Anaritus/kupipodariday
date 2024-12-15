const applicationConfig = process.env;

export const jwtSecretProvider = {
  provide: 'CONFIG',
  useValue: { JWT_SECRET: applicationConfig.JWT_SECRET },
};
