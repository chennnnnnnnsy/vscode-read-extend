import * as vscode from 'vscode';
import { ReaderEngine } from '../reader/ReaderEngine';

export class StatusBarView implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;
  private visible: boolean = true;

  constructor(private readerEngine: ReaderEngine) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    this.statusBarItem.command = 'readExtend.nextPage';
    this.update();
    this.statusBarItem.show();
  }

  update(): void {
    if (!this.visible) { return; }
    const text = this.readerEngine.getCurrentText();
    this.statusBarItem.text = text || '$(book) Read Extend';
    if (text) {
      this.statusBarItem.show();
    }
  }

  toggle(): void {
    this.visible = !this.visible;
    if (this.visible) {
      this.statusBarItem.show();
      this.update();
    } else {
      this.statusBarItem.hide();
    }
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
