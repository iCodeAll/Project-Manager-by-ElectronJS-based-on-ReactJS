import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { IProject } from '../models';

class FirebaseService {
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
  private collection: string;
  private db: firebase.firestore.Firestore;
  public storage: firebase.storage.Storage;
  constructor() {
    this.collection = 'projects';
    firebase.initializeApp(this.firebaseConfig);
    this.db = firebase.firestore();
    this.storage = firebase.storage();
  }
  public authenticateAnonymously = () => {
    return firebase.auth().signInAnonymously();
  };
  public getProjectList = (keyword: string) => {
    console.log(keyword.length);
    return this.db.collection(this.collection).get();
  };
  public getProjectByID = (id: string) => {
    return this.db.collection(this.collection).doc(id).get();
  };
  public streamProjects = (id: string, observer: any) => {
    return this.db
      .collection(this.collection)
      .doc(id)
      .collection('items')
      .orderBy('created')
      .onSnapshot(observer);
  };
  public createProject = (project: IProject) => {
    return this.db.collection(this.collection).add({
      ...project,
    });
  };
  public deleteProject = (projectID: string) => {
    return this.db.collection(this.collection).doc(projectID).delete();
  };
  public updateProject = (projectID: string, project: IProject) => {
    return this.db.collection(this.collection).doc(projectID).update(project);
  };
  public uploadImage = (image: any) => {
    this.storage.ref('images').child(image.name).getDownloadURL();
  };
}

export default new FirebaseService();
