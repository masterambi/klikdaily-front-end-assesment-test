import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { fetchEmployees } from '../services/employeeServices'
import { fetchProducts } from '../services/productServices'
import ProductForm from '../components/ProductForm'

const CreateOrderPage = () => {
  const [employees, setEmployees] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      productInputs: [
        {
          productName: '',
          productUnit: '',
          productQuantity: '',
          productPrice: 0,
        },
      ],
    },
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'productInputs',
  })

  const distributorName = watch('distributorName')
  const distributorCenter = watch('distributorCenter')
  const distributorPaymentType = watch('distributorPaymentType')
  const distributorExpiredDate = watch('distributorExpiredDate')
  const productInputs = watch('productInputs')

  useEffect(() => {
    getEmployees()
    getProducts()
  }, [])

  const getEmployees = async () => {
    const employeesFromService = await fetchEmployees()
    setEmployees(employeesFromService)
    setLoading(false)
  }

  const getProducts = () => {
    const productsFromService = fetchProducts()
    setProducts(productsFromService)
  }

  const checkDistributor = () => {
    const isFilled = distributorCenter && distributorName ? true : false
    return isFilled
  }

  const isInvalidInput = () => {
    if (
      !distributorName ||
      !distributorCenter ||
      !distributorPaymentType ||
      !distributorExpiredDate
    ) {
      return true
    }

    let isNotFilled = false
    productInputs.forEach((productInput) => {
      if (
        !productInput.productName ||
        !productInput.productUnit ||
        !productInput.productQuantity ||
        !productInput.productPrice ||
        productInput.productQuantity === '0'
      ) {
        isNotFilled = true
      }
    })

    if (isNotFilled) return true

    return false
  }

  const calculateTotalPrice = () => {
    return productInputs.reduce(
      (accumulator, productInput) =>
        accumulator +
        Number(productInput.productPrice) *
          Number(productInput.productQuantity),
      0
    )
  }

  const submitForm = (data) => {
    console.log(data)
    alert('Success')
    reset()
  }

  return (
    <div className='p-3'>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h1 className='text-title pl-2'>Create Order</h1>

          <Container className='bg-white p-3 mt-2 shadow' fluid>
            <Form onSubmit={handleSubmit(submitForm)}>
              <Row>
                <Col md='3'>
                  <label>
                    <strong>Detail</strong>
                  </label>
                </Col>

                <Col md='9'>
                  <Form.Row className='mr-5'>
                    <Col md='9'>
                      <Form.Group controlId='form.nameSelect'>
                        <Form.Label>
                          Name<span className='text-danger'>*</span>
                        </Form.Label>
                        <Form.Control
                          as='select'
                          defaultValue=''
                          name='distributorName'
                          ref={register}
                        >
                          <option value='' disabled>
                            Name
                          </option>
                          {employees &&
                            employees.map((employee, index) => (
                              <option key={index} value={employee}>
                                {employee}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md='6'>
                      <Form.Group controlId='form.distributionSelect'>
                        <Form.Label>
                          Distribution Center
                          <span className='text-danger'>*</span>
                        </Form.Label>
                        <Form.Control
                          as='select'
                          defaultValue=''
                          name='distributorCenter'
                          ref={register}
                        >
                          {distributorName ? (
                            <>
                              <option value='' disabled>
                                Distribution Center
                              </option>
                              <option value='DC Tangerang'>DC Tangerang</option>
                              <option value='DC Cikarang'>DC Cikarang</option>
                            </>
                          ) : (
                            <>
                              <option value='' disabled>
                                Distribution Center
                              </option>
                              <option value='' disabled>
                                No data available
                              </option>
                            </>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md='12'></Col>
                    {checkDistributor() && (
                      <>
                        <Col md='6'>
                          <Form.Group controlId='form.paymentSelect'>
                            <Form.Label>
                              Payment Type<span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Control
                              as='select'
                              defaultValue=''
                              ref={register}
                              name='distributorPaymentType'
                            >
                              <option value='' disabled>
                                Payment Type
                              </option>
                              <option value='Cash H+1'>Cash H+1</option>
                              <option value='Cash H+3'>Cash H+3</option>
                              <option value='Cash H+7'>Cash H+7</option>
                              <option value='Transfer H+1'>Transfer H+1</option>
                              <option value='Transfer H+3'>Transfer H+3</option>
                              <option value='Transfer H+7'>Transfer H+7</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>

                        <Col md='6'>
                          <Form.Group controlId='form.expiredSelect'>
                            <Form.Label>
                              Expired Date<span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Control
                              type='date'
                              ref={register}
                              name='distributorExpiredDate'
                            />
                          </Form.Group>
                        </Col>

                        <Col md='9'>
                          <Form.Group controlId='form.notesTextArea'>
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                              as='textarea'
                              rows={4}
                              ref={register}
                              name='distributorNotes'
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )}
                  </Form.Row>
                </Col>

                {checkDistributor() && (
                  <>
                    <Col md='12'>
                      <hr />
                    </Col>

                    <Col md='3'>
                      <label>
                        <strong>Products</strong>
                      </label>
                    </Col>

                    <Col md='9'>
                      <Form.Row className='mr-5'>
                        {fields.map((field, index) => (
                          <ProductForm
                            key={field.id}
                            index={index}
                            products={products}
                            register={register}
                            productInputs={productInputs}
                          />
                        ))}

                        <Col md='12' className='ml-auto mt-4'>
                          <Button
                            variant='warning'
                            size='sm'
                            className='mr-2 font-weight-bold rounded-0 text-white'
                            onClick={() => {
                              append({})
                            }}
                          >
                            NEW ITEM &nbsp;
                            <i className='fas fa-plus'></i>
                          </Button>
                        </Col>
                      </Form.Row>
                    </Col>
                    <Col md='9' className='ml-auto'>
                      <Form.Row className='mr-5 mt-4'>
                        <Col md='6' className='ml-auto'>
                          <div className='d-flex justify-content-between'>
                            <label>
                              <strong>Total</strong>
                            </label>
                            <label>
                              <strong>
                                {calculateTotalPrice()
                                  .toLocaleString('en-US')
                                  .replaceAll(',', '.')}
                              </strong>
                            </label>
                          </div>
                        </Col>
                      </Form.Row>
                    </Col>
                  </>
                )}

                <Col md='12'>
                  <hr className='mt-0' />
                  <div className='d-flex justify-content-end'>
                    <Button
                      variant='light'
                      size='sm'
                      className='mr-2 font-weight-bold rounded-0 bg-white border-0'
                    >
                      CANCEL
                    </Button>
                    <Button
                      type='submit'
                      variant='success'
                      size='sm'
                      className='font-weight-bold rounded-0'
                      disabled={isInvalidInput()}
                    >
                      CONFIRM
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Container>
        </>
      )}
    </div>
  )
}

export default CreateOrderPage
