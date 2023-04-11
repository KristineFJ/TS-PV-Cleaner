// src/Modules/TrueNAS/iSCSI/Target.ts
import { Type } from 'class-transformer';
import { TrueNASiSCSIGroup } from './Group';

export class TrueNASiSCSITarget {
  @Type(() => Number)
  public id: number;

  @Type(() => String)
  public name: string;

  // alias: null,

  @Type(() => String)
  public mode: string;

  @Type(() => TrueNASiSCSIGroup)
  public groups: TrueNASiSCSIGroup[];
}
