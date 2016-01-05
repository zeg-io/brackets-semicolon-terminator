/*jslint nomen: true, vars: true */
/*global define, brackets, $*/

define(function (require, exports, module) {
  'use strict';
  // Brackets modules
  var AppInit     = brackets.getModule('utils/AppInit'),
    EditorManager = brackets.getModule('editor/EditorManager'),
    KeyEvent      = brackets.getModule('utils/KeyEvent'),
    PreferencesManager = brackets.getModule('preferences/PreferencesManager');
  
  function getSpaceIndentation(inLine) {
    var
      spacesString = '',
      i = 0;
    for (i = 0; i < inLine.length; i += 1) {
      if (inLine[i].trim() === '') {
        spacesString += inLine[i];
      }
    }
    return spacesString;
  }
  
  function _keyEventHandler($event, editor, event) {
    var
      cursorPos = editor.getCursorPos(),
      document = editor.document,
      currLine = document.getLine(cursorPos.line),
      indent = getSpaceIndentation(currLine),
      fileLang = editor.document.language._id,
      currLineLen = currLine.length;
    // On alt+ENTER pressed
    if (event.keyCode === KeyEvent.DOM_VK_RETURN && event.shiftKey) {
      // only for JavaScript
      if (fileLang === 'javascript' || fileLang === 'html') {
        
        editor.setCursorPos(cursorPos.line, currLineLen);
        cursorPos = editor.getCursorPos();
        if (currLine.substring(currLineLen-1,currLineLen)!==';') {
          document.replaceRange(';\n' + indent, cursorPos);
        } else {
          document.replaceRange('\n' + indent, cursorPos);
        }
        event.preventDefault();
      }
    } else { 
      //on alt+; pressed
      if (event.keyCode === KeyEvent.DOM_VK_RETURN && event.altKey) {
        if (fileLang === 'javascript' || fileLang === 'html') {
          var curCursorPos = editor.getCursorPos();
          editor.setCursorPos(cursorPos.line, currLine.length);
          cursorPos = editor.getCursorPos();
          if (currLine.substring(currLineLen-1,currLineLen)!==';') {
            document.replaceRange(';', cursorPos);
            editor.setCursorPos(curCursorPos, 0);
          }
          event.preventDefault();
        }
      }
    } 
  }

  function _activeEditorChangeHandler($event, focusedEditor, lostEditor) {
    if (lostEditor) {
      $(lostEditor).off('keydown', _keyEventHandler);
    }
    if (focusedEditor) {
      $(focusedEditor).on('keydown', _keyEventHandler);
    }
  }

  AppInit.appReady(function () {
    var currentEditor = EditorManager.getActiveEditor();
    $(currentEditor).on('keydown', _keyEventHandler);
    $(EditorManager).on('activeEditorChange', _activeEditorChangeHandler);
  });

});

