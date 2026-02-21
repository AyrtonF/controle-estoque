
import { AuditLog } from '../domain/audit-log.entity';
import { IAuditLogRepository } from '../domain/repository.interface';
import { JsonDbHelper } from './json-db.helper';

export class FileSystemAuditLogRepository implements IAuditLogRepository {
  private db: JsonDbHelper<AuditLog>;

  constructor() {
    this.db = new JsonDbHelper<AuditLog>('audit-logs.json');
  }

  async create(log: AuditLog): Promise<AuditLog> {
    const logs = this.db.read();
    logs.push(log);
    this.db.write(logs);
    return log;
  }

  async findAll(): Promise<AuditLog[]> {
    return this.db.read();
  }

  async findByEntity(entityId: string): Promise<AuditLog[]> {
    return this.db.read().filter(l => l.entityId === entityId);
  }
}
