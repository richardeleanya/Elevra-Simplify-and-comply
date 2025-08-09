import { Injectable } from '@nestjs/common';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

@Injectable()
export class ConfigService {
  private ssm = new SSMClient({ region: process.env.AWS_REGION || 'eu-west-2' });
  private cache: Record<string, string> = {};

  async getSecret(name: string, withDecryption = true): Promise<string> {
    if (this.cache[name]) return this.cache[name];
    const cmd = new GetParameterCommand({ Name: name, WithDecryption: withDecryption });
    const resp = await this.ssm.send(cmd);
    const v = resp.Parameter?.Value || '';
    this.cache[name] = v;
    return v;
  }
}