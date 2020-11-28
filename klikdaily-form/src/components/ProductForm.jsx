import React from 'react'
import { Col, Form } from 'react-bootstrap'

const ProductForm = (props) => {
  const { index, products, register, productInputs } = props
  const productInput = productInputs[index]

  const unitSelectOptions = () => {
    const selectedProduct = products.find(
      (el) => el.product_name === productInput.productName
    )

    if (!selectedProduct) return
    const selectedProductUnits = selectedProduct.units.map((unit) => unit.name)
    const takenUnits = []

    productInputs.forEach((el) => {
      if (el.productName === selectedProduct.product_name) {
        selectedProductUnits.forEach((unit) => {
          if (el.productUnit === unit && !takenUnits.includes(unit)) {
            takenUnits.push(unit)
          }
        })
      }
    })

    const availableUnits = selectedProductUnits.filter(
      (unit) => !takenUnits.includes(unit) || productInput.productUnit === unit
    )

    return availableUnits.map((unit, index) => (
      <option key={index} value={unit}>
        {unit}
      </option>
    ))
  }

  const checkPrice = () => {
    const selectedProduct = products.find(
      (el) => el.product_name === productInput.productName
    )
    if (!selectedProduct) return 0

    const selectedProductUnit = selectedProduct.units.find(
      (unit) => unit.name === productInput.productUnit
    )

    if (!selectedProductUnit) return 0
    return selectedProductUnit.price
  }

  const calculateNettPrice = () => {
    return (
      Number(productInput.productPrice || 0) *
      Number(productInput.productQuantity || 0)
    )
  }

  return (
    <>
      <Col md='9'>
        <Form.Group controlId='form.productNameSelect'>
          <Form.Label>
            Product<span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            as='select'
            defaultValue=''
            name={`productInputs[${index}].productName`}
            ref={register()}
          >
            <option value='' disabled>
              Product Name
            </option>
            {products.map((product, idx) => (
              <option key={idx} value={product.product_name}>
                {product.product_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col md='3'>
        <Form.Group controlId='form.productUnitSelect'>
          <Form.Label>
            Unit<span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            as='select'
            defaultValue=''
            name={`productInputs[${index}].productUnit`}
            ref={register()}
          >
            <option value='' disabled>
              Unit
            </option>
            {unitSelectOptions()}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col md='3'>
        <Form.Group controlId='form.productQuantityNumeric'>
          <Form.Label>
            Quantity<span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            type='number'
            placeholder='Quantity'
            name={`productInputs[${index}].productQuantity`}
            ref={register()}
          />
        </Form.Group>
      </Col>
      <Col md='3'>
        <Form.Group controlId='form.productPriceNumeric'>
          <Form.Label>
            Price<span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            type='number'
            placeholder='0'
            value={checkPrice()}
            name={`productInputs[${index}].productPrice`}
            ref={register()}
            readOnly
          />
        </Form.Group>
      </Col>
      <Col md='6'>
        <Form.Group controlId='form.productPriceNumeric'>
          <Form.Label>
            Total Price<span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            type='number'
            placeholder='-'
            value={calculateNettPrice()}
            readOnly
          />
        </Form.Group>
      </Col>

      <Col md='6' className='ml-auto'>
        <hr className='m-0 p-0 my-1' />
        <div className='d-flex justify-content-between mb-4'>
          <small>
            <strong>Total Nett Price</strong>
          </small>
          <small>
            <strong>
              {calculateNettPrice()
                .toLocaleString('en-US')
                .replaceAll(',', '.')}
            </strong>
          </small>
        </div>
      </Col>
    </>
  )
}

export default ProductForm
