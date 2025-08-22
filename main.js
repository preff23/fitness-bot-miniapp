/* Telegram Mini App for Fitness Trainer */
(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  function initTelegram() {
    if (!tg) return;
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#1A1A1A");
    tg.setBackgroundColor("#1A1A1A");
    tg.onEvent("themeChanged", () => {
      // Could adapt CSS variables if needed
    });
  }

  function hapticImpact(style) {
    try {
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style || "light");
      }
    } catch (_) {}
  }

  function showToast(text) {
    if (tg && tg.showPopup) {
      tg.showPopup({ title: "", message: text, buttons: [{ type: "ok" }] });
    } else {
      alert(text);
    }
  }

  function routeAction(action) {
    switch (action) {
      case "free_consult":
        showToast("Бесплатная тренировка + консультация");
        break;
      case "gym_training":
        showToast("Тренировка в зале");
        break;
      case "outdoor_training":
        showToast("Тренировка улица");
        break;
      case "marathon_signup":
        showToast("Запись на марафон");
        break;
      case "home_workouts":
        showToast("Тренировки дома");
        break;
      case "combo_training":
        showToast("Смешанные тренировки (мега комбо)");
        break;
      case "nutrition_plan":
        showToast("Индивидуальный план питания");
        break;
      case "ask_question":
        showToast("Задать свой вопрос");
        break;
    }
  }

  function wireMenu() {
    document.querySelectorAll('.menu-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        hapticImpact('light');
        routeAction(action);
      });
    });
  }

  function wireBottomBar() {
    document.querySelectorAll('.bottom-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-bottom');
        hapticImpact('medium');
        if (action === 'catalog') {
          showToast('Каталог программ');
        } else if (action === 'question') {
          routeAction('ask_question');
        } else if (action === 'invite') {
          const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent('https://t.me') + '&text=' + encodeURIComponent('Присоединяйся к моим тренировкам!');
          if (tg && tg.openTelegramLink) {
            tg.openTelegramLink(shareUrl);
          } else if (tg && tg.openLink) {
            tg.openLink(shareUrl);
          } else {
            window.open(shareUrl, '_blank');
          }
        }
      });
    });
  }

  function main() {
    initTelegram();
    wireMenu();
    wireBottomBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();


