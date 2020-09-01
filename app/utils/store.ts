const electron = require('electron');
const path = require('path');
const fs = require('fs');
import keys from '../constants/key.json';
const Cryptr = require('cryptr');
const cryptr = new Cryptr(keys.secret);
// import { IRequest } from './model';
export interface IStore {
  configName: string;
  defaults?: {
    credentials?: {
      server: string;
      user: string;
      password: string;
      minimize: boolean;
      startup: boolean;
    };
  };

}
class Store {
  private path: any;
  private data: any;
  constructor(opts: IStore) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    this.path = path.join(userDataPath, opts.configName + '.dat');

    this.data = this.parseDataFile(this.path, opts.defaults);
  }

  get(key: string) {
    return this.data[key];
  }

  set(key: string, val: any) {
    this.data[key] = val;
    fs.writeFileSync(this.path, cryptr.encrypt(JSON.stringify(this.data)));
    // fs.writeFileSync(this.path, (JSON.stringify(this.data)));
  }

  public parseDataFile(filePath: string, defaults: any) {
    try {
      return JSON.parse(cryptr.decrypt(fs.readFileSync(filePath)));
    } catch (error) {
      return defaults;
    }
  }
}

export default new Store({
  configName: 'project_manager',
  defaults: {
    credentials: {
      server: '',
      user: '',
      password: '',
      minimize: true,
      startup: false
    }
  }
});
