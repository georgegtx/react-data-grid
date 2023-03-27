import React from "react";
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function EditPersonForm() {
    const { id } = useParams();
    const [person, setPerson] = React.useState(null)
    const [refresh, setRefresh] = React.useState(0)
    const [err, setError] = React.useState(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        if (id) {
            fetch(`http://localhost:8080/api/persons/${id}`)
                .then((res) => res.json())
                .then(p => {
                    setPerson(p)
                })
                .catch(err => setError(err))
        } else {
            setPerson({ name: '', lastName: '' })
        }
    }, [id, refresh])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        if (id) {
            fetch(`http://localhost:8080/api/persons/${id}`, {
                method: 'PUT',
                body: JSON.stringify(person),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    setRefresh(refresh + 1);
                    navigate('/')
                })
                .catch(err => setError(err))
        } else {
            if (person.name && person.lastName) {
                fetch(`http://localhost:8080/api/persons`, {
                    method: 'POST',
                    body: JSON.stringify(person),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(() => {
                        setRefresh(refresh + 1);
                        navigate('/')
                    })
                    .catch(err => setError(err))

            }
        }
    }, [id, refresh, person])

    return (
        <>
            <NavigationBar />
            <main style={{ marginTop: '56px' }} className="container pt-5">
                {
                    person ? (
                        <>
                            {
                                person.id ? (
                                    <h1> Edit person #{person.id}</h1>
                                ) : (
                                    <h1> Create a new person</h1>
                                )
                            }
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label><b>Name</b></Form.Label>
                                    <Form.Control type="text"
                                        className="input"
                                        value={person.name}
                                        onChange={e => setPerson({ ...person, name: e.target.value })}
                                        placeholder="Add a new person" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><b>Last Name</b></Form.Label>
                                    <Form.Control type="text"
                                        className="input"
                                        value={person.lastName}
                                        onChange={e => setPerson({ ...person, lastName: e.target.value })}
                                        placeholder="Add a new person" />
                                </Form.Group>
                                <Button variant="primary mt-3" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </>

                    ) : null
                }
            </main>
        </>


    );
}

export default EditPersonForm;