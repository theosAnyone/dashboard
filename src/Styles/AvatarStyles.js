import  makeStyles  from "@mui/styles/makeStyles";

export const useAvatarStyles = makeStyles((theme)=>({
  responsiveAvatar: {
    // Taille par défaut
    height: '200px',
    width: '200px',
    borderRadius: '10px',

    // Taille pour les petits écrans (smartphones)
    [theme.breakpoints.down('sm')]: {
      height: '150px',
      width: '150px',
    },

    // Taille pour les écrans moyens (tablettes)
    [theme.breakpoints.up('md')]: {
      height: '200px',
      width: '200px',
    },

    // Taille pour les grands écrans (ordinateurs de bureau)
    [theme.breakpoints.up('lg')]: {
      height: '200px',
      width: '200px',
    },
  },

}));