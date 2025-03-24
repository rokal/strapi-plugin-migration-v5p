export default {
  default: ({ env }) => ({
    autoStart: env('MIGRATION_AUTO_START') === 'true',
    migrationFolderPath: env('MIGRATION_FOLDER_PATH') ?? 'migrations',
  }),
  validator() {},
};
