import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import './bubble-input.css';

import enterSoundF from "../audio/ENTER.mp3";
import spaceSoundF from "../audio/SPACE.mp3";
import backspaceSoundF from "../audio/BACKSPACE.mp3";
import genericSoundF from "../audio/GENERIC.mp3";

interface BubbleInputProps {
  onChange: (value: string) => void
  onSubmit: (height: number) => void
  value: string
}

const BubbleInput = ({ onChange, onSubmit, value }: BubbleInputProps) => {
  const refEditable = useRef<HTMLDivElement>(null)
  const refContainer = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [enterSoundFile, setEnterSoundFile] = useState<HTMLAudioElement | null>(null);
  const [spaceSoundFile, setSpaceSoundFile] = useState<HTMLAudioElement | null>(null);
  const [backspaceSoundFile, setBackspaceSoundFile] = useState<HTMLAudioElement | null>(null);
  const [genericSoundFile, setGenericSoundFile] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const enterSound = new Audio(enterSoundF);
    setEnterSoundFile(enterSound);

    const spaceSound = new Audio(spaceSoundF);
    setSpaceSoundFile(spaceSound);

    const backspaceSound = new Audio(backspaceSoundF);
    setBackspaceSoundFile(backspaceSound);

    const genericSound = new Audio(genericSoundF);
    setGenericSoundFile(genericSound);
  }, []);

  const handleKeyDown: KeyboardEventHandler = e => {
    const { current: elContainer } = refContainer
    const { current: elEditable } = refEditable
    if (elContainer === null || elEditable === null) return

    const { isComposing } = e.nativeEvent

    switch (e.key) {
      case "Enter":
        if (!isComposing) {
          const height = elContainer.clientHeight
          onSubmit && onSubmit(height)
          enterSoundFile!.currentTime = 0;
          enterSoundFile!.play();
          e.preventDefault()
          setSubmitted(true)
          requestAnimationFrame(() => {
            elEditable.focus()
            elEditable.innerText = ''
            setSubmitted(false)
          })
        }
        break;
      case " ":
        spaceSoundFile!.currentTime = 0;
        spaceSoundFile!.play();
        break;
      case "Backspace":
        backspaceSoundFile!.currentTime = 0;
        backspaceSoundFile!.play();
        break;
      default:
        genericSoundFile!.currentTime = 0;
        genericSoundFile!.play();
        break;
    }
  }

  const handleBlur = useCallback(() => {
    const { current: elDiv } = refEditable
    if (elDiv) {
      elDiv.focus()
    }
  }, [refEditable])

  useEffect(handleBlur, [handleBlur])

  return (
    <div
      ref={refContainer}
      className={`bubble input  ${value.length === 0 ? 'empty' : ''} ${
        submitted ? 'submitted' : ''
      }`}
    >
      <div
        ref={refEditable}
        className="bubble-content"
        contentEditable
        spellCheck="false"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={e => onChange(e.currentTarget.innerText)}
      />
    </div>
  )
}

export default BubbleInput
