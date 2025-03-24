# Strapi Plugin Migration v5p

> ⚠️ **Version Warning**: This plugin is specifically designed for Strapi v5. If you're using Strapi v4 or earlier, please use the original [strapi-plugin-migrations](https://github.com/TonyDeplanque/strapi-plugin-migrations) by Tony Deplanque.

A migration plugin for Strapi v5, inspired by [strapi-plugin-migrations](https://github.com/TonyDeplanque/strapi-plugin-migrations).

## Overview

This plugin provides migration capabilities for Strapi v5, allowing you to manage database schema changes and data transformations in a structured way. It's based on the original work by [Tony Deplanque](https://github.com/TonyDeplanque) but adapted for Strapi v5 compatibility.

## Installation

```bash
npm install strapi-plugin-migration-v5p
# or
yarn add strapi-plugin-migration-v5p
```

## Configuration & Usage

To enable and configure the plugin, add the following to your `config/plugins.ts` (or `config/plugins.js`):

```typescript
export default () => ({
  migrations5p: {
    enabled: true,
    config: {
      autoStart: true,
      migrationFolderPath: process.env.MIGRATION_PATH,
    },
  },
});
```

This configuration:

- Enables the plugin
- Sets `autoStart` to true to automatically run migrations on startup
- Uses an environment variable `MIGRATION_PATH` to specify where your migration files are located

For more detailed configuration options and advanced usage examples, please refer to the original [strapi-plugin-migrations documentation](https://github.com/TonyDeplanque/strapi-plugin-migrations).

## Credits

This plugin is a fork of [strapi-plugin-migrations](https://github.com/TonyDeplanque/strapi-plugin-migrations) by [Tony Deplanque](https://github.com/TonyDeplanque). All credit for the original implementation goes to him.

## License

This project is licensed under the same terms as the original [strapi-plugin-migrations](https://github.com/TonyDeplanque/strapi-plugin-migrations).
