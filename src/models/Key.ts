import KeyPair from '../Key';

/**
 * Additional options for generating KeyPair with default data
 */
export interface KeyOptions {
  private?: KeyPair;
  public?: KeyPair;
  enc: string;
}
