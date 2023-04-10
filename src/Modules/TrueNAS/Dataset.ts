// src/Modules/TrueNAS/Dataset.ts
import { Type } from 'class-transformer'

class TrueNASCreation {
  parsed: object;

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
  readonly: { parsed: false, rawvalue: 'off', value: 'OFF', source: 'DEFAULT' },
  volsize: {
    parsed: 10737418240,
    rawvalue: '10737418240',
    value: '10G',
    source: 'LOCAL'
  },
  volblocksize: { parsed: 16384, rawvalue: '16384', value: '16K', source: 'NONE' },
  key_format: {
    parsed: 'none',
    rawvalue: 'none',
    value: null,
    source: 'DEFAULT'
  },
  encryption_algorithm: { parsed: 'off', rawvalue: 'off', value: null, source: 'DEFAULT' },
  used: { parsed: 57344, rawvalue: '57344', value: '56K', source: 'NONE' },
  available: {
    parsed: 1051391684608,
    rawvalue: '1051391684608',
    value: '979G',
    source: 'NONE'
  },
  pbkdf2iters: { parsed: '0', rawvalue: '0', value: '0', source: 'DEFAULT' }, */

  @Type(() => TrueNASCreation)
  public creation: TrueNASCreation;

  @Type(() => String)
  mountpoint?: string;

  public user_properties: {
    [key: string]: object;

  };

  @Type(() => Boolean)
  public locked: false;
}