/* eslint-disable func-names, space-before-function-paren, wrap-iife, prefer-arrow-callback, no-unused-vars, consistent-return, camelcase, comma-dangle, max-len, class-methods-use-this */
/* global Mousetrap */

// Zen Mode (full screen) textarea
//
/*= provides zen_mode:enter */
/*= provides zen_mode:leave */

import 'vendor/jquery.scrollTo';
import Dropzone from 'dropzone';
import 'mousetrap';
import 'mousetrap/plugins/pause/mousetrap-pause';

window.Dropzone = Dropzone;

//
// ### Events
//
// `zen_mode:enter`
//
// Fired when the "Edit in fullscreen" link is clicked.
//
// **Synchronicity** Sync
// **Bubbles** Yes
// **Cancelable** No
// **Target** a.js-zen-enter
//
// `zen_mode:leave`
//
// Fired when the "Leave Fullscreen" link is clicked.
//
// **Synchronicity** Sync
// **Bubbles** Yes
// **Cancelable** No
// **Target** a.js-zen-leave
//

export default class ZenMode {
  constructor() {
    this.active_backdrop = null;
    this.active_textarea = null;
    $(document).on('click', '.js-zen-enter', function(e) {
      e.preventDefault();
      return $(e.currentTarget).trigger('zen_mode:enter');
    });
    $(document).on('click', '.js-zen-leave', function(e) {
      e.preventDefault();
      return $(e.currentTarget).trigger('zen_mode:leave');
    });
    $(document).on('zen_mode:enter', (function(_this) {
      return function(e) {
        return _this.enter($(e.target).closest('.md-area').find('.zen-backdrop'));
      };
    })(this));
    $(document).on('zen_mode:leave', (function(_this) {
      return function(e) {
        return _this.exit();
      };
    })(this));
    $(document).on('keydown', function(e) {
      // Esc
      if (e.keyCode === 27) {
        e.preventDefault();
        return $(document).trigger('zen_mode:leave');
      }
    });
  }

  enter(backdrop) {
    Mousetrap.pause();
    this.active_backdrop = $(backdrop);
    this.active_backdrop.addClass('fullscreen');
    this.active_textarea = this.active_backdrop.find('textarea');
    // Prevent a user-resized textarea from persisting to fullscreen
    this.active_textarea.removeAttr('style');
    return this.active_textarea.focus();
  }

  exit() {
    if (this.active_textarea) {
      Mousetrap.unpause();
      this.active_textarea.closest('.zen-backdrop').removeClass('fullscreen');
      this.scrollTo(this.active_textarea);
      this.active_textarea = null;
      this.active_backdrop = null;
      return Dropzone.forElement('.div-dropzone').enable();
    }
  }

  scrollTo(zen_area) {
    return $.scrollTo(zen_area, 0, {
      offset: -150
    });
  }
}
