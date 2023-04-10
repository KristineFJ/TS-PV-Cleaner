// src/Modules/TrueNAS/Pool.ts
import { Type } from 'class-transformer'

export class TrueNASPool {
  @Type(() => Number) 
  id: number;

  @Type(() => String)
  name: string

  @Type(() => String)
  guid: string;

  @Type(() => Boolean)
  encrypt: number;

  @Type(() => String)
  encryptkey: string;

  @Type(() => String)
  path: string;

  @Type(() => String)
  status: string;
}