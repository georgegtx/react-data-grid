import { useNavigate } from 'react-router-dom';
import React from 'react'
import './App.css';
import NavigationBar from './NavigationBar';
import { Form } from 'react-bootstrap'

function App() {
  const navigate = useNavigate()
  const [error, setError] = React.useState(null)
  const [persons, setPersons] = React.useState([])

  const [lastName, setLastName] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [size, setSize] = React.useState(3)
  const [sort, setSort] = React.useState("ASC")

  const [totalPages, setTotalPages] = React.useState(0)
  const [number, setNumber] = React.useState(0)
  const [totalElements, setTotalElements] = React.useState(0)
  const [refresh, setRefresh] = React.useState(0)

  // fetch data from backoffice and fill local state 
  React.useEffect(() => {
    fetch(`http://localhost:8080/api/persons?page=${page}&size=${size}&sort=${sort}` + (lastName ? `&lastName=${lastName}` : ''))
      .then((res) => res.json())
      .then(page => {
        const {
          content,
          number,
          totalElements,
          totalPages
        } = page;
        setNumber(number)
        setTotalPages(totalPages)
        setPersons(content)
        setTotalElements(totalElements)
      })
      .catch(err => setError(err))
  }, [lastName, page, size, sort, refresh])

  const deletePerson = React.useCallback((id) => {
    fetch(`http://localhost:8080/api/persons/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setRefresh(refresh + 1)
      })
      .catch(err => setError(err))
  }, [refresh])

  return (
    <>
      <NavigationBar />

      <main style={{ marginTop: '56px' }} className="container pt-5">

        <h1>People</h1>

        <div className="row mt-5">
          <div className="col-2">
            <button className="btn btn-primary" form="new-person" onClick={() => { navigate('/edit') }} >New Person</button>

          </div>
          <div className="col">
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} name="lastName" className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          </div>
          <div className="col-4">
            <select defaultValue={sort} onChange={(e) => { setSort(e.target.value) }} className="form-select" aria-label="Default select example">
              <option value="ASC">Sort by Last Name: Ascending</option>
              <option value="DESC">Sort by Last Name: Descending</option>
            </select>
          </div>
        </div>


        <table className="table table-hover">

          <thead>

            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Options</th>
            </tr>

          </thead>

          <tbody>
            {
              persons.map(person => (
                <tr key={person.id}>
                  <th scope="row">{person.id}</th>
                  <td>{person.name}</td>
                  <td>{person.lastName}</td>
                  <td>
                    <div className="row" style={{ width: '190px' }}>
                      <div className="col">
                        <a href={`/edit/${person.id}`} className="btn btn-light">edit</a>
                      </div>
                      <div className="col">
                        <button onClick={() => deletePerson(person.id)} type="button" className="btn btn-danger">delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            }



          </tbody>

        </table>

        {
          totalPages > 0 ? (
            <div className="row justify-content-between">
              <div className='col-3'>
                <Form.Select defaultValue={size} onChange={(e) => setSize(e.target.value)}>
                  <option value={3}>Page size: 3</option>
                  <option value={10}>Page size: 10</option>
                  <option value={20}>Page size: 20</option>
                </Form.Select>
              </div>
              <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                <span>{'Now on ' + (number + 1) + ' from total ' + totalPages + ' pages'}</span>
                <span>{'(Total ' + totalElements + ' people)'}</span>
              </div>
              <div className="col-3 d-flex justify-content-end">
                <nav>
                  <ul className="pagination">

                    <li className={number === 0 ? 'disabled page-item' : 'page-item'}>
                      <a className="page-link" onClick={(e) => { e.preventDefault(); setPage(number - 1) }}>
                        Previous</a>
                    </li>

                    {
                      number > 0 ? (
                        <li className="page-item">
                          <a className="page-link" onClick={(e) => { e.preventDefault(); setPage(number - 1) }}>{number}</a>
                        </li>
                      ) : null
                    }


                    <li className="page-item active">
                      <a className="page-link" href="#">{number + 1}</a>
                    </li>

                    {
                      number < totalPages - 1 ? (
                        <li className="page-item">
                          <a className="page-link" onClick={(e) => { e.preventDefault(); setPage(number + 1) }}>{number + 2}</a>
                        </li>
                      ) : null
                    }

                    <li className={number === totalPages - 1 ? 'disabled page-item' : 'page-item'}>
                      <a className="page-link" onClick={(e) => { e.preventDefault(); setPage(number + 1) }}>
                        Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col text-center"><span>No Data</span></div>
            </div>
          )
        }

        {
          error ? (
            <div className="row">
              <div className="col text-center text-error"><span>Error: {error}</span></div>
            </div>
          ) : null
        }

      </main>
    </>
  );
}

export default App;
