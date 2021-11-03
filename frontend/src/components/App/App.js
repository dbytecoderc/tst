import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import { addMetric, getMetrics } from '../../utils/utils';
import { subDays, differenceInMinutes } from 'date-fns'

import DateTimeRangeForm from './DateForm'

const tickOptions = {
    fontColor: '#4a4a4a80',
    fontFamily: 'Averta PE',
    fontSize: 11
};

const toolTipOptions = {
    backgroundColor: '#07002C',
    titleFontColor: 'white',
    bodyFontColor: 'white',
    borderColor: '#07002C',
    titleFontFamily: 'Averta PE',
    bodyFontFamily: 'Averta PE',
    borderWidth: 0,
    caretSize: 2,
    displayColors: true,
};


const options = {
    legend: { display: true },
    tooltips: toolTipOptions,
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        beginAtZero: true,
        ticks: tickOptions,
        gridLines: {
            color: 'rgba(0,0,0,0.07)',
            zeroLineColor: 'rgba(0,0,0,0.0)'
        }
    }
  }
};

const intervalTabs = ['minute', 'hour', 'day']

function App () {
    const [dateTime, setDateTime] = useState([subDays(new Date(), 2), new Date()]);
    const [activeIntervalTab, setActiveIntervalTab] = useState('hour')
    const [timeline, setTimeline] = useState([])
    const [timelineValues, setTimelineValues] = useState([])
    const [modalActive, setModalActive] = useState(false)
    const [average, setAverage] = useState(0)

    const data = canvas => {
        const liteLineGradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 300);
        liteLineGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        liteLineGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return {
            labels: timeline,
            datasets: [
              {
                label: '# of Tickets',
                data: timelineValues,
                fill: true,
                lineTension: 0.45,
                pointBorderColor: 'white',
                pointRadius: 4,
                borderWidth: 2,
                pointBackgroundColor: 'black',
                backgroundColor: liteLineGradient,
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
            ],
        }
    }
    
    useEffect(() => {
        const fetchMetrics = async () => {
            const response = await getMetrics({
                start_time: dateTime[0],
                end_time: dateTime[1],
                time_unit: activeIntervalTab
            })
    
            setTimeline(Object.keys(response.ticket_metrics))
            setTimelineValues(Object.values(response.ticket_metrics))
            setAverage(response.average.toFixed(4))
        }
        
        fetchMetrics()
    }, [dateTime, activeIntervalTab])

    const updateDateTime = (e) => {
        setDateTime([e.start, e.end])
    }

    const displayModal = () => {
        setModalActive(true)
    }

    const removeModal = () => {
        setModalActive(false)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const response = await addMetric({
            name: e.target[0].value,
            value: e.target[1].value,
            timestamp: e.target[2].value,
            time_unit: activeIntervalTab
        })

        const timelineIndex = timeline.indexOf(response.timestamp)

      if (timelineIndex > -1)  {
          const timeLineValue = timelineValues[timelineIndex]
            const newValueForTimeLine = timeLineValue + response.value
            const timelineValuesCopy = [...timelineValues];
            timelineValuesCopy[timelineIndex] = newValueForTimeLine
            setTimelineValues(timelineValuesCopy)
            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            const newTotal = timelineValuesCopy.reduce(reducer)
            const newAverage = newTotal / timeline.length
            setAverage(newAverage.toFixed(4))
        } else {
            const response = await getMetrics({
                start_time: dateTime[0],
                end_time: dateTime[1],
                time_unit: activeIntervalTab
            })
    
            setTimeline(Object.keys(response.ticket_metrics))
            setTimelineValues(Object.values(response.ticket_metrics))
            setAverage(response.average.toFixed(4))
        }

        removeModal()
      }
    
    return (
        <div>
            <header className="header">
                <p className="main-tag">Metrics</p>
                <div className="add-metric-button" onClick={displayModal} >Add metric</div>
            </header>
            <main className="main">
                <section className="metrics-page">
                    <div className="metric-header">
                        <h2 className="metric-header-title">Overview</h2>
                        <div className="metric-header-calender">
                            <div className="metric-header-calender-datetime-titles">
                                <div>
                                    From
                                </div>
                                <div>
                                    To
                                </div>
                            </div>
                            <DateTimeRangeForm
                               updateDateTime={updateDateTime}
                               dateTimeValue={dateTime}
                               className="test" 
                             />
                        </div>
                    </div>
                </section>

                <div className="metric-timeline-tabs">
                    <ul className="metric-timeline-tabs-list">
                        {
                            intervalTabs.map(tab => {
                                return (
                                    <li
                                    key={tab}
                                    onClick={() => {
                                        setActiveIntervalTab(tab);
                                    }}
                                    className={`metric-timeline-tabs-item  ${ activeIntervalTab === tab && 'active'}`}
                                    >
                                        {tab}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                
                <div className="metric-timeline">
                    <div className="metric-timeline-average">
                        {average}
                        <p className="metric-timeline-average-label">Average per {activeIntervalTab}</p>
                    </div>
                    <div className="metric-timeline-graph">
                        {timeline.length ? (
                           <Line className="chart" data={data} options={options} /> 
                        ): (
                        <div className="metric-timeline-empty-graph">No metrics for this time range</div>
                        )}
                    </div>
                </div>
            </main>

            <div 
                className={`modal  ${ modalActive ?  'modal-active' : '' }`}
            >
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <p className="modal-form-title">Metric inputs</p>
                            <span className="close" onClick={removeModal} >&times;</span>
                        </div>
                        <input type="text" placeholder="Add ticket buyer" />
                        <input type="number" placeholder="Number of tickets" />
                        <input type="datetime-local" name="timestamp" placeholder="Time of purchase" step="1"/>
                        <button className="submit-button">Add metric</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App