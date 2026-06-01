/**
 * Centralized runtime loader for Mapbox libraries.
 * Loads scripts dynamically AFTER the app has hydrated.
 * Preserves original globals (window.mapboxgl, window.mapboxSdk).
 */

let loadPromise = null;

const MAPBOX_SDK_URL = '/static/scripts/mapbox/mapbox-sdk@0.16.2/mapbox-sdk.min.js';
const MAPBOX_GL_JS_URL = 'https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js';
const MAPBOX_GL_CSS_URL = 'https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css';

const injectScript = (src, id) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    document.head.appendChild(script);
  });
};

const injectStyle = href => {
  if (document.querySelector(`link[href="${href}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.crossOrigin = 'anonymous';

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));

    document.head.appendChild(link);
  });
};

export const loadMapbox = accessToken => {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    // Load SDK first
    await injectScript(MAPBOX_SDK_URL, 'mapbox-sdk');

    // Then load GL JS + CSS in parallel
    await Promise.all([
      injectStyle(MAPBOX_GL_CSS_URL),
      injectScript(MAPBOX_GL_JS_URL, 'mapbox-gl-js'),
    ]);

    // Set access token once libraries are ready
    if (accessToken && window.mapboxgl && !window.mapboxgl.accessToken) {
      window.mapboxgl.accessToken = accessToken;
    }

    return true;
  })();

  return loadPromise;
};

// For debugging
export const isMapboxLoaded = () => {
  return typeof window !== 'undefined' && !!window.mapboxgl && !!window.mapboxSdk;
};
