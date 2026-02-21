
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../database');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonDbHelper<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  read(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      throw new Error('Failed to persist data');
    }
  }
}
