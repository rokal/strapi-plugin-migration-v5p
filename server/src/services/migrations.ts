import type { Core } from '@strapi/strapi';

import fs from 'fs';
import path from 'path';
import { Config } from 'src/types';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  checkFile: function (dir: string, file: string, currentVersion: number) {
    const filePath = path.join(dir, file);
    const fileVersion = this.getVersionFromFile(file);
    return (
      this.isFile(filePath) && // Is a file
      this.checkIfTheFileNameIsAutorized(file) && // Use correct file name pattern
      this.checkIfTheFileVersionIsAuthorized(fileVersion, currentVersion)
    ); // Is not already migrated
  },

  async migrations() {
    strapi.log.info('--------  MIGRATION STARTED  --------');

    if (!this.checkMigrationsFolderExist()) {
      strapi.log.warn('No migration directory found.');
      strapi.log.info('--------  MIGRATION FINISHED  --------');
      return;
    }

    await this.initVersion();
    const currentVersion = await this.getCurrentVersion();

    strapi.log.info(`Current migration version : v${currentVersion}`);

    let dir = this.getPathFolder();
    const files = fs
      .readdirSync(dir)
      .filter((file) => this.checkFile(dir, file, currentVersion))
      .sort((fileA, fileB) => {
        const v1 = this.getVersionFromFile(fileA);
        const v2 = this.getVersionFromFile(fileB);

        return Number(v1) - Number(v2);
      });

    let lastVersionMigrated = currentVersion;
    if (!files || files.length === 0) {
      strapi.log.info('No files found. Migration skipped.');
    } else {
      if (process.platform === 'win32') {
        dir = 'file:///' + dir.replace(/\\/g, '/');
      }

      for (const file of files) {
        strapi.log.info(`File: ${file} in progress...`);
        try {
          const filePath = path.join(dir, file);
          const module = await import(filePath);
          await module.default();
          strapi.log.info('Status: migrated');

          const newVersion = this.getVersionFromFile(file);
          lastVersionMigrated = newVersion;
          await this.updateVersion(newVersion);
        } catch (e) {
          strapi.log.error('Status: failed');
          strapi.log.error(e.stack);
          strapi.log.info(`Last version migrated : v${lastVersionMigrated}`);
          throw new Error('Error during the migration');
        }
      }
    }

    strapi.log.info(`Last version migrated : v${lastVersionMigrated}`);
    strapi.log.info('--------  MIGRATION FINISHED  --------');
  },

  getFileRegex() {
    return 'v([0-9]+).*\.js';
  },

  checkMigrationsFolderExist() {
    return fs.existsSync(this.getPathFolder());
  },

  getPathFolder() {
    const config = strapi.config.get<Config>('plugin::migrations5p');
    return path.resolve(process.cwd(), config.migrationFolderPath);
  },

  getVersionFromFile(filename: string) {
    const regex = this.getFileRegex();
    const matches = filename.match(regex);
    return matches && matches[1] ? Number(filename.match(regex)[1]) : 0;
  },

  checkIfTheFileNameIsAutorized(file: string) {
    return file.match(this.getFileRegex());
  },

  isFile(filePath: string) {
    const stat = fs.statSync(filePath);
    return stat && stat.isFile();
  },

  checkIfTheFileVersionIsAuthorized(fileVersion: number, currentVersion: number) {
    return fileVersion > currentVersion;
  },

  checkIfTheFileVersionAlreadyExist(file: string, files: string[]) {
    const version = this.getVersionFromFile(file);
    const occ = files.reduce(
      (a, file) => (this.getVersionFromFile(file) === version ? a + 1 : a),
      0
    );
    return occ > 1;
  },

  async getCurrentVersion() {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'migrations5p',
    });

    const version = await pluginStore.get({ key: 'version' });
    return Number(version);
  },

  async updateVersion(version: number) {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'migrations5p',
    });

    await pluginStore.set({ key: 'version', value: version });
  },

  async initVersion() {
    const currentVersion = await this.getCurrentVersion();
    if (currentVersion === null) {
      await this.updateVersion(0);
    }
  },
});

export default service;
