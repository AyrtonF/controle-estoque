
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../database');
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Cache em memória para ambiente serverless (Vercel)
const memoryCache = new Map<string, any[]>();

// Apenas tenta criar diretório em ambiente local
if (!IS_VERCEL && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonDbHelper<T> {
  private filePath: string;
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.filePath = path.join(DATA_DIR, fileName);
    
    // Apenas tenta criar arquivo em ambiente local
    if (!IS_VERCEL && !fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  read(): T[] {
    try {
      // No Vercel: primeiro tenta cache em memória
      if (IS_VERCEL && memoryCache.has(this.fileName)) {
        return memoryCache.get(this.fileName) as T[];
      }

      // Tenta ler arquivo (funciona se foi commitado no Git)
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(data) as T[];
        
        // Guarda no cache se estiver no Vercel
        if (IS_VERCEL) {
          memoryCache.set(this.fileName, parsed);
        }
        
        return parsed;
      }
      
      // Se não existir arquivo, retorna array vazio
      const emptyData: T[] = [];
      if (IS_VERCEL) {
        memoryCache.set(this.fileName, emptyData);
      }
      return emptyData;
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      const emptyData: T[] = [];
      if (IS_VERCEL) {
        memoryCache.set(this.fileName, emptyData);
      }
      return emptyData;
    }
  }

  write(data: T[]): void {
    try {
      // No Vercel: salva apenas em memória (volátil)
      if (IS_VERCEL) {
        memoryCache.set(this.fileName, data);
        console.log(`[Vercel Mode] Data saved to memory cache: ${this.fileName} (${data.length} items)`);
        return;
      }

      // Local: salva no arquivo normalmente
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      
      // Se falhar write no Vercel, tenta salvar em memória como fallback
      if (IS_VERCEL) {
        memoryCache.set(this.fileName, data);
        console.log(`[Vercel Mode] Fallback to memory cache: ${this.fileName}`);
      } else {
        throw new Error('Failed to persist data');
      }
    }
  }
}
