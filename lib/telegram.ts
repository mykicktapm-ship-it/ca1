export type TelegramWebApp = typeof import('@twa-dev/sdk').default;

interface TelegramWebAppData {
  user?: {
    id: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

let webAppPromise: Promise<TelegramWebApp | null> | null = null;

export const initializeTelegramWebApp = async (): Promise<TelegramWebApp | null> => {
  if (typeof window === 'undefined') return null;
  if (webAppPromise) return webAppPromise;

  webAppPromise = import('@twa-dev/sdk')
    .then(({ default: WebApp }) => {
      const instance = typeof window !== 'undefined' && (window as any).Telegram?.WebApp ? (window as any).Telegram.WebApp : WebApp;
      return instance as TelegramWebApp;
    })
    .catch((err) => {
      console.error('Telegram WebApp init failed', err);
      return null;
    });

  return webAppPromise;
};

export const parseInitData = (initData: string): TelegramWebAppData | null => {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const userString = params.get('user');

  if (!userString) return null;

  try {
    const user = JSON.parse(userString);
    return { user };
  } catch (err) {
    console.warn('Failed to parse Telegram init data', err);
    return null;
  }
};

export const validateInitData = (initData: string): TelegramWebAppData | null => {
  // TODO: add signature validation against Telegram bot token hash
  return parseInitData(initData);
};

export const extractUserId = (initData: string): string | null => {
  const data = validateInitData(initData);
  const id = data?.user?.id;
  return id ? String(id) : null;
};
