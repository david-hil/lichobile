var utils = require('../../../utils');
var helper = require('../../helper');

function renderBackwardButton(ctrl) {
  return m('button.game_action[data-icon=I]', {
    config: helper.ontouch(function() {
      if (ctrl.ply > 0) ctrl.jump(ctrl.ply - 1);
    }),
    className: helper.classSet({
      disabled: !(ctrl.ply > 0)
    })
  });
}

function renderForwardButton(ctrl, nbMoves) {
  return m('button.game_action[data-icon=H]', {
    config: helper.ontouch(function() {
      if (ctrl.ply < ctrl.situations.length - 1) ctrl.jump(ctrl.ply + 1);
    }),
    className: helper.classSet({
      disabled: !(ctrl.ply < ctrl.situations.length - 1)
    })
  });
}

module.exports.renderButtons = function(ctrl) {
  return [
    renderBackwardButton(ctrl),
    renderForwardButton(ctrl)
  ];
};
