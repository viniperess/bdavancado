import React, { useState, useEffect } from 'react';
import {
    getOrderByChild,
    getFilterByChild,
    getMostExpensive,
    getMostCheap,
    getPriceRange
} from '../Firebase/ProdutosDao';
import { TableProds } from './tableProds';
import 'materialize-css';
import { Button, Select, Row, Col, ProgressBar, TextInput } from 'react-materialize';
import { Icon } from 'react-materialize';


function ListProds(props) {

    const prods = []
    const [data, setData] = useState([])
    const [loading, setLoad] = useState(true)
    const [order, setOrder] = useState('id_prod')
    const [filter, setFilter] = useState('nome')
    const [priceRange, setPriceRange] = useState(20000)

    useEffect(() => {
        loadProdsFb()
    }, [order, filter])

    function loadProdsFb() {
        getOrderByChild(order, props.firebase.db, receiveProds)
        console.log({ 'ordenar': order })
    }

    function receiveProds(snap) {
        if (snap.exists()) {
            prods.push({ 'id': snap.key, ...snap.val() })
            console.log({ "produto": { 'id': snap.key, ...snap.val() } })
            prods.length?setData([...prods]):setLoad(false)
        }
    }

    const handlerSelectOrder = (event) => {
        setOrder(event.target.value)
    }

    const handlerSelectFilter = (event) => {
        setFilter(event.target.value)
    }

    const handlerApplyFilter = () => {
        setData([])
        setInterval(() => setLoad(false), 3000)
        const termo = document.getElementById('termo').value
        getFilterByChild(filter, termo, props.firebase.db, receiveProds)
    }

    const handlerMostExpensive = () => {
        setData([])
        getMostExpensive(props.firebase.db, setData, prods)
    }

    const handlerMostCheap = () => {
        setData([])
        getMostCheap(props.firebase.db, receiveProds)
    }

    const handlerPriceRange = (event) => {
        setData([])
        setPriceRange(event.target.value)
        if (event.target.value === 0) setLoad(false)
        getPriceRange(event.target.value, props.firebase.db, receiveProds)
    }

    return (<div className='flex-container'>
        <div className={'filterFormContainer'}>
            <label htmlFor="order">Ordenar por:</label>
            <Select id='order' name='order' onChange={handlerSelectOrder} 
                value={order}>
                <option value={'id_prod'} >ID</option>
                <option value={'preco'} >Preco</option>
                <option value={'qtd_estoque'} >Quantidade</option>
                <option value={'nome'} >Nome</option>
            </Select>
            <div className='filterPanel'>
                <div>
                    <label htmlFor="filter">Filtrar por:</label>
                    <Select id='filter' name='field' onChange={handlerSelectFilter} value={filter}>
                        <option value={'nome'} >Nome</option>
                        <option value={'descricao'} >Descricao</option>
                    </Select>
                </div>
                <div>
                    <label htmlFor="termo"> Termo de filtro:</label>
                    <TextInput id="termo" placeholder='Digite o termo' onChange={handlerApplyFilter} />
                </div>
            </div>
            <label htmlFor="vol">Preco:</label>
            <div className='rangeStyle'>
                R$ 10-20k&nbsp;<input type='range'
                    id={"price_range"}
                    name={"price_range"}
                    value={priceRange}
                    max='20000'
                    min='10'
                    step='.01'
                    onChange={handlerPriceRange}
                />
                &nbsp;{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceRange)}
            </div>
            {/* <Button onClick={handlerApplyFilter}>Filtrar</Button> */}
            <div className='btnsContainers'>
                <Button
                    className="waves-effect waves-light btn red"
                    style={{ marginRight: '5px' }}
                    onClick={handlerMostExpensive}>
                    Mais Caros
                    <Icon tiny left>account_balance_wallet</Icon>
                </Button>
                <Button
                    className="waves-effect waves-light btn"
                    style={{ marginRight: '5px' }}
                    onClick={handlerMostCheap}>
                    <Icon tiny left>savings</Icon>
                    Mais Baratos
                </Button>
            </div>
        </div>
        <div className={'tableContainer'}>
            {(data.length > 0) ?
                <TableProds produtos={data}></TableProds>
                : (loading) ? <Row>
                    <Col s={12}>
                        <ProgressBar />
                    </Col>
                </Row> : <p>Sem Resultados</p>
            }
        </div>
    </div>);
}

export default ListProds