interface TelegramWebAppData {
  user?: {
    id: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

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
