import React from 'react'

const ColorSelect = ({ rtl }) => {
  return (
    <div className="select-color">
      <span className="me-4 mb-1 color-000 fw-bold fs-14px">{ rtl ? 'إختر لون' : 'Select Color' }</span>
      <div className="colors-content">
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="colorSelect"
            id="colorSelect1" defaultChecked />
          <label className="form-check-label" htmlFor="colorSelect1">
            <span className="color-circle gray"></span>
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="colorSelect"
            id="colorSelect2" />
          <label className="form-check-label" htmlFor="colorSelect2">
            <span className="color-circle black"></span>
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="colorSelect"
            id="colorSelect3" />
          <label className="form-check-label" htmlFor="colorSelect3">
            <span className="color-circle blue"></span>
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="colorSelect"
            id="colorSelect4" />
          <label className="form-check-label" htmlFor="colorSelect4">
            <span className="color-circle green"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default ColorSelect