import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { IProject } from '../models';

class FirestoreService {
  private firebaseConfig: any = {
    apiKey: 'AIzaSyBl_44K3Spk4bEA6u2WPfDqbuFgD-3YQTk',
    authDomain: 'electron-27eaa.firebaseapp.com',
    databaseURL: 'https://electron-27eaa.firebaseio.com',
    projectId: 'electron-27eaa',
    storageBucket: 'electron-27eaa.appspot.com',
    messagingSenderId: '502463927654',
    appId: '1:502463927654:web:c6e8ff94dc13828c3824a7',
    measurementId: 'G-MT93YN8BYT',
  };
  private db: firebase.firestore.Firestore;
  constructor() {
    firebase.initializeApp(this.firebaseConfig);
    this.db = firebase.firestore();
  }
  public authenticateAnonymously() {
    return firebase.auth().signInAnonymously();
  }
  public getProjectList(keyword: string) {
    console.log(keyword.length);
    return this.db.collection('projects').get();
  }
  public getProjectByID(id: string) {
    return this.db.collection('projects').doc(id).get();
  }
  public streamProjects = (id: string, observer: any) => {
    return this.db
      .collection('projects')
      .doc(id)
      .collection('items')
      .orderBy('created')
      .onSnapshot(observer);
  };
  public createProject = (project: IProject) => {
    return this.db.collection('projects').add({
      ...project,
    });
  };
}

export default new FirestoreService();
