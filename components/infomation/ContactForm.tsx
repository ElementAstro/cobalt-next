'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // 模拟发送请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Form submitted:', { name, email, message })
    toast({
      title: "消息已发送!",
      description: "感谢您的留言，我们会尽快回复您。",
    })
    setName('')
    setEmail('')
    setMessage('')
    setIsSubmitting(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的姓名"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的邮箱"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">信息</label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的信息"
          rows={4}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "发送中..." : "发送消息"}
        </Button>
      </motion.div>
    </motion.form>
  )
}