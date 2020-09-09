import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router';
import queryString from 'query-string';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SaveIcon from '@material-ui/icons/Save';
import ViewIcon from '@material-ui/icons/ViewCompact';
import CloseIcon from '@material-ui/icons/Close';
import FirebaseService from '../../utils/firestore';
import { IProject } from '../../models';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useIdleTimer } from 'react-idle-timer';

const Alert = (props: any) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
  },
  textField: {
    maxWidth: '300px',
    padding: '15px 0px',
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
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <ViewIcon />, name: 'View' },
  { icon: <CloseIcon />, name: 'Close' },
];
const ProjectDetailEdit: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams();
  const location = useLocation();
  const { push } = useHistory();
  const [editable, setEditable] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState<IProject>({
    uid: '',
    name: '',
    description: '',
    icon_image: '',
    featured_image: '',
    menu01: '',
    menu02: '',
    content: '',
    date: '',
  });
  const [operationState, setOperationState] = useState<{
    show: Boolean;
    msg: string;
  }>({
    show: false,
    msg: '',
  });
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (action: string) => (event: any) => {
    event.preventDefault();
    setOpen(false);
    switch (action) {
      case 'Close':
        push('/');
        break;
      case 'Save':
        onSaveClicked();
        break;
      case 'View':
        push(`/projects/view/${id}`);
        break;
      default:
        break;
    }
  };
  const onSaveClicked = () => {
    setOperationState({
      show: true,
      msg: 'Saving...',
    });
    FirebaseService.updateProject(id, projectDetails)
      .then(() => {
        setAlertMsg('The project details has been updated.');
        setAlertSeverity('success');
        setOpenAlert(true);
        setOperationState({
          show: false,
          msg: '',
        });
      })
      .catch((err) => {
        setAlertMsg(err);
        setAlertSeverity('error');
        setOpenAlert(true);

        setOperationState({
          show: false,
          msg: '',
        });
      });
  };
  const changeProjectDetail = (prop: string) => (event: any) => {
    setProjectDetails({ ...projectDetails, [prop]: event.target.value });
  };
  const loadProjectDetails = () => {
    setOperationState({
      show: true,
      msg: 'Loading...',
    });
    FirebaseService.getProjectByID(id)
      .then((project) => {
        if (project.exists) {
          const item: IProject = {
            ...(project.data() as IProject),
            uid: project.id,
          };
          setProjectDetails(item);
          setOperationState({
            show: false,
            msg: '',
          });
        } else {
          setProjectDetails({
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
          setOperationState({
            show: false,
            msg: '',
          });
        }
      })
      .catch((err) => {
        setAlertMsg(err);
        setAlertSeverity('error');
        setOpenAlert(true);
        setOperationState({
          show: false,
          msg: '',
        });
      });
  };
  const handleOnIdle = () => {
    onSaveClicked();
  };

  const handleOnActive = () => {};

  const handleOnAction = () => {};

  useIdleTimer({
    timeout: 1000 * 10 * 1,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });
  useEffect(() => {
    loadProjectDetails();
    const queryParams: any = queryString.parse(location.search);
    if (queryParams && queryParams.editable) setEditable(queryParams.editable);
    else setEditable(false);
    console.log('project is editable--->', queryParams.editable);
  }, []);
  const onCloseAlert = () => {
    setOpenAlert(false);
  };
  return (
    <div className={classes.root}>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={onCloseAlert}>
        <Alert onClose={onCloseAlert} severity={alertSeverity}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <Backdrop open={open}>
        {operationState.show && (
          <CircularProgress aria-label="loading..." color="inherit" />
        )}
      </Backdrop>
      <SpeedDial
        ariaLabel="actions"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose('cancel')}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose(action.name)}
          />
        ))}
      </SpeedDial>
      <div className={classes.form}>
        <TextField
          autoFocus
          margin="normal"
          id="name"
          label="Name"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            readOnly: Boolean(editable),
          }}
          required
          value={projectDetails.name}
          className={classes.textField}
          onChange={changeProjectDetail('name')}
        />
        <TextField
          margin="normal"
          id="description"
          label="Description"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.description}
          className={classes.textField}
          required
          onChange={changeProjectDetail('description')}
        />
        <TextField
          margin="normal"
          id="content"
          label="Content"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.content}
          className={classes.textField}
          fullWidth
          onChange={changeProjectDetail('content')}
        />
        <TextField
          margin="normal"
          id="menu01"
          label="Menu Item 01"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.menu01}
          className={classes.textField}
          fullWidth
          onChange={changeProjectDetail('menu01')}
        />
        <TextField
          margin="normal"
          id="menu02"
          label="Menu Item 02"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.menu02}
          className={classes.textField}
          fullWidth
          onChange={changeProjectDetail('menu02')}
        />
        <TextField
          margin="normal"
          id="icon_image"
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.icon_image}
          label="Icon Image"
          className={classes.textField}
          type="text"
          fullWidth
          onChange={changeProjectDetail('icon_image')}
        />
        <TextField
          margin="normal"
          id="featured_image"
          label="Featured Image"
          InputLabelProps={{
            shrink: true,
          }}
          value={projectDetails.featured_image}
          className={classes.textField}
          type="text"
          fullWidth
          onChange={changeProjectDetail('featured_image')}
        />
      </div>
    </div>
  );
};

export default ProjectDetailEdit;
