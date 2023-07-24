const createButton = (mod, isDisabled) => {
  const button = document.createElement('button');
  button.innerHTML = isDisabled ? 'Downloaded' : 'Download';
  button.style.backgroundColor = isDisabled ? '#333333' : '#ff784d';
  button.disabled = isDisabled;
  button.style.color = '#fff';
  button.style.padding = '0.5rem 1rem';
  button.style.fontSize = '1rem';
  if (!isDisabled) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      chrome.runtime.sendMessage({ text: 'download', mod });
    });
  }

  return button;
};

const getModSlug = (url) => {
  if (url) {
    return url.slice(url.lastIndexOf('/') + 1);
  }
  return null;
};

const loadSearchPage = () => {
  const projectCards = document.querySelectorAll('.project-card');
  chrome.storage.local.get('download-list', (result) => {
    const downloadList = result['download-list'];
    projectCards.forEach((projectCard) => {
      const mod = {
        name: projectCard?.querySelector('.name > span')?.innerText || null,
        url: projectCard?.querySelector('.name')?.href || null,
        slug: getModSlug(projectCard?.querySelector('.name')?.href),
        icon: projectCard?.querySelector('#row-image')?.src || null,
      };

      const menuButton = projectCard?.querySelector('#menuButton');
      if (menuButton) {
        menuButton.innerHTML = '';
      }

      const button = createButton(
        mod,
        downloadList.some((item) => item.slug === mod.slug),
      );
      menuButton?.appendChild(button);
    });
  });
};

const loadModPage = () => {
  const projectHeader = document.querySelector('.project-header');
  chrome.storage.local.get('download-list', (result) => {
    const downloadList = result['download-list'];
    const mod = {
      name: projectHeader?.querySelector('h1')?.innerText || null,
      url: window.location.href,
      slug: getModSlug(window.location.href),
      icon: projectHeader?.querySelector('#row-image').src,
    };

    const menuButton = projectHeader?.querySelector('#menuButton');
    if (menuButton) {
      menuButton.innerHTML = '';
    }
    const button = createButton(
      mod,
      downloadList.some((item) => item.slug === mod.slug),
    );
    menuButton?.appendChild(button);
  });
};

const load = () => {
  const currentUrl = window.location.href;
  if (currentUrl.includes('curseforge.com/minecraft/search')) {
    loadSearchPage();
  } else if (currentUrl.includes('curseforge.com/minecraft/mc-mods')) {
    loadModPage();
  }
};

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const loadWithDebounce = debounce(load, 200);

(() => {
  load();
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (
        (mutation.type === 'childList' && mutation.target.nodeName === 'BODY') ||
        mutation.type === 'attributes'
      ) {
        loadWithDebounce();
      }
    });
  });

  const targetNode = document.body;
  const observerOptions = {
    childList: true,
    subtree: true,
    attributes: true,
  };

  observer.observe(targetNode, observerOptions);
  chrome.runtime.onMessage.addListener((message) => {
    if (message.text === 'reload' || message.text === 'download-list-updated') {
      load();
    }
  });
})();
