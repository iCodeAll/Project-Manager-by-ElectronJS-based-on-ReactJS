import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import ProjectCard from '../project/ProjectCard';
import styles from './Home.css';
import { IProjectList, IProject } from '../../models';

import * as firebase from 'firebase/app';
import FirebaseService from '../../utils/firestore';

const useStyles = makeStyles((theme) => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      textTransform: 'unset',
    },
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  cardHolder: {
    width: '350px',
    float: 'left',
    padding: '10px;',
  },
  topMost: {
    zIndex: 999,
  },
  search: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    '& .MuiFormLabel-root': {
      color: '#fff',
      fontSize: '14px',
    },
    '& .MuiInputBase-input': {
      color: '#fff',

      '&::placeholder': {
        color: '#fff !important',
      },
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
  },
  uploadInput: {
    display: 'none',
  },
  imgUploadProgress: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: '50%',

    '& .MuiTypography-root': {
      position: 'absolute',
      top: '12px',
      left: '3px',
    },
  },
  uploadWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dialogWrapper: {
    '& .MuiTypography-root': {
      color: 'black',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiButton-root': {
      textTransform: 'unset',
    },
  },
}));

const actions = [
  { icon: <AddIcon />, name: 'add a new project', action: 'add' },
];
const Alert = (props: any) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};
const Home: React.FC = () => {
  const classes = useStyles();
  const refs = useRef<any>(null);
  const iconImageInputRef = useRef<any>(null);
  const featuredImageInputRef = useRef<any>(null);
  const [projectList, setProjectList] = useState<IProjectList>([]);
  const [filteredProjectList, setFilteredProjectList] = useState<IProject[]>(
    []
  );
  const [keyword, setKeyword] = useState<string>('');
  const [showAddDlg, setAddDlgState] = useState<boolean>(false);
  const [showConfirmDlg, setConfirmDlgState] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectDetail, setProjectDetail] = useState<IProject>({
    uid: '',
    name: '',
    description: '',
    icon_image: '',
    featured_image: '',
    content: '',
    menu01: '',
    menu02: '',
    date: '',
  });
  const [progress, setProgress] = useState<number>(0);
  const [showImgProgress, setImgProgressVisibility] = useState<boolean>(false);
  const loadProjects = () => {
    setOpen(true);
    setIsFirstLoading(true);
    FirebaseService.authenticateAnonymously()
      .then(() => {
        let itemList: IProject[] = [];
        FirebaseService.getProjectList(keyword)
          .then((list: any) => {
            list.forEach(function (doc: any) {
              if (doc.data()) {
                const item: IProject = {
                  ...(doc.data() as IProject),
                  uid: doc.id,
                };
                itemList.push(item);
              }
            });
            setProjectList(itemList);
            setFilteredProjectList(
              itemList.filter(
                (item: IProject) =>
                  item.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1
              )
            );
            setOpen(false);
            setIsFirstLoading(false);
          })
          .catch((err) => {
            setAlertSeverity('error');
            setAlertMsg(err);
            setOpenAlert(true);
          });
      })
      .catch((err) => {
        setAlertSeverity('error');
        setAlertMsg(err);
        setOpenAlert(true);
      });
  };
  useEffect(() => {
    loadProjects();
  }, []);
  //search projects by name
  useEffect(() => {
    setFilteredProjectList(
      projectList.filter(
        (item: IProject) =>
          item.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1
      )
    );
  }, [keyword, setKeyword]);

  const onSearch = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (actionName: string) => {
    console.log('handling a click from ' + actionName);
    setProjectDetail({
      uid: '',
      name: '',
      description: '',
      icon_image: '',
      featured_image: '',
      content: '',
      date: '',
      menu01: '',
      menu02: ''
    });
    setAddDlgState(true);
    handleClose();
  };
  const closeAddDlg = () => {
    setAddDlgState(false);
    setOpen(false);
  };
  const saveProjectExcerpt = () => {
    console.log(projectDetail);
    if (projectDetail.name.length > 0 && projectDetail.description.length > 0) {
      FirebaseService.createProject(projectDetail)
        .then(() => {
          setAddDlgState(false);
          setOpen(false);
          loadProjects();
          setAlertSeverity('success');
          setAlertMsg('A project has been added.');
          setOpenAlert(true);
        })
        .catch((err) => {
          setAlertSeverity('error');
          setAlertMsg(err);
          setOpenAlert(true);
        });
    }
  };
  const changeProjectDetail = (prop: string) => (event: any) => {
    setProjectDetail({ ...projectDetail, [prop]: event.target.value });
  };
  const onDeleteProject = (ref: any, projectID: string) => {
    ref.current.hideActionMenu();
    setConfirmDlgState(true);
    setSelectedProject(projectID);
    console.log('delete the project--->', projectID);
  };
  const onCloseConfirmDlg = () => {
    setConfirmDlgState(false);
  };
  const onCloseAlert = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const onConfirmDeletion = () => {
    onCloseConfirmDlg();
    FirebaseService.deleteProject(selectedProject)
      .then(() => {
        loadProjects();
        setAlertMsg('A project has been deleted.');
        setAlertSeverity('error');
        setOpenAlert(true);
      })
      .catch((err) => {
        setAlertSeverity('error');
        setAlertMsg(err);
        setOpenAlert(true);
      });
  };
  const projects = filteredProjectList.map((item: IProject, i: number) => (
    <div key={'wrapper-' + i} className={classes.cardHolder}>
      <ProjectCard
        uid={item.uid}
        key={'project-' + i}
        name={item.name}
        description={item.description}
        content={item.content}
        onDelete={onDeleteProject}
        icon_image={item.icon_image}
        featured_image={item.featured_image}
        date=""
        ref={refs}
      />
    </div>
  ));
  const handleCapture = (props: string) => ({ target }) => {
    const image = target.files[0];
    const name = image.name;
    console.log(props, image);
    setImgProgressVisibility(true);
    const uploadTask = FirebaseService.storage
      .ref('images')
      .child(name)
      .put(image);
    uploadTask.on(
      'state_changed',
      function (snapshot) {
        const uploadProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(uploadProgress);
        console.log('Upload is ' + uploadProgress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function (error) {
        console.log('upload error: ', error);
        setImgProgressVisibility(false);
      },
      function () {
        setImgProgressVisibility(false);
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          console.log(featuredImageInputRef);
          if (props === 'featured_image') {
            featuredImageInputRef.current.value = downloadURL;
            setProjectDetail({ ...projectDetail, featured_image: downloadURL });
          } else {
            iconImageInputRef.current.value = downloadURL;
            setProjectDetail({ ...projectDetail, icon_image: downloadURL });
          }
        });
      }
    );
  };
  return (
    <div>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={onCloseAlert}>
        <Alert onClose={onCloseAlert} severity={alertSeverity}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <Dialog
        open={showConfirmDlg}
        onClose={onCloseConfirmDlg}
        aria-labelledby="confirm-dialog-title"
        className={classes.dialogWrapper}
      >
        <DialogTitle id="confirm-dialog-title">
          <WarningIcon />
          Warning
        </DialogTitle>
        <DialogContent>Are you sure to delete the project?</DialogContent>
        <DialogActions>
          <Button onClick={onCloseConfirmDlg} color="default">
            No
          </Button>
          <Button onClick={onConfirmDeletion} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAddDlg}
        onClose={closeAddDlg}
        aria-labelledby="add-dialog-title"
        className={classes.dialogWrapper}
      >
        <DialogTitle id="add-dialog-title">Add a new project</DialogTitle>
        <DialogContent>
          <Backdrop open={true} />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            InputLabelProps={{
              shrink: true,
            }}
            type="text"
            fullWidth
            required
            onChange={changeProjectDetail('name')}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            InputLabelProps={{
              shrink: true,
            }}
            type="text"
            fullWidth
            required
            onChange={changeProjectDetail('description')}
          />
          <TextField
            margin="dense"
            id="content"
            InputLabelProps={{
              shrink: true,
            }}
            label="Content"
            type="text"
            fullWidth
            onChange={changeProjectDetail('content')}
          />
          <TextField
            margin="dense"
            id="menu01"
            InputLabelProps={{
              shrink: true,
            }}
            label="Menu Item 1"
            type="text"
            fullWidth
            onChange={changeProjectDetail('menu01')}
          />
          <TextField
            margin="dense"
            id="menu02"
            InputLabelProps={{
              shrink: true,
            }}
            label="Menu Item 2"
            type="text"
            fullWidth
            onChange={changeProjectDetail('menu02')}
          />
          <div className={classes.uploadWrapper}>
            <TextField
              margin="dense"
              id="icon_image"
              label="Icon Image"
              inputRef={iconImageInputRef}
              InputLabelProps={{
                shrink: true,
              }}
              type="text"
              inputProps={{
                readOnly: true,
              }}
              fullWidth
              onChange={changeProjectDetail('icon_image')}
            />
            <input
              accept="image/*"
              className={classes.uploadInput}
              id="icon-image-button"
              onChange={handleCapture('icon_image')}
              type="file"
            />
            <label htmlFor="icon-image-button">
              <IconButton
                edge="end"
                size="medium"
                color="primary"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>

          <div className={classes.uploadWrapper}>
            <TextField
              margin="dense"
              id="featured_image"
              label="Featured Image"
              type="text"
              fullWidth
              inputRef={featuredImageInputRef}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                readOnly: true,
              }}
              onChange={changeProjectDetail('featured_image')}
            />
            <input
              accept="image/*"
              className={classes.uploadInput}
              id="featured-image-button"
              onChange={handleCapture('featured_image')}
              type="file"
            />
            <label htmlFor="featured-image-button">
              <IconButton
                edge="end"
                size="medium"
                color="primary"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          {showImgProgress && (
            <div className={classes.imgUploadProgress}>
              <CircularProgress value={progress} />
              <Typography
                variant="caption"
                component="div"
                color="textSecondary"
              >{`${progress}%`}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDlg} color="primary">
            Cancel
          </Button>
          <Button onClick={saveProjectExcerpt} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop open={open} className={classes.topMost}>
        {isFirstLoading && <CircularProgress color="inherit" />}
      </Backdrop>
      <SpeedDial
        ariaLabel="actions"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            key={index}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleClick(action.action)}
          />
        ))}
      </SpeedDial>
      <div className={styles.container} data-tid="container">
        <div className={classes.search}>
          <TextField
            id="search"
            label="Enter a project name"
            onChange={onSearch()}
          />
        </div>
        <div className={classes.root}>{projects}</div>
      </div>
    </div>
  );
};
export default Home;
