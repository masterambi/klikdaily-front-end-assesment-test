import axios from 'axios'

export const fetchEmployees = async () => {
  if (localStorage.employees) {
    return JSON.parse(localStorage.employees)
  }

  while (true) {
    try {
      const { data } = await axios.get(
        'http://dummy.restapiexample.com/api/v1/employees'
      )
      const employees = data.data.map((employee) => employee.employee_name)
      localStorage.setItem('employees', JSON.stringify(employees))
      return employees
    } catch (error) {
      console.log(error)
    }
  }
}
