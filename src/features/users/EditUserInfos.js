import { Alert, Avatar, Box, CircularProgress, Snackbar, Stack } from '@mui/material'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TabPanel from '../../components/TabPanel';
import * as React from 'react';
import PropTypes from 'prop-types';

import {  styled } from '@mui/material/styles';

import Fade from '@mui/material/Fade';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SellIcon from '@mui/icons-material/Sell';
import CloudIcon from '@mui/icons-material/Cloud';
import SendIcon from '@mui/icons-material/Send';
import CloudUpload  from '@mui/icons-material/CloudUpload';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';


import Fab from '@mui/material/Fab';


import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button  from '@mui/material/Button';

import UserReview from './UserReview'
import { useAddNewBotMutation } from '../discordBot.js/DiscordBotApiSlice';
import { useAddNewReviewMutation } from '../reviews/ReviewApiSlice';
import {  useGetUsersQuery, useUpdateUserMutation } from './usersApiSlice';
import { useSelector } from 'react-redux';
import { useAddTeacherReviewMutation } from '../teachers/teachersApiSlice';


const EditUserInfos = ({ user_init }) => {

  const teacher_id = useSelector((state) => state.auth.teacher_id)

  const {first_name, last_name, anyone_profile} = useSelector((state) => state.teacher)

  const [ addReview, { data:ReviewData, error:ReviewError, isLoading:ReviewIsLoading, isError:ReviewIsError,  isSuccess:ReviewIsSuccess }] = useAddNewReviewMutation();

  const [ updateUser, { data:updatedUserData, error:updateUserError, isLoading:updateUserIsLoading, isError:updateUserIsError, isSuccess:updateUserIsSuccess }] = useUpdateUserMutation();

  const [ postToBot,{data:BotData, error:BotError, isLoading:BotIsLoading, isError:BotIsError, isSuccess:BotIsSuccess, status:BotStatus}] = useAddNewBotMutation()

  const [addTeacherReview, {data: TeacherReviewData, error:TeacherReviewError, isLoading:TeacherReviewIsLoading, isError:TeacherReviewIsError, isSuccess:TeacherReviewIsSucces}] = useAddTeacherReviewMutation()

  
  const [user, set_user] = React.useState(user_init)

  const [activeStep, setActiveStep] = React.useState(0);
  const [notes, set_notes] = React.useState({init:null})
  const [demos_checked, set_demos_checked] = React.useState({init:[]})
  const [tags, set_tags] = React.useState({init:[],new:[],old:[]})
  const [remaining_tags, set_remaining_tags] = React.useState(0)
  const [file_name, set_file_name] = React.useState({init: "upload mp3"})
  const [files, set_files] = React.useState({init:[]})

  const blocs = user.Journey_Infos.blocs
  const blocs_length = blocs?.length
  const blocs_completed = blocs_length && blocs.filter(bloc => bloc.completed)
  const blocs_reviewed = blocs_length && blocs.filter(bloc => bloc.reviewed || bloc.reviews?.length )
  const bloc_name_init = blocs_length && blocs[0].blocName
  const chosen_block_init = blocs_length && blocs[0]
  const psId = user.Discord_Infos.privateSpaceId;

  const [chosen_block,set_chosen_block] = React.useState(chosen_block_init)
  const [bloc_reviewed, set_bloc_reviewed] = React.useState(blocs_length && (blocs[0].reviewed || blocs[0].reviews?.length))
  const [bloc_name, set_bloc_name] = React.useState(bloc_name_init)

  const [step_content, set_step_content] = React.useState(null)
  const [snackbar, set_snackbar] = React.useState(null)

  const [show_rating, set_show_rating] = React.useState(true)
  const [show_demo, set_show_demo] = React.useState(false)
  const [show_file, set_show_file] = React.useState(false)
  const [show_tags, set_show_tags] = React.useState(false)
  const [show_review_button, set_show_review_button] = React.useState(false)
  const [change_status_fullfiled, set_change_status_fullfiled] = React.useState(true)

  const containerRef = React.useRef(null);
  console.log("note:",notes[bloc_name]);
  console.log("chosen_bloc_comleted:", chosen_block.completed);

  // console.log("ReviewIsLoading:",ReviewIsLoading,'\nupdateUserIsLoading:', updateUserIsLoading, "\nBotIsLoading:" ,BotIsLoading, "\nuserQueryIsLoading:", userQueryIsLoading);
  // console.log("ReviewIsSucces:",ReviewIsSuccess, '\nupdateUserIsSuccess', updateUserIsSuccess, "\nBotIsSuccess",BotIsSuccess,"\nuserQueryIsSuccess",userQueryIsSuccess)

  const hide_all = (but_this_one) => {
    const setters = [
      set_show_rating,
      set_show_demo,
      set_show_file,
      set_show_tags,
      set_show_review_button
    ];
  
    for (let i = 0; i < setters.length; i++) {
      // Convertissez i en chaîne si but_this_one est une chaîne, ou laissez-le en tant que nombre si but_this_one est un nombre
      if (but_this_one !== i ) {
        setters[i](false); // Appelez la fonction pour cacher l'élément
      } 
    }
  };

  const steps = [
    {label:'Attribute mark',description:'not visible by the student'},
    {label:'Check demos',description:'at least one'},
    {label:'Upload vocal',description:'mp3 file'},
    {label:'Add some tags',description:remaining_tags} 
  ];


  React.useEffect(()=>{
    if(!notes[bloc_name]){
      setActiveStep(0)
      set_show_rating(true)
      hide_all(0)
      return
    }
    if(notes[bloc_name]){
      setActiveStep(1)
      set_show_demo(true)
      hide_all(1)

    }
    if(!demos_checked[bloc_name]?.length){
      setActiveStep(1)
      set_show_demo(true)
      hide_all(1)
      return
    } 
    if(demos_checked[bloc_name].length){
      setActiveStep(2)
      set_show_file(true)
    }
    if(!files[bloc_name]?.length){
      setActiveStep(2)
      set_show_file(true)
      return
    }
    if(files[bloc_name].length){
      setActiveStep(3)
      set_show_file(false)
      
    }
    if(activeStep === 3){

      let tags_total = 0;

      for(const key in tags){
        if(tags[key]?.length){
          tags_total+=tags[key].length
        }
      }
      const tags_total_needed = blocs_completed.length * 3
      const tags_remaining = tags_total_needed - tags_total

      if(tags_remaining <= 0 || blocs.length - blocs_reviewed.length > 1){
        setActiveStep(4)
        set_show_review_button(true)
        return
      }
      setActiveStep(3)
      set_show_review_button(false)
      set_remaining_tags(tags_remaining)

    }
  },[notes, demos_checked, files, tags, bloc_name, blocs])


  React.useEffect( () => {
    if(!chosen_block) return
    if(!chosen_block.completed) return
    if(show_rating){
      set_step_content(
        <UserReview handleRatingChange={onRatingChange} ratingValue={notes[bloc_name] ?? notes.init} />
      )
    }
    else if(show_file){
      set_step_content(
          <Fade in={true }  timeout={500} >
            <Button 
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              sx={{fontFamily:'Figtree',minWidth:100 }}

            >
              {file_name[bloc_name] ?? file_name.init}
              <VisuallyHiddenInput 
                type="file" 
                accept='.mp3'
                onChange={(e)=>{
                  handlefile(e)
                }}

              />
            </Button>

          </Fade>
      )
    }
    else if(show_review_button && activeStep === steps.length){
      set_step_content(
          <Fade in={true }  timeout={500}  >
          <Fab variant='extended' sx={{fontFamily:'Figtree',minWidth:100 }} color='success' onClick={handleReviewClicked}>
            <SendIcon sx={{mr:1}}/>
            Send review
          </Fab>
        </Fade>
      )
    }
    else {
      set_step_content(null)
    }
  },[show_rating, show_file, show_review_button, bloc_name])


  React.useEffect( () => {

    if(ReviewIsLoading || updateUserIsLoading || BotIsLoading || TeacherReviewIsLoading){
      set_step_content(
        <CircularProgress color='success' />
      )
    }
  }, [ReviewIsLoading, updateUserIsLoading, BotIsLoading, TeacherReviewIsLoading])


  React.useEffect( () => {
    if(!updateUserIsSuccess) return
    if(updateUserIsSuccess){
      set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='success' sx={{ width: '100%' }}>Updated Successfuly</Alert>
        </Snackbar>
      );
      set_step_content(<UserReview handleRatingChange={onRatingChange} ratingValue={notes[bloc_name] ?? notes.init} />)
    }
  },[updateUserIsSuccess])

  React.useEffect( () => {
    if(!ReviewIsError && !BotIsError && !updateUserIsError && !TeacherReviewIsError) return
    if(ReviewIsError){
      set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>Review Error</Alert>
        </Snackbar>
      )
    }
    if(BotIsError){
      set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>Error sending vocal</Alert>
        </Snackbar>
      )
      console.log("bot error:", BotError);
    }
    if(updateUserIsError){
        set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>Error updating user</Alert>
        </Snackbar>
      )
      console.log("user error:", updateUserError);
    }
    if(TeacherReviewIsError){
        set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>Error adding Teacher Review</Alert>
        </Snackbar>
      )
      console.log("user error:", TeacherReviewError);
    }
    set_step_content(
      <Fade in={true} timeout={500}>
        <Fab
          variant="extended"
          sx={{ fontFamily: "Figtree", minWidth: 100 }}
          color="success"
          onClick={handleReviewClicked}
        >
          <SendIcon sx={{ mr: 1 }} />
          Send review
        </Fab>
      </Fade>
    );
    
    
  },[ReviewIsError,BotIsError,updateUserIsError, TeacherReviewIsError])


  const blocNameFromTabPanel = (bloc) => {
    set_bloc_name(bloc.blocName)
    set_chosen_block(bloc)
  }

  const bloc_reviewed_passed = (bool) => {

    set_bloc_reviewed(bool)
  }

  const handleReviewClicked = async () => {
    
    const file_name = bloc_name + ".mp3"
    const vocal = files[bloc_name]
    
    const bot_body_payload = {
      psId,
      vocal,
      fileName: file_name,
      user_name: user.Discord_Infos.displayName,
      bloc_name,
      teacher_first_name: first_name,
      teacher_last_name: last_name,
      teacher_anyone_profile: anyone_profile,
    };
    try {
      const url = await postToBot(bot_body_payload).unwrap()

      if(!url) return console.log("error posting review on discord")
      
      const review_body_payload = {
        teacherId:teacher_id,
        userId:user._id,
        note:notes[bloc_name],
        demos:demos_checked[bloc_name],
        tags:tags.new,
        url
      }

      const saved_review = await addReview(review_body_payload).unwrap()
      if(!saved_review) return console.log("error saving review")

      set_tags({new:[],old:[...saved_review.tags, ...tags.old]})

      const teacher_review_body_payload = {
        teacher_id,
        review_id:saved_review._id,
        id:teacher_id
      }

      const updated_teacher = await addTeacherReview(teacher_review_body_payload).unwrap()
      if(!updated_teacher) return console.log('error updating teacher')
      
      const update_user_body_payload = {
        userId:user._id,
        blocName:bloc_name,
        review_id:saved_review._id,
        tags:[...tags.new,...tags.old],
        id:user._id,
      }

      const updated_user = await updateUser(update_user_body_payload).unwrap()
      set_user(updated_user)
      if(!updated_user) return console.log("error updating user")

    } catch (error) {
        console.log(error);
        set_snackbar(
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>{`Error ${error?.data?.message ? error.data.message : error}` }</Alert>
        </Snackbar>
      )
    }


  }

 const  handleChangeMenuItemClick = async (status) => {

  set_change_status_fullfiled(false)
    switch(status){
      case "Reviewed":
        const update_user_body_reviewed_payload = {
          userId:user._id,
          blocName:bloc_name,
          review_id:"655168a5c2fe267ac89dab53",
          tags:[...tags.new,...tags.old],
          id:user._id,
        }
        const updated_user_reviewed = await updateUser(update_user_body_reviewed_payload).unwrap()
        if(!updated_user_reviewed) return console.log("error updating user")
        set_change_status_fullfiled(true)
        set_user(updated_user_reviewed)
        break

      case "Not Reviewed":
        const update_user_body_not_reviewed_payload = {
          userId:user._id,
          blocName:bloc_name,
          review_id:"655168a5c2fe267ac89dab53",
          set_not_reviewed:true,
          tags:[...tags.new,...tags.old],
          id:user._id,
        }
        const updated_user_not_reviewed = await updateUser(update_user_body_not_reviewed_payload).unwrap()
        console.log("user updated:",updated_user_not_reviewed);
        if(!updated_user_not_reviewed) return console.log("error updating user")
        set_user(updated_user_not_reviewed)
        set_change_status_fullfiled(true)
          break
      default:
        break
    }
 }

  const onRatingChange = (value) => {
    console.log("rating change bloc name value : ", bloc_name);
    set_notes( {...notes, [bloc_name] : value })
  }

  const demoFromTabPanel = (demo_checked_list) => {

    set_demos_checked({...demos_checked, [bloc_name] :  demo_checked_list})
  }

  const handleTagsFormTabPanel = (tags_from_child) => {
    set_tags(tags_from_child)
  }

  const handlefile = async (e) => {
    const file = e.target.files[0];
    if(!file){
      set_files( {...files, [bloc_name] : null} )
      return
    }

    set_file_name({...file_name,[bloc_name]:file.name})

    const data = new FileReader();

    data.addEventListener('load', () => {
      set_files({...files, [bloc_name] : data.result})
    })
    data.readAsDataURL(file)

  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
        'linear-gradient(136deg, rgba(235,46,191,1) 14%, rgba(242,67,67,1) 38%, rgba(116,203,255,1) 76%, rgba(0,152,242,1) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
        'linear-gradient(136deg, rgba(240,24,24,1) 0%, rgba(229,35,155,1) 50%, rgba(72,22,216,1) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
  }));
  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient(136deg, rgba(161,211,240,1) 0%, rgba(81,182,242,1) 50%, rgba(0,152,242,1) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient(136deg, rgba(240,24,24,1) 0%, rgba(229,35,155,1) 50%, rgba(72,22,216,1) 100%)',
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <ThumbsUpDownIcon sx={{cursor:'pointer'}}/>,
      2: <CheckBoxIcon />,
      3: <CloudIcon />,
      4: <SellIcon />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

  const sub_chip = user.Discord_Infos.grade === "Pro" ? (
      <Chip
        label="Pro"
        clickable={true}
        sx={{
          width: 100,
          background: "linear-gradient(112.91deg, #FF022F 0%, #3700D2 94.35%)",
          color: "white",
        }}
      />
    ) : (
      <Chip
        label="Carriere"
        clickable={true}
        sx={{
          width: 100,
          background: "linear-gradient(112.91deg, #000000 0%, #9a9595 94.35%)",
          color: "white",
        }}
      />
    );
    
  const Typo = styled('h2') (({theme}) => ({

    fontFamily: "Figtree",
    margin:0,
    fontWeight: 600,
    fontSize: '40px', // Taille par défaut
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px', // Taille plus petite pour les écrans jusqu'à 'small'
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '40px', // Taille plus petite pour les écrans jusqu'à 'small'
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '40px', // Taille moyenne pour les écrans 'medium' et plus
    },
    [theme.breakpoints.down('xs')]:{
      fontSize: '10px'
    }
      // Ajoutez d'autres breakpoints si nécessaire
  }));
        

  return (

      <Paper style={{ padding: 50, minHeight: "100vh",overflowY:'auto' }} elevation={0}>
        {snackbar}
        <Paper
          elevation={3}
          style={{
            borderRadius: 20,
            padding: 10,
            minWidth:410,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box className="user_infos_header" sx={{
            '@media (min-width:900px)': {
                flexDirection: 'column',
            },
            '@media (min-width:1200px)': {
                flexDirection: 'row',
            },
            '@media (min-width:0px)': {
                      flexDirection: 'column',
                    },
          }}>
            <div className="avatar_infos">
              <Paper elevation={3} sx={{
                      borderRadius:'20px',
                      height: {
                        xs: '100px', // Taille sur les très petits écrans
                        sm: '150px', // Taille sur les petits écrans
                        md: '200px', // Taille sur les écrans moyens
                        lg: '200px', // Taille sur les grands écrans
                        xl: '250px'  // Taille sur les très grands écrans
                      },
                      width: {
                        xs: '100px', // Taille sur les très petits écrans
                        sm: '150px', // Taille sur les petits écrans
                        md: '200px', // Taille sur les écrans moyens
                        lg: '200px', // Taille sur les grands écrans
                        xl: '250px'  // Taille sur les très grands écrans
                      }
              }}>
                <Avatar
                  src={user.Discord_Infos.avatar_url}
                  variant="square"
                    sx={{  
                      borderRadius:'20px',
                      height: {
                        xs: '100px', // Taille sur les très petits écrans
                        sm: '150px', // Taille sur les petits écrans
                        md: '200px', // Taille sur les écrans moyens
                        lg: '200px', // Taille sur les grands écrans
                        xl: '250px'  // Taille sur les très grands écrans
                      },
                      width: {
                        xs: '100px', // Taille sur les très petits écrans
                        sm: '150px', // Taille sur les petits écrans
                        md: '200px', // Taille sur les écrans moyens
                        lg: '200px', // Taille sur les grands écrans
                        xl: '250px'  // Taille sur les très grands écrans
                      }
                    }}
                />
              </Paper>
              <div className="user_infos">
                {sub_chip}
                <Typo
                >
                  {user.Discord_Infos.displayName}
                </Typo>
                <em>{user.Discord_Infos.discordId}</em>
              </div>
            </div>
            {!bloc_reviewed && chosen_block.completed && (
              <Box
                sx={{
                  width: "100%",
                  minHeight: 174,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                ref={containerRef}
              >
                <Fade
                  in={!bloc_reviewed}
                  container={containerRef.current}
                  timeout={500}
                >
                  <Stepper
                    alternativeLabel
                    activeStep={activeStep}
                    sx={{ mt: 7.5 }}
                    connector={<ColorlibConnector />}
                  >
                    {steps.map((step, index) => {
                      let click_func;
                      switch (index) {
                        case 0:
                          click_func = () => {
                            if (activeStep < 0) return;
                            set_show_file(false);
                            set_show_review_button(false);
                            set_show_rating(true);
                          };
                          break;
                        case 1:
                          click_func = () => {
                            if (activeStep < 1) return;
                            set_show_file(false);
                            set_show_review_button(false);
                            set_show_rating(false);
                          };
                          break;
                        case 2:
                          click_func = () => {
                            if (activeStep < 2) return;
                            set_show_rating(false);
                            set_show_review_button(false);
                            set_show_file(true);
                          };
                          break;
                        case 3:
                          click_func = () => {
                            if (activeStep < 3) return;
                            set_show_rating(false);
                            set_show_file(false);
                            activeStep === steps.length &&
                              set_show_review_button(true);
                          };
                          break;
                        default:
                          break;
                      }

                      return (
                        <Step key={step.label}>
                          <StepLabel
                            StepIconComponent={ColorlibStepIcon}
                            onClick={click_func}
                            sx={{ cursor: "pointer" }}
                          >
                            {
                              <Stack spacing={1} direction={"column"}>
                                <Typography
                                  fontFamily={"FigTree"}
                                  fontWeight={600}
                                >
                                  {step.label}
                                </Typography>
                                {activeStep === index && (
                                  <Typography variant="caption">
                                    {step.description}
                                  </Typography>
                                )}
                              </Stack>
                            }
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Fade>
              </Box>
            )}
          </Box>
          {!bloc_reviewed &&  chosen_block.completed && (
            <Box
              sx={{
                width: "100%",
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Box display={"flex"} width={"100%"} alignItems={"flex-end"} justifyContent={"flex-end"}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    '@media (min-width:1200px)': {
                      width: '50%',
                    },
                    '@media (min-width:900px)': {
                      width: '100%',
                    },
                    '@media (min-width:0px)': {
                      width: '100%',
                    },
                  }}
                >
                  {step_content}
                </Box>
              </Box>
            </Box>
          )}
          <TabPanel
            row_progress={user.Journey_Infos.progress}
            user={user}
            handleReviewClicked={handleReviewClicked}
            transmit_demo_to_EditUserInfos={demoFromTabPanel}
            transmit_tags_to_EditUserInfos={handleTagsFormTabPanel}
            pass_bloc_name_to_parent={blocNameFromTabPanel}
            pass_bloc_reviewed_to_parent={bloc_reviewed_passed}
            handleChangeMenuItemClick={handleChangeMenuItemClick}
            change_status_fullfiled={change_status_fullfiled}
          />
        </Paper>
      </Paper>

  );
}

export default EditUserInfos

