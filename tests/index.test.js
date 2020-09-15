import { render, screen, fireEvent } from '@testing-library/react'
import MatrixTable from '../components/MatrixTable'

const matrix = {
  "36months" : {
      "lite" : 2592.8,
      "standard" : 2981.72,
      "unlimited" : 3889.2
  },
  "24months" : {
      "lite" : 3056.09,
      "standard" : 3445.01,
      "unlimited" : 4352.49
  },
  "12months" : {
      "lite" : 3528,
      "standard" : 3916.92,
      "unlimited" : 4824.4
  },
  "mtm" : {
      "lite" : 5880,
      "standard" : 6268.92,
      "unlimited" : 7176.4
  }
}

describe('Matrix Table', () => {
  beforeAll(() => {
    render(<MatrixTable initialMatrix={matrix} />);
  })

  it('should initialize correctly', () => {
    const input_36months_lite = screen.getByTestId('36months.lite');
    const input_mtm_unlimited = screen.getByTestId('mtm.unlimited');
    expect(input_36months_lite.value).toBe("2592.8");
    expect(input_36months_lite.disabled).toBe(true);
    expect(input_mtm_unlimited.value).toBe("7176.4");
    expect(input_mtm_unlimited.disabled).toBe(true);
  });

  describe('when click on edit', () => {
    beforeAll(() => {
      render(<MatrixTable initialMatrix={matrix} />)
      fireEvent.click(screen.getByText('Edit'))
    })

    it('fields become editable', () => {
      const input_36months_lite = screen.getByTestId('36months.lite');
      const input_mtm_unlimited = screen.getByTestId('mtm.unlimited');
      expect(input_36months_lite.disabled).toBe(false);
      expect(input_mtm_unlimited.disabled).toBe(false);
    });
  });

  describe('when editing lite package price', () => {
    beforeAll(() => {
      render(<MatrixTable initialMatrix={matrix} />)
      fireEvent.click(screen.getByText('Edit'))
      fireEvent.change(screen.getByTestId('36months.lite'), { target: { value: '3000' } })
    })

    it('coeffecient should apply on standard and unlimited package', () => {
      const input_36months_lite = screen.getByTestId('36months.lite');
      const input_36months_standard = screen.getByTestId('36months.standard');
      const input_36months_unlimited = screen.getByTestId('36months.unlimited');
      expect(input_36months_lite.value).toBe('3000');
      expect(input_36months_standard.value).toBe('6000');
      expect(input_36months_unlimited.value).toBe('9000');
    });
  });
});