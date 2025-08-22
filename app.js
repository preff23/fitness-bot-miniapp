/* Telegram Mini App - Fitness Bot - DARING SPORTS STYLE */
import { ADMIN_USERNAME, BRAND, dm } from './config.js';

(function () {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  
  // Bottom Sheet elements
  const bottomSheetOverlay = document.getElementById('bottomSheetOverlay');
  const bottomSheet = document.getElementById('bottomSheet');
  const bottomSheetTitle = document.getElementById('bottomSheetTitle');
  const bottomSheetDescription = document.getElementById('bottomSheetDescription');
  const bottomSheetContent = document.getElementById('bottomSheetContent');

  // Submenu data
  const submenuData = {
    gym: {
      title: 'ТРЕНИРОВКА В ЗАЛЕ',
      description: 'Выберите программу для тренировок в спортзале',
      items: [
        { text: '8 ТРЕНИРОВОК', message: 'Зал: 8 тренировок' },
        { text: '12 ТРЕНИРОВОК', message: 'Зал: 12 тренировок' },
        { text: 'КОМБО (12 + ПП + СОПРОВОЖДЕНИЕ)', message: 'Зал: Комбо' },
        { text: 'ИНДИВИДУАЛЬНЫЙ ПЛАН ПИТАНИЯ', message: 'Зал: Индивидуальный план питания' }
      ]
    },
    outdoor: {
      title: 'ТРЕНИРОВКА УЛИЦА',
      description: 'Выберите программу для тренировок на улице',
      items: [
        { text: '8 ТРЕНИРОВОК', message: 'Улица: 8 тренировок' },
        { text: '12 ТРЕНИРОВОК', message: 'Улица: 12 тренировок' },
        { text: 'КОМБО (12 + ПП + СОПРОВОЖДЕНИЕ)', message: 'Улица: Комбо' },
        { text: 'ИНДИВИДУАЛЬНЫЙ ПЛАН ПИТАНИЯ', message: 'Улица: Индивидуальный план питания' }
      ]
    },
    home: {
      title: 'ТРЕНИРОВКИ ДОМА',
      description: 'Выберите программу для домашних тренировок',
      items: [
        { text: '8 ТРЕНИРОВОК', message: 'Дом: 8 тренировок' },
        { text: 'КОМБО (12 + ПП + СОПРОВОЖДЕНИЕ)', message: 'Дом: Комбо' }
      ]
    },
    combo: {
      title: 'СМЕШАННЫЕ ТРЕНИРОВКИ',
      description: 'Максимальная программа с разными видами активности',
      items: [
        { text: 'МЕГА КОМБО (16 ТРЕНИРОВОК: ЗАЛ + УЛИЦА + ДОМ + ПП + СОПРОВОЖДЕНИЕ)', message: 'Смешанные: Мега комбо 16 тренировок, зал+улица+дом+ПП+сопровождение' }
      ]
    }
  };

  function initTelegram() {
    if (!tg) return;
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#0D0D0D");
    tg.setBackgroundColor("#0D0D0D");
    
    // Handle back button
    tg.onEvent("backButtonClicked", closeBottomSheet);
    
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

  function showBottomSheet(submenuKey) {
    const data = submenuData[submenuKey];
    if (!data) return;

    hapticImpact('medium');
    
    // Update content
    bottomSheetTitle.textContent = data.title;
    bottomSheetDescription.textContent = data.description;
    
    // Clear and populate items
    bottomSheetContent.innerHTML = '';
    data.items.forEach(item => {
      const button = document.createElement('button');
      button.className = 'submenu-item';
      button.innerHTML = `
        <div class="icon">⚡</div>
        <span>${item.text}</span>
      `;
      
      button.addEventListener('click', () => {
        hapticImpact('light');
        dm(item.message);
        closeBottomSheet();
      });
      
      bottomSheetContent.appendChild(button);
    });

    // Show bottom sheet
    bottomSheetOverlay.classList.add('active');
    bottomSheet.classList.add('active');
    
    // Show back button in Telegram
    if (tg && tg.BackButton) {
      tg.BackButton.show();
    }
  }

  function closeBottomSheet() {
    bottomSheetOverlay.classList.remove('active');
    bottomSheet.classList.remove('active');
    
    // Hide back button in Telegram
    if (tg && tg.BackButton) {
      tg.BackButton.hide();
    }
  }

  function routeAction(action) {
    switch (action) {
      case "free_consult":
        hapticImpact('medium');
        dm('Здравствуйте! Хочу бесплатную вводную тренировку + консультацию.');
        break;
      case "marathon_signup":
        hapticImpact('medium');
        dm('Здравствуйте! Хочу записаться на марафон.');
        break;
      case "nutrition_plan":
        hapticImpact('medium');
        dm('Здравствуйте! Нужен индивидуальный план питания.');
        break;
      case "ask_question":
        hapticImpact('medium');
        dm('Здравствуйте! У меня вопрос: …');
        break;
    }
  }

  function wireMenu() {
    document.querySelectorAll('.menu-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const submenu = btn.getAttribute('data-submenu');
        
        hapticImpact('light');
        
        if (submenu) {
          showBottomSheet(submenu);
        } else {
          routeAction(action);
        }
      });
    });
  }

  function wireBottomSheet() {
    // Close on overlay click
    bottomSheetOverlay.addEventListener('click', closeBottomSheet);
    
    // Prevent closing when clicking on bottom sheet content
    bottomSheet.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function main() {
    initTelegram();
    wireMenu();
    wireBottomSheet();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();