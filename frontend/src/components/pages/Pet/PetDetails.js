import api from '../../../utils/api';

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './PetDetais.module.css';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function PetDetails() {
    const [pet, setPet] = useState({});
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        api.get(`pets/${id}`)
            .then((response) => {
                setPet(response.data.pet);
            })
    }, [id]);

    async function schedule() {
        let msgType = 'success';

        const data = await api.patch(`pets/schedule/${pet._id}`, {
            header: {
            Authorization: `Bearer ${JSON.parse(token)}`,
             },
        })
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            });
            
            setFlashMessage(data.message, msgType);
    };

    return (
        <>
            {pet.name && (
                <section className={styles.pet_details_container}>
                    <div className={styles.pet_details_header}>
                        <h1>Conhencendo {pet.name}</h1>
                        <p>Gostou de mim? Marque uma visita!</p>
                    </div>
                    <div className={styles.pet_images}>
                        {pet.images.map((image, index) => (
                            <img src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                                alt={pet.name}
                                key={index}
                            />
                        ))}
                    </div>
                    <p>
                        <span className="bold">Peso:</span> {pet.weight}kg
                    </p>
                    <p>
                        <span className="bold">Idade:</span> {pet.age} anos
                    </p>
                    {token ? (
                        <button onClick={schedule}>Solicitar uma Visita</button>
                    )
                        : (
                            <p>Você precisa estar <Link to='/login'>logado</Link> para solicitar uma visita!</p>
                        )}
                </section>
            )}
        </>
    )
};

export default PetDetails;