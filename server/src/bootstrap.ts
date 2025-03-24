import type { Core } from '@strapi/strapi';
import type { Config } from './types';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const config = strapi.config.get<Config>('plugin.migrations5p');
  if (config.autoStart) {
    await strapi.plugin('migrations5p').service('migrations').migrations();
  }
};

export default bootstrap;
