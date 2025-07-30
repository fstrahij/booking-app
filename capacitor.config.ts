import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'booking-app',
  webDir: 'www',
  plugins: {
    Camera: {
      // optional Camera plugin config here
      photoSize: 'medium',
    }
  }
};

export default config;
