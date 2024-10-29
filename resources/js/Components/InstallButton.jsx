import React, { useState, useEffect } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired'); // للتحقق من إطلاق الحدث
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // إظهار الزر عند إطلاق الحدث
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false); // إخفاء الزر بعد الاستجابة
      });
    }
  };

  return (
    isVisible && (
      <button onClick={handleInstallClick}>
        تثبيت التطبيق
      </button>
    )
  );
};

export default InstallButton;
