import React, { useState, useEffect } from 'react';

const ThemeImage = ({ lightSrc, darkSrc, alt }) => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));

  // 监听 data-theme 的变化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      setTheme(newTheme);
    });

    // 监听 HTML 元素的属性变化
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <img
      src={theme === 'dark' ? darkSrc : lightSrc}
      alt={alt}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default ThemeImage;
