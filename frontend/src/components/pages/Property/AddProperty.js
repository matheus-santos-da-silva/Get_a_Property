import styles from './AddProperty.module.css'
import api from '../../../utils/api'
import { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import PropertyForm from '../../layout/form/PropertyForm'

function AddProperty() {

    const [token] = useState(localStorage.getItem('token' || ''))
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function registerProperty(property) {

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

        const data = await api.post('properties/create', formData, {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data'
        })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                msgType = 'error'
                return error.response.data
            })

        setFlashMessage(data.message, msgType)

        if (msgType !== 'error') {
            navigate('/property/myproperties')
        }

    }

    return (
        <section className={styles.addproperty_header}>
            <div>
                <h1>Cadastre um Imóvel</h1>
            </div>
            <PropertyForm handleSubmit={registerProperty} btnText='Cadastrar Imóvel' />
        </section>
    )

}

export default AddProperty