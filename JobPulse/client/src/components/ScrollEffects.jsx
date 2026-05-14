import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const revealSelectors = [
  '.reveal-on-scroll',
  '.surface-card',
  '.card',
  '.job-card',
  '.category-card',
  '.location-card'
].join(',');

const getRevealDelay = (element) => {
  const parent = element.parentElement;
  if (!parent) return 0;

  const siblings = Array.from(parent.children).filter((child) => child.matches?.(revealSelectors));
  const index = Math.max(0, siblings.indexOf(element));
  return Math.min(index * 45, 270);
};

const isAlreadyInView = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewportHeight * 0.96 && rect.bottom > 0;
};

const ScrollEffects = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      document.documentElement.classList.remove('motion-ready');
      return undefined;
    }

    document.documentElement.classList.add('motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    const observeElement = (element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.dataset.revealBound === 'true') {
        element.classList.add('is-visible');
        return;
      }
      if (element.closest('[data-no-reveal]')) return;
      if (element.closest('.scroll-reveal') && !element.classList.contains('scroll-reveal')) return;

      element.dataset.revealBound = 'true';
      element.style.setProperty('--reveal-delay', `${getRevealDelay(element)}ms`);
      element.classList.add('scroll-reveal');

      if (isAlreadyInView(element)) {
        window.requestAnimationFrame(() => {
          element.classList.add('is-visible');
          observer.unobserve(element);
        });
        return;
      }

      observer.observe(element);

      window.setTimeout(() => {
        if (!document.documentElement.contains(element)) return;
        element.classList.add('is-visible');
        observer.unobserve(element);
      }, 1300 + getRevealDelay(element));
    };

    const scan = () => {
      document.querySelectorAll(revealSelectors).forEach(observeElement);
    };

    let frameId = window.requestAnimationFrame(scan);
    const mutationObserver = new MutationObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(scan);
    });

    mutationObserver.observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, search]);

  return null;
};

export default ScrollEffects;
