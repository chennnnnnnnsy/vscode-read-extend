import EPub from 'epub2';
import * as fs from 'fs';
import * as path from 'path';

export interface Chapter {
  title: string;
  content: string;
}

export interface BookData {
  filePath: string;
  title: string;
  chapters: Chapter[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function parseEpub(filePath: string): Promise<BookData> {
  const epub = await EPub.createAsync(filePath);
  const chapters: Chapter[] = [];

  for (const ch of epub.flow) {
    const id = ch.id;
    try {
      const raw = await epub.getChapterAsync(id);
      const text = stripHtml(raw);
      if (text.length > 0) {
        chapters.push({
          title: ch.title || `Chapter ${chapters.length + 1}`,
          content: text,
        });
      }
    } catch {
      // skip unreadable chapters
    }
  }

  if (chapters.length === 0) {
    chapters.push({ title: '未知章节', content: '' });
  }

  const hasNoTitles = chapters.every(
    (c, i) => c.title === `Chapter ${i + 1}`
  );
  if (hasNoTitles && chapters.length === 1) {
    chapters[0].title = '未知章节';
  }

  return {
    filePath,
    title: epub.metadata?.title || path.basename(filePath, '.epub'),
    chapters,
  };
}

const CHAPTER_PATTERN = /^(第[零一二三四五六七八九十百千万\d]+[章回节卷集部篇])\s*(.*)/m;

function splitByChapters(content: string): Chapter[] {
  const lines = content.split('\n');
  const chapters: Chapter[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const match = line.match(CHAPTER_PATTERN);
    if (match) {
      if (currentTitle || currentLines.length > 0) {
        chapters.push({
          title: currentTitle || '未知章节',
          content: currentLines.join('\n').trim(),
        });
      }
      currentTitle = match[2] ? `${match[1]} ${match[2]}` : match[1];
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentTitle || currentLines.length > 0) {
    chapters.push({
      title: currentTitle || '未知章节',
      content: currentLines.join('\n').trim(),
    });
  }

  if (chapters.length === 0) {
    chapters.push({ title: '未知章节', content });
  }

  return chapters.filter(ch => ch.content.length > 0);
}

export function parseTxt(filePath: string): BookData {
  const content = fs.readFileSync(filePath, 'utf-8');
  const chapters = splitByChapters(content);
  return {
    filePath,
    title: path.basename(filePath, '.txt'),
    chapters: chapters.length > 0 ? chapters : [{ title: '未知章节', content }],
  };
}

const SUPPORTED_EXTENSIONS = ['.epub', '.txt'];

export async function parseFile(filePath: string): Promise<BookData> {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(`不支持的文件格式: ${ext}`);
  }
  if (ext === '.epub') {
    return parseEpub(filePath);
  }
  return parseTxt(filePath);
}
