
import React from 'react'
async function func(messages,name,lat,lng){
  try{
    // const x=await append({role:'user',content:`i want to view properties near ${name} whose lat:${lat},lng:${lng}`});
    // console.log(x);
    console.log(messages);
    console.log("CLICKED")
  }
  catch(error)
  {
    console.error(error)
  }
}

const Options = ({name ,messages,lat,lng}) => {
  return (
    <div className="bg-gray-100 rounded-md p-2 text-center cursor-pointer " onClick={()=>func(messages,name,lat,lng)}>{name}</div>
  )
}

export default Options