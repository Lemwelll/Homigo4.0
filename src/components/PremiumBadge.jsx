import { Crown, Sparkles } from 'lucide-react'

const PremiumBadge = ({ size = 'md', variant = 'default', showText = true }) => {
  const sizes = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  }

  const variants = {
    default: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
    outline: 'border-2 border-yellow-500 text-yellow-600 bg-yellow-50',
    subtle: 'bg-yellow-100 text-yellow-700',
    glow: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50'
  }

  const sizeConfig = sizes[size]
  const variantConfig = variants[variant]

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sizeConfig.container} ${variantConfig}`}>
      <Crown className={sizeConfig.icon} />
      {showText && <span className={sizeConfig.text}>PREMIUM</span>}
      {variant === 'glow' && <Sparkles className={sizeConfig.icon} />}
    </div>
  )
}

export default PremiumBadge
