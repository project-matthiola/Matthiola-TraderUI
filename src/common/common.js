exports.install = function (Vue, options) {
  Vue.prototype.changeMainStyle = function () {
    if (this.$store.state.isCollapse === false) {
      return {
        'padding-top': '65px !important',
        'padding-left': '220px !important'
      }
    } else {
      return {
        'padding-top': '65px !important'
      }
    }
  };
};
