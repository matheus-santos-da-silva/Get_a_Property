import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function MyProperties() {

    const [properties, setProperties] = useState([])

    return (
        <section>

            <div>
                <h1>Meus imóveis</h1>
                <Link to='/property/add'>Cadastrar Imóvel</Link>
            </div>

            <div>
                {properties.length > 0 && <p>Meus imóveis cadastrados</p>}
                {properties.length === 0 && <p>Não há imóveis cadastrados</p>}
            </div>
        </section>
    )

}

export default MyProperties