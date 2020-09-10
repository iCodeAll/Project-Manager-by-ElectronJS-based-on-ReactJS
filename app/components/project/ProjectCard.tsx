import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

interface IProps {
  uid: string;
  name: string;
  description: string;
  content?: string;
  icon_image?: string;
  featured_image?: string;
  date?: string;
  onDelete: (e: any, projectID: string) => void;
}
const ProjectCard = forwardRef((props: IProps, ref) => {
  const {
    uid,
    name,
    description,
    content,
    icon_image,
    featured_image,
    date,
    onDelete,
  } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState<boolean>(false);
  const { push } = useHistory();
  const [actionMenuVisibility, setActionMenuVisibility] = useState<boolean>(
    false
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const showActionMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    setActionMenuVisibility(true);
  };
  const closeActionMenu = () => {
    setAnchorEl(null);
    setActionMenuVisibility(false);
  };
  useImperativeHandle(ref, () => ({
    hideActionMenu() {
      setAnchorEl(null);
      setActionMenuVisibility(false);
      console.log("I'm clicked");
    },
  }));
  const doAction = (uid: string, action: string) => (event: any) => {
    event.preventDefault();
    console.log('---->', uid, action);
    closeActionMenu();
    switch (action) {
      case 'view':
        performProjectViewMode(uid);
        break;
      case 'edit':
        performProjectEditMode(uid);
        break;
      case 'delete':
        performProjectDeleteMode(uid);
        break;
      default:
        break;
    }
  };
  const performProjectViewMode = (projectID: string) => {

    const nativeImage = require('electron').nativeImage;
    const remote=require('electron').remote;
    const BrowserWindow=remote.BrowserWindow;

    const mainIcon = nativeImage.createFromPath(
      __dirname + '/../resources/icon.png'
    );
    const win = new BrowserWindow({
      height: 600,
      width: 800,
      icon: mainIcon,
      title: projectID,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
    }
    });
    win.setMenu(null);
    win.setTitle(projectID);
    // win.webContents.openDevTools();
    win.loadURL(`file://${__dirname}/app.html#/projects/view/${projectID}`);
    // push(`/projects/view/${projectID}?editable=false`);
  };
  const performProjectEditMode = (projectID: string) => {
    push(`/projects/edit/${projectID}?editable=true`);
  };
  const performProjectDeleteMode = (projectID: string) => {
    console.log('requested deletion....');
    onDelete.bind(undefined, projectID);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar alt={name} className={classes.avatar} src={icon_image}>
            PT
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="settings" id={uid} onClick={showActionMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={actionMenuVisibility}
              onClose={closeActionMenu}
            >
              <MenuItem onClick={doAction(uid, 'view')}>View</MenuItem>
              {/* <MenuItem onClick={doAction(uid, 'edit')}>Edit</MenuItem> */}
              <MenuItem onClick={() => onDelete(ref, uid)}>Delete</MenuItem>
            </Menu>
          </div>
        }
        title={name}
        subheader={date}
      />
      <CardMedia
        className={classes.media}
        image={
          featured_image && featured_image.length > 0
            ? featured_image
            : 'https://picsum.photos/300/200'
        }
        title={name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Full Notes:</Typography>
          <Typography paragraph>{content}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
});
export default ProjectCard;
