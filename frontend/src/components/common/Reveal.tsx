import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

interface RevealProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'ul' | 'ol' | 'header'
}

/**
 * Brings its RevealItem children in one after another (heading, then text, then picture)
 * the first time the block scrolls into view. MotionConfig in main.tsx turns the travel off
 * for people who ask for reduced motion.
 */
export function Reveal({ children, className = '', as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
      {children}
    </Tag>
  )
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'p' | 'h2' | 'h3'
}

export function RevealItem({ children, className = '', as = 'div' }: RevealItemProps) {
  const Tag = motion[as]
  return <Tag className={className} variants={item}>{children}</Tag>
}
