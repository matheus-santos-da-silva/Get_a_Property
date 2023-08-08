import { useState } from 'react'
import formStyles from './Form.module.css'
import Input from './Input'
import Select from './Select'

function PropertyForm({ handleSubmit, propertyData, btnText }) {

    const [property, setProperty] = useState(propertyData || {})
    const [preview, setPreview] = useState([])
    const types = ['Casa', 'Apartamento', 'Kitnet', 'Casa de condomínio', 'Cobertura', 'Studio']
    const bedrooms = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    function onFileChange(e) {
        setPreview(Array.from(e.target.files))
        setProperty({ ...property, images: [...e.target.files] })
    }

    function handleChange(e) {
        setProperty({ ...property, [e.target.name]: e.target.value })
    }

    function handleType(e) {
        setProperty({ ...property, type: e.target.options[e.target.selectedIndex].text })
    }

    function handleBedrooms(e) {
        setProperty({ ...property, bedrooms: e.target.options[e.target.selectedIndex].text })
    }

    function submit(e) {
        e.preventDefault()
        handleSubmit(property)
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_property_images}>
                {preview.length > 0
                    ? preview.map((image, index) => (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={property.type}
                            key={`${property.type} + ${index}`}
                        />
                    )) :
                    property.images &&
                    property.images.map((image, index) => (
                        <img
                            src={`${process.env.REACT_APP_API}/images/properties/${image}`}
                            alt={property.type}
                            key={`${property.type} + ${index}`}
                        />
                    ))
                }
            </div>
            <Input
                text='Imagens do imóvel'
                type='file'
                name='images'
                handleOnChange={onFileChange}
                multiple={true}
            />
            <Select
                name='type'
                text='Selecione o tipo'
                options={types}
                handleOnChange={handleType}
                value={property.type || ''}
            />
            <Input
                text='Endereço do imóvel'
                type='text'
                name='address'
                placeholder='Digite o endereço do imóvel'
                handleOnChange={handleChange}
                value={property.address || ''}
            />
            <Input
                text='CEP'
                type='text'
                name='zipcode'
                placeholder='Digite o CEP do imóvel'
                handleOnChange={handleChange}
                value={property.zipcode || ''}
            />
            <Input
                text='Preço'
                type='number'
                name='price'
                placeholder='Digite o preço do imóvel'
                handleOnChange={handleChange}
                value={property.price || ''}
            />
            <Select
                name='bedrooms'
                text='Quantidade de quartos'
                options={bedrooms}
                handleOnChange={handleBedrooms}
                value={property.bedrooms || ''}
            />
            <Input
                text='Descrição'
                type='text'
                name='description'
                placeholder='Descrição'
                handleOnChange={handleChange}
                value={property.description || ''}
            />

            <input type='submit' value={btnText} />
        </form>
    )

}

export default PropertyForm