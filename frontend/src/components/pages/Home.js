import api from '../../utils/api'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Home.module.css'

function Home() {

    const [properties, setProperties] = useState([])

    useEffect(() => {

        api.get('/properties/').then((response) => {
            setProperties(response.data.properties)
        })

    }, [])

    return (
        <section>
            <div className={styles.property_home_header}>
                <h1> Compre um imóvel </h1>
                <p>Veja os detalhes de cada um deles e conheça seus responsáveis</p>
            </div>

            <div className={styles.property_container}>
                {properties.length > 0 && (
                    properties.map((property) => (
                        <div className={styles.property_card}>
                            <div
                                style={{
                                    backgroundImage: `url(${process.env.REACT_APP_API}/images/properties/${property.images[0]})`
                                }}
                                className={styles.property_card_image}
                            ></div>

                            <div className={styles.property_card_content}>
                                <h3 className={styles.property_title}>{property.title}</h3>

                                <div >
                                    <p>
                                        <span >Preço:</span> R$ {property.price} <br></br>
                                    </p>
                                    <p className={styles.property_card_address}>
                                        <span>Endereço:</span> {property.address}
                                    </p>
                                </div>

                                <div className={styles.property_button}>
                                    {property.available ? <Link to={`property/${property._id}`}>Mais detalhes</Link> :
                                        <p className={styles.contracted_text}>Indisponível</p>}
                                </div>

                            </div>



                        </div>
                    ))
                )}
                {properties.length === 0 && (
                    <p>Não há imóveis cadastrados no momento</p>
                )}
            </div>
        </section>
    )

}

export default Home