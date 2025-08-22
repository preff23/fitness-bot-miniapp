// TODO: Заменить на реальный юзернейм заказчика
export const ADMIN_USERNAME = 'afterlyf3';
export const BRAND = 'Fitness Bot';

export function dm(text) {
  const url = `https://t.me/${ADMIN_USERNAME}?text=${encodeURIComponent(text)}`;
  window.Telegram?.WebApp?.openTelegramLink?.(url) || window.open(url, '_blank');
}
