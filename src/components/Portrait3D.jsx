import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const AVATAR_SPEC = 'https://avatars.githubusercontent.com/u/148782991'
const AVATAR_VERIFIED = 'https://avatars.githubusercontent.com/u/315737484?v=4'

export default function Portrait3D() {
  const [imgSrc, setImgSrc] = useState(AVATAR_SPEC)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const tiltX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.7 })
  const tiltY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.7 })

  const sheenX = useTransform(tiltY, [-14, 14], ['-180%', '180%'])
  const sheenOpacity = useTransform(tiltY, [0, 14], [0.12, 0.5])

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotateY.set(px * 28)
    rotateX.set(-py * 28)
  }

  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className="mx-auto mb-7 [perspective:1000px]">
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative h-28 w-28 sm:h-32 sm:w-32"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
      >
        {/* image plane — translateZ(25px) */}
        <motion.div
          style={{ z: 25 }}
          className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-500/50 via-indigo-500/30 to-transparent shadow-[0_0_40px_-8px_rgba(6,182,212,0.35)]"
        >
          <img
            src={imgSrc}
            onError={() => {
              if (imgSrc !== AVATAR_VERIFIED) setImgSrc(AVATAR_VERIFIED)
            }}
            alt="Ahmad Bilal — profile portrait"
            width={128}
            height={128}
            className="h-full w-full rounded-2xl object-cover object-top filter contrast-[1.05] brightness-95 transition-all duration-300 group-hover:brightness-105"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
        </motion.div>

        {/* dynamic specular sheen — translateZ(30px) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            z: 30,
            translateX: sheenX,
            opacity: sheenOpacity,
            background:
              'linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.5) 48%, rgba(165,243,252,0.32) 54%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />

        {/* floating status badge — translateZ(45px) */}
        <motion.span
          style={{ z: 45, top: -10, right: -14 }}
          className="absolute flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-[#0d121c]/95 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300 shadow-lg backdrop-blur"
        >
          <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan-400" />
          SYS // ACTIVE
        </motion.span>
      </motion.div>
    </div>
  )
}