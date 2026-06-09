import * as vscode from 'vscode';
import { BookManager } from './reader/BookManager';
import { ReaderEngine } from './reader/ReaderEngine';
import { StatusBarView } from './ui/StatusBarView';

export function activate(context: vscode.ExtensionContext) {
  const bookManager = new BookManager(context.globalState);
  const readerEngine = new ReaderEngine(bookManager, context.globalState);
  const statusBarView = new StatusBarView(readerEngine);

  readerEngine.onPositionChange(() => statusBarView.update());

  context.subscriptions.push(
    vscode.commands.registerCommand('readExtend.importBook', () => bookManager.importBook()),
    vscode.commands.registerCommand('readExtend.openBook', () => bookManager.openBook(readerEngine)),
    vscode.commands.registerCommand('readExtend.removeBook', () => bookManager.removeBook(readerEngine)),
    vscode.commands.registerCommand('readExtend.nextPage', () => readerEngine.nextPage()),
    vscode.commands.registerCommand('readExtend.prevPage', () => readerEngine.prevPage()),
    vscode.commands.registerCommand('readExtend.toggleVisibility', () => statusBarView.toggle()),
    vscode.commands.registerCommand('readExtend.close', () => {
      readerEngine.close();
      statusBarView.hide();
    }),
    vscode.commands.registerCommand('readExtend.goToChapter', () => readerEngine.goToChapter()),
    vscode.commands.registerCommand('readExtend.search', () => readerEngine.search()),
    vscode.commands.registerCommand('readExtend.searchNext', () => readerEngine.searchNext()),
    vscode.commands.registerCommand('readExtend.searchPrev', () => readerEngine.searchPrev()),
    statusBarView,
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('readExtend.displayLength')) {
        statusBarView.update();
      }
    })
  );

  readerEngine.restore();
}

export function deactivate() {}
