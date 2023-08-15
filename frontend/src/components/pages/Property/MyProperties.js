import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import RoundedImage from '../../layout/RoundedImage'
import useFlashMessage from '../../../hooks/useFlashMessage'
import api from '../../../utils/api'
import styles from './Dashboard.module.css'
import { useNavigate } from "react-router-dom"

function MyProperties() {

    const [properties, setProperties] = useState([])
    const [token] = useState(localStorage.getItem('token' || ''))
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/properties/myproperties', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
            .then((response) => {
                setProperties(response.data.properties)
            })
    }, [token])

    async function removeProperty(id) {
        let msgType = 'success'

        const data = await api.delete(`/properties/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
            .then((response) => {
                const updatedProperties = properties.filter((property) => property._id !== id)
                setProperties(updatedProperties)
                return response.data
            })
            .catch((error) => {
                msgType = 'error'
                return error.response.data
            })

        setFlashMessage(data.message, msgType)
    }

    async function concludeNegotiation(id) {
        let msgType = 'success'

        const data = await api.patch(`/properties/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            navigate('/')
            return response.data
        }).catch((error) => {
            msgType = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>

            <div className={styles.propertylist_header}>
                <h1>Meus imóveis</h1>
                <Link to='/property/add'>Cadastrar Imóvel</Link>
            </div>

            <div className={styles.propertylist_container}>
                {properties.length > 0 &&
                    properties.map((property) => (
                        <div className={styles.propertylist_row} key={property._id}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/properties/${property.images[0]}`}
                                alt={property.title}
                                width='px75'
                            />
                            <span className="bold">{property.title}</span>
                            <div className={styles.actions}>
                                {property.available ?
                                    (<>
                                        {
                                            property.contractor && (
                                                <button className={styles.conclude_btn} onClick={() => {
                                                    concludeNegotiation(property._id)
                                                }}>Concluir negociação</button>
                                            )
                                        }
                                        <Link to={`/property/edit/${property._id}`} >Editar</Link>
                                        <button onClick={() => {
                                            removeProperty(property._id)
                                        }}>Excluir</button>
                                    </>)
                                    :
                                    (
                                        <p>Imóvel indisponível</p>
                                    )
                                }
                            </div>
                        </div>
                    ))

                }
                {properties.length === 0 && <p>Não há imóveis cadastrados</p>}
            </div>
        </section>
    )

}

export default MyProperties