import styles from './PropertyDetails.module.css'
import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'

function PropertyDetails() {

    const [property, setProperty] = useState({})
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/properties/${id}`).then((response) => {
            setProperty(response.data.property)
        })
    }, [id])

    async function schedule() {
        let msgType = 'success'

        const data = await api.patch(`/properties/schedule/${property._id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                msgType = 'error'
                return error.response.data
            })

        setFlashMessage(data.message, msgType)
    }

    return (
        <>
            {property.title && (
                <section className={styles.property_details_container}>
                    <div className={styles.property_details_header}>
                        <h1>{property.title}</h1>
                        <p>Se tiver interesse, marque uma visita a este imóvel</p>
                    </div>
                    <div className={styles.property_images}>
                        {property.images.map((image, index) => (
                            <img
                                src={`${process.env.REACT_APP_API}/images/properties/${image}`}
                                alt={property.title}
                                key={index}
                            />
                        ))}
                    </div>

                    <div className={styles.property_details_price}>
                        A PARTIR DE:<h2>R$ {property.price},00</h2>
                    </div>

                    <div className={styles.property_details_content}>
                        <p>
                            <span className='bold'>Endereço:</span> {property.address}
                        </p>
                        <p>
                            <span className='bold'>Quartos:</span> {property.bedrooms}
                        </p>
                        <p>
                            <span className='bold'>Sobre:</span> {property.description}
                        </p>
                    </div>


                    {token ? (
                        <button onClick={schedule}>Solicitar a visita</button>
                    ) : (
                        <p>Você precisa <Link to='/register'>criar uma conta</Link> para solicitar a visita</p>
                    )}
                </section>
            )}

        </>
    )
}

export default PropertyDetails