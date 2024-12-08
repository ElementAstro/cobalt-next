'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

interface MathCaptchaProps {
  isDarkMode: boolean
  isHighContrast: boolean
  onError: () => void
  onSuccess: () => void
  isDisabled: boolean
}

export function MathCaptcha({ isDarkMode, isHighContrast, onError, onSuccess, isDisabled }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState<'+' | '-' | '*'>()
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    generateNewProblem()
  }, [])

  const generateNewProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 1)
    setNum2(Math.floor(Math.random() * 10) + 1)
    setOperator(['+', '-', '*'][Math.floor(Math.random() * 3)] as '+' | '-' | '*')
    setUserAnswer('')
    setIsCorrect(null)
    setAttempts(0)
    setFeedback('')
  }

  const calculateCorrectAnswer = () => {
    switch (operator) {
      case '+': return num1 + num2
      case '-': return num1 - num2
      case '*': return num1 * num2
    }
  }

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === calculateCorrectAnswer()
    setIsCorrect(correct)
    setAttempts(attempts + 1)
    if (correct) {
      setFeedback('验证成功!')
      onSuccess()
      setTimeout(generateNewProblem, 2000)
    } else {
      onError()
      if (attempts >= 2) {
        setFeedback(`验证失败。正确答案是 ${calculateCorrectAnswer()}。`)
        setTimeout(generateNewProblem, 3000)
      } else {
        setFeedback(`验证失败,还有 ${3 - attempts - 1} 次机会。`)
      }
    }
  }

  const getTextColor = () => {
    if (isHighContrast) {
      return isDarkMode ? 'text-yellow-300' : 'text-blue-700'
    }
    return isDarkMode ? 'text-gray-200' : 'text-gray-800'
  }

  return (
    <motion.div 
      className={`space-y-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`text-lg font-semibold ${getTextColor()}`}>
        {num1} {operator} {num2} = ?
      </div>
      <Input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="输入答案"
        className={isDarkMode ? 'bg-gray-700 text-white' : ''}
        disabled={isDisabled}
        aria-label="数学问题答案"
      />
      <Button onClick={checkAnswer} className="w-full" disabled={isDisabled}>
        验证
      </Button>
      {feedback && (
        <motion.div 
          className={`text-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {feedback}
        </motion.div>
      )}
    </motion.div>
  )
}

