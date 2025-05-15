import React, { useEffect, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Link } from "react-router-dom";



function AllDataTable(props) {
    const symbolTerm = props.symbolTerm;
    const [stocksData, setStocksData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const columns = [
        {
            headerName: "Symbol",
            field: "symbol",
            width: 300,
            cellRendererFramework: (params) => {
                return <Link to={`/history?code=${params.value}`} onClick={() => {
                    props.setStockName(params.data.name);
                }}> {params.value} </Link>
            }
        },
        { headerName: "Name", field: "name", width: 300 },
        { headerName: "Match Score", field: "matchscore", width: 300 }
    ];

    useEffect(() => {

        //getAllStocks(symbolTerm)
        const API_KEY = "A79PGV6UVQC4ZG18";
        const URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbolTerm}&apikey=${API_KEY}`
        console.log(symbolTerm, "symbolTerm", "1")

        console.log(URL, "URL")
        fetch(URL)

            .then((res) => res.json())
            .then(res => res.bestMatches)
            .then((data) =>
                data.map((stock) => {
                    return {
                        symbol: stock["1. symbol"],
                        name: stock["2. name"],
                        matchscore: stock["9. matchScore"]
                    }
                })
            )
            //.then(res => console.log(res))

            .then((stock) => {
                setStocksData(stock);
                setTableData(stock);
            });
    }, [symbolTerm]);

    return (
        <div className="ag-theme-balham stockTable"
            style={
                {
                    height: "347px",
                    width: "900px"
                }
            }>
            <AgGridReact
                columnDefs={columns}
                rowData={tableData}
                pagination={true}
                paginationPageSize={12}
            />
        </div>
    );
}

function Header() {
    return (
        <div>
            <h1>Listing all stocks</h1>
        </div>
    );
}




function SearchBar(props) {
    const [symbolTerm, setSymbolTerm] = useState("");

    return (
        <div className="stockSearch">
            <div className="symbolSearch">
                <label>Search by Symbol or Name</label><br />
                <input className="symbolInput" type="text" name="symbolSearch" value={symbolTerm} placeholder="ex) A" onChange={
                    (e) => {
                        setSymbolTerm(e.target.value);
                    }
                } />
                <button className="symbolSearchButton" type="search" onClick={() => {
                    props.onSymbolSubmit(symbolTerm);
                    //console.log(symbolTerm, "symbolTerm") //works
                }}>Search</button>
            </div>
        </div>
    )
}

function Stocks(props) {
    const [symbolTerm, setSymbolTerm] = useState("");
    const [industrialTerm, setIndustrialTerm] = useState({ label: "All", value: "All" });



    return (
        <div className="stocks">
            <Header />
            <SearchBar symbolTerm={symbolTerm} onSymbolSubmit={setSymbolTerm} industrialTerm={industrialTerm} onIndustrialChanged={setIndustrialTerm} />
            {symbolTerm !== "" &&
                <AllDataTable symbolTerm={symbolTerm} industrialTerm={industrialTerm} setStockName={props.setStockName} />
            }
        </div>
    );
}

export default Stocks;

