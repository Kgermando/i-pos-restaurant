import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ictech.iposrestaurant',
  appName: 'i-pos-restaurant',
  webDir: 'dist/i-pos-restaurant/browser',
  // bundledWebRuntime: false,
  //  hideLogs: true,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      androidIsEncryption: false,
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation: '/Volumes/Development_Lacie/Development/CapacitorDatabases',
      electronLinuxLocation: 'Databases'
    }
  }
};

export default config;