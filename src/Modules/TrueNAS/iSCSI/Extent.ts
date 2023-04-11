// src/Modules/TrueNAS/Extent.ts
import { Type } from 'class-transformer';

export class TrueNASExtent {
  @Type(() => Number)
  public id: number;

  @Type(() => String)
  public name: string;

  @Type(() => String)
  public serial: string;

  @Type(() => String)
  public type: string;

  @Type(() => String)
  public path: string;

  @Type(() => String)
  public filesize: string;

  @Type(() => Number)
  public blocksize: number;

  @Type(() => Boolean)
  public pblocksize: boolean;

  //avail_threshold: null,

  @Type(() => String)
  public comment: string;

  @Type(() => String)
  public naa: string;

  @Type(() => Boolean)
  public insecure_tpc: boolean;

  @Type(() => Boolean)
  public xen: boolean;

  @Type(() => String)
  public rpm: string;

  @Type(() => Boolean)
  public ro: boolean;

  @Type(() => Boolean)
  public enabled: boolean;

  @Type(() => String)
  public vendor: string;

  @Type(() => String)
  public disk: string;

  @Type(() => Boolean)
  public locked: boolean;
}
