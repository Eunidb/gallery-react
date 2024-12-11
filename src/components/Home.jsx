
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import PropTypes from 'prop-types';
const auth = getAuth(appFirebase)

const Home = ({correoUsuario}) =>{
    return (
        <div>
            <h2>Bienvenido{correoUsuario}<button onClick={()=>signOut(auth)}>Logout</button></h2>
        </div>
    )
}
Home.propTypes = {
    correoUsuario: PropTypes.string.isRequired,
};
export default Home



