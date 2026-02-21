
import fs from 'fs';
import path from 'path';

/**
 * Helper para persistência em arquivos JSON
 * 
 * ⚠️ IMPORTANTE: Esta implementação é apenas para desenvolvimento/testes
 * 
 * Limitações:
 * - Não é thread-safe (race conditions em writes concorrentes)
 * - Performance ruim com arquivos grandes
 * - Não escala para produção
 * - Dados podem ser perdidos em deploy/restart no Vercel
 * 
 * Para produção, considere usar:
 * - Vercel Postgres
 * - PlanetScale MySQL
 * - MongoDB Atlas
 * - Upstash Redis
 * - Vercel KV
 */

// Define o caminho para o diretório de dados usando process.cwd()
const DATA_DIR = path.join(process.cwd(), 'database');

// Cria o diretório se não existir
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`✅ Database directory created: ${DATA_DIR}`);
  } catch (error) {
    console.error('❌ Could not create database directory:', error);
  }
}

export class JsonDbHelper<T> {
  private filePath: string;
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.filePath = path.join(DATA_DIR, fileName);
    
    // Cria o arquivo com array vazio se não existir
    if (!fs.existsSync(this.filePath)) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        console.log(`✅ Database file created: ${this.fileName}`);
      } catch (error) {
        console.error(`❌ Could not create database file ${this.fileName}:`, error);
      }
    }
  }

  read(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        console.warn(`⚠️ Database file not found: ${this.fileName}. Returning empty array.`);
        return [];
      }

      const data = fs.readFileSync(this.filePath, 'utf-8');
      
      if (!data || data.trim() === '') {
        console.warn(`⚠️ Database file is empty: ${this.fileName}. Returning empty array.`);
        return [];
      }

      const parsed = JSON.parse(data) as T[];
      return parsed;
    } catch (error) {
      console.error(`❌ Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write(data: T[]): void {
    try {
      // Garante que o diretório existe
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`❌ Error writing to ${this.filePath}:`, error);
      throw new Error(`Failed to persist data to ${this.fileName}`);
    }
  }
}
