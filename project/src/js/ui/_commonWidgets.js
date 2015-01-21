var menu = require('./menu');
var utils = require('../utils');
var gamesMenu = require('./gamesMenu');
var layout = require('./layout');
var session = require('../session');

var widgets = {};

widgets.menuButton = function() {
  return m('button.fa.fa-navicon.menu_button', {
    config: utils.ontouchend(menu.toggle)
  });
};

widgets.gameButton = function() {
  var myTurns = session.myTurnGames().length;
  return m('button.game_menu_button', {
    config: utils.ontouchend(gamesMenu.open)
  }, myTurns ? m('span.nb_playing', myTurns) : null);
};

widgets.header = function() {
  return m('nav', [
    widgets.menuButton(),
    widgets.gameButton(),
    m('h1', 'lichess.org')
  ]);
};

widgets.board = function() {
  var x = utils.getViewportDims().vw;
  return m('section.board_wrapper', {
    style: {
      height: x + 'px'
    }
  }, [utils.viewOnlyBoard()]);
};

widgets.empty = function() {
  return [];
};

widgets.startBoardView = function() {
  return layout.board(widgets.header, widgets.board, widgets.empty, menu.view);
};

module.exports = widgets;
