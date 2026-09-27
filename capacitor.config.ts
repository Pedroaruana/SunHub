import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.sunhub.app',
  appName: 'SunHub',
  webDir: 'dist',
  // o app abre direto no escuro, senao pisca branco antes da abertura do eclipse
  backgroundColor: '#03050a',
  android: {
    backgroundColor: '#03050a'
  }
}

export default config
