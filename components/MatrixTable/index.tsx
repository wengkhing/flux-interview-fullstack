import classnames from 'classnames'
import { useContext } from 'react'
import { MatrixTableContext, MatrixTableContextProvider } from './context'
import MatrixDataCell from '../MatrixDataCell'

type Props = {
  initialMatrix?: import('../../types').Matrix
} & import('react').HTMLAttributes<HTMLDivElement>

/**
 * Add 4 buttons: 
 * - Cancel to reset the matrix to how it was before changing the values (only when in edit mode)
 * - Edit to make the fields editable (only when not in edit mode)
 * - Clear to completely clear the table
 * - Save to save the table
 * @param param0 
 */
const MatrixTable: import('react').FC<Omit<Props, 'initialMatrix'>> = ({ className, children, ...props }) => {
  // State ------------------------------------------------------------------- //
  const [{ matrix, isEditing }, dispatch] = useContext(MatrixTableContext)

  // Handlers ---------------------------------------------------------------- //
  // You can save (to api) the matrix here. Remember to update originalMatrix when done.
  const save = async () => {
    await fetch('http://localhost:3000/api/save-pricing', {
      method: 'post',
      body: JSON.stringify(matrix)
    })

    dispatch({
      type: 'SET_ORIGINAL_MATRIX',
      payload: matrix
    })
    
    dispatch({
      type: 'SET_EDITABLE_STATE',
      payload: false
    })
  }

  const makeEditable = () => {
    dispatch({
      type: 'SET_EDITABLE_STATE',
      payload: true
    })
  }

  const reset = () => {
    dispatch({
      type: 'SET_MATRIX'
    })

    dispatch({
      type: 'SET_EDITABLE_STATE',
      payload: false
    })
  }

  const clear = () => {
    dispatch({
      type: 'SET_MATRIX',
      metadata: {
        resetToEmpty: true
      }
    })
  }

  const handleMatrixChange = (plan: string, mileage: string, value: string) => {
    const price = Number(value)
    const updateFields = mileage === 'lite' ? {
      lite: price,
      standard: price * 2,
      unlimited: price * 3
    } : {
      [mileage]: price
    }

    dispatch({
      type: 'SET_MATRIX',
      payload: {
        ...matrix,
        [plan]: {
          ...matrix[plan],
          ...updateFields
        }
      }
    })
  }

  // Effects ----------------------------------------------------------------- //

  // Rendering --------------------------------------------------------------- //
  const subscriptionPlans = Object.keys(matrix);
  const mileagePackages = [ 'lite', 'standard', 'unlimited' ];

  return (
    <div className={classnames(['container', className])} {...props}>
      {!isEditing && <button onClick={makeEditable}>Edit</button>}
      {isEditing &&  <button onClick={save}>Save</button>}
      {isEditing && <button onClick={reset}>Cancel</button>}
      {isEditing && <button onClick={clear}>Clear</button>}
      <br />
      <table>
        <thead>
          <tr>
            <td />
            {subscriptionPlans.map(column => <td key={column}>{column}</td>)}
          </tr>
        </thead>
        <tbody>
          {mileagePackages.map(mileage => (
            <tr key={mileage}>
              <td>{mileage}</td>
              {
                subscriptionPlans.map(plan =>
                  <MatrixDataCell onChange={(event) => handleMatrixChange(plan, mileage, event.target.value)}
                    name={`${plan}.${mileage}`}
                    disabled={!isEditing} key={plan}>
                    {matrix[plan][mileage]}
                  </MatrixDataCell>)
              }
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          
        }
      `}</style>
    </div>
  )
}

const MatrixTableWithContext: import('react').FC<Props> = ({ initialMatrix, ...props }) => {
  // You can fetch the pricing here or in pages/index.ts
  // Remember that you should try to reflect the state of pricing in originalMatrix.
  // matrix will hold the latest value (edited or same as originalMatrix)

  return (
    <MatrixTableContextProvider initialMatrix={initialMatrix}>
      <MatrixTable {...props} />
    </MatrixTableContextProvider>
  )
}

export default MatrixTableWithContext
