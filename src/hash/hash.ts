import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Hash {
  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  compare(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
