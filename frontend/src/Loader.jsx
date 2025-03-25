import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center'>
      <div className='w-[30px] h-[30px] rounded-full flex  justify-center items-center bg-conic from-blue-600 to-50% animate-spin'>
        <div className='w-[20px] h-[20px] rounded-full bg-[white]'></div>
      </div>
    </div>
  )
}

export default Loader
