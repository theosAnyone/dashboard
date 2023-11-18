
import Box from '@mui/material/Box'
import  Rating  from '@mui/material/Rating'
import { Lens, PanoramaFishEye } from '@mui/icons-material'
import { useState } from 'react';
import { Typography } from '@mui/material';


const labels = {
    1: 'Catastrophic',
    2: 'Verry bad',
    3: 'Bad',
    4: 'Not verry good',
    5: 'Ok',
    6: 'A good thing',
    7: 'Multiples good things',
    8: 'Verry good',
    9: 'Brilliant',
    10: 'Masterclass',
  };

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const UserReview = ({handleRatingChange, ratingValue}) => {

  const [value, setValue] = useState(null);
  const [hover, setHover] = useState(-1);
  
  const onChangeRating = (newValue) => {

    setValue(newValue)
    handleRatingChange(newValue)

  }

  return (
          <Box sx={{
            display:"flex", flexDirection:"row", justifyContent:"center", alignItems:'center',
            '@media (min-width:1200px)': {
                flexDirection: 'row',
            },
            '@media (min-width:900px)': {
                flexDirection: 'column',
            },
            '@media (min-width:0px)': {
                flexDirection: 'column',
            },
          }}>
            <Rating
                name="hover-feedback"
                value={value || ratingValue}
                max={10}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                    onChangeRating(newValue)
                }}
                onChangeActive={(event, newHover) => {
                setHover(newHover);
                }}
                icon={<Lens color='success'/>}
                emptyIcon={<PanoramaFishEye style={{ opacity: 0.55 }} fontSize="inherit" color='success'/>}
                defaultValue={ratingValue ? ratingValue : null}
                
            />
            <Box sx={{ ml: 3,minWidth:160 }}><Typography sx={{fontFamily:'FigTree'}}>{labels[hover !== -1 ? hover : (value || ratingValue)]}</Typography></Box>
            </Box>

  )
  //note 
  //vocal
  //if casting
}

export default UserReview
