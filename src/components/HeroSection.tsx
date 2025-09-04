import { Link } from 'react-router-dom'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  primaryCTAText?: string
  primaryCTALink?: string
  secondaryCTAText?: string
  secondaryCTALink?: string
}

export const HeroSection = ({
  title,
  subtitle,
  description,
  primaryCTAText = "开始学习",
  primaryCTALink = "/courses",
  secondaryCTAText = "了解更多",
  secondaryCTALink = "/about"
}: HeroSectionProps) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-title-main">{title}</span>
            <span className="hero-title-sub">{subtitle}</span>
          </h1>
          <p className="hero-description">{description}</p>
          
          <div className="hero-actions">
            <Link to={primaryCTALink} className="cta-primary">
              {primaryCTAText}
            </Link>
            <Link to={secondaryCTALink} className="cta-secondary">
              {secondaryCTAText}
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-graphic">
            <div className="floating-card card-1">
              <div className="card-icon">🎓</div>
              <div className="card-text">
                <div className="card-title">区块链基础</div>
                <div className="card-subtitle">入门必修</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💎</div>
              <div className="card-text">
                <div className="card-title">DeFi 实战</div>
                <div className="card-subtitle">高级课程</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🔐</div>
              <div className="card-text">
                <div className="card-title">智能合约</div>
                <div className="card-subtitle">开发进阶</div>
              </div>
            </div>
            <div className="hero-center-icon">
              <div className="center-logo">
                <span className="logo-text">Web3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}