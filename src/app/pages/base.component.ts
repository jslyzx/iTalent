import constants, {MIN_WINDOW_HEIGHT} from '../utils/utils';

export class BaseComponent {

  isMobile = constants.isMobile();
  currentWindowHeight = document.documentElement.clientHeight;
  minWindowHeight = MIN_WINDOW_HEIGHT;

  constructor() {
  }

  showFooter() {
    return this.isMobile && (this.currentWindowHeight > this.minWindowHeight);
  }

}
