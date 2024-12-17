'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useCaptchaStore } from "@/lib/store/captcha";
import { CaptchaProps } from '@/types/captcha'

export function MathCaptcha(props: CaptchaProps) {
  const {
    isDarkMode,
    isHighContrast,
    onError,
    onSuccess,
    isDisabled,
    difficulty,
    soundEnabled
  } = useCaptchaStore();

  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>()
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateNewProblem()
  }, [])

  const generateNewProblem = () => {
    const range = difficulty === 'easy' ? 10 : 
                 difficulty === 'normal' ? 20 : 50;
    const operators = difficulty === 'easy' ? ['+', '-'] :
                     difficulty === 'normal' ? ['+', '-', '*'] :
                     ['+', '-', '*', '/'];
    
    setNum1(Math.floor(Math.random() * range) + 1);
    setNum2(Math.floor(Math.random() * range) + 1);
    setOperator(operators[Math.floor(Math.random() * operators.length)] as any);
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
      case '/': return num1 / num2
    }
  }

  const checkAnswer = () => {
    setLoading(true);
    const correct = parseInt(userAnswer) === calculateCorrectAnswer()
    setIsCorrect(correct)
    setAttempts(attempts + 1)
    if (correct) {
      setFeedback('验证成功!')
      onSuccess()
      playSound(true);
      setTimeout(generateNewProblem, 2000)
    } else {
      onError()
      playSound(false);
      if (attempts >= 2) {
        setFeedback(`验证失败。正确答案是 ${calculateCorrectAnswer()}。`)
        setTimeout(generateNewProblem, 3000)
      } else {
        setFeedback(`验证失败,还有 ${3 - attempts - 1} 次机会。`)
      }
    }
    setLoading(false);
  }

  const playSound = (success: boolean) => {
    if (!soundEnabled) return;
    const audio = new Audio(success ? '/sounds/success.mp3' : '/sounds/error.mp3');
    audio.play();
  };

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
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="输入答案"
          className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
          disabled={isDisabled}
          aria-label="数学问题答案"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
        <Button onClick={checkAnswer} className="w-full" disabled={isDisabled || loading}>
          {loading ? "验证中..." : "验证"}
        </Button>
      </div>
      <div className="text-sm text-gray-500 text-center">
        难度: {difficulty} | 运算范围: {
          difficulty === 'easy' ? '1-10' :
          difficulty === 'normal' ? '1-20' : '1-50'
        }
      </div>
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

