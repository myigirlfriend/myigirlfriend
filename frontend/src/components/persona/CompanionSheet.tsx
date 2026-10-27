import Modal from '@components/common/Modal'
import { traitSentence } from '@utils/text'
import type { Persona } from '@/types'
import PhotoGallery from './PhotoGallery'

interface CompanionSheetProps {
  persona: Persona
  isOpen: boolean
  onClose: () => void
}

/** Her profile inside the app: photos, personality and description. Opened from the chat header. */
export default function CompanionSheet({ persona, isOpen, onClose }: CompanionSheetProps) {
  const images = [persona.image, ...persona.gallery].filter((src): src is string => !!src)

  return (
    <Modal isOpen={isOpen} onClose={onClose} label={`${persona.name}'s profile`} size="md" position="sheet">
      <div className="max-h-[80dvh] overflow-y-auto overscroll-contain pr-1">
        <PhotoGallery images={images} name={persona.name} className="mt-6" />
        <h2 className="heading mt-6 text-4xl">{persona.name}</h2>
        {persona.tagline && <p className="mt-1.5 text-lg font-bold text-brand-blush">{traitSentence(persona.tagline)}</p>}
        {persona.description && <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">{persona.description}</p>}
      </div>
    </Modal>
  )
}
