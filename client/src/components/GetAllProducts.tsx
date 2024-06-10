import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalDelete from './ModalDelete';
import ModalAdd from './ModalAdd';
type Product={
    id:number,
    product_name:string,
    image:string,
    price:number,
    quantity:number,
    created_at:string,
}
export default function GetAllProducts() {
    const [typeSubmit,setTypeSubmit]=useState<string>("add")
    const [products,setProducts]=useState<Product[]>([]);
    const [activeModal,setActiveModal]=useState<boolean>(false);
    const [activeModalAdd,setActiveModalAdd]=useState<boolean>(false);
    const [product,setProduct]=useState<Product>({
        id:Math.floor(Math.random()*10000000),
        product_name:'',
        image:'',
        price:0,
        quantity:-1,
        created_at:'',
    })
    //load data from local through API
    const loadData=()=>{
        fetch('http://localhost:1000/products')
        .then((response:Response)=>response.json())
        .then((data:Product[])=>setProducts(data))
        .catch((error)=>console.log(error))
    }
    useEffect(()=>{
        loadData();
    },[]);
    //retrieve detail of product by id
    const getProductById=(id:number)=>{
        fetch(`http://localhost:1000/products/${id}`)
        .then((response:Response)=>{
            if(response.ok){
                return (response.json());            
            }
            throw new Error("No Founded")
        })
        .then((data)=>console.log(data)
        )
        .catch((error)=>console.log(error.message)
        )
    }
    // delete Product by Id
    const removeProductById=()=>{
        
        fetch(`http://localhost:1000/products/${product.id}`,{
            method:'DELETE'
        })
        .then((response:Response)=>{
            if(response.ok){
                loadData();
            }
        })
        .catch((error)=>console.log(error)
        )
        reset();
        setActiveModal(false);
    }
    //Reset Input Vlue
    const reset=()=>{
        setProduct({
            id:Math.floor(Math.random()*10000000),
            product_name:'',
            image:'',
            price:0,
            quantity:-1,
            created_at:'',
        })
    }
    // Reset Product whenever change Input
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const name=e.target.name;
        const value=e.target.value;
        setProduct({...product,[name]:value});
    }
    //open modal Add
    const openModalAdd=()=>{
        setActiveModalAdd(true);
    }
    //close modal Add
    const notConfirmAdd=()=>{
        setActiveModalAdd(false);
        reset();
    }
    // add new Product
    const createProduct=(e:React.FormEvent)=>{
        e.preventDefault();
        // case type Submit is "Add"
        if(typeSubmit==='add'){
            // call API 'post'
            fetch('http://localhost:1000/products',{
                method:'POST',
                headers:{
                    "Content_type":"application/json"
                },
                body:JSON.stringify(product)
            })
            .then((response:Response)=>{
                if(response.ok){
                    loadData()
                }
                //reset form
                reset();
            })
            .catch((error)=>console.log(error)
            )
        }else{
            fetch(`http://localhost:1000/products/${product.id}`,{
                method:'PUT',
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify(product)
            })
            .then((reponse:Response)=>{
                if(reponse.ok){
                    //đóng form
                    //reset form
                    reset();
                    //load lại dữ liệu
                    loadData();
                    //cập nhập lại type submit
                    setTypeSubmit("add");
                }
            })
        }
    }
    // update Product by Id
    const updateProductById=(id:number)=>{
        setActiveModalAdd(true);
        fetch(`http://localhost:1000/products/${id}`)
        .then((response:Response)=>{
            if(response.ok){
                return (response.json());            
            }
            throw new Error("No Founded")
        })
        .then((data)=>setProduct(data)
        )
        .catch((error)=>console.log(error.message)
        )
        setTypeSubmit("update")
    }
    //confirm Modal Del
    const openModal=(idProduct:number)=>{
       setProduct({...product,id:idProduct});
       setActiveModal(true);
    }
    //not confirm Modal Del
    const notConfirmDel=()=>{
        reset();
        setActiveModal(false);
    }
  return (
    <div>
        {activeModal && <ModalDelete confirmDel={removeProductById} notConfirmDel={notConfirmDel}/>}
        {activeModalAdd && <ModalAdd product={product} createProduct={createProduct} handleChange={handleChange} notConfirmAdd={notConfirmAdd}/>}
         <Button onClick={openModalAdd} variant="warning">Thêm mới</Button>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>STT</th>
          <th>Name</th>
          <th>Img</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Create_at</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product,index)=>(
            <tr>
                <td>{index+1}</td>
                <td>{product.product_name}</td>
                <td><img style={{width:'100px',height:'100px'}} src={product.image} alt="" /></td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.created_at}</td>
                <td>
                <Button onClick={()=>updateProductById(product.id) }  variant="warning">Edit</Button>{' '}
                <Button onClick={()=>openModal(product.id)} variant="danger">Delete</Button>{' '}
                </td>
            </tr>
        ))}
      </tbody>
    </Table>
    </div>
  )
}
