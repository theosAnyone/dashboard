import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import  TextField  from '@mui/material/TextField';
import capitalizeFirstLetter from '../../utils/functions/CapitalizeFirstChar';
import { useState } from 'react';


const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

export default function UserTags({transmitTags,tagsTransmitted}) {

  const [tags, setTags] = React.useState(tagsTransmitted)
  const [textFieldValue, set_textFieldValue] = React.useState('')
  const [tag_label, set_tag_label] = useState("tags")
  const [tag_field_color, set_tag_field_color] = useState("success")



  const handleKeyDown = (event) => {
    if(event.code === 'Enter'){
        if(!textFieldValue)return
        if( tags.old.some(tag => tag === textFieldValue) || tags.new.some(tag => tag === textFieldValue)){
            set_tag_label("tag already exist")
            set_tag_field_color("error")
            return
        }

        setTags({...tags, new: [textFieldValue, ...tags.new]})

        transmitTags({...tags, new: [textFieldValue, ...tags.new]})
        set_textFieldValue('')
    }


  }

  const handleTagFieldChange = (event) => {

    if(tags.old.some(tag=> tag === event.target.value) || tags.new.some(tag=> tag === event.target.value)){

        set_tag_label("tag already exist")
        set_tag_field_color("error")
    }else{
        set_tag_label("tags")
        set_tag_field_color("success")
    }
    const value_transformed = capitalizeFirstLetter(event.target.value)
    set_textFieldValue(value_transformed)


  }

  const handleDelete = (chipToDelete) => () => {

    const old_tags_filtered = tags.old.filter( tag => tag !== chipToDelete)
    const new_tags_filtered =  tags.new.filter( tag => tag !== chipToDelete)
    setTags({new: new_tags_filtered, old: old_tags_filtered})
    transmitTags({new: new_tags_filtered, old: old_tags_filtered})

  };



  return (
    <>
      <TextField
        sx={{width:200,borderColor:tag_field_color,marginTop:2,marginRight:2}} 
        id='tags' 
        label={tag_label}
        variant='outlined' 
        onKeyDown={handleKeyDown} 
        onChange={(event) => {handleTagFieldChange(event)}} 
        value={textFieldValue}
        color={tag_field_color}
      />
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          height:300,
          width:'100%',
          maxHeight:400,
          overflow:'auto',
          p: 0.5,
          m: 0,
          mt: 1,
        }}
        component="ul"
        elevation={3}
      >

        {[...tags.new.map((data) => {

            return (
                <ListItem key={data} sx={{maxHeight:20, position:'relative', mt:2}}>
                <Chip label="new" sx={{bgcolor:'gold',color:'white', position:'absolute',width:60,height:20, right:10, top:-13, borderRadius:'24px',fontSize:15,zIndex:10}}/>
                    <Chip
                    label={data}
                    onDelete={handleDelete(data)}
                    sx={{fontSize:20}}
                    size='medium'
                    />
                </ListItem>
            );
          }),...tags.old.map((data) => {

                    return (
                        <ListItem key={data} sx={{maxHeight:20, position:'relative', mt:2}}>
                            <Chip
                            label={data}
                            onDelete={handleDelete(data)}
                            sx={{fontSize:20}}
                            size='medium'
                            
                            />
                        </ListItem>
                    );
             })
        ]}
         
      </Paper>
    </>
  );
}