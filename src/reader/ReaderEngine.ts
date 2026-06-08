import * as vscode from 'vscode';
import { BookData, Chapter } from './TextParser';
import { BookManager } from './BookManager';

interface ReadingPosition {
  chapterIndex: number;
  charOffset: number;
}

const POSITIONS_KEY = 'readExtend.positions';

export class ReaderEngine {
  private position: ReadingPosition = { chapterIndex: 0, charOffset: 0 };
  private book: BookData | undefined;
  private searchKeyword: string = '';
  private positionChangeEmitter = new vscode.EventEmitter<void>();
  private positions: Record<string, ReadingPosition> = {};

  constructor(
    private bookManager: BookManager,
    private globalState: vscode.Memento
  ) {
    this.positions = this.globalState.get<Record<string, ReadingPosition>>(POSITIONS_KEY, {});
  }

  onPositionChange(listener: () => void): vscode.Disposable {
    return this.positionChangeEmitter.event(listener);
  }

  notifyChange(): void {
    this.positionChangeEmitter.fire();
  }

  getCurrentText(): string {
    if (!this.book || this.book.chapters.length === 0) {
      return '';
    }
    const maxLength = vscode.workspace.getConfiguration('readExtend').get<number>('displayLength', 50);
    const chapter = this.book.chapters[this.position.chapterIndex];
    if (!chapter) {
      return '';
    }
    const slice = chapter.content.substring(this.position.charOffset, this.position.charOffset + maxLength);
    const newlineIdx = slice.indexOf('\n');
    if (newlineIdx !== -1) {
      return slice.substring(0, newlineIdx);
    }
    return slice;
  }

  private getMaxDisplayLength(): number {
    return vscode.workspace.getConfiguration('readExtend').get<number>('displayLength', 50);
  }

  onBookLoaded(book: BookData): void {
    this.book = book;
    const saved = this.positions[book.filePath];
    if (saved) {
      this.position = { ...saved };
    } else {
      this.position = { chapterIndex: 0, charOffset: 0 };
    }
    this.notifyChange();
  }

  async restore(): Promise<void> {
    await this.bookManager.restoreActiveBook(this);
  }

  nextPage(): void {
    if (!this.book) { return; }
    const chapter = this.book.chapters[this.position.chapterIndex];
    if (!chapter) { return; }

    const advance = this.getAdvanceLength(chapter.content, this.position.charOffset);
    this.position.charOffset += advance;

    if (this.position.charOffset >= chapter.content.length) {
      if (this.position.chapterIndex < this.book.chapters.length - 1) {
        this.position.chapterIndex++;
        this.position.charOffset = 0;
      } else {
        this.position.charOffset = Math.max(0, chapter.content.length - 1);
        vscode.window.showInformationMessage('已到达最后一章末尾');
      }
    }
    this.savePosition();
    this.notifyChange();
  }

  private getAdvanceLength(content: string, offset: number): number {
    const maxLength = this.getMaxDisplayLength();
    const slice = content.substring(offset, offset + maxLength);
    const newlineIdx = slice.indexOf('\n');
    if (newlineIdx !== -1) {
      return newlineIdx + 1;
    }
    return maxLength;
  }

  prevPage(): void {
    if (!this.book) { return; }
    const chapter = this.book.chapters[this.position.chapterIndex];

    if (this.position.charOffset <= 0) {
      if (this.position.chapterIndex > 0) {
        this.position.chapterIndex--;
        const prevChapter = this.book.chapters[this.position.chapterIndex];
        this.position.charOffset = Math.max(0, prevChapter.content.length - 1);
        this.position.charOffset = this.findLineStart(prevChapter.content, this.position.charOffset);
      } else {
        vscode.window.showInformationMessage('已到达第一章开头');
      }
    } else {
      const searchFrom = this.position.charOffset - 1;
      const prevNewline = chapter.content.lastIndexOf('\n', searchFrom);
      if (prevNewline === -1) {
        this.position.charOffset = 0;
      } else {
        const lineStart = this.findLineStart(chapter.content, prevNewline);
        this.position.charOffset = lineStart;
      }
    }
    this.savePosition();
    this.notifyChange();
  }

  private findLineStart(content: string, fromOffset: number): number {
    const maxLength = this.getMaxDisplayLength();
    const prevNewline = content.lastIndexOf('\n', fromOffset - 1);
    const lineStart = prevNewline + 1;
    if (fromOffset - lineStart <= maxLength) {
      return lineStart;
    }
    return fromOffset - maxLength;
  }

  async goToChapter(): Promise<void> {
    if (!this.book) {
      vscode.window.showInformationMessage('请先导入书籍');
      return;
    }

    const items = this.book.chapters.map((ch, i) => ({
      label: ch.title,
      description: `${i + 1}/${this.book!.chapters.length}`,
      index: i,
    }));

    const selected = await vscode.window.showQuickPick(items, { placeHolder: '选择章节' });
    if (selected) {
      this.position.chapterIndex = selected.index;
      this.position.charOffset = 0;
      this.savePosition();
      this.notifyChange();
    }
  }

  async search(): Promise<void> {
    const keyword = await vscode.window.showInputBox({ prompt: '输入搜索关键词', value: this.searchKeyword });
    if (keyword !== undefined) {
      this.searchKeyword = keyword;
    }
  }

  searchNext(): void {
    if (!this.book || !this.searchKeyword) {
      vscode.window.showInformationMessage('请先执行搜索命令输入关键词');
      return;
    }

    const chapter = this.book.chapters[this.position.chapterIndex];
    const searchFrom = this.position.charOffset + 1;
    let idx = chapter.content.indexOf(this.searchKeyword, searchFrom);

    if (idx !== -1) {
      this.position.charOffset = idx;
      this.savePosition();
      this.notifyChange();
      return;
    }

    for (let i = this.position.chapterIndex + 1; i < this.book.chapters.length; i++) {
      idx = this.book.chapters[i].content.indexOf(this.searchKeyword);
      if (idx !== -1) {
        this.position.chapterIndex = i;
        this.position.charOffset = idx;
        this.savePosition();
        this.notifyChange();
        return;
      }
    }

    vscode.window.showInformationMessage('向后没有更多匹配');
  }

  searchPrev(): void {
    if (!this.book || !this.searchKeyword) {
      vscode.window.showInformationMessage('请先执行搜索命令输入关键词');
      return;
    }

    const chapter = this.book.chapters[this.position.chapterIndex];
    const searchUntil = this.position.charOffset - 1;
    let idx = chapter.content.lastIndexOf(this.searchKeyword, searchUntil);

    if (idx !== -1) {
      this.position.charOffset = idx;
      this.savePosition();
      this.notifyChange();
      return;
    }

    for (let i = this.position.chapterIndex - 1; i >= 0; i--) {
      idx = this.book.chapters[i].content.lastIndexOf(this.searchKeyword);
      if (idx !== -1) {
        this.position.chapterIndex = i;
        this.position.charOffset = idx;
        this.savePosition();
        this.notifyChange();
        return;
      }
    }

    vscode.window.showInformationMessage('向前没有更多匹配');
  }

  clearPosition(filePath: string): void {
    delete this.positions[filePath];
    this.globalState.update(POSITIONS_KEY, this.positions);
  }

  private savePosition(): void {
    if (!this.book) { return; }
    this.positions[this.book.filePath] = { ...this.position };
    this.globalState.update(POSITIONS_KEY, this.positions);
  }
}
