import * as vscode from 'vscode';
import { BookData, parseFile } from './TextParser';
import { ReaderEngine } from './ReaderEngine';

interface BookEntry {
  filePath: string;
  title: string;
}

const BOOKS_KEY = 'readExtend.books';
const ACTIVE_BOOK_KEY = 'readExtend.activeBook';

export class BookManager {
  private books: BookEntry[] = [];
  private activeBookPath: string | undefined;
  private currentBook: BookData | undefined;

  constructor(private globalState: vscode.Memento) {
    this.books = this.globalState.get<BookEntry[]>(BOOKS_KEY, []);
    this.activeBookPath = this.globalState.get<string>(ACTIVE_BOOK_KEY);
  }

  getCurrentBook(): BookData | undefined {
    return this.currentBook;
  }

  async importBook(): Promise<void> {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { 'Books': ['epub', 'txt'] },
      openLabel: 'Import Book',
    });

    if (!uris || uris.length === 0) {
      return;
    }

    const filePath = uris[0].fsPath;

    try {
      const bookData = await parseFile(filePath);
      this.currentBook = bookData;

      const existing = this.books.find(b => b.filePath === filePath);
      if (!existing) {
        this.books.push({ filePath, title: bookData.title });
        await this.globalState.update(BOOKS_KEY, this.books);
      }

      this.activeBookPath = filePath;
      await this.globalState.update(ACTIVE_BOOK_KEY, filePath);
      vscode.window.showInformationMessage(`已导入: ${bookData.title}`);
    } catch (e: any) {
      vscode.window.showErrorMessage(e.message || '导入失败');
    }
  }

  async switchBook(readerEngine: ReaderEngine): Promise<void> {
    if (this.books.length === 0) {
      vscode.window.showInformationMessage('没有已导入的书籍');
      return;
    }

    const items = this.books.map(b => ({ label: b.title, description: b.filePath }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: '选择书籍' });
    if (!selected) {
      return;
    }

    await this.loadBook(selected.description!, readerEngine);
  }

  async removeBook(readerEngine: ReaderEngine): Promise<void> {
    if (this.books.length === 0) {
      vscode.window.showInformationMessage('没有已导入的书籍');
      return;
    }

    const items = this.books.map(b => ({ label: b.title, description: b.filePath }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: '选择要移除的书籍' });
    if (!selected) {
      return;
    }

    const filePath = selected.description!;
    this.books = this.books.filter(b => b.filePath !== filePath);
    await this.globalState.update(BOOKS_KEY, this.books);

    readerEngine.clearPosition(filePath);

    if (this.activeBookPath === filePath) {
      this.currentBook = undefined;
      this.activeBookPath = undefined;
      await this.globalState.update(ACTIVE_BOOK_KEY, undefined);
      readerEngine.notifyChange();
    }

    vscode.window.showInformationMessage(`已移除: ${selected.label}`);
  }

  async loadBook(filePath: string, readerEngine: ReaderEngine): Promise<void> {
    try {
      const bookData = await parseFile(filePath);
      this.currentBook = bookData;
      this.activeBookPath = filePath;
      await this.globalState.update(ACTIVE_BOOK_KEY, filePath);
      readerEngine.onBookLoaded(bookData);
    } catch (e: any) {
      vscode.window.showErrorMessage(e.message || '加载失败');
    }
  }

  async restoreActiveBook(readerEngine: ReaderEngine): Promise<void> {
    if (this.activeBookPath) {
      const entry = this.books.find(b => b.filePath === this.activeBookPath);
      if (entry) {
        await this.loadBook(entry.filePath, readerEngine);
      }
    }
  }
}
