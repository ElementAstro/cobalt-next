"use client";

import React, { memo } from "react";
import { useState } from "react";
import JsonEditor from "./JsonEditor";
import { parseInputData } from "./json-utils";
import { motion } from "framer-motion";

const sampleData = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    country: "USA",
  },
  hobbies: ["reading", "swimming", "coding"],
};

const Page = memo(function Page() {
  const [jsonData, setJsonData] = useState(sampleData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4 landscape:p-2"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto max-w-7xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
          JSON编辑器
        </h1>
        <JsonEditor
          initialData={parseInputData(jsonData)}
          onChange={(newData) => setJsonData(newData)}
        />
      </motion.div>
    </motion.div>
  );
});

export default Page;
