import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import FirebaseService from '../../utils/firestore';

import { IProject } from '../../models';

import styles from './Project.css';

const actions = [
  { icon: <EditIcon />, name: 'Edit' },
  // { icon: <CloseIcon />, name: 'Close' },
];

const ProjectDetailView: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { push } = useHistory();
  const { id } = useParams();
  const [projectDetails, setProjectDetails] = useState<IProject>({
    uid: '',
    name: '',
    description: '',
    icon_image: '',
    featured_image: '',
    content: '',
    date: '',
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleListItemClick = (event: any, index: number) => {
    setSelectedIndex(index);
  };
  const loadProjectDetails = () => {
    FirebaseService.getProjectByID(id)
      .then((project: any) => {
        if (project.exists) {
          const item: IProject = {
            ...(project.data() as IProject),
            uid: project.id,
          };
          setProjectDetails(item);
        } else {
          setProjectDetails({
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
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const handleClose = (action: string) => (event: any) => {
    event.preventDefault();
    setOpen(false);
    switch (action) {
      case 'Close':
        push('/');
        break;
      case 'Edit':
        push(`/projects/edit/${id}`);
        break;
      default:
        break;
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    loadProjectDetails();
  }, []);
  return (
    <div className={styles.container}>
      <Backdrop open={open}></Backdrop>
      <SpeedDial
        ariaLabel="actions"
        className={styles.speedDial}
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
      <div className={styles.leftContent}>
        <h2 className={styles.title}>{projectDetails.name}</h2>
        <div className={styles.featuredImage}>
          <img src={projectDetails.featured_image} />
        </div>
        <div className={styles.description}>{projectDetails.description}</div>
        <List component="nav" aria-label="menu">
          <ListItem
            button
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemText primary="Menu Item 1" />
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemText primary="Menu Item 2" />
          </ListItem>
        </List>
      </div>
      <div className={styles.rightContent}>
        {
          selectedIndex === 0 && (
            <div>
              {projectDetails.menu01}
            </div>
          )
        }
        {
          selectedIndex === 1 && (
            <div>
            {projectDetails.menu02}
          </div>
          )
        }
      </div>
    </div>
  );
};

export default ProjectDetailView;
