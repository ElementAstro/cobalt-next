"use client"

import React, { memo } from 'react'
import { useState } from 'react'
import JsonEditor from './JsonEditor'
import { parseInputData } from './json-utils'

const sampleData = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    country: "USA"
  },
  hobbies: ["reading", "swimming", "coding"]
}

const Page = memo(function Page() {
  const [jsonData, setJsonData] = useState(sampleData)

  const handleJsonChange = (newData: any) => {
    setJsonData(newData)
    console.log("Updated JSON:", newData)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced JSON Editor</h1>
      <JsonEditor initialData={parseInputData(jsonData)} onChange={handleJsonChange} />
    </div>
  )
})

export default Page

