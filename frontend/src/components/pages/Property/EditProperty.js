import api from "../../../utils/api"
import { useState, useEffect } from "react"
import styles from './AddProperty.module.css'
import PropertyForm from '../../layout/form/PropertyForm'
import useFlashMessage from "../../../hooks/useFlashMessage"
import { useParams } from "react-router-dom"

function EditProperty() {

    const [property, setProperty] = useState({})
    const [token] = useState(localStorage.getItem('token' || ''))
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {

        api.get(`/properties/${id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            setProperty(response.data.property)
        })

    }, [token, id])

    async function updateProperty(property) {
        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(property).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < property[key].length; i++) {
                    formData.append('images', property[key][i])
                }
            } else {
                formData.append(key, property[key])
            }
        })

        const data = await api.patch(`/properties/edit/${property._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((error) => {
            msgType = 'error'
            console.log(error.response.data)
            return error.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.addproperty_header}>
                <h1>Editando o seu imóvel</h1>
            </div>
            {property.title && (
                <PropertyForm handleSubmit={updateProperty} btnText='Atualizar' propertyData={property}

                />
            )}
        </section>
    )

}

export default EditProperty