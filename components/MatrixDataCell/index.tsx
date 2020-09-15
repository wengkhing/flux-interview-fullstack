import { useState, useRef, useEffect } from 'react'

type Props = {
  name: string
  disabled: boolean
} & import('react').HTMLAttributes<HTMLDivElement>

const MatrixDataCell: import('react').FC<Props> = ({ name, disabled, onChange, children, ...props }) => {
  const [state, setState] = useState({
    value: children as number
  })

  const mounted = useRef<boolean>();
    useEffect(() => {
      if (!mounted.current) {
        mounted.current = true;
      } else {
        if (children !== state.value) {
          setState({ value: children as number })
        }
      }
    });

  const handleChange = (event) => {
    setState({ value: event.target.value })
    onChange && onChange(event)
  }

  return (
    <td>
      <input type='number'
        data-testid={name}
        value={state.value}
        onChange={handleChange}
        disabled={disabled} />

      <style jsx>{`

      `}</style>
    </td>
  )
}

export default MatrixDataCell