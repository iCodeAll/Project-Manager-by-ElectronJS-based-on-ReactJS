import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { red, green } from '@material-ui/core/colors';
import clsx from 'clsx';
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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import routes from '../constants/routes.json';
import styles from './Home.css';
import ProjectCard from './ProjectCard';
import { autoUpdater, IpcMain } from 'electron';
import { white } from 'chalk';

import { IProjectList, IProject } from '../models';
import FirestoreService from '../utils/firestore';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    transform: 'translateZ(0px)',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
}));

const actions = [
  { icon: <AddIcon />, name: 'add a new project', action: 'add' },
];

export default function Home(): JSX.Element {
  const classes = useStyles();
  const [projectList, setProjectList] = useState<IProjectList>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showAddDlg, setAddDlgState] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [projectDetail, setProjectDetail] = useState<IProject>({
    id: '',
    name: '',
    description: '',
    icon_image: '',
    featured_image: '',
    date: '',
  });
  const reloadProjects = () =>{
    FirestoreService.authenticateAnonymously()
      .then((userCredential) => {
        console.log('credential---->', userCredential);
        let itemList: IProjectList = [];
        FirestoreService.getProjectList(keyword).then((list) => {
          list.forEach(function (doc) {
            console.log(doc.data());
            itemList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setProjectList(itemList);
          setOpen(false);
          setIsFirstLoading(false);
        });
      })
      .catch(() => console.log('anonymous-auth-failed'));
  }
  useEffect(() => {
    console.log('setting....');
    reloadProjects();
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
      id: '',
      name: '',
      description: '',
      icon_image: '',
      featured_image: '',
      date: '',
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

      FirestoreService.createProject(projectDetail)
        .then((docRef) => {
          console.log('a project has been created!');
          reloadProjects();
          setAddDlgState(false);
          setOpen(false);
        })
        .catch((reason) => console.log('project creation failed!'));
    }
  };
  const changeProjectDetail = (prop: string) => (event: any) => {
    setProjectDetail({ ...projectDetail, [prop]: event.target.value });
  };

  const projects = projectList.map((item: IProject, i: string) => (
    <div key={'wrapper-' + i} className={classes.cardHolder}>
      <ProjectCard
        key={'project-' + i}
        name={item.name}
        description={item.description}
        content={item.content}
      />
    </div>
  ));
  return (
    <div>
      <Dialog
        open={showAddDlg}
        onClose={closeAddDlg}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill up the form.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            required
            onChange={changeProjectDetail('name')}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            required
            onChange={changeProjectDetail('description')}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            onChange={changeProjectDetail('content')}
          />
          <TextField
            margin="dense"
            id="icon_image"
            label="Icon Image"
            type="text"
            fullWidth
            onChange={changeProjectDetail('icon_image')}
          />
          <TextField
            margin="dense"
            id="featured_image"
            label="Featured Image"
            type="text"
            fullWidth
            onChange={changeProjectDetail('featured_image')}
          />
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
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        // hidden={hidden}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <Backdrop open={open}>
          {isFirstLoading && <CircularProgress color="inherit" />}
        </Backdrop>
        {actions.map((action, index) => (
          <SpeedDialAction
            key={index}
            icon={action.icon}
            tooltipTitle={action.name}
            // tooltipOpen
            onClick={() => handleClick(action.action)}
          />
        ))}
      </SpeedDial>
      <div className={styles.container} data-tid="container">
        {/* <h2>Projects</h2> */}
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
}
