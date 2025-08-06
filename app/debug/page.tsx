"use client"
import React from 'react'
import { CldUploadButton } from 'next-cloudinary'

const page = () => {
  return (
    <div>
      <CldUploadButton uploadPreset="<Upload Preset>" />
    </div>
  )
}

export default page