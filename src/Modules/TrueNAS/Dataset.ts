// src/Modules/TrueNAS/Dataset.ts
import { Type } from 'class-transformer'

class ParsedDate {
  @Type(() => Date)
  public $date: Date;
}

class TrueNASDate {
  @Type(() => ParsedDate)
  parsed: ParsedDate;

  @Type(() => String)
  rawvalue: string;

  @Type(() => Date)
  value: Date;

  @Type(() => String)
  source: string;
}

class TrueNASUsage {
  @Type(() => Number)
  public parsed: string;

  @Type(() => String)
  rawvalue: string;

  @Type(() => String)
  value: string;

  @Type(() => String)
  source: string;
}

export class TrueNASDataset {
  @Type(() => String)
  public id: string;

  @Type(() => String)
  public type: string;

  @Type(() => String)
  public name: string;
  
  @Type(() => String)
  public pool: string;

  @Type(() => Boolean)
  encrypted: boolean

  
  children: string[];

  managedby: {
    value: string,
    rawvalue: string,
    source: string,
    parsed: string
  };

  /* deduplication: { parsed: 'off', rawvalue: 'off', value: 'OFF', source: 'DEFAULT' },
  checksum: { parsed: true, rawvalue: 'on', value: 'ON', source: 'DEFAULT' },
  sync: {
    parsed: 'standard',
    rawvalue: 'standard',
    value: 'STANDARD',
    source: 'DEFAULT'
  },
  compression: {
    parsed: 'lz4',
    rawvalue: 'lz4',
    value: 'LZ4',
    source: 'INHERITED'
  },
  compressratio: {
    parsed: '1.00',
    rawvalue: '1.00',
    value: '1.00x',
    source: 'NONE'
  },
  origin: { parsed: '', rawvalue: '', value: '', source: 'NONE' },
  reservation: { parsed: null, rawvalue: '0', value: null, source: 'DEFAULT' },
  refreservation: { parsed: null, rawvalue: '0', value: null, source: 'LOCAL' },
  copies: { parsed: 1, rawvalue: '1', value: '1', source: 'INHERITED' },
  readonly: { parsed: false, rawvalue: 'off', value: 'OFF', source: 'DEFAULT' }, */
  
  @Type(() => TrueNASUsage)
  volsize: TrueNASUsage;

  @Type(() => TrueNASUsage)
  volblocksize: TrueNASUsage;

  /*
  key_format: {
    parsed: 'none',
    rawvalue: 'none',
    value: null,
    source: 'DEFAULT'
  },
  encryption_algorithm: { parsed: 'off', rawvalue: 'off', value: null, source: 'DEFAULT' }, */

  @Type(() => TrueNASUsage)
  used: TrueNASUsage;

  @Type(() => TrueNASUsage)
  available: TrueNASUsage;
  // pbkdf2iters: { parsed: '0', rawvalue: '0', value: '0', source: 'DEFAULT' }

  @Type(() => TrueNASDate)
  public creation: TrueNASDate;

  @Type(() => String)
  mountpoint?: string;

  public user_properties: {
    [key: string]: object;
  };

  @Type(() => Boolean)
  public locked: false;
}