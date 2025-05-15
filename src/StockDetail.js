import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function getDetail(queryParam) {

    const API_KEY = "A79PGV6UVQC4ZG18";
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${queryParam}&apikey=${API_KEY}`;
    console.log(url, "←URL (5 calls per minute）")  //A standard API call frequency is 5 calls per minute and 500 calls per day  


    return fetch(url)
        .then((res) => res.json())
        .then(data => data['Time Series (Daily)'])
}
function Header(props) {
    return (
        <div>
            <h1>Showing stocks for {props.queryStock}</h1>
        </div>
    );
}

function DateSearch(props) {
    const searchDate = props.searchDate;
    const setSearchDate = props.setSearchDate;

    return (
        <div className="dateSearch">
            <label>Showing detail from </label>
            <DatePicker
                className="datePicker"
                placeholderText="Select a start date"
                dateFormat="yyyy-MM-dd"
                selected={searchDate}
                minDate={searchDate}
                onChange={(searchDate) => {
                    setSearchDate(new Date(searchDate));
                    props.setChosenDate((searchDate).getFullYear() + "-" + ("0" + (searchDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (searchDate).getDate()).slice(-2))
                }}
            />
        </div>
    );
}


function DetailTable(props) {
    const [originalData, setOriginalData] = useState([]);
    const columns = [
        { headerName: "Date", field: "date", sortable: true, filter: true },
        { headerName: "Open", field: "open", sortable: true, filter: true },
        { headerName: "High", field: "high", sortable: true, filter: true },
        { headerName: "Low", field: "low", sortable: true, filter: true },
        { headerName: "Close", field: "close", sortable: true, filter: true },
        { headerName: "Volume", field: "volume", sortable: true, filter: true }
    ]


    useEffect(() => {
        if (originalData.length === 0) {
            getDetail(props.queryParam)
                .then(res => Object.entries(res)) //made a array for around 100 days of the stock
                .then(addedObj => addedObj.map(key => ({ stock: key })))
                .then((details) => details.map((detail) => {
                    return {
                        date: detail["stock"][0],
                        open: detail["stock"][1]["1. open"],
                        high: detail["stock"][1]["2. high"],
                        low: detail["stock"][1]["3. low"],
                        close: detail["stock"][1]["4. close"],
                        volume: detail["stock"][1]["5. volume"]
                    }
                }))

                .then((tableData) => {
                    setOriginalData(tableData);
                    props.setTableData(tableData);
                    props.setSearchDate(new Date(tableData[tableData.length - 1].date));  //setChosenDate
                })

        } else {

            const searchResult = originalData.filter((detail) => {
                if (new Date(detail.date).getTime() >= props.searchDate.getTime()) {
                    return {
                        date: detail.date,
                        open: detail.open,
                        high: detail.high,
                        low: detail.low,
                        close: detail.close,
                        volume: detail.volumes
                    }
                }
            });
            props.setTableData(searchResult);
        }

    }, [props.searchDate, props.queryParam]);   // props.queryParam  props.searchDate

    return (
        <div className="ag-theme-balham stockDetailTable">
            <AgGridReact
                columnDefs={columns}
                rowData={props.tableData}
                pagination={true}
                paginationPageSize={12}
            />
        </div>
    );
}

function Chart(props) {
    const tableData = props.tableData.slice().reverse();
    const labelData = tableData.map((data) => {
        return data.date;
    });
    const chartData = tableData.map((data) => {
        return data.close;
    })
    const data = {
        labels: labelData,
        datasets: [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            label: "Closing Price",
            data: chartData
        }]
    }
    const options = {
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgb(78, 82, 80)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgb(78, 82, 80)'
                }
            }]
        }
    }

    return (
        <div className="detailChart">
            <Line data={data} options={options} />
        </div>
    );
}


function StockDetail(props) {
    const queryParam = useQuery().get("code");  //queryParam is chose by a user input
    const queryStock = props.stockName;  //queryStock current chosen stock
    const [tableData, setTableData] = useState([]);
    const [searchDate, setSearchDate] = useState();
    const [chosenDate, setChosenDate] = useState();

    return (
        <div className="stockDetail">
            <Header queryStock={queryStock} />
            <DateSearch searchDate={searchDate} setSearchDate={setSearchDate} chosenDate={chosenDate} setChosenDate={setChosenDate} />
            <DetailTable queryParam={queryParam} tableData={tableData} setTableData={setTableData} searchDate={searchDate} setSearchDate={setSearchDate} />
            <Chart tableData={tableData} />
        </div>
    );
}

export default StockDetail;
