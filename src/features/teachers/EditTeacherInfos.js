import React from 'react'

const EditTeacherInfos = ({teacher}) => {
  return (
      <>
        <p>{teacher.first_name}</p>
        <p>{teacher.last_name}</p>
      </>
  )
}

export default EditTeacherInfos
