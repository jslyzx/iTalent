// events list.
export const EVENT_AUTH_ERROR = 'event.auth.error';
export const EVENT_TOAST_LOADING = 'event.toast.loading';
export const EVENT_TOAST_ASYNC_LOADING = 'event.toast.async.loading';
export const EVENT_TOAST_SUCCESS = 'event.toast.success';
export const EVENT_TOAST_ERROR = 'event.toast.error';
export const EVENT_SHOW_TOPTIPS = 'event.show.toptips';
export const MIN_WINDOW_HEIGHT = 570;

// utils function
export default {
  isIOS() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
  },
  isMobile() {
    return /(Mobile)/i.test(navigator.userAgent);
  },
  getUrlVars(url) {
    let hash;
    const myJson = {};
    const hashes = url.slice(url.indexOf('?') + 1).split('&');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      myJson[hash[0]] = hash[1];
      // If you want to get in native datatypes
      // myJson[hash[0]] = JSON.parse(hash[1]);
    }
    return myJson;
  }
};

