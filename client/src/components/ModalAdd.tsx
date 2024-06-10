import React from 'react'
import Button from 'react-bootstrap/Button';
type props={
    product:{
    id:number,
    product_name:string,
    image:string,
    price:number,
    quantity:number,
    created_at:string,
    }
    handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    createProduct:(e:React.FormEvent)=>void,
    notConfirmAdd:()=>void,
}
export default function ModalAdd({product,handleChange,createProduct,notConfirmAdd}:props) {
  return (
    <div className='modal'>
      <form action="" className='formModal'>
            <input required onChange={handleChange} name='name' type="text" placeholder='Name' value={product.product_name} />
            <input required onChange={handleChange} name='img' type="text" placeholder='Image' value={product.image} />
            <input required min={0.1} onChange={handleChange} name='price' type="number" placeholder='Price' value={product.price}/>
            <input required min={0} onChange={handleChange} name='quantity' type="number" placeholder='Quantity' value={product.price}/>
            <input required onChange={handleChange} name='create_at' type="date" placeholder='Create_at'value={product.created_at} />
            <Button onClick={(e)=>createProduct(e)} variant="warning" type='submit'>Submit</Button>{' '}
            <Button onClick={notConfirmAdd} variant="danger">Cancel</Button>{' '}
        </form>
    </div>
  )
}
