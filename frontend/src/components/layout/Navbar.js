import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import Logo from '../../assets/img/logo.png'
import { Context } from '../../context/UserContext'
import { useContext } from 'react'


function Navbar() {

    const { authenticated, logout } = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt='Get a Property'></img>
                <h2>Get a Property</h2>
            </div>
            <ul>
                <li>
                    <Link to='/'>Imóveis</Link>
                </li>
                {authenticated ? (
                    <>
                        <li onClick={logout}>Sair</li>
                        <li>
                            <Link to='/user/profile'>Perfil</Link>
                        </li>
                    </>
                ) : (
                    <>
                            <li>
                                <Link to='/login'>Entrar</Link>
                            </li>

                            <li>
                                <Link to='/register'>Cadastrar</Link>
                            </li>

                    </>
                )}
            </ul>
        </nav>
    )

}

export default Navbar