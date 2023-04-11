// src/Modules/TrueNAS/iSCSI/Group.ts
import { Type } from 'class-transformer';

export class TrueNASiSCSIGroup {
  @Type(() => Number)
  public portal: number;

  @Type(() => Number)
  public initiator: number;

  @Type(() => String)
  public authmethod: string;
}
