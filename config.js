// TODO: Заменить на реальный юзернейм заказчика
export const ADMIN_USERNAME = 'Konoval99';
export const ADMIN_ID = 673353547;
export const BRAND = 'Fitness Bot';

export function dm(text) {
  const url = `https://t.me/${ADMIN_USERNAME}?text=${encodeURIComponent(text)}`;
  window.Telegram?.WebApp?.openTelegramLink?.(url) || window.open(url, '_blank');
}
