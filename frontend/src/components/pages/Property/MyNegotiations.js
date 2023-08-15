import styles from './Dashboard.module.css'
import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import RoundedImage from '../../layout/RoundedImage'

function MyNegotiations() {
    const [properties, setProperties] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get('/properties/mynegotiations', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setProperties(response.data.properties)
        })
    }, [token])

    return (
        <section>
            <div className={styles.propertylist_header}>
                <h1>Minhas Negociações</h1>
            </div>

            <div className={styles.propertylist_container}>
                {properties.length > 0 && properties.map((property) => (
                    <div className={styles.propertylist_row} key={property._id}>
                        <RoundedImage
                            src={`${process.env.REACT_APP_API}/images/properties/${property.images[0]}`}
                            alt={property.title}
                            width='px75'
                        />
                        <span className="bold">{property.title}</span>
                        <div className={styles.actions}>
                            <p>
                                <span className='bold'>Ligue para:</span> {property.user.phone}
                            </p>
                            <p>
                                <span className='bold'>Fale com:</span> {property.user.name}
                            </p>
                        </div>
                        <div className={styles.actions}>
                            {property.available ? (
                                <p>Negociação em processo</p>
                            ) :
                                (
                                    <p>Imóvel indisponível</p>
                                )
                            }
                        </div>
                    </div>
                ))}
                {properties.length === 0 && <p>Não há imóveis em negociação</p>}
            </div>
        </section>
    )
}

export default MyNegotiations