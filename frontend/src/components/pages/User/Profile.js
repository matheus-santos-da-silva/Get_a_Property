import formStyles from '../../layout/form/Form.module.css'
import styles from './Profile.module.css'
import Input from '../../layout/form/Input'
import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'

function Profile() {

    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data.currentUser)
        })
    }, [token])


    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let msgType = 'success'

        const formData = new FormData()

        for (const key of Object.keys(user)) {
            formData.append(key, user[key]);
        }

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
                msgType = 'error'
                return error.response.data
            })


        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
            </div>
            <form onSubmit={handleSubmit} className={formStyles.form_container}>
                <Input
                    type="email"
                    text="E-mail"
                    name="email"
                    placeholder="Digite o seu email"
                    handleOnChange={handleChange}
                    value={user.email || ''}
                />
                <Input
                    type="text"
                    text="Nome"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChange}
                    value={user.name || ''}
                />
                <Input
                    type="text"
                    text="Telefone"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChange}
                    value={user.phone || ''}
                />
                <Input
                    text="Idade"
                    type="number"
                    name="age"
                    placeholder="Digite a sua idade"
                    handleOnChange={handleChange}
                    value={user.age || ''}
                />
                <Input
                    type="password"
                    text="Senha"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    type="password"
                    text="Confirmação de senha"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />
                <input type='submit' value='Editar'></input>
            </form>
        </section>
    )

}

export default Profile